"""
SEMrush 竞品数据采集工具（官方版）
从 Google Sheets 读取域名 → 官方 SEMrush 查询 → 提取 AS + Traffic + 截图 → 写回 Sheets

使用方式:
  python semrush_to_sheets.py              # 全量查询
  python semrush_to_sheets.py --limit 3    # 只查前3个
  python semrush_to_sheets.py --dry-run    # 只提取不写回 Sheets
"""
import requests
import json
import time
import re
import sys
import os
import urllib3
from PIL import Image
from urllib.parse import quote
from io import BytesIO

urllib3.disable_warnings()
sys.stdout.reconfigure(encoding='utf-8')

# ========== 配置 ==========
PROXY = {"http": "http://127.0.0.1:10808", "https": "http://127.0.0.1:10808"}
CLIENT_ID = "704571210228-ek6e7lqq593uognb1po775rbi529mu9g.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REFRESH_TOKEN = "1//090CsFxcT-5CRCgYIARAAGAkSNwF-L9IrSv0WVd6vv--MLMU9OhSVXHP2EGWJgK_Cm94StT1LEqlt46WvQzDWzF3yeJbt_zWawqc"
SHEET_ID = "1zcWFPw7lFq_L6aBpEEpBhU0FKf7uJi6hiQYCVoah_vA"
SHEET_NAME = "竟对清单"
CDP = "http://localhost:3456"

# 列映射: E=AS, F=Traffic, G=月访问量(保留), K=截图
COL_AS = "E"
COL_TRAFFIC = "F"
COL_CHART = "K"

# 等待和间隔配置
NAVIGATE_WAIT = 10       # 导航后等待数据加载（秒）
QUERY_DELAY = 3          # 域名间间隔（秒）
TOKEN_RETRY = 3          # Token 刷新重试次数


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
                proxies=PROXY,
                timeout=15,
                verify=False,
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
    """从 Sheets 读取域名列表，返回 [{row, domain, name, priority}]"""
    print("[Sheets] 读取域名...")
    enc = quote(SHEET_NAME)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!A2:D100"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=15, verify=False)
    values = resp.json().get("values", [])
    domains = []
    for i, row in enumerate(values):
        if len(row) >= 4 and row[3].strip():
            domain = row[3].strip()
            if "." in domain and not domain.startswith("http"):
                domains.append({
                    "row": i + 2,  # Excel 行号（1-based, 跳过表头）
                    "domain": domain,
                    "name": row[2] if len(row) > 2 else "",
                    "priority": row[0] if len(row) > 0 else "",
                })
    print(f"[Sheets] 找到 {len(domains)} 个域名")
    return domains


def write_to_sheet(token, row, as_val, traffic_val, image_formula):
    """写入单个域名的数据到 Sheets（E=AS, F=Traffic, K=截图）"""
    enc = quote(SHEET_NAME)
    headers = {"Authorization": f"Bearer {token}"}
    params = {"valueInputOption": "USER_ENTERED"}

    # E 列: Authority Score
    range_e = f"{enc}!{COL_AS}{row}"
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{range_e}"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!{COL_AS}{row}", "values": [[as_val]]},
        timeout=15, verify=False)

    # F 列: Organic Traffic
    range_f = f"{enc}!{COL_TRAFFIC}{row}"
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{range_f}"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!{COL_TRAFFIC}{row}", "values": [[traffic_val]]},
        timeout=15, verify=False)

    # K 列: 截图 IMAGE 公式
    if image_formula:
        range_k = f"{enc}!{COL_CHART}{row}"
        url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{range_k}"
        requests.put(url, headers=headers, params=params,
            json={"range": f"{SHEET_NAME}!{COL_CHART}{row}", "values": [[image_formula]]},
            timeout=15, verify=False)


