(() => {
  try {
    const log = { texts: {}, chart: null, icons: [], zoom: null };
    const NS = 'http://www.w3.org/2000/svg';

    /* ---- 1. 指标文本 + 域名 ---- */
    const vmap = {
      '1.5万': '3.6千', '319万': '17.5万', '0.5%': '2.1%', '20.7': '16.0',
      'electricalcabinet.net': 'takusushibar.com'
    };
    const sideMap = {
      '概述': '数据概览', '数据洞见': '流量趋势', '网址检查': '网址体检',
      'Google 搜索结果': '搜索表现', 'Google 探索': '探索流量',
      '网页': '热门页面', '视频': '视频表现', '移除': '移除请求',
      '核心网页指标': '网页体验', '链接': '外链引用'
    };
    const iconPaths = {
      '数据概览': 'M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z',
      '流量趋势': 'M4 19h3v3H4zm5.5-6h3v9h-3zM15 8h3v14h-3z',
      '网址体检': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
      '搜索表现': 'M3 17l5-6 4 3 6-8 2 2-7 9-4-3-4 5z',
      '探索流量': 'M12 2c1.2 4.2 4.6 7.6 8.8 8.8-4.2 1.2-7.6 4.6-8.8 8.8-1.2-4.2-4.6-7.6-8.8-8.8C7.4 9.6 10.8 6.2 12 2z',
      '热门页面': 'M5 3h11l3 3v15H5zm3 5h8v2H8zm0 4h8v2H8zm0 4h5v2H8z',
      '视频表现': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3 6l8 4-8 4z',
      '站点地图': 'M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z',
      '移除请求': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-5 9h10v2H7z',
      '网页体验': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 13.6l-3.4-3.4 1.4-1.4 2 2 4.4-4.4 1.4 1.4z',
      '外链引用': 'M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h5v2H7v10h10v-3h2v5H5z'
    };
    const replaceIcon = function (labelNode, key) {
      let c = labelNode;
      for (let i = 0; i < 12 && c; i++) {
        if (typeof c.querySelectorAll !== 'function') { c = c.parentElement; continue; }
        const svgs = c.querySelectorAll('svg');
        if (svgs.length) {
          const host = svgs[0].parentElement;
          svgs.forEach(function (s) { s.style.display = 'none'; });
          const old = host.querySelector('svg[data-mine]');
          if (old) old.remove();
          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('data-mine', '1');
          svg.setAttribute('width', '20');
          svg.setAttribute('height', '20');
          svg.setAttribute('aria-hidden', 'true');
          svg.style.cssText = 'flex-shrink:0;margin-right:14px';
          const p = document.createElementNS(NS, 'path');
          p.setAttribute('d', iconPaths[key]);
          p.setAttribute('fill', 'currentColor');
          svg.appendChild(p);
          host.insertBefore(svg, host.firstChild);
          log.icons.push(key);
          return;
        }
        c = c.parentElement;
      }
    };

    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const t = (n.nodeValue || '').trim();
      if (vmap[t] !== undefined) {
        n.nodeValue = n.nodeValue.replace(t, vmap[t]);
        log.texts[t] = (log.texts[t] || 0) + 1;
      } else if (sideMap[t] !== undefined) {
        const nt = sideMap[t];
        const anchor = n;
        n.nodeValue = n.nodeValue.replace(t, nt);
        log.texts['侧:' + t] = (log.texts['侧:' + t] || 0) + 1;
        if (iconPaths[nt]) replaceIcon(anchor, nt);
      }
    }

    /* ---- 2. 图表重绘 ---- */
    const svg = [...document.querySelectorAll('svg')].find(
      (s) => s.getBoundingClientRect().width > 500
    );
    if (svg) {
      const W = Math.round(svg.getBoundingClientRect().width);
      const H = Math.round(svg.getBoundingClientRect().height);
      let seed = 20260902;
      const rnd = function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      const start = new Date(2025, 4, 1);
      const end = new Date(2026, 7, 31);
      const span = end - start;
      const days = [];
      const d0 = new Date(start);
      while (d0 <= end) {
        const t = (d0 - start) / span;
        const dow = d0.getDay();
        const m = d0.getMonth();
        const cb = 2.5 + 8 * Math.pow(t, 1.12);
        const wk = (dow === 5 || dow === 6) ? 1.5 : (dow === 0 ? 1.2 : 1);
        let se = 1;
        if (m === 10 || m === 11) se = 1.2;
        if (m === 0 || m === 1) se = 0.92;
        const clicks = Math.max(1, Math.round(cb * wk * se * (0.84 + rnd() * 0.32)));
        const ctr = 0.015 + 0.010 * t;
        const impr = Math.round(clicks / (ctr * (0.9 + rnd() * 0.2)));
        days.push({ d: new Date(d0), clicks: clicks, impr: impr });
        d0.setDate(d0.getDate() + 1);
      }
      const L = 40, R = 52, T = 10, B = 26;
      const pw = W - L - R, ph = H - T - B;
      const maxC = 24, maxI = 800;
      const X = function (i) { return L + (i / (days.length - 1)) * pw; };
      const YC = function (v) { return T + ph - (v / maxC) * ph; };
      const YI = function (v) { return T + ph - (v / maxI) * ph; };
      const frag = document.createDocumentFragment();
      const mk = function (tag, attrs, text) {
        const el = document.createElementNS(NS, tag);
        for (const k in attrs) el.setAttribute(k, attrs[k]);
        if (text !== undefined) el.textContent = text;
        return el;
      };
      [0, 6, 12, 18, 24].forEach(function (v) {
        const yy = YC(v);
        frag.appendChild(mk('line', { x1: L, y1: yy, x2: W - R, y2: yy, stroke: '#e8eaed' }));
        frag.appendChild(mk('text', { x: L - 6, y: yy + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, String(v)));
      });
      [0, 200, 400, 600, 800].forEach(function (v) {
        const yy = YI(v);
        frag.appendChild(mk('text', { x: W - R + 6, y: yy + 4, 'font-size': 11, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, v >= 1000 ? (v / 1000) + '千' : String(v)));
      });
      const fd = function (d) { return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); };
      for (let i = 0; i < days.length; i += 91) {
        frag.appendChild(mk('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', 'font-size': 11, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, fd(days[i].d)));
      }
      const pl = function (key, yf) {
        return days.map(function (x, i) { return X(i).toFixed(1) + ',' + yf(x[key]).toFixed(1); }).join(' ');
      };
      frag.appendChild(mk('polyline', { points: pl('impr', YI), fill: 'none', stroke: '#9334e6', 'stroke-width': 1.6, opacity: 0.85 }));
      frag.appendChild(mk('polyline', { points: pl('clicks', YC), fill: 'none', stroke: '#1a73e8', 'stroke-width': 2 }));
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      svg.appendChild(frag);
      log.chart = { W: W, H: H, n: days.length };
    }

    /* ---- 3. 隐藏翻译扩展浮钮 ---- */
    document.querySelectorAll('plasmo-csui, #translate-btn, .bp6-overlay-backdrop').forEach(function (e) { e.style.display = 'none'; });

    /* ---- 4. zoom 收纳视口 ---- */
    document.documentElement.style.zoom = '0.86';
    log.zoom = '0.86';

    return JSON.stringify(log);
  } catch (e) {
    return JSON.stringify({ err: String(e && e.message ? e.message : e) });
  }
})()
