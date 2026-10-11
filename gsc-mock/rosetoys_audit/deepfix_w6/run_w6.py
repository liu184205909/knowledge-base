# -*- coding: utf-8 -*-
"""Wave 6 executor: 26 blind-spot SKUs. Same channel as wave 5 (run_deepcos.py)
plus a categories-unchanged assertion (PUT payload carries only name/desc/short)."""
import json, subprocess, sys, time, os, re, html

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
BASE = "https://rosetoys.org/wp-json"
HERE = os.path.dirname(os.path.abspath(__file__))

def _norm_deep(s):
    s = re.sub(r"<br\s*/?>", "", s)
    s = re.sub(r"<p>\s*((?:<img[^>]*>\s*)+)</p>", r"\1", s)
    s = re.sub(r"<(\w+)[^>]*>", r"<\1>", s)
    return "".join(s.split())

def _srcs(s):
    out = []
    for u in re.findall(r'src="([^"]+)"', s):
        if not out or out[-1] != u:
            out.append(u)
    return out

def _text(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("×", "x").replace("–", "-").replace("—", "-")
    return "".join(s.split())

def curl_json(method, path, payload=None):
    cmd = ["curl", "-s", "--max-time", "90", "-X", method, "-A", UA, "-u", AUTH, BASE + path]
    if payload is not None:
        tmp = os.path.join(HERE, "_payload_tmp_w6.json")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        cmd += ["-H", "Content-Type: application/json; charset=utf-8", "--data-binary", "@" + tmp]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"_raw": r.stdout[:500]}

def main(plan_path):
    plan = json.load(open(os.path.join(HERE, plan_path), encoding="utf-8"))
    results_path = os.path.join(HERE, "results_w6.jsonl")
    n_ok = 0
    for pid in sorted(plan, key=int):
        it = plan[pid]
        pid_i = int(pid)
        rec = {"id": pid_i, "ok": False}
        try:
            before = json.load(open(os.path.join(HERE, f"_before_{pid}.json"), encoding="utf-8"))
            slug0, price0 = before.get("slug"), before.get("price")
            cats0 = sorted(c["id"] for c in (before.get("categories") or []))
            desc = it["desc"]  # no media placeholders in wave 6
            time.sleep(1.0)
            payload = {"name": it["new_name"], "description": desc,
                       "short_description": it["short"]}
            resp = curl_json("PUT", f"/wc/v3/products/{pid_i}", payload)
            if resp.get("id") != pid_i:
                rec.update(stage="put", err=str(resp)[:300]); raise RuntimeError("put failed")
            if resp.get("name") != it["new_name"]:
                rec.update(stage="put_name_mismatch", got=resp.get("name")); raise RuntimeError("name mismatch")
            if _norm_deep(resp.get("description", "")) != _norm_deep(desc):
                rec.update(stage="put_desc_mismatch"); raise RuntimeError("desc mismatch")
            rec["slug_unchanged"] = (resp.get("slug") == slug0)
            rec["price_unchanged"] = (resp.get("price") == price0)
            time.sleep(1.0)
            rm = curl_json("POST", "/rankmath/v1/updateMeta",
                           {"objectType": "post", "objectID": pid_i,
                            "meta": {"rank_math_title": it["tkd_title"],
                                     "rank_math_description": it["tkd_desc"]}})
            rec["rankmath_resp"] = str(rm)[:200]
            time.sleep(1.0)
            back = curl_json("GET", f"/wc/v3/products/{pid_i}")
            md = {m.get("key"): m.get("value") for m in (back.get("meta_data") or [])}
            cats1 = sorted(c["id"] for c in (back.get("categories") or []))
            rec["verify"] = {
                "name": back.get("name") == it["new_name"],
                "desc": _norm_deep(back.get("description") or "") == _norm_deep(desc),
                "short": _text(back.get("short_description") or "") == _text(it["short"]),
                "slug": back.get("slug") == slug0,
                "price": back.get("price") == price0,
                "cats": cats1 == cats0,
                "rm_title": html.unescape(md.get("rank_math_title") or "") == it["tkd_title"],
                "rm_desc": html.unescape(md.get("rank_math_description") or "") == it["tkd_desc"],
            }
            rec["ok"] = all(rec["verify"].values())
            if rec["ok"]:
                n_ok += 1
        except Exception as e:
            rec["exc"] = str(e)[:200]
        with open(results_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(pid, "OK" if rec.get("ok") else "FAIL", rec.get("stage", ""), rec.get("exc", ""), flush=True)
        time.sleep(1.0)
    print(f"done: {n_ok}/{len(plan)}")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "plan_w6.json")
