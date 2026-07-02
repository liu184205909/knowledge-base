# -*- coding: utf-8 -*-
"""验证 T17 builder CSS bug 修复（左栏珠子应显示）。
try/finally 确保 browser.close()，避免 chromium 僵尸。
"""
import json
import os
import sys
from playwright.sync_api import sync_playwright

BUILD_DIR = os.path.dirname(os.path.abspath(__file__))
SHOTS_DIR = os.path.join(BUILD_DIR, "shots")
os.makedirs(SHOTS_DIR, exist_ok=True)

URL = "http://localhost:8765/crystal-bracelet-builder-preview.html"

DESKTOP_W, DESKTOP_H = 1440, 900
MOBILE_W, MOBILE_H = 375, 812

LAUNCH_ARGS = [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
]


def evaluate_diagnostics(page):
    return page.evaluate(
        """() => {
            const getDisplay = (id) => {
                const el = document.getElementById(id);
                return el ? getComputedStyle(el).display : 'no el';
            };
            const getSize = (id) => {
                const el = document.getElementById(id);
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { w: r.width, h: r.height };
            };
            return {
                leftDisplay: getDisplay('t17-left'),
                leftSize: getSize('t17-left'),
                stoneRowCount: document.querySelectorAll('#t17-stone-list .stone-row').length,
                appDisplay: getDisplay('t17-app'),
                canvasSize: getSize('t17-canvas'),
                seqCount: document.querySelectorAll('.seq-item').length,
            };
        }"""
    )


def main():
    result = {
        "ok": False,
        "url": URL,
        "diag": None,
        "console_msgs": [],
        "pageerrors": [],
        "shots": {},
        "error": None,
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=LAUNCH_ARGS)
        # 收集 console / pageerror 的 context 在 try 外创建，确保 finally 仍可关 browser
        context = browser.new_context(
            viewport={"width": DESKTOP_W, "height": DESKTOP_H},
            device_scale_factor=1,
        )
        page = context.new_page()

        page.on(
            "console",
            lambda msg: result["console_msgs"].append(
                {"type": msg.type, "text": msg.text}
            ),
        )
        page.on(
            "pageerror",
            lambda err: result["pageerrors"].append(str(err)),
        )

        try:
            page.goto(URL, wait_until="networkidle", timeout=45000)
            page.wait_for_timeout(3000)

            result["diag"] = evaluate_diagnostics(page)

            # 桌面截图（全页）
            desktop_shot = os.path.join(SHOTS_DIR, "css-fix-desktop.png")
            page.screenshot(path=desktop_shot, full_page=True)
            result["shots"]["desktop"] = desktop_shot

            # 移动端：新 context（不同 viewport）
            mobile_context = browser.new_context(
                viewport={"width": MOBILE_W, "height": MOBILE_H},
                device_scale_factor=2,
            )
            mobile_page = mobile_context.new_page()
            mobile_page.goto(URL, wait_until="networkidle", timeout=45000)
            mobile_page.wait_for_timeout(3000)

            result["diag_mobile"] = evaluate_diagnostics(mobile_page)

            mobile_shot = os.path.join(SHOTS_DIR, "css-fix-mobile.png")
            mobile_page.screenshot(path=mobile_shot, full_page=True)
            result["shots"]["mobile"] = mobile_shot

            mobile_context.close()
            result["ok"] = True
        except Exception as e:
            result["error"] = f"{type(e).__name__}: {e}"
        finally:
            try:
                context.close()
            except Exception:
                pass
            browser.close()  # 强制关闭，避免僵尸

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
