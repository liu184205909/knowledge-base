const T = process.argv[2];
const X = parseFloat(process.argv[3]);
const Y = parseFloat(process.argv[4]);
const TEXT = process.argv[5];
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
    const att = await send('Target.attachToTarget', { targetId: T, flatten: true });
    const sid = att.result.sessionId;
    // 聚焦输入框
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: X, y: Y, button: 'left', buttons: 1, clickCount: 1, pointerType: 'mouse' }, sid);
    await sleep(50);
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: X, y: Y, button: 'left', buttons: 0, clickCount: 1, pointerType: 'mouse' }, sid);
    await sleep(200);
    // 全选
    await send('Input.dispatchKeyEvent', { type: 'keyDown', modifiers: 2, key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 }, sid);
    await sleep(60);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', modifiers: 2, key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 }, sid);
    await sleep(60);
    // 输入文本（替换选中）
    await send('Input.insertText', { text: TEXT }, sid);
    await sleep(150);
    console.log(`filled "${TEXT}" at (${X}, ${Y})`);
    process.exit(0);
  } catch (e) {
    console.error('err:', e.message);
    process.exit(1);
  }
};
ws.onerror = () => { console.error('ws fail'); process.exit(1); };
