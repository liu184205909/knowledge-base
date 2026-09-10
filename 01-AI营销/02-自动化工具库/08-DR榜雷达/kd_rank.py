#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
DR 榜本地查询/自算 KD 工具（2026-09-07 建）
数据源：Ahrefs 免费 domain-rating-top-domains（Top 1M，月度快照）
用法：
  1. 查单/多域名排名：python kd_rank.py example.com foo.com
  2. 从 stdin 读域名（serp_analysis 的 domain 列）自算 KD：
       python kd_rank.py --stdin < domains.txt
     输出：每域名的 dr/rank + 全组中位数/均值（=自算竞争分）
     流转：Ubersuggest serp_analysis 拿 top10 organic 域名 → 喂本脚本 → 得竞争档
刷新数据：bash refresh.sh（4 次 curl 拉全量重建库）
"""
import sqlite3, sys, statistics, os

if hasattr(sys.stdout, 'reconfigure'):  # Win GBK 控制台强制 UTF-8
    sys.stdout.reconfigure(encoding='utf-8')

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dr_top1m.sqlite')

def lookup(domains):
    db = sqlite3.connect(DB)
    out = {}
    for d in domains:
        d = d.strip().lower().strip('.')
        r = db.execute('SELECT dr, rank FROM dr WHERE domain=?', (d,)).fetchone()
        out[d] = r  # None = 不在 Top1M（DR<45）
    db.close()
    return out

def self_kd(domains):
    """SERP top10 域名 -> rank 中位数 = 自算竞争分（越低竞争越小）"""
    res = lookup(domains)
    ranks = [r for r in res.values() if r]  # 不在榜的（DR<45）不计入——小站不算竞争者
    for d, r in res.items():
        print(f'{d:40s} {"NOT-IN-TOP1M" if not r else f"DR {r[0]:.0f}  rank {r[1]:,}"}')
    if not ranks:
        print('\n全部不在 Top1M（DR<45）→ 竞争分：极易'); return
    rk = [r[1] for r in ranks]
    pct = statistics.median(rk) / 10000  # rank 万位
    verdict = '极易' if pct > 50 else '较易' if pct > 20 else '中等' if pct > 8 else '较难' if pct > 3 else '极难'
    print(f'\n在榜 {len(ranks)}/{len(domains)} | rank 中位数 {int(statistics.median(rk)):,} | 均值 {int(statistics.mean(rk)):,}')
    print(f'自算竞争分：{verdict}（中位 rank {pct:.0f} 万位）')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    if sys.argv[1] == '--stdin':
        self_kd(sys.stdin.readlines())
    else:
        for d, r in lookup(sys.argv[1:]).items():
            print(f'{d:40s} {"NOT-IN-TOP1M (DR<45)" if not r else f"DR {r[0]:.0f}  rank {r[1]:,}"}')
