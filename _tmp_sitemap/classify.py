import re, os, json
from urllib.parse import urlparse
from collections import Counter

base = 'D:/Code/knowledge-base/_tmp_sitemap'
def extract(fn):
    with open(os.path.join(base, fn), encoding='utf-8') as f:
        return re.findall(r'<loc>([^<]+)</loc>', f.read())
def slug(url):
    return urlparse(url).path.strip('/')

# ===================== LOAD =====================
samco_post = [slug(u) for u in extract('samco_post.xml')]
samco_project = [slug(u) for u in extract('samco_project.xml') if slug(u) != 'project']
samco_page = [slug(u) for u in extract('samco_page.xml') if slug(u)]
alaqua_post = [slug(u) for u in extract('alaqua_post.xml')]
alaqua_page = [slug(u) for u in extract('alaqua_page.xml') if slug(u)]
toption_urls = []
for i in [1,2,3]:
    toption_urls.extend(extract(f'toption_{i}.xml'))
toption_slugs = [slug(u) for u in toption_urls]

# ===================== FILTER SPEC =====================
def is_product_spec(slug_full, site):
    s = slug_full.lower()
    parts = slug_full.split('/')
    p0 = parts[0] if parts else ''
    if p0 == 'showroom':
        return True
    if p0 == 'product':
        return True
    if site == 'toption':
        eq_cats = {'photochemical-reactor','short-path-molecular-distillation',
                   'freeze-dryer','rotary-evaporator','laboratory-reactor',
                   'ice-bath-series','vacuum-filter','centrifugal-extractor',
                   'supercritical-co2-extraction','spray-dryer',
                   'short-path-distillation','heater-chiller-freezer',
                   'vacuum-oven','nutsche-filter','other-equipment'}
        if p0 in eq_cats:
            return True
    if site == 'samco':
        if p0 == 'solutions' and len(parts) <= 3:
            return True
        if p0 in {'category','tag','author','project_category','project_tag','services'}:
            return True
    if site == 'alaqua':
        if p0 in {'about-us','contact','request-a-quote','applications','experience',
                  'clients','our-services','web-stories','blog'}:
            return True
        standalone = {'heat-exchangers','crystalizers','evaporators-technologies',
                      'evaporator-systems','solvent-recovery-systems','spraydryers',
                      'distillation-equipment'}
        if p0 in standalone:
            return True
    return False

# ===================== CLASSIFY =====================
COMPARE_RE = re.compile(r'(-vs-|\bvs\b|-versus-|difference-between|compared?-?(to|with)?|comparing|better-than|roi|cost-(benefit|analysis)|tco|return-on-investment|cost-savings|reduce-(cost|energy|water|consumption)|saving|optimi)', re.I)

FAQ_BUYER_RE = re.compile(r'^(how-(much|many|often|long|far|fast)|why-|when-to-use|where-to|which-|do-i-|should-i-|can-i-|can-a-|can-you-|top-\d+|best-\d+|\d+-(tips|ways|steps|reasons|signs|factors|benefits|mistakes|types|things|key-factors|key-components)|the-best-|best-(companies|way|methods|practices|suppliers|manufacturers|source)|choose-the-right|choosing-the-right|how-to-choose|how-to-select|selecting-the|how-to-identify|how-to-find|how-to-buy|how-to-spot|buying-guide|buyers-guide|questions-to-ask|faq|key-factors|factors-(to|that|influencing))', re.I)

PRINCIPLE_RE = re.compile(r'(what(-is|s)-(a|an|the)?|principle|working-principle|how-(it|do|does|did)-(work|works|function)|how-it-works|guide|complete-guide|ultimate-guide|beginner.?guide|overview|introduction|basics|fundamentals|explained|understanding|decoding|exploring|insights?|an-introduction|the-process|process-of|stages-of|types-of|how-to-use|application-of|applications-of|applications-and|the-role-of|role-of|function-of|working|design|features|advantages|disadvantages|benefits|a-complete|comprehensive-guide|everything-you-need|all-you-need)', re.I)

OPS_RE = re.compile(r'(maintain|maintenance|cleaning|clean|troubleshoot|troubleshooting|repair|replace|install|installation|operation|operating|safety|safety-considerations|safety-tips|efficiency|energy-(saving|consumption|efficiency)|reduce-water|reduce-energy|save-(water|energy|money)|material-selection|raw-material|clean-in-place|cip|prevent|leak|failing|fouling|wear|replacement|optimize-.*-performance|inspection|preventive|regeneration|lifespan|service-life|lifetime|longevity|reduce-pressure|wear-resistance|reduce-the-pressure|improve-and-maintain)', re.I)

COUNTRIES = ['usa','united-states','us','china','india','germany','uk','united-kingdom',
             'europe','canada','france','italy','japan','korea','south-korea','spain',
             'australia','mexico','brazil','russia','turkey','iran','egypt',
             'south-africa','nigeria','philippines','indonesia','vietnam','thailand',
             'malaysia','singapore','uae','saudi-arabia','dubai','pakistan','bangladesh']

def is_geo(s):
    for c in COUNTRIES:
        if f'-in-{c}' in s or f'-in-{c}-' in s or f'-{c}' == s[-len('-'+c):]:
            return True
        if f'manufacturers-in-{c}' in s or f'suppliers-in-{c}' in s or f'manufacturer-in-{c}' in s or f'supplier-in-{c}' in s or f'exporters-in-{c}' in s:
            return True
    if re.search(r'(manufacturers?-in|suppliers?-in|exporters?-in|distributors?-in|companies-in|makers?-in|dealer-in)-', s):
        return True
    if re.search(r'-(in-usa|in-china|in-india|in-germany|in-uk|in-europe|in-canada|in-france|in-italy|in-japan|in-korea|in-spain|in-australia|in-mexico|in-brazil|in-russia|in-turkey|in-uae|in-saudi)', s):
        return True
    return False

