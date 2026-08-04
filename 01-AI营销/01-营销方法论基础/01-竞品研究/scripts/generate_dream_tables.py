#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dream 3 表全量整理脚本（RLM §3.1 + 1B 手册）。

修复之前 agent 只整理前 1000 行、列残留、auntyflo 后段 49000 行灵性金矿丢失、
以及 Semrush 原始导出"两种列模板拼接"导致的列错位（前 ~1100 行标准 12 列对齐，
之后整批右移 2 列：Number of Results / Traffic Cost 残留字段把 URL 推到 col6）。

核心能力：
  - URL 锚点动态行解析：扫描每行找 http(s):// 开头的单元格定位 URL，左侧固定
    [Keyword, Vol, KD, CPC]，右侧按 Intents 关键词扫出 Intent，其余数字按位
    推断 Traffic / Traffic% / Number of Results（决策只依赖 KD/Vol/KW/URL/Intent，
    这些字段位置稳定；Traffic 仅用于排序）。
  - Dream 专属行筛选规则（品牌词/床垫寝具噪音/影视游戏噪音 Delete；解梦核心 +
    灵性宗教 + 低 KD 长尾 Keep；高 KD 低量 Review）。
  - 默认保留 7 竞品 RAW sheet 原始 SEMrush 导出；只重建 CLEAN 表。
  - 重建 CLEAN_TopKeywords_All / CLEAN_TopPages_All / CLEAN_TopOpportunity。

复用自 generate_all_tables.py：认证、opener（代理）、token 刷新、normalize_url、
to_number、write_data 分批写、list/create/delete worksheet。

用法：
  python generate_dream_tables.py --keywords          # 只整理 Top Keywords 表
  python generate_dream_tables.py --pages             # 只整理 Top Pages 表
  python generate_dream_tables.py --both              # 两者都整理（默认）
  python generate_dream_tables.py --only sleepfy.ai   # 只处理指定竞品（小批量验证）
  python generate_dream_tables.py --dry-run           # 只解析不写回
  python generate_dream_tables.py --rewrite-raw       # 显式标准化回写 RAW tab（默认禁用）
