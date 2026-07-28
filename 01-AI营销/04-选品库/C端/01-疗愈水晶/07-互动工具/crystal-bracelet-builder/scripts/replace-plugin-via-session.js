const fs = require('fs');

const site = process.env.WP_SITE.replace(/\/$/, '');
const zip = process.argv[2];

async function chromeCookies() {
  const targets = await (await fetch('http://localhost:9222/json')).json();
  const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl)
    || targets.find((item) => item.webSocketDebuggerUrl);
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let nextId = 1;
  const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (request) {
      pending.delete(message.id);
      request.resolve(message.result);
    }
  };
  const call = (method) => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method }));
    setTimeout(() => {
      if (pending.delete(id)) reject(new Error(`CDP timeout: ${method}`));
    }, 10000);
  });
  await call('Network.enable');
  const { cookies } = await call('Network.getAllCookies');
  socket.close();
  return cookies
    .filter((cookie) => /(^|\.)goearthward\.com$/.test(cookie.domain))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

async function main() {
  if (!zip || !fs.existsSync(zip)) throw new Error('Plugin ZIP path is missing or invalid.');
  const cookie = await chromeCookies();
  if (!cookie) throw new Error('No logged-in GoEarthWard session cookie is available.');
  const headers = { Cookie: cookie, 'User-Agent': 'Mozilla/5.0' };
  const page = await fetch(`${site}/wp-admin/plugin-install.php?tab=upload`, { headers });
  const nonce = /name=["']_wpnonce["']\s+value=["']([^"']+)/.exec(await page.text())?.[1];
  if (!nonce) throw new Error('Could not obtain the WordPress upload nonce.');
  const form = new FormData();
  form.append('_wpnonce', nonce);
  form.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  form.append('pluginzip', new Blob([fs.readFileSync(zip)], { type: 'application/zip' }), zip.split(/[\\/]/).pop());
  form.append('install-plugin-submit', 'Install Now');
  const uploaded = await fetch(`${site}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST', headers, body: form, redirect: 'follow',
  });
  const uploadHtml = await uploaded.text();
  const overwritePath = /href=["']([^"']*update-from-upload-overwrite[^"']*)/.exec(uploadHtml)?.[1];
  if (!overwritePath) throw new Error(`Upload did not reach the overwrite confirmation (HTTP ${uploaded.status}).`);
  const updated = await fetch(new URL(overwritePath.replace(/&amp;/g, '&'), site), {
    headers, redirect: 'follow',
  });
  const updatedHtml = await updated.text();
  if (!/Plugin updated successfully/.test(updatedHtml)) {
    throw new Error(`WordPress did not confirm the plugin update (HTTP ${updated.status}).`);
  }
  console.log(JSON.stringify({ updated: true, status: updated.status }));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
