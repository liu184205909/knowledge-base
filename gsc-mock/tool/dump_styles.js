(() => {
  try {
    const out = {};
    const pick = (el, extra) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return Object.assign({
        tag: el.tagName, cls: (el.className || '').toString().slice(0, 50),
        w: Math.round(r.width), h: Math.round(r.height),
        bg: cs.backgroundColor, color: cs.color, radius: cs.borderRadius,
        border: cs.border.replace(/\s+0px/g, '').slice(0, 80) || 'none',
        pad: cs.padding, font: cs.fontSize + '/' + cs.fontWeight + ' ' + cs.fontFamily.split(',')[0],
        shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0, 70)
      }, extra || {});
    };
    const byText = (txt, exact) => {
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = tw.nextNode())) {
        const t = (n.textContent || '').trim();
        if (exact ? t === txt : t.indexOf(txt) >= 0 && t.length < (exact ? 999 : 30)) return n.parentElement;
      }
      return null;
    };
    const rowOf = (el, minH, maxH) => {
      let c = el;
      for (let i = 0; i < 10 && c; i++) {
        const h = c.getBoundingClientRect().height;
        if (h >= minH && h <= maxH && h > 0) return c;
        c = c.parentElement;
      }
      return null;
    };

    out.body = pick(document.body, { zoom: document.documentElement.style.zoom || 'none' });
    out.htmlBg = getComputedStyle(document.documentElement).backgroundColor;

    const logo = byText('Search Console', false);
    out.logoText = pick(logo);
    if (logo) out.logoRow = rowOf(logo, 50, 70);

    const check = byText('中的任何网址', false);
    out.searchBox = pick(check ? check.parentElement : null);

    const prop = byText('electricalcabinet.net', true);
    out.propText = pick(prop);
    if (prop) out.propCard = rowOf(prop, 40, 70);

    const ov = byText('概述', true);
    out.sideItemOverview = pick(rowOf(ov, 30, 55));
    const sel = byText('Google 搜索结果', true);
    out.sideItemSelected = pick(rowOf(sel, 30, 55));
    const grp = byText('效果', true);
    out.sideGroup = pick(rowOf(grp, 25, 45));

    out.h1 = pick(byText('在 Google 搜索结果中的表现', true));

    const d16 = byText('16 个月', false);
    out.dateBtn = pick(d16 ? d16.parentElement : d16);
    if (d16) out.dateBtnRow = pick(rowOf(d16, 25, 45));
    const st = byText('搜索类型', false);
    out.dropdown = pick(st ? rowOf(st, 25, 45) : null);
    const upd = byText('上次更新', false);
    out.updated = pick(upd);

    const cl = byText('总点击次数', true);
    const card = cl ? rowOf(cl, 70, 140) : null;
    out.cardSelected = pick(card);
    if (cl) {
      out.cardLabel = pick(cl, { txt: (cl.textContent || '').trim() });
      let p = cl.parentElement, numEl = null;
      for (let i = 0; i < 6 && p && !numEl; i++) {
        for (const el of p.querySelectorAll('*')) {
          if (el.children.length === 0) {
            const t = (el.textContent || '').trim();
            if (/^[\d.,]+[%万千亿]?$/.test(t) && t.length <= 8) { numEl = el; break; }
          }
        }
        p = p.parentElement;
      }
      out.cardValue = pick(numEl, { txt: numEl ? numEl.textContent.trim() : null });
    }
    const ctr = byText('平均点击率', true);
    out.cardUnselected = pick(ctr ? rowOf(ctr, 70, 140) : null);

    const svgs = [...document.querySelectorAll('svg')].filter(s => s.getBoundingClientRect().width > 500);
    out.chartSvg = svgs.length ? pick(svgs[0]) : null;
    if (svgs.length) out.chartContainer = pick(svgs[0].parentElement);
    const ax = svgs.length ? [...svgs[0].querySelectorAll('text')].slice(0, 3) : [];
    out.chartAxisText = ax.length ? pick(ax[0], { attrs: [...ax[0].attributes].map(a => a.name + '=' + (a.value || '').slice(0, 30)).join(' '), }) : null;
    const pls = svgs.length ? [...svgs[0].querySelectorAll('polyline,path')] : [];
    out.chartLines = pls.slice(0, 4).map(pl => ({
      tag: pl.tagName, stroke: pl.getAttribute('stroke') || getComputedStyle(pl).stroke,
      width: pl.getAttribute('stroke-width') || getComputedStyle(pl).strokeWidth,
      fill: pl.getAttribute('fill'), opacity: pl.getAttribute('opacity')
    }));

    const ai = byText('生成式 AI', false);
    out.aiBanner = pick(ai ? rowOf(ai, 36, 70) : null);
    const aiLink = byText('打开报告', false);
    out.aiLink = pick(aiLink);

    const icons = [...document.querySelectorAll('.material-icons, .material-symbols-outlined, [class*="material"]')].slice(0, 4);
    out.iconSamples = icons.map(ic => pick(ic, { txt: (ic.textContent || '').trim().slice(0, 20) }));

    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ err: String(e && e.message ? e.message : e) });
  }
})()