def update_sheet_header(token):
    """更新表头：E 改为 AS, K 新增截图列"""
    enc = quote(SHEET_NAME)
    headers = {"Authorization": f"Bearer {token}"}
    params = {"valueInputOption": "USER_ENTERED"}

    # E1 = AS (原 DR)
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!E1"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!E1", "values": [["AS"]]},
        timeout=15, verify=False)

    # F1 = Organic Traffic (原"流量")
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!F1"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!F1", "values": [["Organic Traffic"]]},
        timeout=15, verify=False)

    # K1 = 截图（新增列）
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{enc}!K1"
    requests.put(url, headers=headers, params=params,
        json={"range": f"{SHEET_NAME}!K1", "values": [["SEMrush 截图"]]},
        timeout=15, verify=False)

    print("[Sheets] 表头已更新: E=AS, F=Organic Traffic, K=SEMrush 截图")


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

    # 设置公开权限
    requests.post(
        f"https://www.googleapis.com/drive/v3/files/{file_id}/permissions",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"role": "reader", "type": "anyone"},
        timeout=10, verify=False,
    )
    return f"https://lh3.googleusercontent.com/d/{file_id}"


# ========== CDP / SEMrush ==========
def find_semrush_target():
    """查找官方 SEMrush Domain Overview 标签页"""
    targets = requests.get(f"{CDP}/targets", timeout=10).json()
    # 优先找 analytics/overview 页面（排除 keywordmagic 等其他 analytics 子页面）
    for t in targets:
        url = t.get("url", "")
        if "www.semrush.com/analytics/overview" in url:
            return t["targetId"]
    # 备选1：任意 www.semrush.com/analytics 页面
    for t in targets:
        if "www.semrush.com/analytics" in t.get("url", ""):
            return t["targetId"]
    # 备选2：任意 semrush.com 标签
    for t in targets:
        if "www.semrush.com" in t.get("url", ""):
            return t["targetId"]
    return None


def wait_for_semrush_data(target, domain, max_wait=45):
    """轮询等待 SEMrush 数据 + 图表SVG 加载完成"""
    # 第一阶段：等待文本数据加载
    js_text = f"""(function(){{
        var text = document.body.innerText;
        var title = document.title || '';
        return title.indexOf('{domain}') >= 0
            && text.indexOf('Authority Score') >= 0
            && text.indexOf('Backlinks') >= 0
            && text.length > 1500;
    }})()"""
    elapsed = 0
    text_loaded = False
    while elapsed < max_wait:
        time.sleep(2)
        elapsed += 2
        try:
            resp = requests.post(f"{CDP}/eval?target={target}", data=js_text.encode("utf-8"), timeout=10)
            if resp.json().get("value") is True:
                text_loaded = True
                break
        except:
            pass

    if not text_loaded:
        print(f"  [警告] 文本数据加载超时")
        return False

    # 第二阶段：等待图表SVG渲染（检测 path 元素数量）
    print(f"  文本数据已加载，等待图表渲染...")
    time.sleep(3)  # 先给3秒让SVG开始渲染
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
            resp = requests.post(f"{CDP}/eval?target={target}", data=js_charts.encode("utf-8"), timeout=10)
            if resp.json().get("value") is True:
                print(f"  图表渲染完成 (等待{chart_elapsed}s)")
                return True
        except:
            pass
    print(f"  [警告] 图表渲染等待超时，继续执行")
    return True  # 超时也继续执行，截图可能部分渲染


def get_section_crop(target):
    """获取主内容SECTION的位置，返回 (dpr, css_left, css_top, css_width, css_height)"""
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
    resp = requests.post(f"{CDP}/eval?target={target}", data=js.encode("utf-8"), timeout=10)
    val = resp.json().get("value")
    if val and isinstance(val, str):
        return json.loads(val)
    return None


