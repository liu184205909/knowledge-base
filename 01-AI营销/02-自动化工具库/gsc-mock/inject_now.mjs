const T = process.argv[2];
const fs = await import('fs');
const ws = new WebSocket('ws://127.0.0.1:9222/devtools/browser');
let id = 0; const pending = new Map();
function send(m, p = {}, s) { return new Promise((res, rej) => { const i = ++id; const msg = { id: i, method: m, params: p }; if (s) msg.sessionId = s; pending.set(i, { res, rej }); ws.send(JSON.stringify(msg)); }); }
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
ws.onopen = async () => {
  try {
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    // 导航到 16 个月效果页
    await send('Page.enable', {}, sid);
    await send('Target.activateTarget', { targetId: T });
    await send('Page.navigate', { url: 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:electricalcabinet.net&metrics=CLICKS,IMPRESSIONS&num_of_months=16' }, sid);
    const js = fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject_electrical.js', 'utf8');
    for (let i = 0; i < 20; i++) {
      await sleep(1500);
      const r = await send('Runtime.evaluate', { expression: js, returnByValue: true }, sid);
      const v = r.result && r.result.result && r.result.result.value;
      if (v && v.indexOf('observer') >= 0) { console.log('injected:', v); break; }
    }
    await sleep(1200);
    const chk = await send('Runtime.evaluate', { expression: 'JSON.stringify({v45:(document.body.innerText||"").indexOf("4.5万")>=0,chart:!!([...document.querySelectorAll("svg")].find(x=>x.getBoundingClientRect().width>500)||{querySelector:()=>null}).querySelector||false})', returnByValue: true }, sid).catch(e=>null);
    console.log('check:', chk && chk.result && chk.result.result && chk.result.result.value);
    process.exit(0);
  } catch (e) { console.error('err', e.message); process.exit(1); }
};
ws.onerror = () => { console.error('fail'); process.exit(1); };