"""

import io
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

# Windows 控制台 UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# ---------------------------------------------------------------------------
# Config — 认证 / 代理（复用 generate_all_tables.py）
# ---------------------------------------------------------------------------
TOKEN_FILE = r'C:\Users\Dylan\.google_workspace_mcp\credentials\lzn184205909@gmail.com.json'
PROXY = 'http://127.0.0.1:10808'

# Dream 3 表 spreadsheet IDs
DREAM_KW_SS = '1ThE4yaE5m5s8GhnZvJKc4XY4j6Sk4eWsK9yQecOEJf4'
DREAM_TP_SS = '15Kcbd0uZVSreqBT8rwfV-yloOjQsjPKYnZKTy1HXl8Y'

# 标准列（RLM §3.1 第 64-72 行）
KW_HEADER = [
    'Keyword', 'Search Volume', 'Keyword Difficulty', 'CPC', 'URL',
    'Traffic', 'Traffic(%)', 'Number of Results', 'Keyword Intents',
    'Suggested Action', 'Reason',
]
TP_HEADER = [
    'URL', 'Traffic(%)', 'Traffic', 'Top Keyword', 'Primary Intent',
    'LLM Prompts', 'Suggested Action', 'Reason',
]

# 7 个竞品原始 sheet（按数据量从小到大，方便小批量验证先跑小的）
COMPETITORS = [
    'sleepfy.ai',
    'dreambible.com',
    'dreammoods.com',
    'dreaminterpreter.ai',
    'dreamdictionary.org',
    'auntyflo.com',
    'casper.com',
]

# 不参与读取/汇总的 sheet
EXCLUDED_KW_SHEETS = {
    'Top keywords', 'CLEAN_TopKeywords_All', 'CLEAN_TopOpportunity',
    'CLEAN_DreamOpportunity', 'CLEAN_CrossVerticalOpportunity',
    'Competitor-Sheet-Map', 'Topic-Discovery', 'Keyword-Page-Proof',
    'README', 'README_Data_Source', '字段说明',
}
EXCLUDED_TP_SHEETS = {
    'CLEAN_TopPages_All', 'CLEAN_URL模式分析', 'Competitor-Sheet-Map',
    'README', 'README_Data_Source', '字段说明',
}

# ---------------------------------------------------------------------------
# Dream 专属筛选规则
# ---------------------------------------------------------------------------

# 品牌导航词（含常见拼错）→ Delete / brand_nav
# 注意：dream dictionary / dream interpreter / dream bible 等是通用解梦词，
# 不删（它们是内容选题核心长尾）。只删真正的品牌专名 + casper 床垫产品词。
BRAND_PATTERNS = re.compile(
    r'\b(dream\s*moods?|dreammoods?|aunty\s*flo|auntyflo|sleepfy|'
    r'dreammeani?ngs?\.com|dreambible|dream\s*bible\.com|'
    r'casper\s*mattress|casper\s*bed|caspar\s*mattress|casper\.com|'
    r'kaspar\s*mattress)\b',
    re.IGNORECASE,
)

# 床垫 / 寝具 / 床尺寸噪音（casper 主体，与解梦无关）→ Delete / mattress_bedding_noise
# 注意：bed bug dream / dream about bed 等是 dream symbol，通过 dream_context
# 豁免保护（见 classify_kw 的 not dream_ctx 判断）。本规则只匹配寝具产品/尺寸词。
# 2026-07-08 M2 修订：扩充词表覆盖 casper 全部寝具/尺寸/床家具噪音，把 casper Keep
# 从 19068 降到 <500（仅留真 dream/sleep spiritual 词）。
MATTRESS_PATTERNS = re.compile(
    r'\b(mattress|mattresses|matress|matresses|'
    # 寝具
    r'pillow|pillows|pillowcase|pillowcases|pillow sham|'
    r'sheet|sheets|fitted\s*sheet|flat\s*sheet|top\s*sheet|'
    r'blanket|blankets|throw\s*blanket|weighted\s*blanket|'
    r'duvet|duvets|comforter|comforters|quilt|quilts|'
    r'bedding|bedskirts?|bed\s*skirt|bed\s*pad|bed\s*topper|'
    r'thread\s*count|microfiber|linens?|'
    # 床垫构造/材质
    r'memory\s*foam|latex\s*mattress|hybrid\s*mattress|innerspring|'
    r'wave\s*hybrid|snow\s*technology|mattress\s*(pad|topper)|'
    # 床尺寸/类型
    r'bed\s*size|bed\s*sizes|bed\s*dimensions|bed\s*measurements|'
    r'bed\s*chart|sizes?\s*chart|sizes?\s*in\s*(inches|order|cm)|'
    r'queen\s*(size|bed|mattress)|king\s*(size|bed|mattress)|'
    r'twin\s*(size|bed|xl|vs)|full\s*(size|bed)|double\s*(bed|size)|'
    r'california\s*king|split\s*(queen|king)|'
    r'crib|bunk\s*bed|daybed|ottoman\s*bed|trundle|'
    r'twin\s*vs\s*full|full\s*vs\s*queen|queen\s*vs\s*king|king\s*vs\s*california|'
    # 床家具/配件
    r'bed\s*frame|bed\s*base|bed\s*slats|headboard|footboard|'
    r'box\s*spring|foundation|'
    # 床/家具泛指（非 dream_ctx 下视为家具噪音：dog bed/pet bed/beds 等）
    r'\bbeds?\b|pet\s*bed|dog\s*bed|cat\s*bed|squeaky\s*bed|'
    # casper 品牌产品/商业词
    r'casper\s*(mattress|bed|beds|sheets?|pillow|pillows|bedding|store|stores?|'
    r'promo|coupon|discount|near\s*me|hiring|careers?|reviews?|vs|'
    r'hybrid|wave|snow|nova|element|original|'
    r'matress|matresses|sleep)|casper\.com|caspar\s*mattress|kaspar\s*mattress|'
    # 床垫清洁/除味/污渍
    r'mattress\s*(deodoriz|stain|clean|cleaner|protector|cover|bag)|'
    r'baking\s*soda\s*mattress|pee\s*(on|out\s*of)\s*(mattress|bed)|'
    r'blood\s*(on|out\s*of)\s*(sheets?|mattress)|vomit\s*(on|out\s*of)|'
    r'bed\s*bug\s*(exterminator|bite|bites|treatment|spray|trap|mattress|'
    r'mattress\s*cover|killer|infestation)|'
    # 睡眠产品/姿势/生理（非 dream_ctx）：sleep aid/positions/better sleep
    r'sleeping\s*(positions?|pills?|aid|bag|mat|pads?)|'
    r'how\s*to\s*(sleep|fall\s*asleep|get\s*to\s*sleep|sleep\s*better|'
    r'sleep\s*faster|sleep\s*with|stop\s*snoring|stop\s*sweating|stop\s*dreaming)|'
    r'why\s*(do|can|cant|cannot|does|is)\s*(i|you|we|my)\s*(sleep|dream|sweat|snore)|'
    r'best\s*(sleep|mattress|pillow|blanket|bed)|sleep\s*aids?|melatonin|'
    r'snoring|sleep\s*apnea|insomnia|restless\s*leg|'
    r'swimmers?\s*ear|ear\s*infection|back\s*pain|'
    # 睡眠产品/配件（非 dream_ctx）：sleep mask / night light / glow / silk / percale 等
    r'sleep\s*mask|night\s*light|casper\s*glow|glow\s*light|'
    r'eye\s*mask|blackout\s*curtain|weighted\s*eye\s*mask|'
    r'mulberry\s*silk|silk\s*pillowcase|flannel|percale|sateen|matelasse|'
    r'tencel?|bamboo\s*sheets?|egyptian\s*cotton|linen\s*sheets?|'
    r'loungewear|pajamas?|pyjamas?|nightgown|robe|slippers?|'
    # 家具/卧室装饰/家具尺寸
    r'furniture|bedroom|nightstand|dresser|wardrobe|armoire|chest\s*of\s*drawers|'
    r'rooms?\s*(to\s*go|bigger|smaller|go\s*furniture)|matrice\s*sizes?|'
    # 杂项 casper 商业/导航词
    r'casper\s*(com|inc|the\s*casper|showroom|light|adjustable|coupons?|'
    r'offer\s*code|outlet|warehouse)|capser|caspar\b|'
    # 床垫/寝具度量
    r'dimensions\s*of\s*a|measurements\s*of\s*a|how\s*(big|much\s*bigger|long|wide)\s*is\s*a|'
    r'whats?\s*a\s*sham|what\s*is\s*(microfiber|a\s*sham|mulberry\s*silk|percale)|'
    # 产品对比/选购（泛用词，仅在 casper 竞品下作为电商对比噪音删除，
    # 避免误伤其他竞品的 dream symbol 对比查询；见 classify_kw 的 casper 专属块）
    r'best\s*(mattress|pillow|blanket|bed|sleep)|'
    r'best\s*\d+\s*(mattress|pillow|bed)|'
    r'top\s*\d+\s*(mattress|pillow|bed)|'
    r'(mattress|pillow|bed)\s*reviews?|price|prices|cost|costs)\b',
    re.IGNORECASE,
)

# casper 专属电商噪音（产品对比/选购查询，casper 是床垫电商这些词与解梦无关；
# 但 vs/difference 在其他竞品可能是 "dream moods vs dream bible" 这类正当查询，
# 所以单独隔离，只在 competitor == casper.com 时应用）。
CASPER_ECOM_PATTERNS = re.compile(
    r'\b(vs|versus|difference\s*between|compare|comparison|better|'
    r'alternative|alternatives|cheaper|cheap|worth\s*it|'
    r'promo\s*code|coupon|discount|sale|black\s*friday|cyber\s*monday|'
    r'warranty|return\s*policy|shipping|free\s*shipping|'
    r'near\s*me|store\s*near|locations?|hours|'
    r'hiring|careers?|jobs?|customer\s*service|phone\s*number|'
    r'gift\s*card|financing|affirm|klarna|afterpay|'
    r'best\s*\d+|top\s*\d+|reviews?|review|rating)\b',
    re.IGNORECASE,
)

# 影视 / 游戏 / 商业噪音 → Delete / pop_culture_noise
# 注意：movie theater / celebrity / film 等 dream symbol 是正当解梦长尾，
# 通过 dream_context 豁免逻辑保护（见 classify_kw）。本规则只匹配明确指向
# 商业IP/娱乐消费的词，且对含 dream/dreaming/symbol/meaning/dictionary 的
# 词不生效（它们是"梦到X"的解梦查询）。
POPCULTURE_PATTERNS = re.compile(
    r'\b(american\s*dream\s+(mall|movie|film|tv|show|series|song|cast|'
    r'soundtrack|netflix|teams?|diner|store|casino)|barbie\s+dream\s+'
    r'(house|party|camp)|wnba|nba\s+(youngboy|finals|scores?|draft)|nfl|'
    r'watch\s+(movies?|the\s+movie)|download\s+movie|movie\s+(trailer|'
    r'review|release|cast|director|tickets?|theater\s+near)|'
    r'netflix|hulu|hbo\s+(max|go)|season\s+\d\s+episode|video\s*game|'
    r'gaming|fortnite|roblox|pokemon|minecraft|'
    r'america.{0,5}got.{0,5}talent|tik\s*tok|youtube|instagram|'
    r'amazon|etsy|ebay|walmart|target\.com|aliexpress|alibaba)\b',
    re.IGNORECASE,
)

# 灵性 / 宗教高价值词 → Keep / spiritual_religious_priority
SPIRITUAL_PATTERNS = re.compile(
    r'\b(biblical|bible|islam|islamic|muslim|quran|qur.?an|prophetic|'
    r'spiritual(\s*meaning)?|spirituality|angel\s*number|angel\s*numbers?|'
    r'archangel|numerology|soul|mystic|mystical|divine|prophecy|prophet|'
    r'chakra|aura|karma|reincarnation|afterlife|omen|omens|'
    r'tarot|zodiac|horoscope|astrology|astrological|'
    r'consciousness|meditation|manifest|manifestation|'
    r'sacred|prayer|faith|god|jesus|christ|christian|holy)\b',
    re.IGNORECASE,
)

# 解梦核心词 → Keep / dream_topic_core
DREAM_CORE_PATTERNS = re.compile(
    r'\b(dream|dreams|dreaming|dreamt|dream.{0,3}mean|dream.{0,3}interp|'
    r'dream\s*dictionary|dream\s*symbol|nightmare|nightmares|'
    r'lucid\s*dream|recurring\s*dream)\b',
    re.IGNORECASE,
)

INTENT_KEYWORDS = {
    'informational', 'commercial', 'transactional', 'navigational',
}


# ---------------------------------------------------------------------------
# Auth / HTTP（复用 generate_all_tables.py）
# ---------------------------------------------------------------------------

def get_opener():
    proxy = urllib.request.ProxyHandler({'https': PROXY, 'http': PROXY})
    return urllib.request.build_opener(proxy)


def get_token(opener):
    with open(TOKEN_FILE, 'r', encoding='utf-8') as f:
        c = json.load(f)
    if c.get('refresh_token'):
        body = urllib.parse.urlencode({
            'client_id': c['client_id'],
            'client_secret': c['client_secret'],
            'refresh_token': c['refresh_token'],
            'grant_type': 'refresh_token',
        }).encode('utf-8')
        req = urllib.request.Request(
            c.get('token_uri', 'https://oauth2.googleapis.com/token'),
            data=body,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
        )
        resp = opener.open(req, timeout=30)
        c['token'] = json.loads(resp.read().decode())['access_token']
    return c['token']


def api_request(opener, url, token, method='GET', data=None, retries=3):
    """带重试的 API 调用（应对 429/5xx 瞬时错误）。"""
    body = json.dumps(data).encode('utf-8') if data is not None else None
    last_err = None
    for attempt in range(retries):
        req = urllib.request.Request(
            url,
            data=body,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json',
            },
            method=method,
        )
        try:
            resp = opener.open(req, timeout=90)
            return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code in (429, 500, 502, 503):
                wait = 5 * (attempt + 1)
                print(f'    [retry {attempt+1}/{retries}] HTTP {e.code}, wait {wait}s')
                time.sleep(wait)
                continue
            raise
        except Exception as e:
            last_err = e
            wait = 3 * (attempt + 1)
            print(f'    [retry {attempt+1}/{retries}] {e}, wait {wait}s')
            time.sleep(wait)
    raise RuntimeError(f'API failed after {retries} retries: {last_err}')


def api_get(opener, url, token):
    return api_request(opener, url, token, 'GET')


def api_put(opener, url, token, data):
    return api_request(opener, url, token, 'PUT', data)


def api_post(opener, url, token, data):
    return api_request(opener, url, token, 'POST', data)


# ---------------------------------------------------------------------------
# Sheet 操作（复用 generate_all_tables.py）
# ---------------------------------------------------------------------------

def list_worksheets(opener, spreadsheet_id, token):
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}'
           f'?fields=sheets.properties(title,sheetId,gridProperties(rowCount,columnCount))')
    data = api_get(opener, url, token)
    out = []
    for s in data['sheets']:
        p = s['properties']
        g = p.get('gridProperties', {})
        out.append((p['title'], p['sheetId'], g.get('rowCount', 0), g.get('columnCount', 0)))
    return out


def read_all_values(opener, spreadsheet_id, sheet_title, token):
    """读整张 sheet（A1:ZZ），返回 list[list[str]]。"""
    enc = urllib.request.quote(sheet_title, safe='')
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}'
           f'/values/{enc}!A1:ZZ1000000')
    return api_get(opener, url, token).get('values', [])


def delete_worksheet(opener, spreadsheet_id, sheet_id, token):
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}:batchUpdate'
    return api_post(opener, url, token, {'requests': [{'deleteSheet': {'sheetId': sheet_id}}]})


def create_worksheet(opener, spreadsheet_id, title, token):
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}:batchUpdate'
    result = api_post(opener, url, token, {
        'requests': [{'addSheet': {'properties': {'title': title}}}]
    })
    return result['replies'][0]['addSheet']['properties']['sheetId']


def clear_sheet(opener, spreadsheet_id, sheet_title, token):
    """清空 sheet 内容（保留 sheet 本身）。写前调用，避免旧残留。"""
    enc = urllib.request.quote(sheet_title, safe='')
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}'
           f'/values/{enc}:clear')
    return api_post(opener, url, token, {})


def write_values(opener, spreadsheet_id, sheet_title, values, token, keep_cols=None):
    """写数据。先 clear 整张 sheet，再 PUT 全量到 A1（分批 append），
    最后收缩 grid 删除尾部残留空行 + 多余列（append 会留下旧行尾/列尾）。

    values: list[list[str]]，含表头行。
    keep_cols: 目标列数（KW=11, TP=8）。若提供且 grid 宽于此值，收缩列。
    """
    enc = urllib.request.quote(sheet_title, safe='')
    total = len(values)

    # 先 clear，避免行长度不一致时残留旧数据
    try:
        clear_sheet(opener, spreadsheet_id, sheet_title, token)
    except Exception as e:
        print(f'    [warn] clear failed: {e}')

    first_batch = min(total, 5000)
    url = (f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}'
           f'/values/{enc}!A1?valueInputOption=RAW')
    api_put(opener, url, token, {'values': values[:first_batch]})
    print(f'    written rows 1-{first_batch}/{total}')

    append_size = 3000
    written = first_batch
    remaining = values[first_batch:]
    for i in range(0, len(remaining), append_size):
        chunk = remaining[i:i + append_size]
        append_url = (
            f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}'
            f'/values/{enc}%21A%3AA:append?valueInputOption=RAW&insertDataOption=OVERWRITE'
        )
        api_post(opener, append_url, token, {'values': chunk})
        s = written + i + 1
        e = written + i + len(chunk)
        print(f'    written rows {s}-{e}/{total}')
        written = e

    # 收缩 grid：删除尾部多余行 + 多余列
    trim_grid(opener, spreadsheet_id, sheet_title, total, keep_cols, token)


def trim_grid(opener, spreadsheet_id, sheet_title, keep_rows, keep_cols, token):
    """收缩 sheet grid 到 (keep_rows, keep_cols)，删除多余行列。"""
    sheets = list_worksheets(opener, spreadsheet_id, token)
    sheet_id = None
    grid_rows = None
    grid_cols = None
    for title, sid, rc, cc in sheets:
        if title == sheet_title:
            sheet_id = sid
            grid_rows = rc
            grid_cols = cc
            break
    if sheet_id is None:
        return

    requests = []
    if grid_rows and grid_rows > keep_rows:
        requests.append({
            'deleteDimension': {
                'range': {
                    'sheetId': sheet_id,
                    'dimension': 'ROWS',
                    'startIndex': keep_rows,
                    'endIndex': grid_rows,
                }
            }
        })
    if keep_cols and grid_cols and grid_cols > keep_cols:
        requests.append({
            'deleteDimension': {
                'range': {
                    'sheetId': sheet_id,
                    'dimension': 'COLUMNS',
                    'startIndex': keep_cols,
                    'endIndex': grid_cols,
                }
            }
        })

    if not requests:
        return
    url = f'https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}:batchUpdate'
    try:
        api_post(opener, url, token, {'requests': requests})
        msg = []
        if grid_rows and grid_rows > keep_rows:
            msg.append(f'rows {grid_rows}->{keep_rows}')
        if keep_cols and grid_cols and grid_cols > keep_cols:
            msg.append(f'cols {grid_cols}->{keep_cols}')
        print(f'    trimmed grid: {", ".join(msg)}')
    except Exception as e:
        print(f'    [warn] trim failed: {e}')


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def normalize_url(url):
    if not url:
        return ''
    u = str(url).lower().strip()
    u = re.sub(r'^https?://', '', u)
    u = re.sub(r'^www\.', '', u)
    u = u.split('?')[0].split('#')[0].rstrip('/')
    return u


def to_number(value):
    if value is None:
        return 0.0
    t = str(value).strip().replace(',', '').replace('%', '').replace('$', '')
    if not t:
        return 0.0
    try:
        return float(t)
    except ValueError:
        return 0.0


def find_url_index(row):
    """返回行中第一个 http(s):// 单元格的索引，找不到返回 -1。"""
    for i, c in enumerate(row):
        s = str(c).lower()
        if s.startswith('http://') or s.startswith('https://'):
            return i
    return -1


