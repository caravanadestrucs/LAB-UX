// Build PDF report: embeds screenshots + tables into HTML, prints via Chromium.
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
.cover .verdict { display: inline-block; margin: 18px 0; padding: 10px 22px; background: #b91c1c; color: #fff; font-size: 18px; font-weight: bold; border-radius: 8px; }
table { border-collapse: collapse; width: 100%; margin: 10px 0 16px; font-size: 10px; }
th, td { border: 1px solid #999; padding: 4px 6px; text-align: left; }
th { background: #eee; }
h2 { margin-top: 22px; border-bottom: 2px solid #CA8A04; padding-bottom: 4px; }
figure { page-break-inside: avoid; margin: 10px 0; border: 1px solid #ccc; padding: 6px; }
figcaption { font-weight: bold; margin-bottom: 4px; font-size: 10px; }
figure img { width: 100%; }
.issue { page-break-inside: avoid; border: 1px solid #999; padding: 8px; margin: 8px 0; }
.small { color: #444; }
</style></head><body>
<div class="cover">
<h1>LAB-Ux — Verificación QA visual</h1>
<p>Fecha: 2026-11-11 · Base: main 1c59c04 (V1+V2+V3 mergeados, vitest 41 pass)<br/>
Dev: http://localhost:3100 · Personas: Lucía (375px) + Carlos (768/1440px)<br/>
Rutas: 8 · Anchos: 375 / 768 / 1440 · Capturas: 24 · axe-core 4.10.2 (CDN)</p>
<div class="verdict">VEREDICTO: DO NOT SHIP / Fail</div>
<p class="small">Bloqueante P0: todas las rutas responden HTTP 500<br/>(Cannot apply unknown utility class: border-border — postcss.config.mjs vs Tailwind v3).<br/>Nada de V1/V2/V3 pudo verificarse visualmente.</p>
</div>

<h2>1. Smoke — consola y red</h2>
<table><tr><th>Métrica</th><th>Valor (24 páginas)</th></tr>
<tr><td>Console error</td><td>72 (3 por página: 500 documento + 2 bundle CSS)</td></tr>
<tr><td>pageerror ModuleBuildError border-border</td><td>24</td></tr>
<tr><td>Console warning (Deprecated API)</td><td>24</td></tr>
<tr><td>info React DevTools (ruido) + log HMR</td><td>24 + 24</td></tr>
<tr><td>Respuestas 5xx</td><td>24 (todas las navegaciones)</td></tr>
<tr><td>Respuestas 4xx</td><td>0</td></tr></table>

<h2>2. Core Web Vitals (representativo: /)</h2>
<table><tr><th>Métrica</th><th>Valor</th><th>Umbral pragmático</th><th>Estado</th></tr>
<tr><td>LCP</td><td>n/d (sin contenido)</td><td>&lt; 4.0s</td><td>Bloqueado</td></tr>
<tr><td>domContentLoaded (navegación)</td><td>~1329ms</td><td>—</td><td>Informativo</td></tr>
<tr><td>CLS</td><td>n/d</td><td>&lt; 0.25</td><td>Bloqueado</td></tr>
<tr><td>INP</td><td>n/d</td><td>&lt; 500ms</td><td>Bloqueado</td></tr>
<tr><td>overflowX</td><td>0 en 24/24 (sobre página de error)</td><td>0</td><td>No representativo</td></tr></table>

<h2>3. axe-core por breakpoint (sobre página de error Next — método, no veredicto de app)</h2>
<table><tr><th>Breakpoint</th><th>Páginas</th><th>Viol/pág</th><th>Serious</th><th>Moderate</th></tr>
<tr><td>375px</td><td>8</td><td>6</td><td>document-title, html-has-lang, scrollable-region-focusable</td><td>landmark-one-main, page-has-heading-one, region</td></tr>
<tr><td>768px</td><td>8</td><td>5</td><td>document-title, html-has-lang</td><td>landmark-one-main, page-has-heading-one, region</td></tr>
<tr><td>1440px</td><td>8</td><td>5</td><td>document-title, html-has-lang</td><td>landmark-one-main, page-has-heading-one, region</td></tr></table>
<p class="small">Totales: axe corrió 24/24 · 56 serious + 72 moderate · 0 critical. Checklist manual pendiente tras el fix: teclado, foco #CA8A04, landmarks main/nav/footer, aria-live glosario, contraste AA.</p>

<h2>4. Issues</h2>
<div class="issue"><b>#1 [Critical] 500 global: @apply border-border vs plugin Tailwind v4.</b> postcss.config.mjs:2 · src/styles/globals.css:79 · package.json:56. Reproduce: dev en 3100 → abrir / → 500 ModuleBuildError. Evidencia: qa-results.json + 24 shots.</div>
<div class="issue"><b>#2 [High] Backend backend.lab-ux.site inaccesible</b> (fetch failed). Tras el fix verificar skeletons/mocks vs datos reales.</div>
<div class="issue"><b>#3 [Medium] Sin baseline visual</b> — este set de 24 es el primer baseline (del estado 500).</div>
<div class="issue"><b>#4 [Medium] Ruido entorno:</b> @next/swc-win32-x64-msvc inválido + warning Deprecated API x24. Reinstalar node_modules.</div>
<div class="issue"><b>#5 [Low] a11y manual diferida:</b> foco #CA8A04, landmarks, aria-live glosario, contraste AA, teclado end-to-end.</div>
<div class="issue"><b>#6 [Low] Tech-debt registrado</b> (layouts html anidados, auth localStorage, typo constans/, components.json) — ver AGENTS.md §9.</div>

<h2>5. Screenshots (24) — ruta + ancho</h2>
${shots}
<p class="small">Datos crudos: docs/ux/qa-results.json · Capturas: docs/ux/shots/ · Reporte Markdown: docs/ux/reporte-2026-11-11.md · Script: docs/ux/qa-verify.mjs</p>
</body></html>`;

fs.writeFileSync('docs/ux/reporte-2026-11-11.html', html);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///' + path.resolve('docs/ux/reporte-2026-11-11.html').replace(/\\/g, '/'));
await page.pdf({ path: 'docs/ux/reporte-2026-11-11.pdf', format: 'A4', printBackground: true });
await browser.close();
console.log('PDF OK', fs.statSync('docs/ux/reporte-2026-11-11.pdf').size);
