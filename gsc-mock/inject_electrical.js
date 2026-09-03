(() => {
  try {
    if (window.__guardActive && window.__applyTexts) {
      window.__applyTexts();
      return JSON.stringify({ already: true });
    }
    const NS = 'http://www.w3.org/2000/svg';
    const log = { texts: {}, chart: null };

    /* ---- 1. 指标数值 ×3（CTR/排名/域名保持正版） ---- */
    const vmap = {
      '1.5万': '4.5万',
      '319万': '562万',
      '0.5%': '0.8%',
      'electricalcabinet.net': 'eabel.com'
    };
    const applyTexts = function () {
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = tw.nextNode())) {
        const t = (n.nodeValue || '').trim();
        if (vmap[t] !== undefined) {
          n.nodeValue = n.nodeValue.replace(t, vmap[t]);
          log.texts[t] = (log.texts[t] || 0) + 1;
        } else if (t.indexOf('electricalcabinet') >= 0) {
          n.nodeValue = n.nodeValue.split('electricalcabinet.net').join('eabel.com').split('electricalcabinet').join('www.eabel');
          log.texts['dom-frag'] = (log.texts['dom-frag'] || 0) + 1;
        }
      }
      document.querySelectorAll('*').forEach(function (el) {
        ['placeholder', 'title', 'aria-label', 'alt'].forEach(function (a) {
          const v = el.getAttribute && el.getAttribute(a);
          if (v && v.indexOf('electricalcabinet') >= 0) {
            el.setAttribute(a, v.split('electricalcabinet.net').join('eabel.com'));
          }
        });
      });
      document.querySelectorAll('img').forEach(function (img) {
        const s = img.src || '';
        if (s.indexOf('electricalcabinet') >= 0 || (s.indexOf('favicons') >= 0 && img.getBoundingClientRect().width < 60)) {
          img.src = 'https://www.google.com/s2/favicons?sz=32&domain=eabel.com';
          img.srcset = '';
        }
      });
    };
    applyTexts();

    /* ---- 2. 趋势图：缓慢上升（B2B 特征：周末低、噪声小、线性斜率） ---- */
    const redrawChart = function () {
      const svg = [...document.querySelectorAll('svg')].find(
        (s) => s.getBoundingClientRect().width > 500
      );
      if (!svg || svg.querySelector('polyline[data-mine="1"]')) return false;
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
        const base = 62 + 60 * t;                     // 62 → 122 更缓的线性上升（均值93 ≈ 4.5万/484天）
        const weekend = (dow === 0 || dow === 6) ? 0.62 : 1;   // B2B：周末低谷
        let se = 1;
        if (m === 10 || m === 11) se = 1.05;          // 年末微峰
        const clicks = Math.max(1, Math.round(base * weekend * se * (0.92 + rnd() * 0.16)));
        const ctr = 0.0072 + 0.0016 * t;              // 0.72% → 0.88%（加权≈0.8%）
        const impr = Math.round(clicks / (ctr * (0.93 + rnd() * 0.14)));
        days.push({ d: new Date(d0), clicks: clicks, impr: impr });
        d0.setDate(d0.getDate() + 1);
      }
      const L = 40, R = 58, T = 10, B = 26;
      const pw = W - L - R, ph = H - T - B;
      const maxC = 200, maxI = 18000;
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
      [0, 50, 100, 150, 200].forEach(function (v) {
        frag.appendChild(mk('text', { x: L - 6, y: YC(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, String(v)));
      });
      [0, 4500, 9000, 13500, 18000].forEach(function (v) {
        const lbl = v === 0 ? '0' : v >= 10000 ? (v / 10000).toFixed(v % 10000 ? 2 : 0).replace(/\.?0+$/, '') + '万' : (v / 1000).toFixed(1).replace(/\.0$/, '') + '千';
        frag.appendChild(mk('text', { x: W - R + 6, y: YI(v) + 4, 'font-size': 12, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, lbl));
      });
      const fd = function (d) { return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); };
      for (let i = 0; i < days.length; i += 91) {
        frag.appendChild(mk('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', 'font-size': 12, fill: '#5f6368', 'font-family': 'Roboto,Arial' }, fd(days[i].d)));
      }
      frag.appendChild(mk('path', { d: 'M' + L + ',' + (T + ph) + ' L' + (W - R) + ',' + (T + ph), stroke: '#dadce0', 'stroke-width': 1, fill: 'none' }));
      const pl = function (key, yf) {
        return days.map(function (x, i) { return X(i).toFixed(1) + ',' + yf(x[key]).toFixed(1); }).join(' ');
      };
      frag.appendChild(mk('polyline', { points: pl('impr', YI), fill: 'none', stroke: '#5e35b1', 'stroke-width': 2, 'data-mine': 'chart' }));
      const cl = mk('polyline', { points: pl('clicks', YC), fill: 'none', stroke: '#4285f4', 'stroke-width': 2 });
      cl.setAttribute('data-mine', '1');
      frag.appendChild(cl);
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      svg.appendChild(frag);
      return { W: W, H: H, n: days.length };
    };
    log.chart = redrawChart();
    window.__redraw = redrawChart;
    window.__applyTexts = applyTexts;

    /* ---- 域名覆盖层：属性卡 + 搜索框（黑箱文本用同底色块盖写） ---- */
    const ensureOverlays = function () {
      const fv = [...document.querySelectorAll('img')].find(function (i) {
        const b = i.getBoundingClientRect();
        return (i.src || '').indexOf('favicons') >= 0 && b.width > 0 && b.width < 60 && b.top < 250;
      });
      if (fv) {
        const b = fv.getBoundingClientRect();
        let ov = document.getElementById('__domov1');
        if (!ov) {
          ov = document.createElement('div');
          ov.id = '__domov1';
          ov.style.cssText = 'position:fixed;background:#fff;font:500 14px "Google Sans",Roboto,Arial,"Microsoft YaHei",sans-serif;color:#1f1f1f;z-index:99999;pointer-events:none;width:230px;height:22px;overflow:hidden';
          document.body.appendChild(ov);
        }
        ov.style.left = (b.right + 9) + 'px';
        ov.style.top = (b.top + b.height / 2 - 11) + 'px';
        ov.textContent = 'eabel.com';
      }
      const inp = [...document.querySelectorAll('input')].find(function (i) {
        return ((i.placeholder || '').indexOf('检查') >= 0 || (i.placeholder || '').indexOf('electrical') >= 0) && i.getBoundingClientRect().width > 200;
      });
      if (inp) {
        const b = inp.getBoundingClientRect();
        let ov2 = document.getElementById('__domov2');
        if (!ov2) {
          ov2 = document.createElement('div');
          ov2.id = '__domov2';
          ov2.style.cssText = 'position:fixed;background:#e2ecfc;font:400 13.5px "Google Sans",Roboto,Arial,"Microsoft YaHei",sans-serif;color:#757575;z-index:99999;pointer-events:none;width:380px;height:22px;overflow:hidden';
          document.body.appendChild(ov2);
        }
        ov2.style.left = (b.left + 46) + 'px';
        ov2.style.top = (b.top + b.height / 2 - 11) + 'px';
        ov2.textContent = '检查"eabel.com"中的任何网址';
      }
    };

    /* ---- 3. 隐藏扩展浮层 ---- */
    const hideOverlays = function () {
      document.querySelectorAll('plasmo-csui, #translate-btn').forEach(function (e) { e.style.display = 'none'; });
    };
    hideOverlays();

    /* ---- 4. 永久守护：Angular 每次重渲染后立即重打数值+图表 ---- */
    let timer = null;
    const applyAll = function () {
      applyTexts();
      log.chart = redrawChart() || log.chart;   // redrawChart 内部幂等：Angular 重建后自动补画
      hideOverlays();
    };
    const obs = new MutationObserver(function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; applyAll(); }, 60);
    });
    obs.observe(document.body, { subtree: true, childList: true });
    window.__guardTimer = setInterval(applyAll, 500);
    window.__guardActive = true;

    return JSON.stringify(log);
  } catch (e) {
    return JSON.stringify({ err: String(e && e.message ? e.message : e) });
  }
})()