def extract_intent(row, url_idx):
    """从行中扫出 Intent（informational/commercial/...）。"""
    for c in row[url_idx + 1:]:
        s = str(c).strip().lower()
        if s in INTENT_KEYWORDS:
            return s
    # 也扫 URL 之前（部分错位行 intent 在前）
    for c in row[:url_idx]:
        s = str(c).strip().lower()
        if s in INTENT_KEYWORDS:
            return s
    return ''


def extract_numbers_after_url(row, url_idx):
    """URL 右侧的数字单元格，按出现顺序返回。

    错位行结构通常是 [URL, Traffic, Traffic%, Number_of_Results 或其他]。
    由于 Semrush 两种模板混排，这里只返回数字序列，由调用方按业务约定赋值。
    本项目决策不依赖 Traffic/Results 的精确值（只用于排序），因此采用
    保守映射：第一个非 0 数当 Traffic，第二个当 Traffic%，第三个当 Number of Results。
    """
    nums = []
    for c in row[url_idx + 1:]:
        s = str(c).strip()
        if re.fullmatch(r'-?\d+(\.\d+)?', s):
            nums.append(s)
    return nums


# ---------------------------------------------------------------------------
# 行解析：把任意列错位的原始行标准化为 11 列 KW 行
# ---------------------------------------------------------------------------