def query_domain(target, domain):
    """查询域名，返回 (as_val, traffic_val, chart_png_bytes)"""
    # 导航到 Domain Overview（不滚动，内容在viewport顶部可见）
    url = f"https://www.semrush.com/analytics/overview/?q={domain}&searchType=domain"
    encoded_url = quote(url, safe=":/?&=%")
    requests.get(f"{CDP}/navigate?target={target}&url={encoded_url}", timeout=30)

    # 等待数据+图表渲染
    time.sleep(3)
    wait_for_semrush_data(target, domain)

    # 提取页面文本
    js = "(function(){ return document.body.innerText.substring(0, 3000); })()"
    resp = requests.post(f"{CDP}/eval?target={target}", data=js.encode("utf-8"), timeout=15)
    text = resp.json().get("value", "")

    # 解析 AS 和 Traffic
    as_match = re.search(r"Authority Score\s*\n\s*(\d+)", text)
    traffic_match = re.search(r"Organic Traffic\s*\n\s*([\d.]+[KMB]?)", text)
    as_val = as_match.group(1) if as_match else ""
    traffic_val = traffic_match.group(1) if traffic_match else ""

    # 截图前：把SECTION滚到viewport顶部，确保完整可见
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
    requests.post(f"{CDP}/eval?target={target}", data=js_scroll.encode("utf-8"), timeout=10)
    time.sleep(1)

    # 截图并裁剪：scrollIntoView后，动态获取SECTION实际位置
    section = get_section_crop(target)
    resp = requests.get(f"{CDP}/screenshot?target={target}", timeout=15)
    img = Image.open(BytesIO(resp.content))

    if section:
        dpr = section["dpr"]
        # SECTION实际CSS坐标 × DPR = 像素坐标
        left = max(0, int(section["left"] * dpr) - 5)
        top = max(0, int(section["top"] * dpr) - 5)
        right = min(img.width, int((section["left"] + section["width"]) * dpr) + 5)
        bottom = min(img.height, int((section["top"] + section["height"]) * dpr) + 5)
        print(f"  裁剪区域: ({left}, {top}, {right}, {bottom}) DPR={dpr:.2f} CSS=({section['left']:.0f},{section['top']:.0f},{section['width']:.0f},{section['height']:.0f})")
        cropped = img.crop((left, top, right, bottom))
    else:
        print(f"  [警告] 未找到SECTION，使用完整viewport")
        cropped = img

    buf = BytesIO()
    cropped.save(buf, "PNG", optimize=True)
    chart_bytes = buf.getvalue()

    return as_val, traffic_val, chart_bytes


# ========== 主流程 ==========
def main():
    print("=" * 50)
    print("  SEMrush 竞品数据采集工具（官方版）")
    print("=" * 50)

    # 解析参数
    limit = None
    dry_run = False
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--limit" and i + 1 < len(args):
            limit = int(args[i + 1])
            i += 2
        elif args[i] == "--dry-run":
            dry_run = True
            i += 1
        else:
            i += 1

    # Step 1: 获取 Token
    print("\n[1/5] 获取 Google Token...")
    token = get_access_token()

    # Step 2: 查找 SEMrush 标签
    print("\n[2/5] 查找 SEMrush 标签...")
    target = find_semrush_target()
    if not target:
        print("  未找到 SEMrush 标签！请确保已登录 semrush.com")
        return
    print(f"  Target: {target[:16]}...")

    # Step 3: 读取域名
    print("\n[3/5] 读取域名列表...")
    domains = read_domains(token)
    if not domains:
        print("  未找到域名")
        return
    if limit:
        domains = domains[:limit]
        print(f"  限制查询前 {limit} 个域名")

    # Step 4: 更新表头
    if not dry_run:
        print("\n[4/5] 更新 Sheets 表头...")
        update_sheet_header(token)
    else:
        print("\n[4/5] [DRY-RUN] 跳过表头更新")

    # Step 5: 批量查询
    print(f"\n[5/5] 开始批量查询 {len(domains)} 个域名...\n")

    for idx, d in enumerate(domains):
        domain = d["domain"]
        row = d["row"]
        print(f"[{idx+1}/{len(domains)}] {domain} ({d['name']}) - 行{row}")

        try:
            as_val, traffic_val, chart_bytes = query_domain(target, domain)
            print(f"  AS={as_val} | Traffic={traffic_val} | 截图={len(chart_bytes)}b")

            if dry_run:
                print(f"  [DRY-RUN] 跳过写入")
                continue

            # 上传截图到 Drive
            image_url = upload_screenshot(token, chart_bytes, domain)
            formula = f'=IMAGE("{image_url}", 1)'

            # 写入 Sheets
            write_to_sheet(token, row, as_val, traffic_val, formula)
            print(f"  已写入 Sheets E{row}/F{row}/K{row}")

        except Exception as e:
            print(f"  错误: {e}")
            if not dry_run:
                write_to_sheet(token, row, "ERROR", str(e)[:50], "")

        # 域名间延迟
        if idx < len(domains) - 1:
            print(f"  等待 {QUERY_DELAY}s...")
            time.sleep(QUERY_DELAY)

    print(f"\n{'='*50}")
    print(f"  完成！共处理 {len(domains)} 个域名")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
