const T = process.argv[2];
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
    await sleep(500);

    await send('Page.navigate', { url: 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:electricalcabinet.net&metrics=CLICKS,IMPRESSIONS&num_of_months=16' }, sid);

    // 注入（observer 守护，ligature/icon/域名/图表全打）
    let injected = false;
    for (let i = 0; i < 30 && !injected; i++) {
      await sleep(800);
      const w = await evalJs(sid, fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject6_observer.js', 'utf8'));
      if (w && w.indexOf('observer') >= 0) { injected = true; console.log('injected:', w); }
    }
    if (!injected) { console.error('inject failed'); process.exit(1); }

    // 等图表画上 + 字体就绪
    let okChart = false, okFont = false;
    for (let i = 0; i < 25; i++) {
      await sleep(1000);
      const st = await evalJs(sid, `(()=>{
        const svg=[...document.querySelectorAll('svg')].find(s=>s.getBoundingClientRect().width>500);
        return JSON.stringify({
          chart: !!(svg && svg.querySelector('polyline[stroke="#1a73e8"]')),
          font: document.fonts ? document.fonts.status : 'n/a',
          cards: (document.body.innerText||'').indexOf('3.6千')>=0,
          lig: (document.body.innerText||'').indexOf('dashboard')<0
        });})()`);
      const s = JSON.parse(st || '{}');
      okChart = !!s.chart; okFont = s.font === 'loaded';
      if (okChart && okFont && s.cards) { console.log('all ready @', i + 1, 's'); break; }
      if (i === 24) console.log('timeout, state:', st);
    }
    await sleep(800);
    const shot = await send('Page.captureScreenshot', { format: 'png' }, sid);
    if (!shot.result || !shot.result.data) { console.error('shot failed'); process.exit(1); }
    fs.writeFileSync('D:/Code/knowledge-base/gsc-mock/taku_gsc_final.png', Buffer.from(shot.result.data, 'base64'));
    console.log('saved taku_gsc_final.png');
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws connect failed'); process.exit(1); };