def is_news_event(s):
    return bool(re.search(r'(award|exhibition|expo|carnival|conference|trade-show|summit|webinar|news|announce|launch|holiday|greeting|new-year|spring-festival|ramadan|family-travel|night-climb|challenge|iso|ce-certification|warm-remind|feedback-from-customers|travel|family|thank|greeting|spending-spree|purchasing-carnival)', s, re.I))

def categorize(slug_full, site='auto'):
    s = slug_full.lower()
    parts = slug_full.split('/')
    p0 = parts[0] if parts else ''
    last = parts[-1]
    body = '/'.join(parts[1:]) if len(parts) > 1 else last

    # Path-based overrides
    if p0 == 'project':
        return 1
    if p0 == 'news':
        return 6
    if p0 == 'blog':
        # blog slug like blog/what-is-...-NNNNN.html
        body_clean = re.sub(r'-\d+\.html$', '', body)
        body_clean = re.sub(r'\.html$', '', body_clean)
        # 7 geo (rare)
        if is_geo(body_clean):
            return 7
        if COMPARE_RE.search(body_clean):
            return 4
        # what-is / how-it-works / principle
        if re.match(r'^(what-(is|are|s))', body_clean, re.I) or 'working-principle' in body_clean or 'how-it-works' in body_clean or re.match(r'^how-does-.+-work', body_clean, re.I) or re.match(r'^how-do-.+-work', body_clean, re.I):
            return 2
        if FAQ_BUYER_RE.match(body_clean):
            return 3
        if PRINCIPLE_RE.search(body_clean):
            return 2
        if OPS_RE.search(body_clean):
            return 5
        return 8
    if p0 == 'info':
        body_clean = re.sub(r'-\d+\.html$', '', body)
        body_clean = re.sub(r'\.html$', '', body_clean)
        if is_news_event(body_clean):
            return 6
        if is_geo(body_clean):
            return 7
        if COMPARE_RE.search(body_clean):
            return 4
        if re.match(r'^(what-(is|are|s))', body_clean, re.I) or 'working-principle' in body_clean or 'how-it-works' in body_clean or re.match(r'^how-does-.+-work', body_clean, re.I):
            return 2
        if FAQ_BUYER_RE.match(body_clean):
            return 3
        if PRINCIPLE_RE.search(body_clean):
            return 2
        if OPS_RE.search(body_clean):
            return 5
        return 2  # default: product encyclopedia

    # root slugs
    if is_geo(last):
        return 7
    if COMPARE_RE.search(last):
        return 4
    if re.match(r'^(what-(is|are|s)?-(a|an|the)?|how-(does|do)-.+work|how-it-works|how-.+-works|working-principle|principle)', last, re.I):
        return 2
    if FAQ_BUYER_RE.search(last):
        return 3
    if PRINCIPLE_RE.search(last):
        return 2
    if OPS_RE.search(last):
        return 5
    if is_news_event(last):
        return 6
    # solution/application
    if re.search(r'(solution|application|case-study|case-history|project|implement|deploy|install-at|customer-|success-story|facility|plant|for-(the-)?(food|chemical|pharma|oil|gas|beverage|dairy|sugar|fertilizer|mining|steel|metal|electronic|semiconductor|pulp|paper|textile|automotive|aerospace|cannabis|cosmetic|biotech))', last, re.I):
        return 1
    return 8

# ===================== PROCESS =====================
samco_kept = []
for s in samco_post:
    if is_product_spec(s,'samco'): continue
    samco_kept.append((categorize(s,'samco'), s, 'post'))
for s in samco_project:
    if is_product_spec(s,'samco'): continue
    samco_kept.append((categorize(s,'samco'), s, 'project'))
for s in samco_page:
    if is_product_spec(s,'samco'): continue
    samco_kept.append((categorize(s,'samco'), s, 'page'))

alaqua_kept = []
for s in alaqua_post:
    if is_product_spec(s,'alaqua'): continue
    alaqua_kept.append((categorize(s,'alaqua'), s, 'post'))
for s in alaqua_page:
    if is_product_spec(s,'alaqua'): continue
    alaqua_kept.append((categorize(s,'alaqua'), s, 'page'))

toption_kept = []
for s in toption_slugs:
    if is_product_spec(s,'toption'): continue
    if s == '': continue
    if s.split('/')[0] in {'blog','info','news'} and len(s.split('/'))==1:
        continue
    toption_kept.append((categorize(s,'toption'), s, s.split('/')[0]))

print('===== SAMCO =====')
print(f'Input: post={len(samco_post)}, project={len(samco_project)}, page={len(samco_page)}')
print(f'After cleaning: {len(samco_kept)}')
print('By cat:', dict(sorted(Counter(c for c,_,_ in samco_kept).items())))
print()
print('===== Alaqua =====')
print(f'Input: post={len(alaqua_post)}, page={len(alaqua_page)}')
print(f'After cleaning: {len(alaqua_kept)}')
print('By cat:', dict(sorted(Counter(c for c,_,_ in alaqua_kept).items())))
print()
print('===== Toption =====')
print(f'Input: {len(toption_slugs)}')
print(f'After cleaning: {len(toption_kept)}')
print('By cat:', dict(sorted(Counter(c for c,_,_ in toption_kept).items())))

with open(os.path.join(base, 'classified.json'),'w',encoding='utf-8') as f:
    json.dump({'samco':samco_kept, 'alaqua':alaqua_kept, 'toption':toption_kept}, f, ensure_ascii=False, indent=2)
print('\nSaved.')
