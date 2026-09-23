const T = process.argv[2];
const QUERY = process.argv[3] || 'electricalcabinet.net';
const REPLACE = process.argv[4] || 'crystals.com';
const ws = new WebSocket('ws://127.0.0.1:9222/devtools/browser');
let id = 0; const pending = new Map();
function send(m, p = {}, s) { return new Promise((res, rej) => { const i = ++id; const msg = { id: i, method: m, params: p }; if (s) msg.sessionId = s; pending.set(i, { res, rej }); ws.send(JSON.stringify(msg)); }); }
ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m); } };
ws.onopen = async () => {
  try {
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('DOM.enable', {}, sid);
    await send('DOM.getDocument', { depth: 0, pierce: true }, sid);
    const search = await send('DOM.performSearch', { query: QUERY }, sid);
    const range = await send('DOM.getSearchResults', { searchId: search.result.searchId, fromIndex: 0, toIndex: search.result.resultCount }, sid);
    const nodeIds = range.result.nodeIds || [];
    console.log('total hits:', nodeIds.length);
    // 只处理顶栏/属性卡区域（y < 260 逻辑像素）
    let fixed = 0, noBox = 0, noObj = 0, noHit = 0, ySkipped = 0;
    for (const nid of nodeIds) {
      const box = await send('DOM.getBoxModel', { nodeId: nid }, sid).catch(() => null);
      if (!box || !box.result || !box.result.model) { noBox++; continue; }
      const ys = box.result.model.content.map(p => p[1]);
      const top = Math.min(...ys);
      if (top > 260) { ySkipped++; continue; }
      // 对该节点执行 JS：改 input.value / textContent / placeholder
      const rn = await send('DOM.resolveNode', { nodeId: nid }, sid).catch(() => null);
      if (!rn || !rn.result || !rn.result.object) { noObj++; continue; }
      const call = await send('Runtime.callFunctionOn', {
        functionDeclaration: `function(QUERY, REPLACE){
          const out = [];
          if (this.tagName === 'INPUT') {
            const clean = (s) => s.split('eabel.com').join(REPLACE).split('electricalcabinet.net').join(REPLACE).split('electricalcabinet').join(REPLACE);
            if (this.value && (this.value.indexOf(QUERY) >= 0 || this.value.indexOf('eabel.com') >= 0)) { this.value = clean(this.value); out.push('value'); }
            if ((this.placeholder||'').indexOf(QUERY) >= 0) { this.placeholder = this.placeholder.split(QUERY).join(REPLACE); out.push('ph'); }
          } else {
            const walk = (el) => {
              for (const c of el.childNodes) {
                if (c.nodeType === 3 && (c.nodeValue||'').indexOf(QUERY) >= 0) { c.nodeValue = c.nodeValue.split(QUERY).join(REPLACE); out.push('txt'); }
                else if (c.nodeType === 1) walk(c);
              }
            };
            walk(this);
            this.querySelectorAll && this.querySelectorAll('input').forEach(i2 => {
              if ((i2.value||'').indexOf(QUERY)>=0 || (i2.value||'').indexOf('eabel.com')>=0) { i2.value = clean(i2.value); out.push('cvalue'); }
              if ((i2.placeholder||'').indexOf(QUERY)>=0) { i2.placeholder = i2.placeholder.split(QUERY).join(REPLACE); out.push('cph'); }
            });
          }
          if (out.length === 0) out.push('DUMP:' + this.tagName + '|v=' + String(this.value||'').slice(0,40) + '|ph=' + String(this.placeholder||'').slice(0,50) + '|t=' + String(this.textContent||'').trim().slice(0,40));
          return out.join(',');
        }`,
        objectId: rn.result.object.objectId,
        returnByValue: true, arguments: [{ value: QUERY }, { value: REPLACE }]
      }, sid).catch(e => ({ error: e.message }));
      const v = call.result && call.result.result && call.result.result.value;
      if (v) { fixed++; console.log('node y=' + Math.round(top), 'fixed:', v); } else { noHit++; }
    }
    console.log('fixed:', fixed, 'noBox:', noBox, 'noObj:', noObj, 'ySkipped:', ySkipped, 'noHit(no match):', noHit);
    process.exit(0);
  } catch (e) { console.error('err', e.message); process.exit(1); }
};
ws.onerror = () => { console.error('fail'); process.exit(1); };
