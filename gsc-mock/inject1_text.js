(() => {
  const cnt = {};
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
    for (const k in map) {
      if (t.trim() === k) {
        n.nodeValue = t.replace(k, map[k]);
        cnt[k] = (cnt[k] || 0) + 1;
      }
    }
  }
  return JSON.stringify({ cnt: cnt });
})()
