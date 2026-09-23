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

ws.onopen = async () => {
  try {
    await send('Target.activateTarget', { targetId: T });
    console.log('activated (front)');
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('Page.enable', {}, sid);
    await sleep(1000);

    // 等指标卡渲染
    for (let i = 0; i < 14; i++) {
      const r = await send('Runtime.evaluate', {
        expression: '(document.body.innerText||"").indexOf("总点击次数")>=0',
        returnByValue: true
      }, sid);
      if (r.result && r.result.result && r.result.result.value === true) { console.log('cards ready'); break; }
      await sleep(1500);
    }

    const js = fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject6_observer.js', 'utf8');
    const inj = await send('Runtime.evaluate', { expression: js, returnByValue: true }, sid);
    console.log('inject:', inj.result && inj.result.result && inj.result.result.value);

    await sleep(1800);
    const chk = await send('Runtime.evaluate', {
      expression: 'JSON.stringify({mine:document.querySelectorAll("svg[data-mine]").length,taku:(document.body.innerText||"").indexOf("takusushibar")>=0})',
      returnByValue: true
    }, sid);
    console.log('check:', chk.result && chk.result.result && chk.result.result.value);

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
