// 中文塔罗竞品抽牌流程截图脚本
// 用法: node _playwright_draw.js <key>
// key 对应 SITES 中的一个站点配置
// 中文站多直连，失败回退代理 http://127.0.0.1:10808

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = __dirname;
const PROXY = 'http://127.0.0.1:10808';

const SITES = {
  tarothall: {
    name: 'tarothall.com',
    url: 'https://tarothall.com/draw',
    steps: [
      { name: '01-landing', action: 'screenshot' },
      { name: '02-after-click', selector: 'a, button', text: ['開始', '开始', '抽牌', '占卜', '洗牌'], action: 'click-first-text' },
      { name: '03-after-click-2', wait: 1500, action: 'screenshot' },
    ],
  },
  ptaluo: {
    name: 'p.taluo.com',
    url: 'https://p.taluo.com/',
    explore: ['/1/', '/3/', '/seven/', '/love/'],
  },
  cctarot: {
    name: 'cctarot.com',
    url: 'https://cctarot.com/divination/three-cards/',
    steps: [
      { name: '01-three-cards', action: 'screenshot' },
    ],
    explore: ['https://cctarot.com/divination/', 'https://cctarot.com/divination/celtic-cross/', 'https://cctarot.com/divination/birthday/'],
  },
  xzw: {
    name: 'm.xzw.com',
    url: 'https://m.xzw.com/tarot/divine/',
    steps: [{ name: '01-divine', action: 'screenshot' }],
    explore: ['https://m.xzw.com/tarot/'],
  },
  lovehealing: {
    name: 'love-healing.com',
    url: 'https://love-healing.com/Tarot.aspx',
    steps: [{ name: '01-tarot', action: 'screenshot' }],
  },
  taroscope: {
    name: 'taroscope.ai',
    url: 'https://taroscope.ai/',
    steps: [{ name: '01-landing', action: 'screenshot' }],
  },
  cornerwonder: {
    name: 'tarot.cornerwonder.com',
    url: 'https://tarot.cornerwonder.com/',
    steps: [{ name: '01-landing', action: 'screenshot' }],
  },
  gomedia: {
    name: 'gomedia.asia',
    url: 'https://gomedia.asia/zh/free_tarot/',
    steps: [{ name: '01-free-tarot', action: 'screenshot' }],
  },
  tarotmoons: {
    name: 'tarotmoons.com',
    url: 'https://tarotmoons.com/tarot',
    steps: [{ name: '01-tarot', action: 'screenshot' }],
    explore: ['https://tarotmoons.com/spreads/three-card', 'https://tarotmoons.com/masters'],
  },
  fortunetell: {
    name: 'fortunetell.ai',
    url: 'https://fortunetell.ai/fortune-tarot',
    steps: [{ name: '01-fortune-tarot', action: 'screenshot' }],
  },
  tarotmood: {
    name: 'tarotmood.com',
    url: 'https://tarotmood.com/spreads/three',
    steps: [{ name: '01-three', action: 'screenshot' }],
    explore: ['https://tarotmood.com/spreads/celtic', 'https://tarotmood.com/spreads/love-relationship-status'],
  },
  jasiyu: {
    name: 'jasiyu.com',
    url: 'https://jasiyu.com/',
    steps: [{ name: '01-landing', action: 'screenshot' }],
  },
};

async function tryGoto(page, url) {
  // 先直连，超时/失败回退代理
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    return { ok: true, mode: 'direct' };
  } catch (e) {
    return { ok: false, err: String(e).slice(0, 200) };
  }
}

async function clickFirstText(page, selector, texts) {
  for (const t of texts) {
    const el = await page.locator(selector, { hasText: t }).first();
    const count = await el.count().catch(() => 0);
    if (count > 0) {
      try { await el.click({ timeout: 4000 }); return t; } catch (e) {}
    }
  }
  return null;
}

