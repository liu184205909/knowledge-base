"""
SEMrush 竞品数据采集工具
从 Google Sheets 读取域名 → SEMrush 查询 → 提取 AS + Traffic + 截图 → 写回 Sheets

前置条件:
  1. Tabbit 带 --remote-debugging-port=9222 --remote-allow-origins=* 启动
  2. 已在 Tabbit 中登录 semrush.com

使用方式:
  python semrush_to_sheets.py              # 全量查询
  python semrush_to_sheets.py --limit 5    # 只查前5个
  python semrush_to_sheets.py --start 4    # 从第4行开始
  python semrush_to_sheets.py --dry-run    # 只提取不写回 Sheets
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

import requests
import json
import time
import re
import os
import base64
import subprocess
import urllib3
import websocket
from PIL import Image
from urllib.parse import quote
from io import BytesIO

urllib3.disable_warnings()

# ========== 配置 ==========
PROXY = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
CLIENT_ID = "704571210228-ek6e7lqq593uognb1po775rbi529mu9g.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REFRESH_TOKEN = "1//090CsFxcT-5CRCgYIARAAGAkSNwF-L9IrSv0WVd6vv--MLMU9OhSVXHP2EGWJgK_Cm94StT1LEqlt46WvQzDWzF3yeJbt_zWawqc"
SHEET_ID = "1zcWFPw7lFq_L6aBpEEpBhU0FKf7uJi6hiQYCVoah_vA"
SHEET_NAME = "竟对清单"

# Tabbit / Chrome DevTools 直连
BROWSER_DEBUG_PORT = 9222
BROWSER_BASE = f"http://localhost:{BROWSER_DEBUG_PORT}"
TABBIT_PATH = r"D:\Program Files (x86)\Tabbit\Application\Tabbit.exe"

# 列映射: A=编号, B=网址, C=AS, D=Traffic, E=截图, L=建站平台, M=竞品类型
COL_AS = "C"
COL_TRAFFIC = "D"
COL_CHART = "E"

# 等待和间隔配置
QUERY_DELAY = 3
TOKEN_RETRY = 3

# CDP 命令 ID 计数器
_cdp_id = 0


# ========== CDP 直连（WebSocket） ==========
def _next_id():
    global _cdp_id
    _cdp_id += 1
    return _cdp_id


def cdp_command(target_id, method, params=None):
    """通过 WebSocket 直接向浏览器发送 Chrome DevTools Protocol 命令"""
    # 获取目标标签的 WebSocket URL
    tabs = requests.get(f"{BROWSER_BASE}/json/list", timeout=5).json()
    ws_url = None
    for tab in tabs:
        if tab.get("id") == target_id:
            ws_url = tab.get("webSocketDebuggerUrl")
            break
    if not ws_url:
        raise Exception(f"找不到标签 {target_id}")

    # 发送命令
    ws = websocket.create_connection(ws_url, timeout=60)
    try:
        cmd = {"id": _next_id(), "method": method}
        if params:
            cmd["params"] = params
        ws.send(json.dumps(cmd))
        while True:
            msg = json.loads(ws.recv())
            if "id" in msg and msg["id"] == cmd["id"]:
                if "error" in msg:
                    raise Exception(f"CDP error: {msg['error']}")
                return msg.get("result", {})
    finally:
        ws.close()


def cdp_eval(target_id, js):
    """在标签页中执行 JavaScript 并返回值"""
    result = cdp_command(target_id, "Runtime.evaluate", {
        "expression": js,
        "returnByValue": True,
    })
    return result.get("result", {}).get("value")


def cdp_navigate(target_id, url):
    """导航标签页到指定 URL"""
    return cdp_command(target_id, "Page.navigate", {"url": url})


def cdp_screenshot(target_id):
    """截取标签页 viewport 截图，返回 PNG bytes"""
    result = cdp_command(target_id, "Page.captureScreenshot", {"format": "png"})
    return base64.b64decode(result.get("data", ""))


def find_semrush_target():
    """查找 SEMrush 标签页"""
    tabs = requests.get(f"{BROWSER_BASE}/json/list", timeout=5).json()
    pages = [t for t in tabs if t.get("type") == "page"]
    # 优先找 SEMrush Domain Overview
    for t in pages:
        if "www.semrush.com/analytics/overview" in t.get("url", ""):
            print(f"  找到 SEMrush 标签: {t.get('title', '')[:50]}")
            return t["id"]
    for t in pages:
        if "www.semrush.com/analytics" in t.get("url", ""):
            return t["id"]
    for t in pages:
        if "www.semrush.com" in t.get("url", ""):
            return t["id"]
    return None


def ensure_browser_ready():
    """检查浏览器调试端口是否可用，不可用则尝试重启"""
    try:
        resp = requests.get(f"{BROWSER_BASE}/json/version", timeout=3)
        return True
    except:
        pass

    print("[浏览器] 调试端口不可用，尝试重启 Tabbit...")
    subprocess.call(["taskkill", "/F", "/IM", "Tabbit.exe"], timeout=10)
    time.sleep(3)
    subprocess.Popen([TABBIT_PATH, f"--remote-debugging-port={BROWSER_DEBUG_PORT}", "--remote-allow-origins=*"])
    time.sleep(5)

    try:
        resp = requests.get(f"{BROWSER_BASE}/json/version", timeout=5)
        print(f"[浏览器] 已就绪: {resp.json().get('Browser', '?')}")
        return True
    except:
        print("[浏览器] 启动失败，请手动启动 Tabbit 并加上参数:")
        print(f"  {TABBIT_PATH} --remote-debugging-port={BROWSER_DEBUG_PORT} --remote-allow-origins=*")
        return False


# ========== Google API ==========
def get_access_token():
    """刷新 Google OAuth access token"""
    print("[Auth] 刷新 Token...")
    for attempt in range(TOKEN_RETRY):
        try:
            resp = requests.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                    "refresh_token": REFRESH_TOKEN,
                    "grant_type": "refresh_token",
                },
                proxies=PROXY, timeout=15, verify=False,
            )
            token = resp.json()["access_token"]
            print("[Auth] Token OK")
            return token
        except Exception as e:
            print(f"[Auth] 第 {attempt+1}/{TOKEN_RETRY} 次失败: {e}")
            if attempt < TOKEN_RETRY - 1:
                time.sleep(5)
    raise Exception("Token 刷新失败")


def read_domains(token):
    """从 Sheets 读取域名列表"""
    print("[Sheets] 读取域名...")
    enc = quote(SHEET_NAME)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!A2:B100"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=15, verify=False)
    values = resp.json().get("values", [])
    domains = []
    for i, row in enumerate(values):
        if len(row) >= 2 and row[1].strip():
            domain = row[1].strip()
            if "." in domain and not domain.startswith("http"):
                domains.append({
                    "row": i + 2,
                    "domain": domain,
                })
    print(f"[Sheets] 找到 {len(domains)} 个域名")
    return domains


def write_to_sheet(token, row, as_val, traffic_val, image_formula):
    """写入单个域名的数据到 Sheets"""
    enc = quote(SHEET_NAME)
    headers = {"Authorization": f"Bearer {token}"}
    params = {"valueInputOption": "USER_ENTERED"}

    # E: AS
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!{COL_AS}{row}"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!{COL_AS}{row}", "values": [[as_val]]},
        timeout=15, verify=False)

    # F: Traffic
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!{COL_TRAFFIC}{row}"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!{COL_TRAFFIC}{row}", "values": [[traffic_val]]},
        timeout=15, verify=False)

    # G: 截图
    if image_formula:
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!{COL_CHART}{row}"
        requests.put(url, headers=headers, params=params,
            json={"range": f"{SHEET_NAME}!{COL_CHART}{row}", "values": [[image_formula]]},
            timeout=15, verify=False)


def update_sheet_header(token):
    """更新表头"""
    enc = quote(SHEET_NAME)
    headers = {"Authorization": f"Bearer {token}"}
    params = {"valueInputOption": "USER_ENTERED"}

    for col, val in [(COL_AS, "AS"), (COL_TRAFFIC, "Organic Traffic"), (COL_CHART, "SEMrush 截图")]:
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!{col}1"
        requests.put(url, headers=headers, params=params,
            json={"range": f"{SHEET_NAME}!{col}1", "values": [[val]]},
            timeout=15, verify=False)

    print("[Sheets] 表头已更新: C=AS, D=Organic Traffic, E=SEMrush 截图")


# ========== Google Drive ==========
def upload_screenshot(token, image_bytes, domain):
    """上传截图到 Google Drive 并返回公开 URL"""
    upload_url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
    files = {
        "metadata": (None, json.dumps({"name": f"semrush_{domain}.png"}), "application/json"),
        "media": (f"{domain}.png", image_bytes, "image/png"),
    }
    resp = requests.post(upload_url, headers={"Authorization": f"Bearer {token}"},
        files=files, timeout=30, verify=False)
    file_id = resp.json()["id"]

    requests.post(
        f"https://www.googleapis.com/drive/v3/files/{file_id}/permissions",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"role": "reader", "type": "anyone"},
        timeout=10, verify=False,
    )
    return f"https://lh3.googleusercontent.com/d/{file_id}"


# ========== SEMrush 数据提取 ==========
def wait_for_semrush_data(target, domain, max_wait=45):
    """轮询等待 SEMrush 数据 + 图表加载完成"""
    js_text = f"""(function(){{
        var text = document.body.innerText;
        var title = document.title || '';
        return title.indexOf('{domain}') >= 0
            && text.indexOf('Authority Score') >= 0
            && text.indexOf('Backlinks') >= 0
            && text.length > 1500;
    }})()"""

    elapsed = 0
    while elapsed < max_wait:
        time.sleep(2)
        elapsed += 2
        try:
            if cdp_eval(target, js_text) is True:
                break
        except:
            pass
    else:
        print(f"  [警告] 文本数据加载超时")
        return False

    # 等图表渲染
    print(f"  文本数据已加载，等待图表渲染...")
    time.sleep(3)
    js_charts = """(function(){
        var svgs = document.querySelectorAll('svg');
        var totalPaths = 0;
        for(var i=0;i<svgs.length;i++) totalPaths += svgs[i].querySelectorAll('path').length;
        return totalPaths >= 15;
    })()"""
    chart_elapsed = 0
    while chart_elapsed < 20:
        time.sleep(2)
        chart_elapsed += 2
        try:
            if cdp_eval(target, js_charts) is True:
                print(f"  图表渲染完成 (等待{chart_elapsed}s)")
                return True
        except:
            pass
    print(f"  [警告] 图表渲染等待超时，继续执行")
    return True


def get_section_crop(target):
    """获取 Distribution by Country SECTION 的位置"""
    js = """(function(){
        var h3s=document.querySelectorAll('h3');
        var t=null;
        for(var i=0;i<h3s.length;i++){
            if(h3s[i].textContent.trim()==='Distribution by Country') t=h3s[i];
        }
        if(!t) return JSON.stringify(null);
        var el=t;
        for(var d=0;d<12;d++){
            el=el.parentElement;
            if(!el) break;
            if(el.tagName==='SECTION' && (el.className||'').indexOf('SCard')>=0){
                var r=el.getBoundingClientRect();
                return JSON.stringify({
                    dpr: window.devicePixelRatio||1,
                    top: r.top, left: r.left, width: r.width, height: r.height
                });
            }
        }
        return JSON.stringify(null);
    })()"""
    val = cdp_eval(target, js)
    if val and isinstance(val, str):
        return json.loads(val)
    return None


def query_domain(target, domain):
    """查询域名，返回 (as_val, traffic_val, chart_png_bytes)"""
    # 导航
    url = f"https://www.semrush.com/analytics/overview/?q={domain}&searchType=domain"
    encoded_url = quote(url, safe=":/?&=%")
    cdp_navigate(target, encoded_url)

    # 等待
    time.sleep(3)
    wait_for_semrush_data(target, domain)

    # 提取文本
    text = cdp_eval(target, "(function(){ return document.body.innerText.substring(0, 3000); })()") or ""

    # 解析 AS 和 Traffic
    as_match = re.search(r"Authority Score\s*\n\s*(\d+)", text)
    traffic_match = re.search(r"Organic Traffic\s*\n\s*([\d.]+[KMB]?)", text)
    as_val = as_match.group(1) if as_match else ""
    traffic_val = traffic_match.group(1) if traffic_match else ""

    # 滚动 SECTION 到 viewport 顶部
    js_scroll = """(function(){
        var h3s=document.querySelectorAll('h3');
        for(var i=0;i<h3s.length;i++){
            if(h3s[i].textContent.trim()==='Distribution by Country'){
                var el=h3s[i];
                for(var d=0;d<12;d++){
                    el=el.parentElement;
                    if(!el) break;
                    if(el.tagName==='SECTION' && (el.className||'').indexOf('SCard')>=0){
                        el.scrollIntoView({behavior:'instant',block:'start'});
                        return true;
                    }
                }
            }
        }
        return false;
    })()"""
    cdp_eval(target, js_scroll)
    time.sleep(1)

    # 截图并裁剪
    section = get_section_crop(target)
    img_bytes = cdp_screenshot(target)
    img = Image.open(BytesIO(img_bytes))

    if section:
        dpr = section["dpr"]
        left = max(0, int(section["left"] * dpr) - 5)
        top = max(0, int(section["top"] * dpr) - 5)
        right = min(img.width, int((section["left"] + section["width"]) * dpr) + 5)
        bottom = min(img.height, int((section["top"] + section["height"]) * dpr) + 5)
        print(f"  裁剪: ({left},{top},{right},{bottom}) DPR={dpr:.2f}")
        cropped = img.crop((left, top, right, bottom))
    else:
        print(f"  [警告] 未找到 SECTION，使用完整 viewport")
        cropped = img

    buf = BytesIO()
    cropped.save(buf, "PNG", optimize=True)
    return as_val, traffic_val, buf.getvalue()


# ========== 主流程 ==========
def main():
    print("=" * 50)
    print("  SEMrush 竞品数据采集工具")
    print("=" * 50)

    # 解析参数
    limit = None
    start_row = None
    dry_run = False
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--limit" and i + 1 < len(args):
            limit = int(args[i + 1])
            i += 2
        elif args[i] == "--start" and i + 1 < len(args):
            start_row = int(args[i + 1])
            i += 2
        elif args[i] == "--dry-run":
            dry_run = True
            i += 1
        else:
            i += 1

    # Step 1: 检查浏览器
    print("\n[1/4] 检查浏览器...")
    if not ensure_browser_ready():
        return

    # Step 2: 获取 Token + 找标签
    print("\n[2/4] 连接...")
    token = get_access_token()

    target = find_semrush_target()
    if not target:
        print("  未找到 SEMrush 标签！请先在 Tabbit 中打开 semrush.com 并登录")
        return
    print(f"  Target: {target[:16]}...")

    # Step 3: 读取域名
    print("\n[3/4] 读取域名...")
    domains = read_domains(token)
    if not domains:
        print("  未找到域名")
        return

    # --start 过滤
    if start_row:
        domains = [d for d in domains if d["row"] >= start_row]
        print(f"  从第 {start_row} 行开始")
    if limit:
        domains = domains[:limit]
        print(f"  限制 {limit} 个域名")

    # 更新表头
    if not dry_run:
        update_sheet_header(token)

    # Step 4: 批量查询
    print(f"\n[4/4] 开始查询 {len(domains)} 个域名...\n")

    for idx, d in enumerate(domains):
        domain = d["domain"]
        row = d["row"]
        print(f"[{idx+1}/{len(domains)}] {domain} - 行{row}")

        try:
            as_val, traffic_val, chart_bytes = query_domain(target, domain)
            print(f"  AS={as_val} | Traffic={traffic_val} | 截图={len(chart_bytes)}b")

            if dry_run:
                print(f"  [DRY-RUN] 跳过写入")
                continue

            image_url = upload_screenshot(token, chart_bytes, domain)
            formula = f'=IMAGE("{image_url}", 1)'
            write_to_sheet(token, row, as_val, traffic_val, formula)
            print(f"  已写入 E{row}/F{row}/G{row}")

        except Exception as e:
            print(f"  错误: {e}")
            if not dry_run:
                write_to_sheet(token, row, "ERROR", str(e)[:50], "")

        if idx < len(domains) - 1:
            print(f"  等待 {QUERY_DELAY}s...")
            time.sleep(QUERY_DELAY)

    print(f"\n{'='*50}")
    print(f"  完成！共处理 {len(domains)} 个域名")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
