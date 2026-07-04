import { createRequire } from 'module';
const require = createRequire('C:/Users/Dylan/AppData/Roaming/npm/node_modules/playwright/package.json');
const { chromium } = require('playwright');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const URL = 'http://localhost:8765/crystal-bracelet-builder-preview.html';

const consoleLogs = [];
const pageErrors = [];

const browser = await chromium.launch({
  headless: true,
  args: [
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--enable-webgl2',
  ],
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    // emulate WebGL software rendering context attributes
  });

  // Inject webgl context attributes before page navigates
  context.on('webconsole', () => {});

  const page = await context.newPage();

  page.on('console', (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message + (err.stack ? '\n' + err.stack : ''));
  });

  // Enable preserveDrawingBuffer via context attributes (CDP)
  // Playwright doesn't expose WebGL attrs directly; rely on swiftshader + page-side init.
  if (page.addInitScript) {
    await page.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, attrs) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return orig.call(this, type, {
            ...(attrs || {}),
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
          });
        }
        return orig.apply(this, arguments);
      };
    });
  }

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  // give dynamic 3D import time to resolve + render
  await page.waitForTimeout(4000);

  const metrics = await page.evaluate(() => {
    return {
      leftDisplay: (() => {
        const el = document.getElementById('t17-left');
        return el ? getComputedStyle(el).display : 'no el';
      })(),
      leftSize: (() => {
        const el = document.getElementById('t17-left');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      stoneRowCount: document.querySelectorAll('#t17-stone-list .stone-row').length,
      appDisplay: (() => {
        const el = document.getElementById('t17-app');
        return el ? getComputedStyle(el).display : 'no app';
      })(),
      appSize: (() => {
        const el = document.getElementById('t17-app');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      canvasSize: (() => {
        const c = document.getElementById('t17-canvas');
        if (!c) return null;
        const r = c.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      })(),
      canvasHasContent: (() => {
        const c = document.getElementById('t17-canvas');
        if (!c) return 'no canvas';
        return c.width + 'x' + c.height;
      })(),
      canvasClientSize: (() => {
        const c = document.getElementById('t17-canvas');
        if (!c) return null;
        return c.width + 'x' + c.height;
      })(),
      seqCount: document.querySelectorAll('.seq-item').length,
      priceText: (() => {
        const p = document.getElementById('t17-price');
        return p ? p.textContent.trim().slice(0, 60) : 'no price el';
      })(),
      cordBtns: document.querySelectorAll('.cord-btn').length,
      sizeBtns: document.querySelectorAll('.size-btn').length,
      hasThreeOnWindow: typeof window.THREE !== 'undefined',
      toolbarBtns: document.querySelectorAll('#t17-app button').length,
      // diagnostic: list all t17-* ids present
      allT17Ids: Array.from(document.querySelectorAll('[id^="t17-"]')).map((e) => e.id),
      // diagnostic: app innerHTML first 2000 chars
      appInnerHead: (() => {
        const el = document.getElementById('t17-app');
        if (!el) return 'no app';
        return el.innerHTML.slice(0, 2000);
      })(),
      // canvas webgl: read a pixel to detect actual render (preserveDrawingBuffer)
      canvasHasPixels: (() => {
        const c = document.getElementById('t17-canvas');
        if (!c) return 'no canvas';
        try {
          const gl = c.getContext('webgl2') || c.getContext('webgl');
          if (!gl) return 'no gl ctx';
          const px = new Uint8Array(4);
          gl.readPixels(
            Math.floor(c.width / 2),
            Math.floor(c.height / 2),
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            px
          );
          return Array.from(px);
        } catch (e) {
          return 'err: ' + e.message;
        }
      })(),
    };
  });

  const shotPath = path.join(__dirname, 'shots', 'css-fix-v2.png');
  await page.screenshot({ path: shotPath, fullPage: true });

  console.log('=== METRICS ===');
  console.log(JSON.stringify(metrics, null, 2));
  console.log('=== CONSOLE (' + consoleLogs.length + ') ===');
  for (const l of consoleLogs) {
    console.log('[' + l.type + '] ' + l.text);
  }
  console.log('=== PAGEERRORS (' + pageErrors.length + ') ===');
  for (const e of pageErrors) {
    console.log(e);
  }
  console.log('=== SHOT ===');
  console.log(shotPath);
} finally {
  await browser.close();
  console.log('[finally] browser.close() done');
}
