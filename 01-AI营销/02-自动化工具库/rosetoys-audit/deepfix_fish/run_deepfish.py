# -*- coding: utf-8 -*-
"""rosetoys stockings 深修执行器: PUT(name+description+short_description) + POST updateMeta(TKD)
用法: python run_deepfix.py <start> <end>   # plan_deepfix.json 切片执行(含头不含尾)
"""
import json, subprocess, time, os, sys, re

BASE = r"D:\Code\knowledge-base\gsc-mock\rosetoys_audit\deepfix_fish"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
GAP = 0.4

def curl_json(method, url, body=None):
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
        data = {"_raw": payload[:300]}
    return code, data

def wordcount(html):
    txt = re.sub(r"<[^>]+>", " ", html)
    return len(txt.split())

def main():
    a, b = int(sys.argv[1]), int(sys.argv[2])
    plan = json.load(open(os.path.join(BASE, "plan_deepfish.json"), encoding="utf-8"))
    todo = plan[a:b]
    resl_path = os.path.join(BASE, "results_deepfish.jsonl")
    f_resl = open(resl_path, "a", encoding="utf-8")
    for e in todo:
        pid = e["id"]
        rec = {"id": pid, "old_name": e["old_name"], "new_name": e["new_name"],
               "tkd_title": e["tkd_title"], "tkd_desc": e["tkd_desc"]}
        if not e.get("tkd_only"):
            body = {"description": e["desc"], "short_description": e["short"]}
            if e["name_changed"]:
                body["name"] = e["new_name"]
            code, resp = curl_json("PUT", f"https://rosetoys.org/wp-json/wc/v3/products/{pid}", body)
            desc_ok = (resp.get("description") or "").strip() == e["desc"].strip()
            short_ok = (resp.get("short_description") or "").strip() == e["short"].strip()
            name_ok = (resp.get("name") == e["new_name"]) if e["name_changed"] else (resp.get("name") == e["new_name"])
            slug_ok = resp.get("slug") == e.get("_expect_slug", resp.get("slug"))  # slug 不可变,仅记录
            put_ok = (code == "200" and desc_ok and short_ok and name_ok)
            rec.update({"put_ok": put_ok, "code": code, "desc_ok": desc_ok, "short_ok": short_ok,
                        "name_ok": name_ok, "slug": resp.get("slug"),
                        "desc_words": wordcount(e["desc"]), "short_words": wordcount(e["short"]),
                        "desc_len_tkd": len(e["tkd_desc"])})
            print(f"{pid} PUT {code} name={name_ok} desc={desc_ok} short={short_ok} "
                  f"words={rec['desc_words']}/{rec['short_words']} tkdlen={len(e['tkd_desc'])} slug={resp.get('slug')}", flush=True)
        else:
            rec.update({"put_ok": None, "desc_words": 0, "short_words": 0, "desc_len_tkd": len(e["tkd_desc"])})
        time.sleep(GAP)
        tkd_body = {"objectType": "post", "objectID": pid,
                    "meta": {"rank_math_title": e["tkd_title"],
                             "rank_math_description": e["tkd_desc"]}}
        code2, resp2 = curl_json("POST", "https://rosetoys.org/wp-json/rankmath/v1/updateMeta", tkd_body)
        rec.update({"tkd_ok": code2 == "200", "tkd_code": code2,
                    "tkd_err": "" if code2 == "200" else json.dumps(resp2, ensure_ascii=False)[:150]})
        print(f"{pid} TKD {code2}", flush=True)
        f_resl.write(json.dumps(rec, ensure_ascii=False) + "\n")
        f_resl.flush()
        time.sleep(GAP)
    f_resl.close()
    print("BATCH DONE", flush=True)

if __name__ == "__main__":
    main()
