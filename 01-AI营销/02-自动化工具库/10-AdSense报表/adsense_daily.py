# -*- coding: utf-8 -*-
r"""
AdSense Management API v2 每日报表拉取脚本
账号: pub-6800690192456643

用法：
  python adsense_daily.py                    # 拉昨天（dateRange=YESTERDAY）
  python adsense_daily.py --days 7           # 拉最近 N 天（startDate/endDate 精确区间）
  python adsense_daily.py --start 2026-09-01 --end 2026-09-07

流程：刷新 token（走代理）-> reports.generate -> JSON 落 reports/ -> 控制台摘要
凭证：C:\Users\Dylan\tools\adsense_token.json（get_adsense_code.py 产出）
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

PROXY = "http://127.0.0.1:10808"
TOKEN_URI = "https://oauth2.googleapis.com/token"
ACCOUNT_ID = "pub-6800690192456643"
TOKEN_FILE = os.path.expanduser("~/tools/adsense_token.json")
HERE = os.path.dirname(os.path.abspath(__file__))
REPORTS_DIR = os.path.join(HERE, "reports")

DIMENSIONS = "DATE,OWNED_SITE_DOMAIN_NAME"
METRICS = "ESTIMATED_EARNINGS,IMPRESSIONS,PAGE_VIEWS"


def api(method, url, token, timeout=60):
    cmd = [
        "curl", "-s", "--proxy", PROXY,
        "-w", "\n%{http_code}",
        "-X", method,
        "-H", f"Authorization: Bearer {token}",
        url,
        "--connect-timeout", "15",
        "--max-time", str(timeout),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 10)
    if r.returncode != 0:
        raise RuntimeError(f"curl failed: {r.stderr[:300]}")
    body, _, status = r.stdout.rpartition("\n")
    return status.strip(), body


def refresh_access_token():
    with open(TOKEN_FILE, "r", encoding="utf-8") as f:
        cred = json.load(f)
    cmd = [
        "curl", "-s", "--proxy", PROXY,
        "-X", "POST", TOKEN_URI,
        "--data-urlencode", f"client_id={cred['client_id']}",
        "--data-urlencode", f"client_secret={cred['client_secret']}",
        "--data-urlencode", f"refresh_token={cred['refresh_token']}",
        "--data-urlencode", "grant_type=refresh_token",
        "--connect-timeout", "15",
        "--max-time", "30",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=40)
    if r.returncode != 0:
        raise RuntimeError(f"curl failed: {r.stderr[:300]}")
    resp = json.loads(r.stdout)
    if "access_token" not in resp:
        raise RuntimeError(
            f"refresh failed: {resp.get('error')}: {resp.get('error_description', '')}"
        )
    cred["token"] = resp["access_token"]
    cred["expiry"] = (
        datetime.now(timezone(timedelta(hours=8))) + timedelta(seconds=resp.get("expires_in", 3600))
    ).strftime("%Y-%m-%dT%H:%M:%S.%f")
    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(cred, f, indent=2)
    return resp["access_token"]


def build_report_params(args):
    if args.start and args.end:
        return {
            "startDate": args.start,
            "endDate": args.end,
            "dimensions": DIMENSIONS,
            "metrics": METRICS,
            "currencyCode": "USD",
        }
    if args.days and args.days > 1:
        today = datetime.now().date()
        return {
            "startDate": (today - timedelta(days=args.days)).isoformat(),
            "endDate": (today - timedelta(days=1)).isoformat(),
            "dimensions": DIMENSIONS,
            "metrics": METRICS,
            "currencyCode": "USD",
        }
    return {
        "dateRange": "YESTERDAY",
        "dimensions": DIMENSIONS,
        "metrics": METRICS,
        "currencyCode": "USD",
    }


def summarize(resp_json):
    """控制台摘要：按日汇总 收入(micros->USD)/展示/页面浏览。
    v2 响应结构：rows[].cells = [{"value": "..."}, ...]，顺序 = dimensionHeaders + metricHeaders；
    CURRENCY_MICROS 类型数值单位为百万分之一美元。"""
    header = resp_json.get("header", {})
    dim_names = [h["name"] for h in header.get("dimensionHeaders", [])]
    metric_meta = [(h["name"], h.get("type", "")) for h in header.get("metricHeaders", [])]
    n_dim = len(dim_names)
    rows = resp_json.get("rows", [])
    if not rows:
        print("[INFO] no rows returned (account may have no data yet) - empty result is still a successful call")
        return

    def fmt(name, mtype, raw):
        try:
            v = float(raw.replace(",", ""))
        except (ValueError, AttributeError):
            return raw or "0"
        if mtype == "CURRENCY_MICROS":
            return f"{v / 1e6:,.2f} USD"
        return f"{v:,.0f}"

    print(" | ".join(dim_names) + " | " + " | ".join(n for n, _ in metric_meta))
    print("-" * 100)
    for row in rows:
        cells = [c.get("value", "") for c in row.get("cells", [])]
        dims = cells[:n_dim]
        mvals = cells[n_dim:]
        parts = []
        for i, (name, mtype) in enumerate(metric_meta):
            parts.append(fmt(name, mtype, mvals[i] if i < len(mvals) else "0"))
        print(" | ".join(dims) + " | " + " | ".join(parts))
    print("-" * 100)

    # API 官方 totals 行（同 rows 结构）
    tcells = [c.get("value", "") for c in resp_json.get("totals", {}).get("cells", [])]
    if tcells:
        parts = []
        for i, (name, mtype) in enumerate(metric_meta):
            raw = tcells[n_dim + i] if n_dim + i < len(tcells) else "0"
            parts.append(f"{name}={fmt(name, mtype, raw)}")
        print("TOTAL: " + " | ".join(parts))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=None, help="拉最近 N 天")
    ap.add_argument("--start", type=str, default=None, help="起始日期 YYYY-MM-DD")
    ap.add_argument("--end", type=str, default=None, help="结束日期 YYYY-MM-DD")
    args = ap.parse_args()

    if not os.path.exists(TOKEN_FILE):
        print(f"[ERROR] token file missing: {TOKEN_FILE}")
        print("        Run: python C:\\Users\\Dylan\\tools\\get_adsense_code.py first.")
        sys.exit(1)

    print("[1/3] refreshing access token ...")
    token = refresh_access_token()
    print("      ok")

    # 先列账号验证连接（同时确认账号可见）
    print("[2/3] verifying account access ...")
    status, body = api("GET", "https://adsense.googleapis.com/v2/accounts", token)
    if status != "200":
        print(f"[ERROR] accounts.list HTTP {status}: {body[:400]}")
        sys.exit(1)
    accounts = json.loads(body).get("accounts", [])
    names = [a["name"] for a in accounts]
    print(f"      visible accounts: {names if names else '(empty)'}")
    target = f"accounts/{ACCOUNT_ID}"
    if names and target not in names:
        print(f"[WARN] target {target} not in visible accounts; report may 403")

    params = build_report_params(args)
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"https://adsense.googleapis.com/v2/{target}/reports:generate?{qs}"
    print(f"[3/3] fetching report: {qs}")
    status, body = api("GET", url, token)
    if status != "200":
        print(f"[ERROR] reports.generate HTTP {status}: {body[:600]}")
        sys.exit(1)

    resp = json.loads(body)
    os.makedirs(REPORTS_DIR, exist_ok=True)
    label = params.get("startDate", params.get("dateRange", "report")).replace(":", "-")
    out = os.path.join(REPORTS_DIR, f"adsense_{label}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(resp, f, ensure_ascii=False, indent=2)
    print(f"[OK] saved: {out}")
    print()
    summarize(resp)


if __name__ == "__main__":
    main()
