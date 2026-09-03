(() => {
  try {
    const NS = 'http://www.w3.org/2000/svg';
    const PATHS = {
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
    const map = {
      '概述': '数据概览',
      '数据洞见': '流量趋势',
      '网址检查': '网址体检',
      'Google 搜索结果': '搜索表现',
      'Google 探索': '探索流量',
      '网页': '热门页面',
      '视频': '视频表现',
      '移除': '移除请求',
      '核心网页指标': '网页体验',
      '链接': '外链引用'
    };
    const cnt = {};
    const icons = {};
    const swapIcon = function (startEl, newPathD, key) {
      let c = startEl;
      for (let i = 0; i < 6 && c; i++) {
        const svg = c.querySelector && c.querySelector('svg');
        if (svg) {
          while (svg.firstChild) svg.removeChild(svg.firstChild);
          const p = document.createElementNS(NS, 'path');
          p.setAttribute('d', newPathD);
          p.setAttribute('fill', 'currentColor');
          svg.appendChild(p);
          icons[key] = true;
          return true;
        }
        c = c.parentElement;
      }
      return false;
    };
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const t = (n.nodeValue || '').trim();
      if (map[t] !== undefined) {
        const nt = map[t];
        n.nodeValue = n.nodeValue.replace(t, nt);
        cnt[t] = (cnt[t] || 0) + 1;
        if (PATHS[nt]) swapIcon(n.parentElement, PATHS[nt], nt);
      }
    }
    return JSON.stringify({ cnt: cnt, icons: Object.keys(icons) });
  } catch (e) {
    return JSON.stringify({ err: String(e && e.message ? e.message : e) });
  }
})()
