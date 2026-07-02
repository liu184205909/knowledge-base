"""AI Tarot Chat v2.1 visual verification — desktop + mobile screenshots.
Captures: empty state (left tabs with avatars), after selecting Oracle, after a real send.
Proxy: http://127.0.0.1:10808 (site reachable directly too; fallback tries both).
"""
import os, sys, time
from playwright.sync_api import sync_playwright

URL = "https://goearthward.com/tools/ai-tarot-chat/"
OUT = os.path.dirname(os.path.abspath(__file__)) + os.sep + "shots"
os.makedirs(OUT, exist_ok=True)
PROXY = {"server": "http://127.0.0.1:10808"}

def shoot(p, browser_type, name, width, height, is_mobile=False):
    launcher = p.chromium.launch
    ctx_kws = {"viewport": {"width": width, "height": height}}
    if is_mobile:
        ctx_kws["user_agent"] = ("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
                                 "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1")
        ctx_kws["device_scale_factor"] = 2
        ctx_kws["is_mobile"] = True
        ctx_kws["has_touch"] = True
    try:
        browser = launcher(headless=True)
        ctx = browser.new_context(**ctx_kws)
    except Exception:
        browser = launcher(headless=True, proxy=PROXY)
        ctx = browser.new_context(**ctx_kws)
    page = ctx.new_page()
    try:
        page.goto(URL, wait_until="domcontentloaded", timeout=45000)
    except Exception:
        page.goto(URL, wait_until="domcontentloaded", timeout=45000)
    # wait for tool root
    try:
        page.wait_for_selector("#eac-wrap", timeout=20000)
    except Exception as e:
        print(f"  [{name}] #eac-wrap not found: {e}")
    page.wait_for_timeout(1200)

    # 1) empty state
    p1 = os.path.join(OUT, f"{name}-1-empty.png")
    page.screenshot(path=p1, full_page=True)
    print(f"  shot1 empty -> {p1} ({os.path.getsize(p1)//1024}KB)")

    # 2) click Oracle tab
    try:
        page.click('button.eac-tab[data-role="oracle"]', timeout=8000)
        page.wait_for_timeout(900)
        p2 = os.path.join(OUT, f"{name}-2-oracle-selected.png")
        page.screenshot(path=p2, full_page=True)
        print(f"  shot2 oracle-selected -> {p2} ({os.path.getsize(p2)//1024}KB)")
    except Exception as e:
        print(f"  [{name}] click oracle failed: {e}")

    # 3) type a question + send (real call)
    try:
        page.fill('#eac-question', "I feel stuck between two paths in my career. What should I reflect on?")
        page.wait_for_timeout(400)
        p3 = os.path.join(OUT, f"{name}-3-typed.png")
        page.screenshot(path=p3, full_page=True)
        print(f"  shot3 typed -> {p3} ({os.path.getsize(p3)//1024}KB)")
        page.click('#eac-send')
        # wait for Send button back to "Send" (= request done) up to 60s, then extra settle
        try:
            for _ in range(60):
                txt = page.eval_on_selector('#eac-send', "e=>e.textContent") if page.query_selector('#eac-send') else ''
                if txt and 'Ask' not in txt:
                    break
                page.wait_for_timeout(1000)
        except Exception:
            pass
        page.wait_for_timeout(1500)
        p4 = os.path.join(OUT, f"{name}-4-answered.png")
        page.screenshot(path=p4, full_page=True)
        # capture answer text
        try:
            ans = page.eval_on_selector_all('.eac-msg-assistant .eac-msg-text',
                                            "els => els.map(e=>e.textContent.trim())")
            print(f"  shot4 answered -> {p4} ({os.path.getsize(p4)//1024}KB)")
            print(f"  [answer text len] { (len(ans[-1]) if ans else 0) } | preview: { (ans[-1][:200] if ans else '(none)') }")
        except Exception:
            print(f"  shot4 answered -> {p4}")
    except Exception as e:
        print(f"  [{name}] send/answer failed: {e}")
    ctx.close()
    browser.close()

def main():
    with sync_playwright() as p:
        print("== desktop 1366x900 ==")
        shoot(p, "chromium", "desktop", 1366, 900, is_mobile=False)
        print("== mobile 390x844 ==")
        shoot(p, "chromium", "mobile", 390, 844, is_mobile=True)
    print("done.")

if __name__ == "__main__":
    main()
