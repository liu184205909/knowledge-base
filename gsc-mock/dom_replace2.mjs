const T = process.argv[2];
const QUERY = process.argv[3] || 'electricalcabinet.net';
const REPLACE = process.argv[4] || 'eabel.com';
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
const walkTexts = (node, out) => {
  if (!node) return;
  if (node.nodeType === 3 && (node.nodeValue || '').indexOf(QUERY) >= 0) out.push(node.nodeId);
  (node.children || []).forEach(c => walkTexts(c, out));
  if (node.shadowRoots) node.shadowRoots.forEach(sr => (sr.children || []).forEach(c => walkTexts(c, out)));
};
ws.onopen = async () => {
  try {
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('DOM.enable', {}, sid);
    await send('DOM.getDocument', { depth: 0, pierce: true }, sid);
    const search = await send('DOM.performSearch', { query: QUERY }, sid);
    const count = search.result.resultCount || 0;
    console.log('matches:', count);
    const range = await send('DOM.getSearchResults', { searchId: search.result.searchId, fromIndex: 0, toIndex: Math.min(count, 100) }, sid);
    const nodeIds = range.result.nodeIds || [];
    let textFixed = 0;
    for (const nid of nodeIds) {
      const r = await send('DOM.describeNode', { nodeId: nid, depth: 4, pierce: true }, sid).catch(() => null);
      if (!r || !r.result || !r.result.node) continue;
      const texts = [];
      walkTexts(r.result.node, texts);
      for (const tid of texts) {
        const rr = await send('DOM.setNodeValue', { nodeId: tid, value: REPLACE }, sid).catch(e => null);
        if (rr !== null) textFixed++;
      }
    }
    console.log('text nodes fixed:', textFixed);
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws fail'); process.exit(1); };