def parse_kw_row(row):
    """返回 dict 或 None（无法解析）。

    标准映射：
      Keyword / Search Volume / Keyword Difficulty / CPC / URL / Traffic /
      Traffic(%) / Number of Results / Keyword Intents
    （Suggested Action / Reason 由 classify() 后续填充）
    """
    if not row or not str(row[0]).strip():
        return None

    url_idx = find_url_index(row)

    if url_idx == 4:
        # 标准对齐行：[KW, Vol, KD, CPC, URL, Traffic, Traffic%, Results, ...]
        kw = str(row[0]).strip()
        vol = str(row[1]).strip() if len(row) > 1 else ''
        kd = str(row[2]).strip() if len(row) > 2 else ''
        cpc = str(row[3]).strip() if len(row) > 3 else ''
        url = str(row[4]).strip()
        traffic = str(row[5]).strip() if len(row) > 5 else ''
        traffic_pct = str(row[6]).strip() if len(row) > 6 else ''
        results = str(row[7]).strip() if len(row) > 7 else ''
        intent = ''
        for c in row[8:]:
            s = str(c).strip().lower()
            if s in INTENT_KEYWORDS:
                intent = s
                break
        return {
            'Keyword': kw, 'Search Volume': vol, 'Keyword Difficulty': kd,
            'CPC': cpc, 'URL': url, 'Traffic': traffic, 'Traffic(%)': traffic_pct,
            'Number of Results': results, 'Keyword Intents': intent,
        }

    if url_idx >= 6:
        # 错位行：[KW, Vol, KD, CPC, Results残, TrafficCost残, URL, ...]
        kw = str(row[0]).strip()
        vol = str(row[1]).strip() if len(row) > 1 else ''
        kd = str(row[2]).strip() if len(row) > 2 else ''
        cpc = str(row[3]).strip() if len(row) > 3 else ''
        url = str(row[url_idx]).strip()
        intent = extract_intent(row, url_idx)
        nums = extract_numbers_after_url(row, url_idx)
        # 错位行 URL 右侧通常是 [Traffic, Traffic%, Results, ...]
        traffic = nums[0] if len(nums) > 0 else ''
        traffic_pct = nums[1] if len(nums) > 1 else ''
        results = nums[2] if len(nums) > 2 else ''
        return {
            'Keyword': kw, 'Search Volume': vol, 'Keyword Difficulty': kd,
            'CPC': cpc, 'URL': url, 'Traffic': traffic, 'Traffic(%)': traffic_pct,
            'Number of Results': results, 'Keyword Intents': intent,
        }

    # URL 找不到但行有内容：可能整行是碎片，保留 Keyword 其余留空
    kw = str(row[0]).strip()
    if not kw:
        return None
    return {
        'Keyword': kw, 'Search Volume': '', 'Keyword Difficulty': '', 'CPC': '',
        'URL': '', 'Traffic': '', 'Traffic(%)': '', 'Number of Results': '',
        'Keyword Intents': '',
    }