(async () => {
  const key = process.argv[2];
  if (!key || !SITES[key]) {
    console.error('Usage: node _playwright_draw.js <key>, keys:', Object.keys(SITES).join(','));
    process.exit(1);
  }
  const cfg = SITES[key];
  const dir = path.join(OUT, key);
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'zh-CN',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  });
  const page = await ctx.newPage();
  const result = { key, name: cfg.name, pages: [], errors: [] };

  // 主 URL
  let land = await tryGoto(page, cfg.url);
  let usedProxy = false;
  if (!land.ok) {
    // 重建带代理的 context
    await browser.close();
    const pb = await chromium.launch({ headless: true, proxy: { server: PROXY } });
    const pctx = await pb.newContext({
      viewport: { width: 1440, height: 900 },
      locale: 'zh-CN',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    });
    const ppage = await pctx.newPage();
    usedProxy = true;
    try {
      await ppage.goto(cfg.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await runSteps(ppage, cfg, dir, key, result);
    } catch (e) {
      result.errors.push({ url: cfg.url, err: String(e).slice(0, 300) });
    }
    // explore
    for (const ex of (cfg.explore || [])) {
      try {
        await ppage.goto(ex, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await ppage.waitForTimeout(1800);
        const fname = path.join(dir, `${key}--${slug(ex)}--full.png`);
        await ppage.screenshot({ path: fname, fullPage: true });
        const title = await ppage.title();
        result.pages.push({ url: ex, title, file: path.basename(fname) });
      } catch (e) {
        result.errors.push({ url: ex, err: String(e).slice(0, 200) });
      }
    }
    await pb.close();
  } else {
    try {
      await runSteps(page, cfg, dir, key, result);
    } catch (e) {
      result.errors.push({ url: cfg.url, err: String(e).slice(0, 300) });
    }
    for (const ex of (cfg.explore || [])) {
      try {
        await page.goto(ex, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(1800);
        const fname = path.join(dir, `${key}--${slug(ex)}--full.png`);
        await page.screenshot({ path: fname, fullPage: true });
        const title = await page.title();
        result.pages.push({ url: ex, title, file: path.basename(fname) });
      } catch (e) {
        result.errors.push({ url: ex, err: String(e).slice(0, 200) });
      }
    }
    await browser.close();
  }

  result.usedProxy = usedProxy;
  fs.writeFileSync(path.join(dir, '_result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ key, ok: result.errors.length === 0, pages: result.pages.length, errors: result.errors.length, usedProxy }, null, 2));
})();

function slug(url) {
  return url.replace(/^https?:\/\//, '').replace(/[\/\?=&\.]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

async function runSteps(page, cfg, dir, key) {
  await page.waitForTimeout(2000);
  const title = await page.title();
  // 首屏 + 全页
  const f1 = path.join(dir, `${key}--01-landing--viewport.png`);
  await page.screenshot({ path: f1 });
  const f1f = path.join(dir, `${key}--01-landing--full.png`);
  await page.screenshot({ path: f1f, fullPage: true });
  // 收集交互线索（按钮文字）
  const btns = await page.evaluate(() => {
    const els = [...document.querySelectorAll('a, button, [role=button], .btn, [class*=btn]')];
    const seen = new Set();
    const out = [];
    for (const e of els) {
      const t = (e.innerText || e.textContent || '').trim().slice(0, 20);
      if (t && !seen.has(t) && t.length < 18) { seen.add(t); out.push(t); }
      if (out.length >= 30) break;
    }
    return out;
  }).catch(() => []);
  // 抽取页面文本摘要（前2000字符）
  const text = await page.evaluate(() => (document.body.innerText || '').slice(0, 2500)).catch(() => '');
  // 尝试点击进入抽牌
  let clicked = null;
  for (const t of ['開始', '开始', '抽牌', '占卜', '洗牌', '切牌', '免费占卜', '開始占卜', '开始占卜', '抽取', '选牌']) {
    const loc = page.locator(`text="${t}"`).first();
    const c = await loc.count().catch(() => 0);
    if (c > 0) {
      try { await loc.click({ timeout: 4000 }); clicked = t; break; } catch (e) {}
    }
  }
  if (clicked) {
    await page.waitForTimeout(2500);
    const f2 = path.join(dir, `${key}--02-after-click--viewport.png`);
    await page.screenshot({ path: f2 });
    const f2f = path.join(dir, `${key}--02-after-click--full.png`);
    await page.screenshot({ path: f2f, fullPage: true });
  }
  // 保存交互线索
  fs.writeFileSync(path.join(dir, '_page.json'), JSON.stringify({ url: cfg.url, title, clicked, buttons: btns, textSample: text.slice(0, 1500) }, null, 2));
  return { title, clicked, btns };
}
