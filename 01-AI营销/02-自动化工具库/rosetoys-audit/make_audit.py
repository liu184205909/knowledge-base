# -*- coding: utf-8 -*-
"""汇总 results.jsonl → mechfix_before_after.json + 统计"""
import json, os, re

BASE = r"D:\Code\knowledge-base\gsc-mock\rosetoys_audit"

def main():
    plan = {e['id']: e for e in json.load(open(BASE + r'\fix_plan.json', encoding='utf-8'))}
    recs = [json.loads(l) for l in open(BASE + r'\results.jsonl', encoding='utf-8') if l.strip()]
    ok = [r for r in recs if r['put_ok'] and r['tkd_ok']]
    out = {
        'meta': {
            'site': 'rosetoys.org', 'date': '2026-09-04',
            'scope': 'status=publish 全量(API 实拉 481,任务预期168系前情口径差异)',
            'batch': '机械批修：剥货号前缀+图片alt+TKD回填',
        },
        'stats': {
            'total_publish': len(plan),
            'processed_ok': len(ok),
            'name_stripped': sum(1 for r in ok if r['name_changed']),
            'name_unchanged': sum(1 for r in ok if not r['name_changed']),
            'name_skipped_short': sum(1 for r in recs if r.get('skip_reason')),
            'images_alt_filled': sum(r['n_images'] for r in ok),
            'tkd_written': sum(1 for r in ok if r['tkd_ok']),
        },
        'products': [{
            'id': r['id'], 'slug': r['slug'],
            'before': {'name': r['old_name'], 'alts': r['old_alts']},
            'after': {'name': r['new_name'],
                      'alt': r['new_name'],
                      'rank_math_title': r['tkd_title'],
                      'rank_math_description': r['tkd_desc']},
            'n_images': r['n_images'],
            'name_changed': r['name_changed'],
        } for r in ok],
        'failures': [r for r in recs if not (r['put_ok'] and r['tkd_ok'])],
    }
    json.dump(out, open(BASE + r'\mechfix_before_after.json', 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    dl = [len(r['tkd_desc']) for r in ok]
    print(json.dumps(out['stats'], ensure_ascii=False, indent=1))
    print('desc len <110:', sum(1 for x in dl if x < 110),
          '| 110-155:', sum(1 for x in dl if 110 <= x <= 155),
          '| >155:', sum(1 for x in dl if x > 155))
    print('failures:', len(out['failures']))

if __name__ == '__main__':
    main()