# ---------------------------------------------------------------------------
# 行分类（1B 手册步骤 1+3：结构性噪音 + 语义筛选）
# ---------------------------------------------------------------------------

def is_dream_context(kw):
    """关键词是否处于"解梦上下文"——含 dream/dreaming/dreamt/symbol/meaning 等。

    解梦上下文的词即使表面含 movie/bed bug/celebrity 等，也是正当 dream symbol
    查询（梦到电影院/臭虫/名人），不适用 popculture/mattress 噪音删除规则。
    """
    kw_l = kw.lower()
    return bool(re.search(
        r'\b(dream|dreams|dreaming|dreamt|nightmare|symbol|meaning|'
        r'dictionary|interpret)\b', kw_l
    ))


def classify_kw(rec, competitor):
    """返回 (suggested_action, reason)。规则按优先级：Delete 规则先判。

    dream_context 豁免：含 dream/symbol/meaning 等的词跳过 popculture/mattress
    噪音删除（因为"梦到电影/臭虫/名人"是正当 dream symbol 查询）。
    但少数明确的商业 IP（american dream mall / barbie dream house）即使在
    dream context 也强制删除。
    """
    kw = rec.get('Keyword', '')
    kw_l = kw.lower()
    kd = to_number(rec.get('Keyword Difficulty'))
    vol = to_number(rec.get('Search Volume'))
    has_url = bool(rec.get('URL', '').strip())
    dream_ctx = is_dream_context(kw)

    # casper "Dream" 系列产品名特判：casper dream mattress / casper dream max queen
    # plush hybrid 等含 "dream" 但同时含 casper 产品型号词（mattress/queen/king/
    # plush/medium/hybrid/max/firm/ultra），是产品噪音不是 dream symbol，强制 Delete。
    # 即使含 dream 也删除（覆盖 dream_ctx 豁免）。
    if competitor == 'casper.com':
        if re.search(r'\b(casper\s+)?dream\s+(max|medium|plush|firm|hybrid|ultra)\b', kw_l) and \
           re.search(r'\b(mattress|queen|king|twin|full|plush|medium|hybrid|firm|ultra)\b', kw_l):
            return 'Delete', 'casper_dream_product_line'
        if re.search(r'\bcasper\s+dream\b', kw_l) and \
           re.search(r'\b(mattress|queen|king|twin|full|mattresses|plush|medium|hybrid)\b', kw_l):
            return 'Delete', 'casper_dream_product_line'

    # --- Delete 规则（最高优先级，dream_context 不豁免）---
    if BRAND_PATTERNS.search(kw):
        return 'Delete', 'brand_nav'
    # 硬删除：明确商业 IP（即使在 dream context）
    if re.search(r'\b(american\s*dream\s+(mall|casino|store|teams?)|'
                 r'barbie\s+dream\s+(house|party|camp|plane|closet))\b', kw_l):
        return 'Delete', 'commercial_ip'
    # popculture / mattress 噪音：dream_context 豁免
    if not dream_ctx and POPCULTURE_PATTERNS.search(kw):
        return 'Delete', 'pop_culture_noise'
    if not dream_ctx and MATTRESS_PATTERNS.search(kw):
        return 'Delete', 'mattress_bedding_noise'

    # casper 专属电商噪音（vs/best N/reviews/promo code 等产品对比选购词；
    # dream_context 豁免同样生效，保护 "dream moods vs dream bible" 类查询）。
    if competitor == 'casper.com' and not dream_ctx and CASPER_ECOM_PATTERNS.search(kw):
        return 'Delete', 'casper_ecommerce_noise'

    # 无 URL 或无 Vol 的碎片行 → Delete
    if not has_url and vol == 0 and kd == 0:
        return 'Delete', 'fragment_no_data'

    # --- Keep 规则（高价值优先）---
    if SPIRITUAL_PATTERNS.search(kw):
        return 'Keep', 'spiritual_religious_priority'
    if DREAM_CORE_PATTERNS.search(kw) and has_url:
        return 'Keep', 'dream_topic_core'

    # casper 白名单收紧（M2 核心）：casper 是床垫电商，非 dream_ctx 且未命中
    # spiritual/dream_core 的低 KD 词几乎都是寝具产品词（best pillow 等已在前删，
    # 残留的 sleep/dog/furniture 泛词不应进机会池）。对 casper，低 KD 长尾的
    # 默认 Keep 改为 Delete，把 CLEAN_TopOpportunity 的 casper 占比从 49% 降到 <3%。
    if competitor == 'casper.com':
        return 'Delete', 'casper_non_dream_filter'

    # 低 KD 长尾（KD<40 且有 URL）→ Keep（其他 5 家竞品保留默认逻辑）
    if 0 < kd < 40 and has_url:
        return 'Keep', 'low_kd_long_tail'

    # --- Review 规则 ---
    if kd > 80 and vol < 500:
        return 'Review', 'high_kd_low_volume'
    if not has_url:
        return 'Review', 'no_url'

    # 默认 Keep（有 URL 有数据，未命中删除规则的解梦相关词）
    return 'Keep', 'default_keep'


