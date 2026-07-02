// E2E test for AI Tarot Chat — desktop + mobile
// 用 playwright 1.61.1（.tmp-pw-install），强制指定已存在的 chromium-1208 chrome.exe
const { chromium } = require('playwright');

// 已存在的完整 chromium（playwright 1.61 默认找 1228 不存在，手动指 1208）
const CHROMIUM_EXE = 'C:\\Users\\Dylan\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe';
const SHOTS = 'D:/Code/knowledge-base/01-AI营销/04-选品库/C端/01-疗愈水晶/07-互动工具/ai-tarot-chat/build/shots';

const TS = Math.floor(Date.now() / 1000);
const URL = `https://goearthward.com/tools/ai-tarot-chat/?nocache=${TS}`;

const consoleMsgs = [];
const pageErrors = [];

function log(...a) { console.log(...a); }

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXE,
    headless: true,
  });

  const result = {
    url: URL,
    desktop: {},
    mobile: {},
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
  };

  // ============ DESKTOP ============
  log('=== DESKTOP 1280x900 ===');
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dPage = await dCtx.newPage();

  dPage.on('console', m => {
    const t = m.type();
    const txt = m.text();
    consoleMsgs.push({ ctx: 'desktop', type: t, text: txt });
    if (t === 'error') result.consoleErrors.push('[desktop] ' + txt);
    if (t === 'warning') result.consoleWarnings.push('[desktop] ' + txt);
  });
  dPage.on('pageerror', e => { result.pageErrors.push('[desktop] ' + e.message); pageErrors.push(e); });

  await dPage.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await dPage.waitForTimeout(2000);

  // 3. role list children
  const roleCount = await dPage.locator('#eac-role-list .eac-tab').count();
  result.desktop.roleTabCount = roleCount;
  log('role .eac-tab count =', roleCount);

  // 4. 点击第一个角色
  const firstTab = dPage.locator('#eac-role-list .eac-tab').first();
  const tabText = await firstTab.textContent().catch(() => '?');
  log('first tab text:', tabText.trim());
  await firstTab.click();
  await dPage.waitForTimeout(1200);

  // 5. empty display / panel display / textarea rect / send visible
  const emptyDisplay = await dPage.locator('#eac-empty').evaluate(el => getComputedStyle(el).display).catch(() => 'ELEMENT_NOT_FOUND');
  const panelDisplay = await dPage.locator('#eac-chat-panel').evaluate(el => getComputedStyle(el).display).catch(() => 'ELEMENT_NOT_FOUND');
  const taRect = await dPage.locator('#eac-question').evaluate(el => {
    const r = el.getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height), visible: r.width > 0 && r.height > 0 };
  }).catch(() => ({ error: 'NOT_FOUND' }));
  const sendVisible = await dPage.locator('#eac-send').isVisible();

  result.desktop.emptyDisplay = emptyDisplay;
  result.desktop.panelDisplay = panelDisplay;
  result.desktop.textareaRect = taRect;
  result.desktop.sendVisible = sendVisible;
  log('empty.display =', emptyDisplay, '| panel.display =', panelDisplay);
  log('textarea rect =', JSON.stringify(taRect), '| send visible =', sendVisible);

  // 6. 输入
  const QUESTION = 'What do you see for my love life right now?';
  await dPage.locator('#eac-question').fill(QUESTION);
  const taVal = await dPage.locator('#eac-question').inputValue();
  result.desktop.textareaValue = taVal;
  log('textarea filled, len =', taVal.length);

  // 7. 点 Send
  await dPage.locator('#eac-send').click();
  log('send clicked, waiting 40s for DeepSeek...');

  // 8. 等 40s
  await dPage.waitForTimeout(40000);

  // 9. .eac-msg count
  const msgCount = await dPage.locator('.eac-msg').count();
  result.desktop.msgCount = msgCount;
  log('.eac-msg count =', msgCount);

  // 10. 最后一条 assistant 文本
  const lastAssistantText = await dPage.locator('.eac-msg-assistant .eac-msg-text').last().textContent().catch(() => '');
  const cleaned = (lastAssistantText || '').trim();
  result.desktop.lastAssistantLen = cleaned.length;
  result.desktop.lastAssistantPreview = cleaned.slice(0, 200);
  result.desktop.lastAssistantIsAscii = /^[\x00-\x7F]+$/.test(cleaned.replace(/\s/g, '')); // 纯英文/拉丁
  log('last assistant msg len =', cleaned.length);
  log('last assistant preview =', cleaned.slice(0, 150));

  // 11. 滚动条验证
  const scrollInfo = await dPage.locator('#eac-chat-panel').evaluate(el => {
    const cs = getComputedStyle(el);
    return {
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      overflowY: cs.overflowY,
      display: cs.display,
      hasScroll: el.scrollHeight > el.clientHeight,
    };
  }).catch(() => ({ error: 'NOT_FOUND' }));
  result.desktop.scrollInfo = scrollInfo;
  log('panel scroll: scrollH=', scrollInfo.scrollHeight, 'clientH=', scrollInfo.clientHeight, 'hasScroll=', scrollInfo.hasScroll, 'overflowY=', scrollInfo.overflowY);

  // 12. 截图
  await dPage.screenshot({ path: `${SHOTS}/desktop-full.png`, fullPage: true });
  await dPage.locator('#eac-chat-panel').screenshot({ path: `${SHOTS}/desktop-panel.png` }).catch(e => log('panel screenshot failed:', e.message));
  log('desktop screenshots saved');

  await dCtx.close();

  // ============ MOBILE ============
  log('\n=== MOBILE 375x812 ===');
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' });
  const mPage = await mCtx.newPage();
  mPage.on('console', m => {
    const t = m.type(), txt = m.text();
    if (t === 'error') result.consoleErrors.push('[mobile] ' + txt);
    if (t === 'warning') result.consoleWarnings.push('[mobile] ' + txt);
  });
  mPage.on('pageerror', e => result.pageErrors.push('[mobile] ' + e.message));

  await mPage.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await mPage.waitForTimeout(2000);

  const mRoleCount = await mPage.locator('#eac-role-list .eac-tab').count();
  result.mobile.roleTabCount = mRoleCount;
  await mPage.locator('#eac-role-list .eac-tab').first().click();
  await mPage.waitForTimeout(1200);

  const mEmpty = await mPage.locator('#eac-empty').evaluate(el => getComputedStyle(el).display).catch(() => '?');
  const mPanel = await mPage.locator('#eac-chat-panel').evaluate(el => getComputedStyle(el).display).catch(() => '?');
  const mTaRect = await mPage.locator('#eac-question').evaluate(el => {
    const r = el.getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height), visible: r.width > 0 && r.height > 0 };
  }).catch(() => ({ error: 'NOT_FOUND' }));
  const mSendVisible = await mPage.locator('#eac-send').isVisible();
  result.mobile.emptyDisplay = mEmpty;
  result.mobile.panelDisplay = mPanel;
  result.mobile.textareaRect = mTaRect;
  result.mobile.sendVisible = mSendVisible;
  log('mobile: empty=', mEmpty, 'panel=', mPanel, 'taRect=', JSON.stringify(mTaRect), 'send=', mSendVisible);

  await mPage.screenshot({ path: `${SHOTS}/mobile-full.png`, fullPage: true });
  await mPage.locator('#eac-chat-panel').screenshot({ path: `${SHOTS}/mobile-panel.png` }).catch(e => log('mobile panel screenshot failed:', e.message));
  log('mobile screenshots saved');

  await mCtx.close();
  await browser.close();

  // 输出汇总 JSON
  console.log('\n========== RESULT JSON ==========');
  console.log(JSON.stringify(result, null, 2));
})().catch(e => {
  console.error('FATAL:', e.message);
  console.error(e.stack);
  process.exit(1);
});
