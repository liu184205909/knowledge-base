# -*- coding: utf-8 -*-
"""补跑失败产品：name 含 & 时回显 &amp; 导致断言误判；断言改用 html.unescape"""
import json, subprocess, time, os, html

BASE = r"D:\Code\knowledge-base\gsc-mock\rosetoys_audit"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"

def curl_json(method, url, body=None):
    tmp = os.path.join(BASE, "_req_body2.json")
    cmd = ["curl", "-s", "-X", method, url, "-u", AUTH,
           "-H", "User-Agent: " + UA,
           "-H", "Content-Type: application/json; charset=utf-8",
           "-w", "\n__HTTP__%{http_code}"]
    if body is not None:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(body, f, ensure_ascii=False)
        cmd += ["--data-binary", "@" + tmp]
    r = subprocess.run(cmd, capture_output=True)
    out = r.stdout.decode("utf-8", "replace")
    payload, code = out.rsplit("__HTTP__", 1)
    try:
        return code.strip(), json.loads(payload) if payload.strip() else {}
    except Exception:
        return code.strip(), {"_raw": payload[:200]}

def main():
    plan = {e['id']: e for e in json.load(open(BASE + r'\fix_plan.json', encoding='utf-8'))}
    recs = [json.loads(l) for l in open(BASE + r'\results.jsonl', encoding='utf-8') if l.strip()]
    fails = [r for r in recs if not (r['put_ok'] and r['tkd_ok'])]
    print('failures to fix:', [r['id'] for r in fails])
    lines = []
    for r in fails:
        e = plan[r['id']]
        body = {"name": e["new_name"],
                "images": [{"id": im["id"], "alt": im["new_alt"]} for im in e["images"]]}
        code, resp = curl_json("PUT", f"https://rosetoys.org/wp-json/wc/v3/products/{r['id']}", body)
        name_echo = html.unescape(resp.get("name") or "")
        put_ok = (code == "200" and name_echo == e["new_name"]
                  and all(html.unescape(im.get("alt") or "") == e["new_name"] for im in (resp.get("images") or []))
                  and resp.get("slug") == e["slug"])
        tkd_ok = False
        if put_ok:
            time.sleep(0.4)
            code2, _ = curl_json("POST", "https://rosetoys.org/wp-json/rankmath/v1/updateMeta",
                                 {"objectType": "post", "objectID": r['id'],
                                  "meta": {"rank_math_title": e["tkd_title"],
                                           "rank_math_description": e["tkd_desc"]}})
            tkd_ok = (code2 == "200")
        r2 = dict(r); r2.update({"put_ok": put_ok, "tkd_ok": tkd_ok})
        print(r['id'], 'put=', put_ok, 'tkd=', tkd_ok)
        lines.append(r2)
    # 重写 results.jsonl：失败记录替换为补跑结果
    by_id = {r['id']: r for r in recs}
    for l in lines:
        by_id[l['id']] = l
    with open(BASE + r'\results.jsonl', 'w', encoding='utf-8') as f:
        for r in by_id.values():
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print('results.jsonl rewritten')

if __name__ == '__main__':
    main()
