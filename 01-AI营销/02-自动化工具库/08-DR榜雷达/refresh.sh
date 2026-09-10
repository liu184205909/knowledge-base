#!/bin/bash
# 月度刷新 Top1M DR 榜（本地手动 / GH Actions CI 通用）
# 流程：拉 4 块 CSV → 旧库转 _prev（仅本地存在时）→ 建新库
# 凭证：优先环境变量 AHREFS_API_KEY（CI），否则读 ~/.env（本地）
set -e
cd "$(dirname "$0")"
KEY="${AHREFS_API_KEY:-$(grep '^AHREFS_API_KEY=' ~/.env | cut -d= -f2)}"
[ -z "$KEY" ] && { echo "AHREFS_API_KEY not found"; exit 1; }
for i in 0 1 2 3; do
  from=$((i*250000+1)); to=$(((i+1)*250000))
  curl -s -H "Authorization: Bearer $KEY" \
    "https://api.ahrefs.com/v3/public/domain-rating-top-domains?from=$from&to=$to&output=csv" \
    -o "data/dr_top1m_$(printf '%02d' $((i+1))).csv"
  echo "chunk $((i+1)) done: $(wc -l < data/dr_top1m_$(printf '%02d' $((i+1))).csv) lines"
done
[ -f dr_top1m.sqlite ] && mv dr_top1m.sqlite dr_top1m_prev.sqlite
python - <<'EOF'
import sqlite3, csv, glob, io, os
os.makedirs('data', exist_ok=True)
db = sqlite3.connect('dr_top1m.sqlite')
db.execute('CREATE TABLE dr (domain TEXT PRIMARY KEY, dr REAL, "rank" INTEGER)')
db.execute('CREATE INDEX idx_rank ON dr("rank")')
for f in sorted(glob.glob('data/dr_top1m_*.csv')):
    with io.open(f, encoding='utf-8') as fh:
        db.executemany('INSERT OR REPLACE INTO dr VALUES (?,?,?)',
                       [(r['domain'], float(r['domain_rating']), int(r['rank'])) for r in csv.DictReader(fh)])
db.commit(); print('new db rows:', db.execute('SELECT COUNT(*) FROM dr').fetchone()[0])
EOF
echo "refresh done. 下一步: python diff.py --label YYYY-MM && python push_stats.py --as-of YYYY-MM-DD"
