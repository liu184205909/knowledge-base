/**
 * Step-1 verification: open the local prototype with Playwright and screenshot
 * desktop + mobile, plus exercise the core interactions (color filter, add,
 * delete, replace, rotate, charm, cord, pricing, preset).
 *
 * Run: node verify-step1.js
 * (Needs playwright installed; chromium launched with --allow-file-access-from-files
 *  so the self-hosted vendor ES modules load from file://)
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML = path.resolve(__dirname, 'crystal-bracelet-builder.html');
const FILE_URL = 'file:///' + HTML.replace(/\\/g, '/');

function log(...a) { console.log('[verify]', ...a); }

(async () => {
  if (!fs.existsSync(HTML)) { console.error('HTML not found:', HTML); process.exit(1); }
  const browser = await chromium.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });

  // ---------- DESKTOP ----------
  const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const desk = await deskCtx.newPage();
  const errors = [];
  desk.on('console', (m) => { if (m.type() === 'error') errors.push('DESK CONSOLE: ' + m.text()); });
  desk.on('pageerror', (e) => errors.push('DESK PAGEERR: ' + e.message));

  await desk.goto(FILE_URL, { waitUntil: 'load' });
  await desk.waitForTimeout(2500); // Three.js boot + texture pre-render

  // Shot 1: default state (6-bead starter mix)
  await desk.screenshot({ path: path.join(__dirname, 'step1-1-default-desktop.png'), fullPage: false });
  const beadCards1 = await desk.locator('.bead-card').count();
  const seq1 = await desk.locator('.seq-item').count();
  const total1 = await desk.locator('.price-total span').last().textContent();
  log('DESKTOP default: bead cards =', beadCards1, '| sequence slots =', seq1, '| total =', total1);

  // Shot 2: click a color filter tab (Purple)
  await desk.locator('.color-tab[data-color="purple"]').click();
  await desk.waitForTimeout(400);
  const purpleCards = await desk.locator('.bead-card').count();
  log('Purple filter: cards =', purpleCards);
  await desk.screenshot({ path: path.join(__dirname, 'step1-2-filter-purple-desktop.png') });

  // reset filter
  await desk.locator('.color-tab[data-color="all"]').click();
  await desk.waitForTimeout(300);

  // Shot 3: add beads — click Amethyst card several times (append)
  await desk.locator('.bead-card[data-bead="amethyst"]').first().click();
  await desk.waitForTimeout(200);
  await desk.locator('.bead-card[data-bead="citrine"]').first().click();
  await desk.waitForTimeout(200);
  await desk.locator('.bead-card[data-bead="malachite"]').first().click();
  await desk.waitForTimeout(300);
  const seq3 = await desk.locator('.seq-item').count();
  const total3 = await desk.locator('.price-total span').last().textContent();
  log('After 3 adds: slots =', seq3, '| total =', total3);
  await desk.screenshot({ path: path.join(__dirname, 'step1-3-added-beads-desktop.png') });

  // Shot 4: select last slot then remove it (replace + delete)
  await desk.locator('.seq-item').last().click();
  await desk.waitForTimeout(200);
  await desk.locator('#t17-sel-actions [data-action="remove-selected"]').click();
  await desk.waitForTimeout(300);
  const seq4 = await desk.locator('.seq-item').count();
  log('After remove: slots =', seq4);
  await desk.screenshot({ path: path.join(__dirname, 'step1-4-removed-desktop.png') });

  // Shot 5: select first bead slot, then click a different stone card = replace
  await desk.locator('.seq-item').first().click();
  await desk.waitForTimeout(200);
  const firstName0 = await desk.locator('.seq-item').first().locator('small').textContent();
  await desk.locator('.bead-card[data-bead="tiger_eye"]').first().click();
  await desk.waitForTimeout(300);
  const firstName1 = await desk.locator('.seq-item').first().locator('small').textContent();
  log('Replace: first slot was "', firstName0, '" -> "', firstName1, '"');
  await desk.screenshot({ path: path.join(__dirname, 'step1-5-replaced-desktop.png') });

  // Shot 6: add a charm + change cord + change bead size
  await desk.locator('.charm-btn[data-charm="lotus"]').first().click();
  await desk.waitForTimeout(200);
  await desk.locator('.cord-btn[data-cord="silver_wire"]').first().click();
  await desk.waitForTimeout(200);
  await desk.locator('.size-btn[data-size="10"]').first().click();
  await desk.waitForTimeout(400);
  const total6 = await desk.locator('.price-total span').last().textContent();
  log('After charm+silver+10mm: total =', total6);
  await desk.screenshot({ path: path.join(__dirname, 'step1-6-charm-cord-size-desktop.png') });

  // Shot 7: rotate the 3D scene (drag empty area) then screenshot
  const canvas = desk.locator('#t17-canvas');
  const box = await canvas.boundingBox();
  await desk.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.5);
  await desk.mouse.down();
  await desk.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.35, { steps: 12 });
  await desk.mouse.up();
  await desk.waitForTimeout(500);
  await desk.screenshot({ path: path.join(__dirname, 'step1-7-rotated-desktop.png') });

  // Shot 8: preset combo
  await desk.locator('.preset-btn[data-preset="prosperity"]').first().click();
  await desk.waitForTimeout(400);
  const seq8 = await desk.locator('.seq-item').count();
  log('After Prosperity preset: slots =', seq8);
  await desk.screenshot({ path: path.join(__dirname, 'step1-8-preset-desktop.png') });

  // capture add-to-cart console.log
  const cartMsgs = [];
  desk.on('console', (m) => { if (m.text().indexOf('[T17] Add to cart') >= 0) cartMsgs.push(m.text()); });
  await desk.locator('#t17-add-cart').click();
  await desk.waitForTimeout(300);
  log('Add-to-cart console msgs =', cartMsgs.length);

  await deskCtx.close();

  // ---------- MOBILE ----------
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mob = await mobCtx.newPage();
  const merrors = [];
  mob.on('pageerror', (e) => merrors.push('MOB PAGEERR: ' + e.message));
  await mob.goto(FILE_URL, { waitUntil: 'load' });
  await mob.waitForTimeout(2500);
  await mob.screenshot({ path: path.join(__dirname, 'step1-mobile-top.png'), fullPage: false });
  // scroll to stage
  await mob.locator('#t17-stage').scrollIntoViewIfNeeded();
  await mob.waitForTimeout(600);
  await mob.screenshot({ path: path.join(__dirname, 'step1-mobile-stage.png'), fullPage: false });
  await mob.locator('#t17-bottom').scrollIntoViewIfNeeded();
  await mob.waitForTimeout(400);
  await mob.screenshot({ path: path.join(__dirname, 'step1-mobile-pricing.png'), fullPage: false });
  await mobCtx.close();

  await browser.close();

  log('DONE. desktop errors:', errors.length, '| mobile errors:', merrors.length);
  if (errors.length) errors.forEach((e) => console.log('  ERROR:', e));
  if (merrors.length) merrors.forEach((e) => console.log('  MOB ERR:', e));
  process.exit(0);
})().catch((e) => { console.error('VERIFY FAILED:', e); process.exit(1); });
