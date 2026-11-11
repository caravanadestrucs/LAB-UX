// QA capture: navigates public routes at 3 viewports, collects console/network/vitals/a11y signals.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:3100';
const OUT = 'docs/ux/shots';
const ROUTES = [
  { name: 'home', url: '/' },
  { name: 'team', url: '/public/team' },
  { name: 'proyectos', url: '/public/research/proyectos' },
  { name: 'glosario', url: '/public/research/glosario' },
  { name: 'metodologias', url: '/public/research/metodologias' },
  { name: 'diffusion', url: '/public/diffusion' },
  { name: 'support', url: '/public/support' },
  { name: 'login', url: '/public/login' },
];
const WIDTHS = [375, 768, 1440];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const r of ROUTES) {
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const consoleMsgs = [];
    const badResponses = [];
    page.on('console', (m) => consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 300) }));
    page.on('pageerror', (e) => consoleMsgs.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
    page.on('response', (res) => {
      if (res.status() >= 400) badResponses.push({ status: res.status(), url: res.url().slice(0, 200) });
    });
    let status = 0, title = '', ok = true, err = '';
    const t0 = Date.now();
    try {
      const resp = await page.goto(BASE + r.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = resp?.status() ?? 0;
      await page.waitForTimeout(2500);
      title = await page.title().catch(() => '');
    } catch (e) {
      ok = false; err = String(e).slice(0, 300);
    }
    const loadMs = Date.now() - t0;
    // Vitals + layout + a11y signals inside the page
    let evalData = {};
    try {
      evalData = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        const lcp = lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime : null;
        const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const imgs = Array.from(document.images).map((i) => ({ src: (i.currentSrc || i.src || '').slice(0, 120), alt: i.alt ?? '' }));
        const missingAlt = imgs.filter((i) => !i.alt).length;
        const hasMain = !!document.querySelector('main');
        const hasNav = !!document.querySelector('nav, header nav, [role="navigation"]');
        const hasFooter = !!document.querySelector('footer, [role="contentinfo"]');
        const ariaLive = !!document.querySelector('[aria-live]');
        const focusable = document.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])').length;
        const bodyText = document.body ? document.body.innerText.slice(0, 2000) : '';
        const links = Array.from(document.querySelectorAll('a[href]')).slice(0, 40).map((a) => a.getAttribute('href'));
        return {
          navMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
          lcpMs: lcp != null ? Math.round(lcp) : null,
          cls: null,
          overflowX: Math.round(overflowX),
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          imgsTotal: imgs.length, missingAlt, hasMain, hasNav, hasFooter, ariaLive, focusable, bodyText, links,
        };
      });
    } catch (e) { evalData = { evalError: String(e).slice(0, 200) }; }
    // axe via CDN (best effort, offline-safe)
    let axe = { ran: false };
    try {
      await page.addScriptTag({ url: 'https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js', timeout: 15000 });
      await page.waitForFunction(() => typeof window.axe !== 'undefined', null, { timeout: 15000 });
      axe = await page.evaluate(async () => {
        const res = await window.axe.run({ resultTypes: ['violations'] });
        return { ran: true, violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })) };
      });
    } catch (e) { axe = { ran: false, error: String(e).slice(0, 200) }; }
    const shotName = `${r.name}-${w}.png`;
    try { await page.screenshot({ path: path.join(OUT, shotName), fullPage: false }); } catch (e) { ok = false; err += ' shot:' + String(e).slice(0, 120); }
    results.push({ route: r.name, url: r.url, width: w, shot: `shots/${shotName}`, status, title, ok, err, loadMs, console: consoleMsgs, badResponses, eval: evalData, axe });
    console.log(`${r.name} ${w} status=${status} console=${consoleMsgs.length} bad=${badResponses.length} overflowX=${evalData.overflowX} axe=${axe.ran ? (axe.violations || []).length + 'viol' : 'no-run'}`);
    await page.close();
  }
}
await browser.close();
fs.writeFileSync('docs/ux/qa-results.json', JSON.stringify({ base: BASE, date: new Date().toISOString(), results }, null, 2));
console.log('DONE routes=' + results.length);