# ---------------------------------------------------------------------------
# Top Keywords 处理
# ---------------------------------------------------------------------------

def process_competitor_kw(opener, spreadsheet_id, sheet_title, token, dry_run=False, rewrite_raw=False):
    """读单个竞品 KW sheet 全量 → 解析 → 分类 → 回写标准 11 列。

    返回 (data_row_count, kept, deleted, reviewed, parsed_records)。
    """
    print(f'\n  --- {sheet_title} ---')
    raw = read_all_values(opener, spreadsheet_id, sheet_title, token)
    if len(raw) <= 1:
        print(f'    empty, skip')
        return 0, 0, 0, 0, []

    data_rows = raw[1:]  # 跳表头
    out_rows = [KW_HEADER[:]]  # 新表头
    records = []
    kept = deleted = reviewed = parse_fail = 0
    raw_records = []
    raw_rows = [KW_HEADER[:]]  # 含表头，先收集再去重

    for row in data_rows:
        if not row or not str(row[0]).strip():
            continue
        rec = parse_kw_row(row)
        if rec is None:
            parse_fail += 1
            continue
        action, reason = classify_kw(rec, sheet_title)
        rec['Suggested Action'] = action
        rec['Reason'] = reason
        raw_records.append(rec)
        raw_rows.append([rec.get(h, '') for h in KW_HEADER])

    # M3 (2026-07-08)：同竞品内连续重复 Keyword 行去重（Semrush 导出末段常有
    # row 49998-49999 重复同一个 KW）。保留首次出现，删除后续连续重复。
    out_rows = [KW_HEADER[:]]
    records = []
    prev_kw = None
    dedup_removed = 0
    for i, out_row in enumerate(raw_rows[1:]):
        kw_norm = re.sub(r'\s+', ' ', str(out_row[0]).lower().strip())
        if kw_norm and kw_norm == prev_kw:
            dedup_removed += 1
            continue
        prev_kw = kw_norm
        out_rows.append(out_row)
        rec = raw_records[i]
        records.append(rec)
        action = rec['Suggested Action']
        if action == 'Keep':
            kept += 1
        elif action == 'Delete':
            deleted += 1
        else:
            reviewed += 1
    if dedup_removed > 0:
        print(f'    [dedup] removed {dedup_removed} consecutive duplicate rows')

    print(f'    data_rows={len(data_rows)} parsed={len(records)} parse_fail={parse_fail}')
    print(f'    Keep={kept} Delete={deleted} Review={reviewed}')

    if not dry_run and rewrite_raw and len(out_rows) > 1:
        write_values(opener, spreadsheet_id, sheet_title, out_rows, token, keep_cols=len(KW_HEADER))
        print(f'    [written] {len(out_rows)-1} data rows, {len(KW_HEADER)} cols')
    elif not dry_run:
        print('    [raw preserved] use --rewrite-raw to standardize source tab')

    return len(records), kept, deleted, reviewed, records


# ---------------------------------------------------------------------------
# Top Pages 处理（已标准 8 列，只需重判 Suggested Action / Reason）
# ---------------------------------------------------------------------------

def classify_tp(row, competitor):
    """Top Pages 行分类。row 已是标准 8 列对齐。"""
    url = row[0] if len(row) > 0 else ''
    top_kw = row[3] if len(row) > 3 else ''
    intent = row[4] if len(row) > 4 else ''
    traffic_pct = to_number(row[1]) if len(row) > 1 else 0
    kw_l = str(top_kw).lower()
    url_l = str(url).lower()

    # casper /pages/ 非解梦页 → Review
    if 'casper' in competitor and '/dream' not in url_l and '/sleep' not in url_l:
        if MATTRESS_PATTERNS.search(top_kw) or 'mattress' in url_l or 'bed' in url_l:
            return 'Review', 'casper_mattress_page'

    if SPIRITUAL_PATTERNS.search(top_kw) or 'spiritual' in url_l:
        return 'Keep', 'spiritual_page'
    if DREAM_CORE_PATTERNS.search(top_kw) or 'dream' in url_l:
        return 'Keep', 'dream_content_page'
    if traffic_pct >= 0.5:
        return 'Keep', 'traffic_page'
    return 'Review', 'low_traffic_review'


