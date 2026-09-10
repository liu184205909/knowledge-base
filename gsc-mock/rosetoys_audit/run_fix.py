# -*- coding: utf-8 -*-
"""rosetoys 批量执行器：PUT(name+images) + POST updateMeta(TKD)
- 50 个一批，批后 API 抽验 2 个
- 结果写 results.jsonl 支持断点续跑
"""
import json, subprocess, time, os, sys

BASE = r"D:\Code\knowledge-base\gsc-mock\rosetoys_audit"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
BATCH = 50
GAP = 0.35

def curl_json(method, url, body=None, tag=""):
    tmp = os.path.join(BASE, "_req_body.json")
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
    if "__HTTP__" in out:
        payload, code = out.rsplit("__HTTP__", 1)
        code = code.strip()
    else:
        payload, code = out, "0"
    try:
        data = json.loads(payload) if payload.strip() else {}
    except Exception:
        data = {"_raw": payload[:200]}
    return code, data

def main():
    plan = json.load(open(os.path.join(BASE, "fix_plan.json"), encoding="utf-8"))
    # 断点续跑
    done = {}
    resl = os.path.join(BASE, "results.jsonl")
    if os.path.exists(resl):
        for line in open(resl, encoding="utf-8"):
            line = line.strip()
            if line:
                rec = json.loads(line)
                if rec.get("put_ok") and rec.get("tkd_ok"):
                    done[rec["id"]] = rec
    todo = [e for e in plan if e["id"] not in done]
    print(f"total {len(plan)}, done {len(done)}, todo {len(todo)}", flush=True)

    f_resl = open(resl, "a", encoding="utf-8")
    n_ok = n_fail = 0
    for i, e in enumerate(todo):
        pid = e["id"]
        body = {"name": e["new_name"],
                "images": [{"id": im["id"], "alt": im["new_alt"]} for im in e["images"]]}
        code, resp = curl_json("PUT", f"https://rosetoys.org/wp-json/wc/v3/products/{pid}", body)
        put_ok = (code == "200" and resp.get("name") == e["new_name"]
                  and all((im.get("alt") or "") == e["new_name"] for im in (resp.get("images") or []))
                  and resp.get("slug") == e["slug"])
        tkd_ok = False
        tkd_err = ""
        if put_ok:
            time.sleep(GAP)
            tkd_body = {"objectType": "post", "objectID": pid,
                        "meta": {"rank_math_title": e["tkd_title"],
                                 "rank_math_description": e["tkd_desc"]}}
            code2, resp2 = curl_json("POST", "https://rosetoys.org/wp-json/rankmath/v1/updateMeta", tkd_body)
            tkd_ok = (code2 == "200")
            if not tkd_ok:
                tkd_err = f"{code2}:{json.dumps(resp2, ensure_ascii=False)[:150]}"
        rec = {"id": pid, "slug": e["slug"], "old_name": e["old_name"],
               "new_name": e["new_name"], "name_changed": e["name_changed"],
               "tkd_title": e["tkd_title"], "tkd_desc": e["tkd_desc"],
               "n_images": len(e["images"]),
               "old_alts": [im["old_alt"] for im in e["images"]],
               "put_ok": put_ok, "tkd_ok": tkd_ok, "tkd_err": tkd_err}
        f_resl.write(json.dumps(rec, ensure_ascii=False) + "\n")
        f_resl.flush()
        n_ok += 1 if (put_ok and tkd_ok) else 0
        n_fail += 0 if (put_ok and tkd_ok) else 1
        if not put_ok or not tkd_ok:
            print(f"FAIL {pid} put={put_ok}({code}) tkd={tkd_ok} {tkd_err}", flush=True)
        # 批后抽验 2 个
        done[pid] = rec
        if (i + 1) % BATCH == 0 or i == len(todo) - 1:
            print(f"progress {i+1}/{len(todo)} ok={n_ok} fail={n_fail} — 抽验...", flush=True)
            sample = todo[max(0, i - 1):i + 1]  # 本批尾部 2 个
            for s in sample:
                c, r = curl_json("GET", f"https://rosetoys.org/wp-json/wc/v3/products/{s['id']}?_fields=id,name,slug,images")
                alt_ok = all((im.get("alt") or "") == s["new_name"] for im in (r.get("images") or []))
                okk = (c == "200" and r.get("name") == s["new_name"]
                       and r.get("slug") == s["slug"] and alt_ok)
                print(f"  抽验 {s['id']}: {c} name={r.get('name') == s['new_name']} "
                      f"slug={r.get('slug') == s['slug']} alt={alt_ok} => {'PASS' if okk else 'FAIL'}", flush=True)
                time.sleep(GAP)
        time.sleep(GAP)
    f_resl.close()
    print(f"DONE ok={n_ok} fail={n_fail}", flush=True)

if __name__ == "__main__":
    main()
