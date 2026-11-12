// Build PDF report v2 (verde): embeds screenshots + tables into HTML, prints via Chromium.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const data = JSON.parse(fs.readFileSync('docs/ux/qa-results.json', 'utf8'));
const byRoute = {};
for (const r of data.results) { (byRoute[r.route] ??= []).push(r); }

const img64 = (p) => 'data:image/png;base64,' + fs.readFileSync(path.join('docs/ux', p)).toString('base64');
const cap = (r) => `${r.route} ${r.width}px — HTTP ${r.status} · consola ${r.console.length} · red-4xx/5xx ${r.badResponses.length} · axe ${r.axe.ran ? (r.axe.violations || []).length + ' viol' : 'no-run'} · overflowX ${r.eval.overflowX ?? 'n/d'}`;

let shots = '';
for (const [route, rows] of Object.entries(byRoute)) {
  for (const r of rows) {
    shots += `<figure><figcaption>${cap(r)}</figcaption><img src="${img64(r.shot)}" /></figure>`;
  }
}

const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8" />
<style>
@page { size: A4; margin: 14mm; }
body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 11px; line-height: 1.45; }
.cover { page-break-after: always; padding-top: 120px; text-align: center; }
.cover h1 { font-size: 28px; margin-bottom: 6px; }
.cover .verdict { display: inline-block; margin: 18px 0; padding: 10px 22px; background: #166534; color: #fff; font-size: 18px; font-weight: bold; border-radius: 8px; }
table { border-collapse: collapse; width: 100%; margin: 10px 0 16px; font-size: 10px; }
th, td { border: 1px solid #999; padding: 4px 6px; text-align: left; }
th { background: #eee; }
h2 { margin-top: 22px; border-bottom: 2px solid #CA8A04; padding-bottom: 4px; }
figure { page-break-inside: avoid; margin: 10px 0; border: 1px solid #ccc; padding: 6px; }
figcaption { font-weight: bold; margin-bottom: 4px; font-size: 10px; }
figure img { width: 100%; }
.issue { page-break-inside: avoid; border: 1px solid #999; padding: 8px; margin: 8px 0; }
.small { color: #444; }
.closed { background: #f0fdf4; }
</style></head><body>
<div class="cover">
<h1>LAB-Ux — Re-verificación QA visual (verde)</h1>
<p>Fecha: 2026-11-12 (re-run post-fix) · Base: main 7d2fd96 (merge PR22 bc6e025 fix postcss v3)<br/>
Dev: http://localhost:3100 · Personas: Lucía (375px) + Carlos (768/1440px)<br/>
Rutas: 8 · Anchos: 375 / 768 / 1440 · Capturas: 24 reales · axe-core 4.10.2 (CDN)</p>
<div class="verdict">VEREDICTO: SHIP WITH FIXES</div>
<p class="small">El bloqueante P0 de PR21 (HTTP 500 global border-border) está cerrado:<br/>24/24 rutas en HTTP 200 con contenido real, 0 5xx, axe Critical 0.<br/>Resta 1 High fix-forward (contraste AA en 6 rutas) + 2 Medium + 3 Low.</p>
</div>

<h2>1. Smoke — consola y red</h2>
<table><tr><th>Métrica</th><th>Valor (24 páginas)</th></tr>
<tr><td>HTTP 200</td><td>24/24</td></tr>
<tr><td>Respuestas 5xx / 4xx</td><td>0 / 0</td></tr>
<tr><td>Console error críticos de app (ModuleBuildError, crash)</td><td>0</td></tr>
<tr><td>error ERR_NAME_NOT_RESOLVED (backend caído, tolerado)</td><td>36</td></tr>
<tr><td>error React select defaultValue (home x3) + Error fetching proyectos (x3)</td><td>6</td></tr>
<tr><td>pageerror Failed to fetch (proyectos x3, backend caído)</td><td>3</td></tr>
<tr><td>Console warning Deprecated API (ruido Chrome)</td><td>24</td></tr>
<tr><td>info React DevTools (ruido)</td><td>24</td></tr>
<tr><td>overflowX</td><td>0 en 24/24 (contenido real)</td></tr></table>

<h2>2. Core Web Vitals (representativo: /)</h2>
<table><tr><th>Métrica</th><th>Valor</th><th>Umbral pragmático</th><th>Estado</th></tr>
<tr><td>LCP</td><td>n/d (headless-shell sin entries)</td><td>&lt; 4.0s</td><td>Informativo</td></tr>
<tr><td>domContentLoaded (navegación)</td><td>/ ~221ms · rango 180–375ms</td><td>—</td><td>Verde</td></tr>
<tr><td>CLS</td><td>n/d (harness)</td><td>&lt; 0.25</td><td>Informativo</td></tr>
<tr><td>INP</td><td>n/d (harness)</td><td>&lt; 500ms</td><td>Informativo</td></tr></table>

<h2>3. axe-core (contenido real, 24/24)</h2>
<table><tr><th>Ruta</th><th>Viol/pág</th><th>Serious</th><th>Moderate</th></tr>
<tr><td>home</td><td>0</td><td>—</td><td>—</td></tr>
<tr><td>team</td><td>2</td><td>color-contrast (2)</td><td>—</td></tr>
<tr><td>proyectos</td><td>4</td><td>color-contrast (1)</td><td>heading-order, landmark-one-main, region</td></tr>
<tr><td>glosario</td><td>3</td><td>—</td><td>heading-order, landmark-one-main, region</td></tr>
<tr><td>metodologias</td><td>3</td><td>color-contrast (1)</td><td>landmark-one-main, region</td></tr>
<tr><td>diffusion</td><td>4</td><td>color-contrast (1)</td><td>landmark-one-main, page-has-heading-one, region</td></tr>
<tr><td>support</td><td>4</td><td>color-contrast (3)</td><td>heading-order, landmark-one-main, region</td></tr>
<tr><td>login</td><td>4</td><td>color-contrast (2)</td><td>landmark-one-main, page-has-heading-one, region</td></tr></table>
<p class="small">Totales: axe corrió 24/24 · 0 critical · 18 instancias serious (color-contrast, fix-forward) · resto moderate.</p>

<h2>4. Build (informativo)</h2>
<p>CSS compila (Compiled successfully 13.0s — fix PR22 verificado a nivel build). <b>next build NO pasa por lint pre-existente</b> (no-unused-vars, no-explicit-any, no-unescaped-entities en admin; sin relación con PR22; fuera de alcance docs-only).</p>

<h2>5. Issues</h2>
<div class="issue closed"><b>#1 [CERRADO] 500 global border-border</b> — fix PR22 bc6e025 verificado: 24/24 en 200, 0 ModuleBuildError.</div>
<div class="issue"><b>#2 [Medium] Warning React defaultValue/value en &lt;select&gt;</b> (home x3). Controlar el select con defaultValue/value.</div>
<div class="issue"><b>#3 [Medium] Backend backend.lab-ux.site inaccesible</b> (ERR_NAME_NOT_RESOLVED x36). Vistas con datos en fallback; re-verificar con backend vivo.</div>
<div class="issue"><b>#4 [Low] landmark-one-main ausente en 6/8 rutas</b> + heading-order/region moderate. Envolver vistas en &lt;main&gt;.</div>
<div class="issue"><b>#5 [High fix-forward] color-contrast serious en 6 rutas</b> (support 3, team/login 2, resto 1). Ajustar tokens y re-correr axe.</div>
<div class="issue"><b>#6 [Low] Vitals n/d en headless + warning Deprecated API x24</b> (ruido Chrome, candidato a allowlist). Medir LCP en browser real.</div>

<h2>6. Screenshots (24 reales) — ruta + ancho</h2>
${shots}
<p class="small">Datos crudos: docs/ux/qa-results.json · Capturas: docs/ux/shots/ · Reporte Markdown: docs/ux/reporte-2026-11-11.md · Scripts: docs/ux/qa-verify.mjs, docs/ux/make-pdf.mjs · Rerun tras PR22 bc6e025 sobre main 7d2fd96.</p>
</body></html>`;

fs.writeFileSync('docs/ux/reporte-2026-11-11.html', html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///' + path.resolve('docs/ux/reporte-2026-11-11.html').replace(/\\/g, '/'));
await page.pdf({ path: 'docs/ux/reporte-2026-11-11.pdf', format: 'A4', printBackground: true });
await browser.close();
console.log('PDF OK', fs.statSync('docs/ux/reporte-2026-11-11.pdf').size);