def process_competitor_tp(opener, spreadsheet_id, sheet_title, token, dry_run=False, rewrite_raw=False):
    """读 TP sheet → 重判 Action/Reason → 回写标准 8 列。"""
    print(f'\n  --- {sheet_title} ---')
    raw = read_all_values(opener, spreadsheet_id, sheet_title, token)
    if len(raw) <= 1:
        print(f'    empty, skip')
        return 0, []

    header = raw[0]
    data_rows = raw[1:]
    out_rows = [TP_HEADER[:]]
    records = []

    # 原 header 可能就是标准 8 列（含 Suggested Action/Reason），或只有 6 列
    # 统一映射：按列名取值
    h_idx = {name: i for i, name in enumerate(header)}

    for row in data_rows:
        if not row or not str(row[0]).strip():
            continue
        # 补齐到至少 6 列
        padded = list(row) + [''] * max(0, 6 - len(row))

        def col(name, default=''):
            i = h_idx.get(name)
            return padded[i] if i is not None and i < len(padded) else default

        url = col('URL', padded[0])
        traffic_pct = col('Traffic(%)', padded[1] if len(padded) > 1 else '')
        traffic = col('Traffic', padded[2] if len(padded) > 2 else '')
        top_kw = col('Top Keyword', padded[3] if len(padded) > 3 else '')
        intent = col('Primary Intent', col('Intent', padded[4] if len(padded) > 4 else ''))
        llm = col('LLM Prompts', padded[5] if len(padded) > 5 else '')

        action, reason = classify_tp([url, traffic_pct, traffic, top_kw, intent, llm], sheet_title)

        new_row = [url, traffic_pct, traffic, top_kw, intent, llm, action, reason]
        out_rows.append(new_row)
        records.append({
            'URL': url, 'Traffic(%)': traffic_pct, 'Traffic': traffic,
            'Top Keyword': top_kw, 'Primary Intent': intent, 'LLM Prompts': llm,
            'Suggested Action': action, 'Reason': reason, '_source': sheet_title,
        })

    print(f'    data_rows={len(data_rows)} output={len(out_rows)-1}')

    if not dry_run and rewrite_raw and len(out_rows) > 1:
        write_values(opener, spreadsheet_id, sheet_title, out_rows, token, keep_cols=len(TP_HEADER))
        print(f'    [written] {len(out_rows)-1} data rows, {len(TP_HEADER)} cols')
    elif not dry_run:
        print('    [raw preserved] use --rewrite-raw to standardize source tab')

    return len(records), records


# ---------------------------------------------------------------------------
# 汇总表
# ---------------------------------------------------------------------------

def build_clean_top_keywords_all(all_records):
    """合并 7 竞品 Keep 行，按 normalized keyword 去重（保留 KD 低/Vol 高的）。返回含表头行。"""
    by_kw = {}
    for rec in all_records:
        if rec.get('Suggested Action') != 'Keep':
            continue
        kw_norm = re.sub(r'\s+', ' ', rec['Keyword'].lower().strip())
        if not kw_norm:
            continue
        existing = by_kw.get(kw_norm)
        if existing is None:
            by_kw[kw_norm] = rec
        else:
            # 保留 KD 更低（机会更好）的；同 KD 取 Vol 高
            kd_new = to_number(rec.get('Keyword Difficulty', 999))
            kd_old = to_number(existing.get('Keyword Difficulty', 999))
            vol_new = to_number(rec.get('Search Volume', 0))
            vol_old = to_number(existing.get('Search Volume', 0))
            if kd_new < kd_old or (kd_new == kd_old and vol_new > vol_old):
                by_kw[kw_norm] = rec

    rows = [[
        'Keyword', 'Search Volume', 'KD', 'CPC', 'URL', 'Traffic', 'Traffic%',
        'Number of Results', 'Intents', 'Suggested Action', 'Reason', 'Source',
    ]]
    for rec in by_kw.values():
        rows.append([
            rec.get('Keyword', ''), rec.get('Search Volume', ''),
            rec.get('Keyword Difficulty', ''), rec.get('CPC', ''),
            rec.get('URL', ''), rec.get('Traffic', ''), rec.get('Traffic(%)', ''),
            rec.get('Number of Results', ''), rec.get('Keyword Intents', ''),
            'Keep', rec.get('Reason', ''), rec.get('_source', ''),
        ])
    # 按 Vol 降序
    rows[1:] = sorted(rows[1:], key=lambda r: -to_number(r[1]))
    return rows, len(rows) - 1


def build_clean_top_opportunity(all_records):
    """挖灵性 + 低 KD 长尾金矿（全量，不限前 1000）。"""
    cands = []
    for rec in all_records:
        if rec.get('Suggested Action') != 'Keep':
            continue
        reason = rec.get('Reason', '')
        if reason in ('spiritual_religious_priority', 'low_kd_long_tail'):
            cands.append(rec)

    # 排序：灵性优先 → Vol 降序（高量词浮头）→ KD 升序
    # M3 (2026-07-08)：原 (is_spirit, kd_asc, -vol) 让 KD=0 小词挤头部，
    # 125 条 Vol≥1000 KD<30 真高价值词埋 2000+ 行后。改 vol 主键解决。
    def sort_key(r):
        is_spirit = 0 if r.get('Reason') == 'spiritual_religious_priority' else 1
        return (is_spirit,
                -to_number(r.get('Search Volume', 0)),
                to_number(r.get('Keyword Difficulty', 999)))
    cands.sort(key=sort_key)

    rows = [[
        'Keyword', 'Search Volume', 'KD', 'CPC', 'URL', 'Traffic', 'Traffic%',
        'Number of Results', 'Intents', 'Suggested Action', 'Reason', 'Source',
    ]]
    for rec in cands:
        rows.append([
            rec.get('Keyword', ''), rec.get('Search Volume', ''),
            rec.get('Keyword Difficulty', ''), rec.get('CPC', ''),
            rec.get('URL', ''), rec.get('Traffic', ''), rec.get('Traffic(%)', ''),
            rec.get('Number of Results', ''), rec.get('Keyword Intents', ''),
            'Keep', rec.get('Reason', ''), rec.get('_source', ''),
        ])
    return rows, len(rows) - 1


def is_dream_opportunity_row(row):
    """True when an opportunity row is directly about dreams, not only adjacent spirituality."""
    kw = str(row[0]).lower() if len(row) > 0 else ''
    url = str(row[4]).lower() if len(row) > 4 else ''
    return bool(DREAM_CORE_PATTERNS.search(kw) or DREAM_CORE_PATTERNS.search(url))


def split_opportunity_rows(opportunity_rows):
    """Split total opportunity table into dream-core and cross-vertical opportunity tables."""
    header = opportunity_rows[0]
    dream_rows = [header[:]]
    cross_rows = [header[:]]
    for row in opportunity_rows[1:]:
        if is_dream_opportunity_row(row):
            dream_rows.append(row)
        else:
            cross_rows.append(row)
    return (dream_rows, len(dream_rows) - 1), (cross_rows, len(cross_rows) - 1)


