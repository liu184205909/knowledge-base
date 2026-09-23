(() => {
  try {
    const svg = [...document.querySelectorAll("svg")].find(
      (s) => s.getBoundingClientRect().width > 500
    );
    if (!svg) return JSON.stringify({ step: "find", err: "no svg" });
    const W = Math.round(svg.getBoundingClientRect().width);
    const H = Math.round(svg.getBoundingClientRect().height);
    let seed = 20260902;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
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
    const P = function (k, yf) {
      return days.map(function (x, i) { return X(i).toFixed(1) + "," + yf(x[k]).toFixed(1); }).join(" ");
    };
    let g = "";
    [0, 6, 12, 18, 24].forEach(function (v) {
      const yy = YC(v);
      g += '<line x1="' + L + '" y1="' + yy + '" x2="' + (W - R) + '" y2="' + yy + '" stroke="#e8eaed"/>';
      g += '<text x="' + (L - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + v + '</text>';
    });
    [0, 200, 400, 600, 800].forEach(function (v) {
      const yy = YI(v);
      g += '<text x="' + (W - R + 6) + '" y="' + (yy + 4) + '" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + (v >= 1000 ? v / 1000 + '千' : v) + '</text>';
    });
    const fd = function (d) { return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(); };
    for (let i = 0; i < days.length; i += 91) {
      g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + fd(days[i].d) + '</text>';
    }
    g += '<polyline points="' + P('impr', YI) + '" fill="none" stroke="#9334e6" stroke-width="1.6" opacity="0.85"/>';
    g += '<polyline points="' + P('clicks', YC) + '" fill="none" stroke="#1a73e8" stroke-width="2"/>';
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    const doc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg">' + g + '</svg>',
      'image/svg+xml'
    );
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const imported = [...doc.documentElement.childNodes];
    imported.forEach(function (node) {
      svg.appendChild(document.importNode(node, true));
    });
    return JSON.stringify({ ok: true, W: W, H: H, n: days.length, added: imported.length });
  } catch (e) {
    return JSON.stringify({ step: 'chart', err: String(e && e.message ? e.message : e) });
  }
})()
