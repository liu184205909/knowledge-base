# -*- coding: utf-8 -*-
"""nightwear (term 163) SKU deep-fix executor, wave 3.
Usage: python run_deepnight.py plan_night_b01.json
Per SKU: GET before -> PUT wc/v3 (name/description/short_description)
       -> POST rankmath updateMeta -> GET verify -> results jsonl.
"""
import json, subprocess, sys, time, os

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
BASE = "https://rosetoys.org/wp-json"
HERE = os.path.dirname(os.path.abspath(__file__))

def _norm(s):
    return "".join(s.split())

def curl_json(method, path, payload=None, out_file=None):
    cmd = ["curl", "-s", "--max-time", "90", "-X", method, "-A", UA,
           "-u", AUTH, BASE + path]
    if payload is not None:
        tmp = os.path.join(HERE, "_payload_tmp.json")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd += ["-H", "Content-Type: application/json; charset=utf-8",
                "--data-binary", "@" + tmp]
    if out_file:
        cmd += ["-o", out_file]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if out_file:
        with open(out_file, "r", encoding="utf-8") as f:
            return f.read()
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"_raw": r.stdout[:500]}

def main(plan_path):
    plan = json.load(open(os.path.join(HERE, plan_path), encoding="utf-8"))
    results_path = os.path.join(HERE, "results_deepnight.jsonl")
    ids = sorted(plan.keys(), key=int) if isinstance(plan, dict) else [p["id"] for p in plan]
    items = plan if isinstance(plan, dict) else {p["id"]: p for p in plan}
    for pid in ids:
        it = items[pid]
        pid_i = int(pid)
        rec = {"id": pid_i, "ok": False}
        try:
            # 1. before snapshot
            before = curl_json("GET", f"/wc/v3/products/{pid_i}")
            with open(os.path.join(HERE, f"_before_{pid}.json"), "w", encoding="utf-8") as f:
                json.dump(before, f, ensure_ascii=False, indent=1)
            slug0, price0 = before.get("slug"), before.get("price")
            time.sleep(1.2)
            # 2. PUT product
            payload = {"name": it["new_name"],
                       "description": it["desc"],
                       "short_description": it["short"]}
            resp = curl_json("PUT", f"/wc/v3/products/{pid_i}", payload)
            if resp.get("id") != pid_i:
                rec["stage"] = "put"; rec["err"] = str(resp)[:300]
                raise RuntimeError("put failed")
            if resp.get("name") != it["new_name"]:
                rec["stage"] = "put_name_mismatch"
                rec["got"] = resp.get("name")
                raise RuntimeError("name mismatch")
            if _norm(resp.get("description", "")) != _norm(it["desc"]):
                rec["stage"] = "put_desc_mismatch"
                rec["desc_got_len"] = len(resp.get("description") or "")
                rec["desc_want_len"] = len(it["desc"])
                raise RuntimeError("desc mismatch")
            rec["slug_unchanged"] = (resp.get("slug") == slug0)
            rec["price_unchanged"] = (resp.get("price") == price0)
            time.sleep(1.2)
            # 3. rankmath TKD
            rm = curl_json("POST", "/rankmath/v1/updateMeta",
                           {"objectType": "post", "objectID": pid_i,
                            "meta": {"rank_math_title": it["tkd_title"],
                                     "rank_math_description": it["tkd_desc"]}})
            rec["rankmath_resp"] = str(rm)[:200]
            time.sleep(1.2)
            # 4. verify read-back
            back = curl_json("GET", f"/wc/v3/products/{pid_i}")
            md = {m.get("key"): m.get("value") for m in (back.get("meta_data") or [])}
            rec["verify"] = {
                "name": back.get("name") == it["new_name"],
                "desc": _norm(back.get("description") or "") == _norm(it["desc"]),
                "short": (back.get("short_description") or "").replace("<p>","").replace("</p>","").replace("\n","").strip() != "" ,
                "slug": back.get("slug") == slug0,
                "price": back.get("price") == price0,
                "rm_title": md.get("rank_math_title") == it["tkd_title"],
                "rm_desc": md.get("rank_math_description") == it["tkd_desc"],
            }
            rec["ok"] = all(rec["verify"].values()) and rec["slug_unchanged"] and rec["price_unchanged"]
        except Exception as e:
            rec["exc"] = str(e)[:200]
        with open(results_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(pid, "OK" if rec.get("ok") else "FAIL", rec.get("stage", ""), rec.get("exc", ""))
        time.sleep(1.2)

if __name__ == "__main__":
    main(sys.argv[1])
