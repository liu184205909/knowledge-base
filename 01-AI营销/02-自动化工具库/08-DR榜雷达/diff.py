#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
DR 榜月度 diff 引擎：新进榜/跃迁/掉榜 → 过滤噪音 → 月报 MD
核心认知（2026-09-07 首期实证）：100 万行原始 diff 里 95% 是噪音——
榜尾 DR45 边缘挤进挤出是常态、批量操盘网络（810XXXX.xyz 系）月月进出。
数据的价值不在 diff 本身，在过滤器和判读：
  ① 显著性阈值：新进榜 rank<30万（高起点崛起）｜跃迁 rank+≥10万｜掉榜原 rank<20万（头部崩塌才算警报）
  ② 垃圾域名过滤：数字/乱码模式 + 垃圾 TLD（PBN 噪音，用 kd_rank.py 同款规则）
  ③ 行业关联（下期接入）：新崛起域名 ∩ 我方监控词池 SERP 出现 = "我们品类的"信号，
     纯榜单做不了语义分类，必须与 x-radar / 选品词池联动才可判读
用法：python diff.py --label 2026-10   （读 dr_top1m_prev.sqlite vs dr_top1m.sqlite）
"""
import sqlite3, sys, os, re, argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE = os.path.dirname(os.path.abspath(__file__))
JUNK_TLD = ('.xyz', '.cyou', '.icu', '.top', '.bid', '.link', '.click', '.rest', '.sbs', '.monster')
NUMERIC = re.compile(r'^\d+[a-z]*\d*$|^[a-z0-9]{8,}$')

def is_junk(d):
    return d.endswith(JUNK_TLD) or bool(NUMERIC.match(d.split('.')[0]))

def load(dbfile):
    db = sqlite3.connect(os.path.join(BASE, dbfile))
    rows = dict(db.execute('SELECT domain, rank FROM dr').fetchall())
    db.close()
    return rows

def main(label):
    prev, cur = load('dr_top1m_prev.sqlite'), load('dr_top1m.sqlite')
    new_in = {d: r for d, r in cur.items() if d not in prev and r < 300000}
    dropped = {d: r for d, r in prev.items() if d not in cur and r < 200000}
    jumped = {d: (prev[d], cur[d]) for d in cur if d in prev and prev[d] - cur[d] >= 100000 and cur[d] < 300000 and prev[d] > 200000}
    # 过滤垃圾域名（PBN 噪音），保留原计数供报告披露
    stats = {'new_in_raw': len([d for d in cur if d not in prev]),
             'dropped_raw': len([d for d in prev if d not in cur])}
    new_in = {d: r for d, r in new_in.items() if not is_junk(d)}
    dropped = {d: r for d, r in dropped.items() if not is_junk(d)}
    jumped = {d: j for d, j in jumped.items() if not is_junk(d)}

    rep = os.path.join(BASE, 'reports')
    os.makedirs(rep, exist_ok=True)
    out = os.path.join(rep, f'dr_diff_{label}.md')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(f'# DR 榜月度雷达 {label}\n\n原始进出：+{stats["new_in_raw"]} / -{stats["dropped_raw"]}（含噪音）\n\n')
        f.write(f'## 高起点新进榜（rank<30万，已滤垃圾域名，共 {len(new_in)}）\n\n')
        f.write('| rank | domain |\n|---|---|\n')
        for d, r in sorted(new_in.items(), key=lambda x: x[1])[:100]:
            f.write(f'| {r:,} | {d} |\n')
        f.write(f'\n## 显著跃迁（rank+≥10万，共 {len(jumped)}）\n\n| prev | cur | domain |\n|---|---|---|\n')
        for d, (p, c) in sorted(jumped.items(), key=lambda x: x[1][1])[:100]:
            f.write(f'| {p:,} | {c:,} | {d} |\n')
        f.write(f'\n## 掉榜警报（原 rank<20万，共 {len(dropped)}）\n\n| prev rank | domain |\n|---|---|\n')
        for d, r in sorted(dropped.items(), key=lambda x: x[1])[:100]:
            f.write(f'| {r:,} | {d} |\n')
        f.write('\n---\n**判读待办（人工/agent 接续）**：①新进榜域名哪些与我方品类相关（交叉词池 SERP）'
                '②跃迁域名抽查增长引擎（SOP §七b 上升归因）③掉榜域名抽查看崩塌原因（反面前车之鉴）\n')
    print(f'report -> {out}')
    print(f'new_in={len(new_in)} jumped={len(jumped)} dropped={len(dropped)} (filtered)')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--label', required=True, help='期号 YYYY-MM')
    a = ap.parse_args()
    main(a.label)
