const T = process.argv[2];
const fs = await import('fs');
const ws = new WebSocket('ws://127.0.0.1:9222/devtools/browser');
let id = 0; const pending = new Map();
function send(m, p = {}, s) { return new Promise((res, rej) => { const i = ++id; const msg = { id: i, method: m, params: p }; if (s) msg.sessionId = s; pending.set(i, { res, rej }); ws.send(JSON.stringify(msg)); }); }
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const evalJs = async (sid, expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }, sid); return r.result && r.result.result && r.result.result.value; };
ws.onopen = async () => {
  try {
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('Page.enable', {}, sid);
    await send('Target.activateTarget', { targetId: T });
    const js = fs.readFileSync('D:/Code/knowledge-base/gsc-mock/inject_electrical.js', 'utf8');
    // 带校验的导航（确认落在 electricalcabinet 属性 + 1.5万 真实值出现）
    for (let a = 0; a < 4; a++) {
      await send('Page.navigate', { url: 'https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:electricalcabinet.net&metrics=CLICKS,IMPRESSIONS&num_of_months=16' }, sid);
      for (let i = 0; i < 25; i++) {
        await sleep(1500);
        await send('Target.activateTarget', { targetId: T }).catch(() => {});
        const ok = await evalJs(sid, '(document.body.innerText||"").indexOf("1.5万")>=0').catch(() => false);
        if (ok) {
          console.log(`electrical data ready (attempt ${a + 1})`);
          const r = await evalJs(sid, js);
          console.log('inject:', r);
          await sleep(2000);
          const fin = await evalJs(sid, '(()=>{const it=document.body.innerText||"";const s=[...document.querySelectorAll("svg")].find(x=>x.getBoundingClientRect().width>500);return JSON.stringify({chart:!!(s&&s.querySelector("polyline[data-mine]")),guard:!!window.__guardActive,vOK:it.indexOf("65.2万")>=0||it.indexOf("1.5万")>=0});})()');
          console.log('final:', fin);
          process.exit(0);
        }
      }
      console.log(`attempt ${a + 1} failed, retrying`);
    }
    console.error('never ready');
    process.exit(1);
  } catch (e) { console.error('err', e.message); process.exit(1); }
};
ws.onerror = () => { console.error('fail'); process.exit(1); };
