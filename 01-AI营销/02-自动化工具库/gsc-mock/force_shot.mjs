const T = process.argv[2];
const OUT = process.argv[3] || 'D:/Code/knowledge-base/gsc-mock/eabel_gsc.png';
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
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('Page.enable', {}, sid);

    // 持续前台保活：每 4 秒 re-activate，直到指标卡出现
    let ready = false;
    for (let i = 0; i < 12 && !ready; i++) {
      await send('Target.activateTarget', { targetId: T }).catch(() => {});
      await sleep(4000);
      ready = await evalJs(sid, '(document.body.innerText||"").indexOf("总点击次数")>=0');
      console.log(`t=${(i + 1) * 4}s ready=${ready}`);
    }
    console.log('cards:', ready ? 'READY' : 'NOT-READY (guard will cover)');

    const inj = await evalJs(sid, fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject_electrical.js', 'utf8'));
    console.log('inject:', inj);

    for (let i = 0; i < 15; i++) {
      await send('Target.activateTarget', { targetId: T }).catch(() => {});
      await sleep(2000);
      const st = await evalJs(sid, '(()=>{const it=document.body.innerText||"";const s=[...document.querySelectorAll("svg")].find(x=>x.getBoundingClientRect().width>500);return JSON.stringify({chart:!!(s&&s.querySelector("polyline[data-mine]")),v45:it.indexOf("4.5万")>=0,guard:!!window.__guardActive});})()');
      const s = JSON.parse(st || '{}');
      console.log(`verify ${i + 1}:`, st);
      if (s.chart && s.v45 && s.guard) break;
    }
    await evalJs(sid, 'window.__redraw&&window.__redraw();window.__applyTexts&&window.__applyTexts();"ok"');
    await sleep(400);
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
