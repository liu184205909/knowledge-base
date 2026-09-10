#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""stats 重算并推 D1（月度管道第 3 步；本地/CI 通用）
用法：python push_stats.py --as-of 2026-10-01
读 dr_top1m.sqlite → 全量统计 → INSERT OR REPLACE 进 D1 stats 表（k='snapshot'）"""
import sqlite3, json, sys, os, io, time, argparse, urllib.request

sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

BASE = os.path.dirname(os.path.abspath(__file__))
DB_ID = '2936a004-96f8-4812-878d-b3ffb01fe7ad'  # D1 dr-radar

def env():
    e = {}
    p = os.path.expanduser('~/.env')
    if os.path.exists(p):
        for line in io.open(p, encoding='utf-8'):
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                e[k] = v.strip('"')
    # CI/环境变量优先
    for k in ('CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'):
        if os.environ.get(k):
            e[k] = os.environ[k]
    return e

def make_api(E):
    url = f"https://api.cloudflare.com/client/v4/accounts/{E['CLOUDFLARE_ACCOUNT_ID']}/d1/database/{DB_ID}/query"
    _p = E.get('HTTPS_PROXY') or E.get('https_proxy')
    if _p == '':
        _p = None  # CI 显式禁代理（空串曾被 or 兜底到本地代理）
    if not _p:
        import socket
        _p = 'http://127.0.0.1:10808' if os.name == 'nt' else None  # 本地 Windows 才走代理
    proxy = urllib.request.ProxyHandler({'https': _p} if _p else {})
    def api(sql):
        body = json.dumps({'sql': sql}).encode()
        req = urllib.request.Request(url, data=body, method='POST',
            headers={'Authorization': 'Bearer ' + E['CLOUDFLARE_API_TOKEN'], 'Content-Type': 'application/json'})
        opener = urllib.request.build_opener(proxy)
        with opener.open(req, timeout=120) as r:
            d = json.load(r)
        if not d.get('success'):
            raise RuntimeError(json.dumps(d.get('errors'))[:300])
        return d
    return api

def compute(as_of):
    db = sqlite3.connect(os.path.join(BASE, 'dr_top1m.sqlite'))
    total = db.execute('SELECT COUNT(*) FROM dr').fetchone()[0]
    buckets = [(45,49),(50,54),(55,59),(60,64),(65,69),(70,74),(75,79),(80,84),(85,89),(90,94),(95,100)]
    dr_dist = [{'label': f'DR{lo}' + ('+' if hi==100 else f'-{hi}'),
                'count': db.execute('SELECT COUNT(*) FROM dr WHERE CAST(dr AS INT) BETWEEN ? AND ?', (lo, hi)).fetchone()[0]}
               for lo, hi in buckets]
    deciles = []
    for i in range(10):
        lo, hi = i*100000+1, (i+1)*100000
        dmin = db.execute('SELECT MIN(CAST(dr AS INT)) FROM dr WHERE "rank" BETWEEN ? AND ?', (lo, hi)).fetchone()[0]
        deciles.append({'label': f'TOP {hi//1000}K', 'range': f'第 {lo:,} - {hi:,} 位', 'dr_min': dmin})
    tld_count = {}
    sus = {'total': 0, 'by_dr': {}, 'all_by_dr': {}}
    for dom, dr in db.execute('SELECT domain, CAST(dr AS INT) FROM dr'):
        t = dom.rsplit('.', 1)[-1].lower()
        tld_count[t] = tld_count.get(t, 0) + 1
        b = (dr // 10) * 10
        sus['all_by_dr'][b] = sus['all_by_dr'].get(b, 0) + 1
        name, _, tld = dom.rpartition('.')
        if name.isdigit() or tld.lower() in ('xyz', 'cyou', 'icu'):
            sus['total'] += 1
            sus['by_dr'][b] = sus['by_dr'].get(b, 0) + 1
    tld_top = [{'label': '.'+t, 'count': c, 'pct': round(c/total*100, 1)}
               for t, c in sorted(tld_count.items(), key=lambda x: -x[1])[:10]]
    sus_density = [{'label': f'DR{b}-{b+9}', 'sus': sus['by_dr'].get(b, 0), 'total': sus['all_by_dr'][b],
                    'pct': round(sus['by_dr'].get(b, 0)/sus['all_by_dr'][b]*100, 1)}
                   for b in sorted(sus['all_by_dr'], reverse=True) if sus['all_by_dr'][b] > 1000]
    return {'meta': {'as_of': as_of, 'total': total, 'source': 'Domain Rating by Ahrefs'},
            'kpis': {'total': total, 'dr_floor': 45, 'sus_total': sus['total'],
                     'sus_pct': round(sus['total']/total*100, 1), 'com_pct': tld_top[0]['pct']},
            'dr_dist': dr_dist, 'deciles': deciles, 'tld_top': tld_top, 'sus_density': sus_density}

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--as-of', required=True)
    a = ap.parse_args()
    stats = compute(a.as_of)
    js = json.dumps(stats, ensure_ascii=False)
    print('stats bytes:', len(js), '| total:', stats['meta']['total'])
    E = env()
    api = make_api(E)
    for attempt in range(5):
        try:
            api("INSERT OR REPLACE INTO stats VALUES ('snapshot', '" + js.replace("'", "''") + "')")
            print('D1 stats written, as_of =', a.as_of)
            break
        except Exception as e:
            print('retry', attempt, str(e)[:120])
            time.sleep(10 * (2 ** attempt))
