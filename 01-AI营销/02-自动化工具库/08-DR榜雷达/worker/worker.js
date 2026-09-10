// DR Radar API — Cloudflare Worker + D1
// 数据源：Ahrefs 免费 Top 1M DR 榜（月度快照，as_of 标注）。署名要求：Domain Rating by Ahrefs
// 注意：rank = DR 榜名次（域名权威/被链接度排序），不是流量排名；DR 同分区间的位次有 ±个位数的日漂移
// 端点：
//   GET /api?domain=example.com        单域名查询
//   GET /api?domains=a.com,b.com       批量（≤50）
//   GET /                              说明页

const AS_OF = '2026-09-07'; // 快照日期，月度刷新时同步更新

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  });

function fmt(domain) {
  return String(domain || '').trim().toLowerCase()
    .replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].replace(/\.+$/, '');
}

const SUS_RE = /^\d+[a-z]*\d*$/;
const JUNK_TLD_RE = /\.(xyz|cyou|icu)$/;
const isSus = (d) => SUS_RE.test(d.split('.')[0]) || JUNK_TLD_RE.test(d);

async function queryOne(db, domain) {
  let row = await db.prepare('SELECT dr, "rank" FROM dr WHERE domain = ?').bind(domain).first();
  if (!row) {
    // 试 www 前缀变体（榜内部分域名带 www 存储）
    row = await db.prepare('SELECT dr, "rank" FROM dr WHERE domain = ?').bind('www.' + domain).first();
  }
  const sus = isSus(domain);
  if (!row) return { domain, in_top1m: false, note: 'not in Top 1M (DR<45)', sus, as_of: AS_OF };
  return {
    domain,
    in_top1m: true,
    dr: row.dr,
    rank: row.rank,
    top_percent: +(row.rank / 10000).toFixed(4), // rank 24 → top 0.0024%
    sus,
    as_of: AS_OF,
    source: 'Domain Rating by Ahrefs',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/api/live') {
      const domain = fmt(url.searchParams.get('domain'));
      if (!domain) return json({ error: 'domain required' }, 400);
      try {
        // 简单限流：每 IP 8 次/分钟
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const now = Date.now();
        globalThis.__rl = globalThis.__rl || new Map();
        const arr = (globalThis.__rl.get(ip) || []).filter(t => now - t < 60000);
        if (arr.length >= 8) return json({ error: '请求过于频繁，请一分钟后再试' }, 429);
        arr.push(now); globalThis.__rl.set(ip, arr);
        if (!env.AHREFS_API_KEY) return json({ error: 'live 查询未配置' }, 503);
        const r = await fetch(`https://api.ahrefs.com/v3/public/domain-rating-free?target=${encodeURIComponent(domain)}`,
          { headers: { Authorization: `Bearer ${env.AHREFS_API_KEY}` } });
        if (!r.ok) return json({ error: '上游错误 ' + r.status }, 502);
        const d = await r.json();
        const dr = d && d.domain_rating ? d.domain_rating.domain_rating : null;
        let rankInfo = {};
        let row = await env.DB.prepare('SELECT dr, "rank" FROM dr WHERE domain = ?').bind(domain).first();
        if (!row) row = await env.DB.prepare('SELECT dr, "rank" FROM dr WHERE domain = ?').bind('www.' + domain).first();
        if (row) rankInfo = { in_top1m: true, rank: row.rank, snapshot_dr: row.dr, top_percent: +(row.rank / 10000).toFixed(4), as_of: AS_OF };
        else rankInfo = { in_top1m: false };
        return json({ domain, dr, live: true, ...rankInfo, source: 'Domain Rating by Ahrefs' });
      } catch (e) {
        return json({ error: String(e && e.message || e) }, 500);
      }
    }

    if (url.pathname === '/api/stats') {
      try {
        const row = await env.DB.prepare("SELECT v FROM stats WHERE k='snapshot'").first();
        if (!row) return json({ error: 'stats not ready' }, 404);
        return json(JSON.parse(row.v));
      } catch (e) {
        return json({ error: String(e && e.message || e) }, 500);
      }
    }

    if (url.pathname === '/api') {
      const single = url.searchParams.get('domain');
      const multi = url.searchParams.get('domains');
      const list = multi ? multi.split(/[,\s]+/).map(fmt).filter(Boolean).slice(0, 200) : null;
      if (!single && !list) return json({ error: 'param required: domain or domains' }, 400);
      try {
        if (list) {
          const results = [];
          for (const d of list) results.push(await queryOne(env.DB, d));
          return json({ count: results.length, results });
        }
        return json(await queryOne(env.DB, fmt(single)));
      } catch (e) {
        return json({ error: String(e && e.message || e) }, 500);
      }
    }

    if (url.pathname === '/') {
      const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>DR Radar API</title><style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;color:#21272c;line-height:1.7}
code{background:#f0f2f4;padding:2px 8px;border-radius:4px}a{color:#0e6e84}</style></head><body>
<h2>DR Radar API</h2>
<p>全球 Top 1M 域名权威榜查询（Ahrefs DR 数据，月度更新）。</p>
<p><code>GET /api?domain=example.com</code> — 单域名<br>
<code>GET /api?domains=a.com,b.com</code> — 批量（≤50）</p>
<p>返回示例：<code>{"domain":"github.com","dr":97,"rank":16,"top_percent":0.0016}</code></p>
<p style="color:#5b6570;font-size:13px">Data: Domain Rating by Ahrefs · powered by Cloudflare Workers + D1</p></body></html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', ...CORS } });
    }

    return json({ error: 'not found' }, 404);
  },
};
