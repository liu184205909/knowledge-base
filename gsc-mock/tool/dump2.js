(() => {
  try {
    const out = {};
    const byText = (txt, exact) => {
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = tw.nextNode())) {
        const t = (n.textContent || '').trim();
        if (exact ? t === txt : t.indexOf(txt) >= 0 && t.length < 30) return n.parentElement;
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

    /* 1. 字体资源 URL */
    out.fontResources = performance.getEntriesByType('resource')
      .map(r => r.name).filter(u => /\.(woff2?|ttf)($|\?)/.test(u)).slice(0, 20);
    out.fontFamilies = [];
    document.fonts.forEach(f => { if (out.fontFamilies.indexOf(f.family) < 0) out.fontFamilies.push(f.family + ':' + f.status); });

    /* 2. 选中指标卡：子孙中非透明背景 */
    const cl = byText('总点击次数', true);
    if (cl) {
      let card = rowOf(cl, 60, 130);
      const bgs = [];
      let c = card;
      for (let i = 0; i < 6 && c; i++) {
        const cs = getComputedStyle(c);
        bgs.push({ depth: i, bg: cs.backgroundColor, radius: cs.borderRadius, h: Math.round(c.getBoundingClientRect().height) });
        c = c.parentElement;
      }
      out.selectedCardChain = bgs;
      if (card) {
        const deep = [];
        card.querySelectorAll('*').forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') {
            deep.push({ bg: cs.backgroundColor, radius: cs.borderRadius, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) });
          }
        });
        out.selectedCardColored = deep.slice(0, 6);
      }
    }
    /* 3. 未选中卡（平均点击率）背景 */
    const ctr = byText('平均点击率', true);
    if (ctr) {
      const card2 = rowOf(ctr, 60, 130);
      const chain2 = [];
      let c = card2;
      for (let i = 0; i < 5 && c; i++) {
        const cs = getComputedStyle(c);
        chain2.push({ depth: i, bg: cs.backgroundColor, radius: cs.borderRadius, shadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow.slice(0, 60) });
        c = c.parentElement;
      }
      out.unselectedCardChain = chain2;
    }

    /* 4. 日期按钮组每个按钮 */
    const d16 = byText('16 个月', false);
    if (d16) {
      const row = rowOf(d16, 25, 45);
      out.dateButtons = row ? [...row.querySelectorAll('*')].filter(e => e.children.length === 0 && (e.textContent || '').trim().length > 0 && e.textContent.trim().length < 12).slice(0, 10).map(e => {
        const cs = getComputedStyle(e.parentElement);
        return { txt: e.textContent.trim(), color: cs.color, border: cs.border.slice(0, 50), radius: cs.borderRadius, pad: cs.padding, font: cs.fontSize + '/' + cs.fontWeight, bg: cs.backgroundColor };
      }) : null;
    }

    /* 5. 图表 path 形状与轴文字 */
    const svgs = [...document.querySelectorAll('svg')].filter(s => s.getBoundingClientRect().width > 500);
    if (svgs.length) {
      const paths = [...svgs[0].querySelectorAll('path')].filter(p => (p.getAttribute('stroke') || '').indexOf('#') === 0);
      out.chartPathD = paths.slice(0, 2).map(p => (p.getAttribute('d') || '').slice(0, 100));
      const texts = [...svgs[0].querySelectorAll('text')].filter(t => t.getAttribute('opacity') !== '0');
      out.chartTextAttrs = texts.slice(0, 4).map(t => [...t.attributes].map(a => a.name + '=' + (a.value || '').slice(0, 40)).join(' '));
      const gridLines = [...svgs[0].querySelectorAll('line')].slice(0, 3);
      out.gridLineAttrs = gridLines.map(l => [...l.attributes].map(a => a.name + '=' + (a.value || '').slice(0, 30)).join(' '));
    }

    /* 6. 侧栏 icon 元素 */
    const ov = byText('概述', true);
    if (ov) {
      const r = rowOf(ov, 30, 55);
      if (r) {
        const ic = r.querySelector('[class*="icon"], .material-icons, [aria-hidden]');
        out.sideIcon = ic ? { cls: (ic.className || '').toString().slice(0, 40), font: getComputedStyle(ic).fontFamily.slice(0, 60) + ' ' + getComputedStyle(ic).fontSize, txt: (ic.textContent || '').trim().slice(0, 15) } : null;
      }
    }
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ err: String(e && e.message ? e.message : e) });
  }
})()
