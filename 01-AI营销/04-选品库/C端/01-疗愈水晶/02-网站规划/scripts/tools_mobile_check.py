# -*- coding: utf-8 -*-
"""
水晶工具移动端+平板端渲染检查
5 工具 x 2 视口(375 / 768)
输出:截图 + 字体/触控/溢出/JS执行/错误结构化报告
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

OUT = r"D:\Code\knowledge-base\01-AI营销\04-选品库\C端\01-疗愈水晶\02-网站规划\screenshots\tools-mobile"
os.makedirs(OUT, exist_ok=True)

TOOLS = [
    ("chakra-test",          "https://goearthward.com/tools/chakra-test/"),
    ("element-test",         "https://goearthward.com/tools/element-test/"),
    ("crystal-quiz",         "https://goearthward.com/tools/crystal-quiz/"),
    ("cleansing-timer",      "https://goearthward.com/tools/crystal-cleansing-timer/"),
    ("birthstone-finder",    "https://goearthward.com/tools/birthstone-finder/"),
]

VIEWPORTS = [("mobile", 375, 812), ("tablet", 768, 1024)]

# JS 探针:在每个工具容器内检查交互是否渲染出内容
# 返回插入页面后在 window 上可读的探测结果
PROBE_JS = r"""
() => {
  const r = { found: {}, text: {}, counts: {}, dims: [] };
  // 通用:找可能的工具根
  const sel = [
    'main','article','.entry-content','#content',
    '[class*="chakra"]','[class*="quiz"]','[class*="element"]',
    '[class*="cleansing"]','[class*="birthstone"]','[class*="tool"]',
    'button','input','select'
  ];
  // 检测关键交互信号
  const html = document.body.innerHTML.toLowerCase();
  r.found.question = html.includes('question') || html.includes('题目') || html.includes('often') || html.includes('sometimes') || html.includes('rarely');
  r.found.button = document.querySelectorAll('button').length;
  r.found.radio = document.querySelectorAll('input[type="radio"]').length;
  r.found.select = document.querySelectorAll('select').length;
  r.found.canvas = document.querySelectorAll('canvas').length;

  // 找所有 button 测量触控尺寸
  const btns = Array.from(document.querySelectorAll('button, [role="button"], input[type="submit"], a.btn, .btn, [class*="option"]'));
  const bsz = [];
  for (const b of btns.slice(0, 30)) {
    const d = b.getBoundingClientRect();
    if (d.width > 0 && d.height > 0) bsz.push({w: Math.round(d.width), h: Math.round(d.height), t: (b.innerText||b.getAttribute('aria-label')||b.className||'').slice(0,40)});
  }
  r.dims = bsz;

  // 测量正文字体大小:取若干段落/div
  const texts = Array.from(document.querySelectorAll('p, li, label, div, span, h1, h2, h3, h4'));
  const fonts = {};
  let h1fs = null, h2fs = null, smallest = null;
  for (const t of texts.slice(0, 600)) {
    const cs = getComputedStyle(t);
    const fs = parseFloat(cs.fontSize);
    if (!fs) continue;
    const txt = (t.innerText||'').trim();
    if (!txt || txt.length < 2) continue;
    if (t.tagName === 'H1' && h1fs === null) h1fs = fs;
    if (t.tagName === 'H2' && h2fs === null) h2fs = fs;
    // 找最小可见文本
    if (!smallest || fs < smallest.fs) smallest = {fs: fs, txt: txt.slice(0,50), tag: t.tagName};
    const key = Math.round(fs);
    fonts[key] = (fonts[key]||0)+1;
  }
  r.text.h1 = h1fs;
  r.text.h2 = h2fs;
  r.text.fontDistribution = fonts;
  r.text.smallest = smallest;
  return r;
}
"""

def run():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for slug, url in TOOLS:
            results[slug] = {"url": url, "viewports": {}}
            for vname, w, h in VIEWPORTS:
                ctx = browser.new_context(viewport={"width": w, "height": h},
                                          user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" if vname=="mobile" else None,
                                          device_scale_factor=2 if vname=="mobile" else 1,
                                          is_mobile=(vname=="mobile"),
                                          has_touch=(vname=="mobile"))
                page = ctx.new_page()
                errors = []
                page.on("console", lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type in ("error","warning") else None)
                page.on("pageerror", lambda exc: errors.append(f"[pageerror] {exc}"))

                try:
                    page.goto(url, wait_until="networkidle", timeout=45000)
                except Exception as e:
                    errors.append(f"[goto] {e}")
                    try:
                        page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    except Exception as e2:
                        errors.append(f"[goto2] {e2}")

                time.sleep(2.0)  # 等 JS 渲染

                # 横向溢出检测
                overflow = page.evaluate("""() => {
                    const de = document.documentElement;
                    const b = document.body;
                    return {
                      scrollW: de.scrollWidth,
                      clientW: de.clientWidth,
                      innerW: window.innerWidth,
                      bodyScrollW: b.scrollWidth,
                      overflowPx: de.scrollWidth - de.clientWidth
                    };
                }""")

                # JS 执行 + 字体/触控探测
                try:
                    probe = page.evaluate(PROBE_JS)
                except Exception as e:
                    probe = {"err": str(e)}

                # 触发一次交互看是否有响应(点击第一个 option/radio/button 文本)
                interaction = "n/a"
                try:
                    interaction = page.evaluate("""() => {
                      // quiz/chakra/element:点第一个选项按钮(含 often/rarely/sometimes 或 chakra 选项)
                      const opts = Array.from(document.querySelectorAll('button, label, [role="button"], input[type="radio"]'));
                      const target = opts.find(o => {
                        const t = (o.innerText||o.getAttribute('aria-label')||'').toLowerCase();
                        return /rarely|sometimes|often|option|root|heart|throat|fire|water|earth|air|month|january|february|jan|feb|cleanse|smudge|salt|sunlight/.test(t) || o.tagName==='INPUT';
                      });
                      if (!target) return 'no-target';
                      const before = document.body.innerHTML.length;
                      try { target.click(); } catch(e){}
                      return {clicked: (target.innerText||target.className||'').slice(0,40), htmlDelta: document.body.innerHTML.length - before};
                    }""")
                except Exception as e:
                    interaction = f"err: {e}"

                # 截图
                shot_fold = os.path.join(OUT, f"{slug}-{vname}-fold.png")
                shot_full = os.path.join(OUT, f"{slug}-{vname}-full.png")
                try:
                    page.screenshot(path=shot_fold, full_page=False)
                    page.screenshot(path=shot_full, full_page=True)
                except Exception as e:
                    errors.append(f"[screenshot] {e}")

                results[slug]["viewports"][vname] = {
                    "viewport": [w, h],
                    "overflow": overflow,
                    "probe": probe,
                    "interaction": interaction,
                    "errors": errors[:30],
                    "screenshot_fold": shot_fold,
                    "screenshot_full": shot_full,
                }
                ctx.close()
        browser.close()
    return results

if __name__ == "__main__":
    data = run()
    jpath = os.path.join(OUT, "_report.json")
    with open(jpath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("DONE ->", jpath)
    # 简要控制台输出
    for slug, d in data.items():
        for vn, vd in d["viewports"].items():
            ov = vd["overflow"]
            pr = vd["probe"] or {}
            print(f"\n=== {slug} [{vn}] ===")
            print(f"  overflow: {ov.get('overflowPx')}px (scrollW={ov.get('scrollW')} clientW={ov.get('clientW')})")
            print(f"  buttons={pr.get('found',{}).get('button')} radio={pr.get('found',{}).get('radio')} select={pr.get('found',{}).get('select')}")
            print(f"  h1={pr.get('text',{}).get('h1')} h2={pr.get('text',{}).get('h2')} smallest={pr.get('text',{}).get('smallest')}")
            print(f"  fontDist={pr.get('text',{}).get('fontDistribution')}")
            print(f"  interaction={vd['interaction']}")
            errs = [e for e in vd["errors"] if "[error]" in e or "pageerror" in e]
            print(f"  errors={len(errs)}: {errs[:5]}")
