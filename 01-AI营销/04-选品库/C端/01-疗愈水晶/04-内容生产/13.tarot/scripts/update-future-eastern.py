# -*- coding: utf-8 -*-
"""
更新 22 篇 future 塔罗 post 的 content: eastern 中文→英文
策略: GET 线上 content -> 用本地 articles/*.json 的同样替换规则做字符串替换 -> POST 回去
保留图片/schema/wp:html 块结构, 只改文字. status 保持 future.
"""
import json, os, subprocess, sys, time, re

env = {}
for line in open(os.path.expanduser('~/.env'), encoding='utf-8'):
    line = line.strip()
    if not line or line.startswith('#'):
        continue
    if '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip()
U = env['WP_USER']; P = env['WP_APP_PASSWORD']; SITE = env['WP_SITE']
PROXY = ['--proxy', 'socks5://127.0.0.1:10808']

ROOT = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(os.path.dirname(ROOT), 'articles')
QC = os.path.join(os.path.dirname(ROOT), '_qc', 'upload-results.json')
results = json.load(open(QC, encoding='utf-8'))
cn = re.compile(r'[一-鿿]')

# content 内中文→英文替换表（与 _fix_eastern.py 的 ct_repl 完全一致）
ct_repl = {
    'the-fool': [
        ("the energy of The Fool also resonates with what is called <em>初发心</em> — the beginner's heart, the first arising of aspiration on the path.",
         "the energy of The Fool also resonates with what is called the beginner's heart — the first arising of aspiration on the path."),
        ("In some older Chinese texts it is called <em>菩萨石</em> — the bodhisattva stone — and it has been used for Buddhist prayer beads (malas)",
         "In some older Chinese texts it is called the bodhisattva stone, and it has been used for Buddhist prayer beads (malas)"),
    ],
    'the-emperor': [
        ("the Eastern principle of <em>正</em> (zhèng) — uprightness, the well-ordered foundation on which both inner and outer life can stand",
         "the Eastern principle of uprightness — the well-ordered foundation on which both inner and outer life can stand"),
    ],
    'the-chariot': [
        ("the Eastern principle of <em>中道</em> (zhōngdào) — the middle way, understood not as a mediocre average",
         "the Eastern principle of the middle way, understood not as a mediocre average"),
    ],
    'the-hermit': [
        ("the Tibetan Buddhist practice of <em>闭关</em> (bìguān) — structured retreat, undertaken not to escape the world",
         "the Tibetan Buddhist practice of structured retreat, undertaken not to escape the world"),
    ],
    'death': [
        ("the Eastern contemplation of impermanence (<em>无常</em>, wúcháng) — a central teaching across both Buddhist and Daoist traditions.",
         "the Eastern contemplation of impermanence — a central teaching across both Buddhist and Daoist traditions."),
    ],
    'temperance': [
        ("the Eastern principle of <em>中道</em> (zhōngdào) — the middle way, central to both Buddhist and Confucian thought.",
         "the Eastern principle of the middle way, central to both Buddhist and Confucian thought."),
    ],
    'the-star': [
        ("The Star's hope is not被动等待; it is tended, one small light at a time.",
         "The Star's hope is not passive waiting; it is tended, one small light at a time."),
        ("the Eastern ideal of <em>菩提心</em> (pútíxīn) — the awakened heart/mind, the steady, luminous aspiration",
         "the Eastern ideal of the awakened heart and mind — the steady, luminous aspiration"),
    ],
    'judgment': [
        ("the Confucian discipline of daily self-examination (the <em>吾日三省吾身</em> of Zengzi) share a crucial feature",
         "the Confucian discipline of daily self-examination (the practice of examining oneself three times a day, taught by Zengzi) share a crucial feature"),
    ],
    'the-world': [
        ("clear quartz (the <em>菩萨石</em> or bodhisattva stone of older Chinese texts) has been used for prayer beads",
         "clear quartz (the bodhisattva stone of older Chinese texts) has been used for prayer beads"),
    ],
}

# 含中文的 9 篇; 其余 13 篇线上 content 无中文, 跳过(但脚本仍可全量校验)
target_slugs = set(ct_repl.keys())

