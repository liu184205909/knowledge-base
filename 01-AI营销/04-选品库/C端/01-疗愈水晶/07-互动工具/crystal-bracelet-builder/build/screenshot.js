/**
 * T17 prototype 截图验证 — 用 Playwright 打开 prototype.html，截图 + 测试交互。
 * Usage: node screenshot.js
 */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  const logs = [];
  page.on('console', m => logs.push('[' + m.type() + '] ' + m.text()));
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  const url = 'file:///' + path.resolve(__dirname, 'prototype.html').replace(/\\/g, '/');
  console.log('Opening:', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500); // let three.js spin + textures bake

  // Screenshot 1: default state (3 beads)
  await page.screenshot({ path: path.resolve(__dirname, 'shot-1-default.png'), fullPage: false });
  console.log('Shot 1 saved (default)');

  // Interaction test: click the first bead to select it
  const canvasBox = await page.locator('#canvas-wrap canvas').boundingBox();
  // click near a bead on the ring (right side of center, where cos(0)*R sits)
  const cx = canvasBox.x + canvasBox.width / 2;
  const cy = canvasBox.y + canvasBox.height / 2;
  const R = canvasBox.width * 0.18; // approx screen radius of ring
  await page.mouse.click(cx + R, cy);
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve(__dirname, 'shot-2-selected.png') });
  console.log('Shot 2 saved (selected)');

  const selVisible = await page.locator('#selected-info').isVisible();
  const selTitle = await page.locator('#sel-title').textContent();
  console.log('Selection box visible:', selVisible, '| title:', selTitle);

  // Test delete
  await page.locator('#btn-delete').click();
  await page.waitForTimeout(500);
  const beadCountAfter = await page.locator('#bead-count').textContent();
  const totalAfter = await page.locator('#total').textContent();
  console.log('After delete → beads:', beadCountAfter, '| total:', totalAfter);
  await page.screenshot({ path: path.resolve(__dirname, 'shot-3-after-delete.png') });

  // Test add via stone card (Rose Quartz)
  await page.locator('.stone-card').first().click();
  await page.waitForTimeout(400);
  const beadCountAfterAdd = await page.locator('#bead-count').textContent();
  console.log('After add (click Rose Quartz card with no selection) → beads:', beadCountAfterAdd);

  // Zoom test: wheel
  await page.mouse.move(cx, cy);
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve(__dirname, 'shot-4-zoomed.png') });
  console.log('Shot 4 saved (zoomed)');

  // Rotate test: drag empty area
  await page.mouse.move(cx, cy - 200);
  await page.mouse.down();
  for (let i = 0; i < 20; i++) {
    await page.mouse.move(cx - 150 + i * 15, cy - 200 + i * 2);
    await page.waitForTimeout(15);
  }
  await page.mouse.up();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.resolve(__dirname, 'shot-5-rotated.png') });
  console.log('Shot 5 saved (rotated)');

  console.log('\n=== Console logs (first 15) ===');
  logs.slice(0, 15).forEach(l => console.log(l));
  console.log('\n=== Page errors ===');
  if (errors.length === 0) console.log('NONE (clean)');
  else errors.forEach(e => console.log(e));

  await browser.close();
  console.log('\nDONE.');
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
