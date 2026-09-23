const T = process.argv[2];
const OUT = process.argv[3] || 'D:/Code/knowledge-base/gsc-mock/electricalcabinet_3x.png';
const INJ = process.argv[4] || 'D:/Code/knowledge-base/gsc-mock/inject_electrical.js';
const URL = 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:electricalcabinet.net&metrics=CLICKS,IMPRESSIONS&num_of_months=16';
const fs = await import('fs');
const ws = new WebSocket('ws://127.0.0.1:9222/devtools/browser');
let id = 0;
const pending = new Map();
function send(method, params = {}, sessionId) {
  return new Promise((res, rej) => {
    const i = ++id;
    const msg = { id: i, method, params };
    if (sessionId) msg.sessionId = sessionId;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify(msg));
  });
}
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) rej(new Error(m.error.message)); else res(m);
  }
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const evalJs = async (sid, expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }, sid);
  return r.result && r.result.result && r.result.result.value;
};
ws.onopen = async () => {
  try {
    await send('Target.activateTarget', { targetId: T });
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('Page.enable', {}, sid);

    // 带重试的加载
    let loaded = false;
    for (let attempt = 0; attempt < 4 && !loaded; attempt++) {
      await send('Page.navigate', { url: URL }, sid);
      for (let i = 0; i < 25; i++) {
        await sleep(1200);
        const ok = await evalJs(sid, '(document.body.innerText||"").indexOf("总点击次数")>=0');
        if (ok) { loaded = true; console.log(`cards ready (attempt ${attempt + 1}, ${(i + 1) * 1.2}s)`); break; }
        const err = await evalJs(sid, 'location.href.indexOf("chrome-error")>=0');
        if (err) { console.log(`attempt ${attempt + 1}: network error, retrying`); break; }
      }
    }
    if (!loaded) { console.error('page never became ready'); process.exit(1); }

    const r = await evalJs(sid, fs.readFileSync(INJ, 'utf8'));
    console.log('inject:', r);
    const inj = JSON.parse(r || '{}');
    if (inj.err) { console.error('inject error'); process.exit(1); }

    for (let i = 0; i < 20; i++) {
      await sleep(1000);
      const st = await evalJs(sid, '(()=>{const s=[...document.querySelectorAll("svg")].find(x=>x.getBoundingClientRect().width>500);return JSON.stringify({chart:!!(s&&s.querySelector("polyline[data-mine]")),val:(document.body.innerText||"").indexOf("4.5万")>=0});})()');
      const s = JSON.parse(st || '{}');
      if (s.chart && s.val) { console.log(`verified @ ${i + 1}s`); break; }
    }
    await sleep(500);
    // 同步重画+文本重打，并触发重绘后立即截图
    await evalJs(sid, 'window.__redraw&&window.__redraw();window.__applyTexts&&window.__applyTexts();window.scrollBy(0,12);window.scrollBy(0,-12);document.body.style.outline="1px solid transparent";"forced"');
    await sleep(250);
    const shot = await send('Page.captureScreenshot', { format: 'png' }, sid);
    fs.writeFileSync(OUT, Buffer.from(shot.result.data, 'base64'));
    console.log('saved', OUT);
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws connect failed'); process.exit(1); };
