const T = process.argv[2];
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
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('Page.enable', {}, sid);
    const js = fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject_electrical.js', 'utf8');

    await send('Target.activateTarget', { targetId: T }).catch(() => {});
    await send('Page.navigate', { url: URL }, sid);
    console.log('navigating...');

    // 抢注窗口：从 300ms 起每 400ms 注入一次，共 ~25s，抢在 hydration 迁移前命中域名
    let domainHit = -1, valueHit = -1;
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) await send('Target.activateTarget', { targetId: T }).catch(() => {});
      await sleep(400);
      const r = await evalJs(sid, js).catch(() => null);
      const st = await evalJs(sid, 'JSON.stringify({dom:(document.body.innerText||"").indexOf("eabel.com")>=0,v45:(document.body.innerText||"").indexOf("4.5万")>=0,any:(document.body.innerText||"").length>50})').catch(() => null);
      const s = JSON.parse(st || '{}');
      if (s.dom && domainHit < 0) { domainHit = i; console.log(`domain replaced @ ${(i + 1) * 0.4}s`); }
      if (s.v45 && valueHit < 0) { valueHit = i; console.log(`values ok @ ${(i + 1) * 0.4}s`); }
      if (domainHit >= 0 && valueHit >= 0 && i > domainHit + 8) break;  // 稳定窗口后停
    }
    const final = await evalJs(sid, 'JSON.stringify({dom:(document.body.innerText||"").indexOf("eabel.com")>=0,v45:(document.body.innerText||"").indexOf("4.5万")>=0,v562:(document.body.innerText||"").indexOf("562万")>=0,ctr:(document.body.innerText||"").indexOf("0.8%")>=0,guard:!!window.__guardActive})');
    console.log('final:', final);
    console.log('READY FOR MANUAL SCREENSHOT — tab is in foreground');
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws connect failed'); process.exit(1); };
