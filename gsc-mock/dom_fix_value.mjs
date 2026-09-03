const T = process.argv[2];
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
    const search = await send('DOM.performSearch', { query: 'electricalcabinet' }, sid);
    const range = await send('DOM.getSearchResults', { searchId: search.result.searchId, fromIndex: 0, toIndex: search.result.resultCount }, sid);
    const nodeIds = range.result.nodeIds || [];
    console.log('total hits:', nodeIds.length);
    // 只处理顶栏/属性卡区域（y < 260 逻辑像素）
    let fixed = 0;
    for (const nid of nodeIds) {
      const box = await send('DOM.getBoxModel', { nodeId: nid }, sid).catch(() => null);
      if (!box || !box.result || !box.result.model) continue;
      const ys = box.result.model.content.map(p => p[1]);
      const top = Math.min(...ys);
      if (top > 260) continue;
      // 对该节点执行 JS：改 input.value / textContent / placeholder
      const rn = await send('DOM.resolveNode', { nodeId: nid }, sid).catch(() => null);
      if (!rn || !rn.result || !rn.result.object) continue;
      const call = await send('Runtime.callFunctionOn', {
        functionDeclaration: `function(){
          const out = [];
          if (this.tagName === 'INPUT') {
            if (this.value && this.value.indexOf('electricalcabinet') >= 0) { this.value = this.value.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('eabel'); out.push('value'); }
            if ((this.placeholder||'').indexOf('electricalcabinet') >= 0) { this.placeholder = this.placeholder.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('eabel'); out.push('ph'); }
          } else {
            const walk = (el) => {
              for (const c of el.childNodes) {
                if (c.nodeType === 3 && (c.nodeValue||'').indexOf('electricalcabinet') >= 0) { c.nodeValue = c.nodeValue.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('eabel'); out.push('txt'); }
                else if (c.nodeType === 1) walk(c);
              }
            };
            walk(this);
            this.querySelectorAll && this.querySelectorAll('input').forEach(i2 => {
              if ((i2.value||'').indexOf('electricalcabinet')>=0) { i2.value = i2.value.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('eabel'); out.push('cvalue'); }
              if ((i2.placeholder||'').indexOf('electricalcabinet')>=0) { i2.placeholder = i2.placeholder.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('eabel'); out.push('cph'); }
            });
          }
          return out.join(',');
        }`,
        objectId: rn.result.object.objectId,
        returnByValue: true
      }, sid).catch(e => ({ error: e.message }));
      const v = call.result && call.result.result && call.result.result.value;
      if (v) { fixed++; console.log('node y=' + Math.round(top), 'fixed:', v); }
    }
    console.log('fixed nodes:', fixed);
    process.exit(0);
  } catch (e) { console.error('err', e.message); process.exit(1); }
};
ws.onerror = () => { console.error('fail'); process.exit(1); };
