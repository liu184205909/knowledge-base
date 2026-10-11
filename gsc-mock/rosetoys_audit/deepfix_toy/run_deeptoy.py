# -*- coding: utf-8 -*-
"""rose-toys SKU deep-fix executor, wave 4 (toy line).
Usage: python run_deeptoy.py plan_toy_b01.json
Per SKU: GET before -> PUT wc/v3 (name/description/short_description)
       -> POST rankmath updateMeta -> GET verify -> results jsonl.
Media placeholder: "⟦IMG⟧" in plan desc is replaced in order by the img tags
extracted from the CURRENT live description (iframe likewise via ⟦IFRAME⟧).
Plan key "media_mode": "keep" (default) uses placeholders; "clean" ignores them.
"""
import json, subprocess, sys, time, os, re, html

AUTH = "lzn184205909@gmail.com:x1F3unlUOIpUrhcb5aE0bDdG"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
BASE = "https://rosetoys.org/wp-json"
HERE = os.path.dirname(os.path.abspath(__file__))
PH_IMG = chr(0x27E6) + "IMG" + chr(0x27E7)
PH_IF = chr(0x27E6) + "IFRAME" + chr(0x27E7)

def _norm(s):
    return "".join(s.split())

def _norm_deep(s):
    """Content-level normalization tolerant of wp_kses rewrites:
    unwraps <p><img></p> back to bare img, strips all tag attributes,
    then collapses whitespace. Used for desc equivalence checks."""
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
    s = s.replace("×", "x").replace("–", "-").replace("—", "-").replace(" ", " ")
    return _norm(s)

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

def build_media(before_desc):
    """Extract media tags (img then iframe, in document order) from live desc."""
    tags = re.findall(r"<img[^>]*/?>|<iframe[^>]*>.*?</iframe>", before_desc, re.S)
    return tags

def main(plan_path):
    plan = json.load(open(os.path.join(HERE, plan_path), encoding="utf-8"))
    results_path = os.path.join(HERE, "results_deeptoy.jsonl")
    ids = sorted(plan.keys(), key=int) if isinstance(plan, dict) else [p["id"] for p in plan]
    items = plan if isinstance(plan, dict) else {p["id"]: p for p in plan}
    for pid in ids:
        it = items[pid]
        pid_i = int(pid)
        rec = {"id": pid_i, "ok": False}
        try:
            before = curl_json("GET", f"/wc/v3/products/{pid_i}")
            with open(os.path.join(HERE, f"_before_{pid}.json"), "w", encoding="utf-8") as f:
                json.dump(before, f, ensure_ascii=False, indent=1)
            slug0, price0 = before.get("slug"), before.get("price")
            time.sleep(1.2)
            # build desc with media (placeholders: @@IMG@@ / @@IF@@ or unicode form)
            desc = it["desc"].replace("@@IMG@@", PH_IMG).replace("@@IF@@", PH_IF)
            media = build_media(before.get("description") or "")
            if it.get("drop_iframe"):
                dropped_if = [t for t in media if t.startswith("<iframe")]
                media = [t for t in media if not t.startswith("<iframe")]
                rec["iframes_dropped"] = len(dropped_if)
                desc = desc.replace(PH_IF, "")
            n_ph = desc.count(PH_IMG) + desc.count(PH_IF)
            if it.get("media_mode", "keep") == "clean":
                desc = desc.replace(PH_IMG, "").replace(PH_IF, "")
                rec["media_dropped"] = len(media)
            else:
                if n_ph != len(media):
                    rec["stage"] = "media_count_mismatch"
                    rec["ph"] = n_ph; rec["media"] = len(media)
                    raise RuntimeError(f"placeholder {n_ph} vs media {len(media)}")
                for tag in media:
                    if PH_IMG in desc and tag.startswith("<img"):
                        desc = desc.replace(PH_IMG, tag, 1)
                    elif PH_IF in desc:
                        desc = desc.replace(PH_IF, tag, 1)
                    else:
                        raise RuntimeError("placeholder type mismatch: " + tag[:40])
                rec["media_kept"] = len(media)
            # 2. PUT product
            payload = {"name": it["new_name"],
                       "description": desc,
                       "short_description": it["short"]}
            resp = curl_json("PUT", f"/wc/v3/products/{pid_i}", payload)
            if resp.get("id") != pid_i:
                rec["stage"] = "put"; rec["err"] = str(resp)[:300]
                raise RuntimeError("put failed")
            if resp.get("name") != it["new_name"]:
                rec["stage"] = "put_name_mismatch"; rec["got"] = resp.get("name")
                raise RuntimeError("name mismatch")
            if _norm_deep(resp.get("description", "")) != _norm_deep(desc) or _srcs(resp.get("description", "")) != _srcs(desc):
                rec["stage"] = "put_desc_mismatch"
                rec["desc_got_len"] = len(resp.get("description") or "")
                rec["desc_want_len"] = len(desc)
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
                "desc": _norm_deep(back.get("description") or "") == _norm_deep(desc) and _srcs(back.get("description") or "") == _srcs(desc),
                "short": _text(back.get("short_description") or "") != "" and _text(back.get("short_description") or "") == _text(it["short"]),
                "slug": back.get("slug") == slug0,
                "price": back.get("price") == price0,
                "rm_title": html.unescape(md.get("rank_math_title") or "") == it["tkd_title"],
                "rm_desc": html.unescape(md.get("rank_math_description") or "") == it["tkd_desc"],
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
