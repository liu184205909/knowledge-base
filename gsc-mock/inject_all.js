(() => {
  const log = { cnt: {}, svg: null, cards: null };
  const map = {
    "1.5万": "3.6千",
    "319万": "17.5万",
    "0.5%": "2.1%",
    "20.7": "16.0",
    "electricalcabinet.net": "takusushibar.com"
  };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const t = n.nodeValue;
    const trimmed = t.trim();
    if (map[trimmed] !== undefined) {
      n.nodeValue = t.replace(trimmed, map[trimmed]);
      log.cnt[trimmed] = (log.cnt[trimmed] || 0) + 1;
    }
  }

  const svg = [...document.querySelectorAll("svg")].find(
    (s) => s.getBoundingClientRect().width > 500
  );
  if (svg) {
    const W = Math.round(svg.getBoundingClientRect().width);
    const H = Math.round(svg.getBoundingClientRect().height);
    let seed = 20260902;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    const start = new Date(2025, 4, 1);
    const end = new Date(2026, 7, 31);
    const span = end - start;
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const t = (d - start) / span;
      const dow = d.getDay();
      const m = d.getMonth();
      const cb = 2.5 + 8 * Math.pow(t, 1.12);
      const wk = (dow === 5 || dow === 6) ? 1.5 : (dow === 0 ? 1.2 : 1);
      let se = 1;
      if (m === 10 || m === 11) se = 1.2;
      if (m === 0 || m === 1) se = 0.92;
      const clicks = Math.max(1, Math.round(cb * wk * se * (0.84 + rnd() * 0.32)));
      const ctr = 0.015 + 0.010 * t;
      const impr = Math.round(clicks / (ctr * (0.9 + rnd() * 0.2)));
      days.push({ d: new Date(d), clicks: clicks, impr: impr });
    }
    const L = 40, R = 52, T = 10, B = 26;
    const pw = W - L - R, ph = H - T - B;
    const maxC = 24, maxI = 800;
    const X = (i) => L + (i / (days.length - 1)) * pw;
    const YC = (v) => T + ph - (v / maxC) * ph;
    const YI = (v) => T + ph - (v / maxI) * ph;
    const P = (k, yf) => days.map((x, i) => X(i).toFixed(1) + "," + yf(x[k]).toFixed(1)).join(" ");
    let g = "";
    const gridValsC = [0, 6, 12, 18, 24];
    gridValsC.forEach((v) => {
      const yy = YC(v);
      g += '<line x1="' + L + '" y1="' + yy + '" x2="' + (W - R) + '" y2="' + yy + '" stroke="#e8eaed"/>';
      g += '<text x="' + (L - 6) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + v + "</text>";
    });
    const gridValsI = [0, 200, 400, 600, 800];
    gridValsI.forEach((v) => {
      const yy = YI(v);
      g += '<text x="' + (W - R + 6) + '" y="' + (yy + 4) + '" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + (v >= 1000 ? v / 1000 + "千" : v) + "</text>";
    });
    const fd = (d) => d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
    for (let i = 0; i < days.length; i += 91) {
      g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#5f6368" font-family="Roboto,Arial">' + fd(days[i].d) + "</text>";
    }
    g += '<polyline points="' + P("impr", YI) + '" fill="none" stroke="#9334e6" stroke-width="1.6" opacity="0.85"/>';
    g += '<polyline points="' + P("clicks", YC) + '" fill="none" stroke="#1a73e8" stroke-width="2"/>';
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svg.innerHTML = g;
    log.svg = { W: W, H: H, n: days.length };
  }
  return JSON.stringify(log);
})()
