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
const sleep = ms => new Promise(r => setTimeout(r, ms));
ws.onopen = async () => {
  try {
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    await send('DOM.enable', {}, sid);

    // 关闭可能开着的对话框（ESC）
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sid);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }, sid);
    await sleep(600);

    // 穿透 shadow 的全文档搜索（等同 F12 Ctrl+F）
    const doc = await send('DOM.getDocument', { depth: 0, pierce: true }, sid);
    const search = await send('DOM.performSearch', { query: QUERY }, sid);
    const count = search.result.searchResultDisclosure ? 0 : (search.result.resultCount || 0);
    console.log('matches:', count);
    if (count > 0) {
      const range = await send('DOM.getSearchResults', { searchId: search.result.searchId, fromIndex: 0, toIndex: Math.min(count, 80) }, sid);
      const nodeIds = range.result.nodeIds || [];
      let textFixed = 0, attrFixed = 0;
      for (const nid of nodeIds) {
        const node = await send('DOM.describeNode', { nodeId: nid, depth: 0 }, sid).catch(() => null);
        if (!node || !node.result || !node.result.node) continue;
        const n = node.result.node;
        if (n.nodeType === 3) { // text node
          const val = (n.nodeValue || '');
          const nv = val.split(QUERY).join(REPLACE);
          if (nv !== val) {
            await send('DOM.setNodeValue', { nodeId: nid, value: nv }, sid);
            textFixed++;
          }
        } else if (n.nodeType === 1) { // element -> attributes
          for (const aname of ['placeholder', 'title', 'aria-label', 'value', 'alt']) {
            const attrs = n.attributes || [];
            for (let i = 0; i < attrs.length; i += 2) {
              if (attrs[i] === aname && String(attrs[i + 1]).indexOf(QUERY.split('.')[0]) >= 0) {
                const nv = String(attrs[i + 1]).split(QUERY).join(REPLACE);
                await send('DOM.setAttributeValue', { nodeId: nid, name: aname, value: nv }, sid);
                attrFixed++;
              }
            }
          }
        }
      }
      console.log('text nodes fixed:', textFixed, '| attributes fixed:', attrFixed);
    }
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws fail'); process.exit(1); };