def curl(args, max_time=60):
    cmd = ['curl', '-s'] + PROXY + args + ['--max-time', str(max_time)]
    return subprocess.run(cmd, capture_output=True, timeout=max_time + 30)

def _parse(s, ctx):
    txt = s.strip()
    if not txt:
        raise RuntimeError(ctx + ': empty response')
    try:
        return json.loads(txt)
    except Exception as e:
        raise RuntimeError(ctx + ': JSON parse fail: ' + txt[:200])

def get_post(pid):
    url = f'https://{SITE}/wp-json/wp/v2/posts/{pid}?context=edit&_fields=status,slug,title,content,date,excerpt'
    r = curl(['-u', f'{U}:{P}', url], max_time=30)
    return _parse(r.stdout.decode('utf-8'), f'GET {pid}')

def update_post(pid, content):
    url = f'https://{SITE}/wp-json/wp/v2/posts/{pid}?_fields=id,slug,status,modified'
    payload = json.dumps({'content': content})
    tmp = os.path.join(ROOT, '_tmp-update.json')
    with open(tmp, 'w', encoding='utf-8') as f:
        f.write(payload)
    r = curl(['-u', f'{U}:{P}', '-X', 'POST', '-H', 'Content-Type: application/json',
              '-d', '@' + tmp, url], max_time=90)
    os.remove(tmp)
    return _parse(r.stdout.decode('utf-8'), f'POST {pid}')

report = []
ok = 0; skip = 0; fail = 0

for rec in results:
    slug = rec['slug']
    post_slug = rec.get('postSlug', '')
    pid = rec.get('id')
    # 跳过 hub
    if rec.get('status') != 'ok' or not post_slug.startswith('tarot-'):
        continue
    if slug not in target_slugs:
        # 仍校验线上是否真的无中文
        try:
            j = get_post(pid)
            c = j.get('content', {}).get('raw', '') if isinstance(j.get('content'), dict) else j.get('content', '')
            if cn.search(c):
                report.append((slug, pid, 'CN_FOUND_BUT_NO_RULE', len(cn.findall(c))))
                print(f'!! {slug} (id={pid}): 线上有中文但无替换规则, 需人工')
                fail += 1
            else:
                skip += 1
        except Exception as e:
            report.append((slug, pid, 'GET_FAIL', str(e)[:80]))
            fail += 1
        continue

    # 含中文的目标篇
    try:
        j = get_post(pid)
        c = j.get('content', {}).get('raw', '') if isinstance(j.get('content'), dict) else j.get('content', '')
        before_cn = len(cn.findall(c))
        applied = 0
        for old, new in ct_repl[slug]:
            if old in c:
                c = c.replace(old, new, 1)
                applied += 1
        after_cn = len(cn.findall(c))
        if applied == 0 and before_cn > 0:
            report.append((slug, pid, 'RULE_NOT_MATCH', f'before={before_cn}'))
            print(f'!! {slug} (id={pid}): 替换规则未命中, 线上文本可能与预期不符 (before_cn={before_cn})')
            fail += 1
            continue
        if applied == 0 and before_cn == 0:
            report.append((slug, pid, 'NO_CN_ONLINE', '0'))
            skip += 1
            continue
        # POST 更新
        res = update_post(pid, c)
        if 'id' in res:
            report.append((slug, pid, 'OK', f'applied={applied} before={before_cn} after={after_cn}'))
            print(f'OK {slug} (id={pid}): applied={applied} 中文 {before_cn}->{after_cn} status={res.get("status")}')
            ok += 1
        else:
            report.append((slug, pid, 'UPDATE_FAIL', str(res)[:120]))
            print(f'FAIL {slug} (id={pid}): {str(res)[:120]}')
            fail += 1
    except Exception as e:
        report.append((slug, pid, 'EXC', str(e)[:80]))
        print(f'EXC {slug} (id={pid}): {str(e)[:80]}')
        fail += 1
    time.sleep(0.5)

out = os.path.join(os.path.dirname(ROOT), '_qc', 'update-eastern-results.json')
json.dump(report, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print()
print(f'=== 完成: {ok} 更新, {skip} 跳过(无中文), {fail} 失败 ===')
print('报告:', out)