def build_clean_top_pages_all(all_tp_records):
    rows = [[
        'Source', 'URL', 'Traffic(%)', 'Traffic', 'Top Keyword',
        'Primary Intent', 'LLM Prompts', 'Suggested Action', 'Reason',
    ]]
    # 只收 Keep 行
    kept = [r for r in all_tp_records if r.get('Suggested Action') == 'Keep']
    kept.sort(key=lambda r: -to_number(r.get('Traffic', 0)))
    for rec in kept:
        rows.append([
            rec.get('_source', ''), rec.get('URL', ''), rec.get('Traffic(%)', ''),
            rec.get('Traffic', ''), rec.get('Top Keyword', ''),
            rec.get('Primary Intent', ''), rec.get('LLM Prompts', ''),
            'Keep', rec.get('Reason', ''),
        ])
    return rows, len(rows) - 1


def recreate_sheet(opener, spreadsheet_id, title, token):
    """删除并重建 sheet，返回新 sheetId。"""
    sheets = list_worksheets(opener, spreadsheet_id, token)
    for t, sid, _, _ in sheets:
        if t == title:
            print(f'    delete existing {title} (id={sid})')
            delete_worksheet(opener, spreadsheet_id, sid, token)
            break
    new_id = create_worksheet(opener, spreadsheet_id, title, token)
    print(f'    created {title} (id={new_id})')
    return new_id


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    args = set(sys.argv[1:])
    if '--both' in args or ('--keywords' not in args and '--pages' not in args):
        do_kw, do_tp = True, True
    elif '--keywords' in args:
        do_kw, do_tp = True, False
    else:  # --pages
        do_kw, do_tp = False, True

    dry_run = '--dry-run' in args
    rewrite_raw = '--rewrite-raw' in args

    only = None
    if '--only' in args:
        i = sys.argv.index('--only')
        only = sys.argv[i + 1] if i + 1 < len(sys.argv) else None

    opener = get_opener()
    token = get_token(opener)

    targets = [c for c in COMPETITORS if only is None or c == only]

    print('=' * 70)
    print(f'Dream 全量整理  |  do_kw={do_kw} do_tp={do_tp}  dry_run={dry_run} rewrite_raw={rewrite_raw}')
    print(f'targets: {targets}')
    print('=' * 70)

    all_kw_records = []
    all_tp_records = []
    kw_stats = {}
    tp_stats = {}

    if do_kw:
        print('\n########## TOP KEYWORDS ##########')
        for comp in targets:
            n, kept, deleted, reviewed, recs = process_competitor_kw(
                opener, DREAM_KW_SS, comp, token, dry_run, rewrite_raw
            )
            for r in recs:
                r['_source'] = comp
            all_kw_records.extend(recs)
            kw_stats[comp] = (n, kept, deleted, reviewed)

        # 汇总表（全量数据驱动）
        if not dry_run and (only is None or len(targets) == len(COMPETITORS)):
            print('\n>>> 重建 CLEAN_TopKeywords_All')
            rows, cnt = build_clean_top_keywords_all(all_kw_records)
            recreate_sheet(opener, DREAM_KW_SS, 'CLEAN_TopKeywords_All', token)
            write_values(opener, DREAM_KW_SS, 'CLEAN_TopKeywords_All', rows, token, keep_cols=12)
            print(f'    CLEAN_TopKeywords_All: {cnt} rows')

            print('\n>>> 重建 CLEAN_TopOpportunity')
            rows, cnt = build_clean_top_opportunity(all_kw_records)
            recreate_sheet(opener, DREAM_KW_SS, 'CLEAN_TopOpportunity', token)
            write_values(opener, DREAM_KW_SS, 'CLEAN_TopOpportunity', rows, token, keep_cols=12)
            print(f'    CLEAN_TopOpportunity: {cnt} rows')

            (dream_rows, dream_cnt), (cross_rows, cross_cnt) = split_opportunity_rows(rows)

            print('\n>>> 重建 CLEAN_DreamOpportunity')
            recreate_sheet(opener, DREAM_KW_SS, 'CLEAN_DreamOpportunity', token)
            write_values(opener, DREAM_KW_SS, 'CLEAN_DreamOpportunity', dream_rows, token, keep_cols=12)
            print(f'    CLEAN_DreamOpportunity: {dream_cnt} rows')

            print('\n>>> 重建 CLEAN_CrossVerticalOpportunity')
            recreate_sheet(opener, DREAM_KW_SS, 'CLEAN_CrossVerticalOpportunity', token)
            write_values(opener, DREAM_KW_SS, 'CLEAN_CrossVerticalOpportunity', cross_rows, token, keep_cols=12)
            print(f'    CLEAN_CrossVerticalOpportunity: {cross_cnt} rows')

    if do_tp:
        print('\n########## TOP PAGES ##########')
        for comp in targets:
            n, recs = process_competitor_tp(
                opener, DREAM_TP_SS, comp, token, dry_run, rewrite_raw
            )
            all_tp_records.extend(recs)
            tp_stats[comp] = n

        if not dry_run and (only is None or len(targets) == len(COMPETITORS)):
            print('\n>>> 重建 CLEAN_TopPages_All')
            rows, cnt = build_clean_top_pages_all(all_tp_records)
            recreate_sheet(opener, DREAM_TP_SS, 'CLEAN_TopPages_All', token)
            write_values(opener, DREAM_TP_SS, 'CLEAN_TopPages_All', rows, token, keep_cols=9)
            print(f'    CLEAN_TopPages_All: {cnt} rows')

    # 汇总报告
    print('\n' + '=' * 70)
    print('SUMMARY')
    print('=' * 70)
    if do_kw:
        print('Top Keywords:')
        tot_n = tot_k = tot_d = tot_r = 0
        for comp, (n, k, d, r) in kw_stats.items():
            print(f'  {comp:25s} parsed={n:6d} Keep={k:6d} Delete={d:6d} Review={r:6d}')
            tot_n += n; tot_k += k; tot_d += d; tot_r += r
        print(f'  {"TOTAL":25s} parsed={tot_n:6d} Keep={tot_k:6d} Delete={tot_d:6d} Review={tot_r:6d}')
    if do_tp:
        print('Top Pages:')
        for comp, n in tp_stats.items():
            print(f'  {comp:25s} parsed={n:6d}')


if __name__ == '__main__':
    main()
