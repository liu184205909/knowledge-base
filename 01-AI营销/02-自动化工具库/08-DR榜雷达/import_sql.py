#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""把 SQL dump（wrangler d1 export 输出）导入本地 SQLite
用法：python import_sql.py dump.sql out.sqlite  （月度管道第 1 步：线上 D1 = 上期快照）"""
import sqlite3, sys, os

if len(sys.argv) != 3:
    print(__doc__); sys.exit(1)
src, dst = sys.argv[1], sys.argv[2]
if os.path.exists(dst):
    os.remove(dst)
db = sqlite3.connect(dst)
db.executescript(open(src, encoding='utf-8').read())
db.commit()
n = db.execute('SELECT COUNT(*) FROM dr').fetchone()[0]
print(f'{dst}: {n} rows imported')
