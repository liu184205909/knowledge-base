# 02-鑷姩鍖栧伐鍏峰簱

> 鏈嶅姟浜?RLM 钀ラ攢娴佺▼鐨勮嚜鍔ㄥ寲鑴氭湰涓庡伐鍏烽泦鍚?| 鏈€鍚庢洿鏂? 2026-05-14

---

## 宸ュ叿鎬昏

| 搴忓彿 | 宸ュ叿 | 鏍稿績鍔熻兘 | 鑴氭湰鏂囦欢 |
|------|------|---------|---------|
| **01** | 鍩熷悕鏌ヨ | 鎵归噺妫€娴嬪煙鍚嶅彲鐢ㄦ€э紝WHOIS 鏌ヨ | `domain_checker.py` |
| **02** | 绔炲搧鐮旂┒宸ュ叿 | 浜哄伐 Google 鎼滅储绔炲搧 + SEMrush 鏁版嵁閲囬泦 + Sitemap 瑙ｆ瀽锛坰itemap-mcp-server锛?| `semrush_to_sheets.py`锛坄serp_competitor_finder.py` `sitemap_parser.py` 宸查€€褰癸級 |
| **03** | WordPress 寤虹珯 | AI 鎿嶄綔 WordPress锛孍lementor 寤虹珯瑙勫垯 | 鏂囨。涓轰富 |
| **04** | 鍥剧墖鐢熸垚宸ュ叿 | AI 鍥剧墖鐢熸垚鎻愮ず璇嶏紙浜у搧椤?Hero/淇冮攢/淇′换/缁嗚妭/瀵规瘮/鐢熸椿鏂瑰紡 6 鍦烘櫙锛?| 鎻愮ず璇嶆枃妗?|
| **05** | 绔炲搧鍐呭鍒嗘瀽宸ュ叿 | 鍐呭妯″紡鍒嗘瀽 + 绔欏唴閲嶅妫€娴?+ 绔欏鍘熷垱鎬ф娴?| `content_analyzer.py` `content_duplicate_checker.py` `content_originality_checker.py` |
| **06** | 鍐呭璐ㄦ宸ュ叿 | E-E-A-T 鍐呭璐ㄩ噺璇勪及锛屽彂甯冨墠鍚岃川鍖栭闄╂娴?| 鎻愮ず璇嶆枃妗?|
| **07** | 鏁版嵁鍒嗘瀽宸ュ叿 | Google Data Studio 鏁版嵁鍙鍖栵紝SEO/娴侀噺浠〃鐩?| 鏂囨。涓轰富 |
| **08** | 鐭棰戝伐鍏?| 绱犳潗閲囬泦/鎷嗚В/鍒涗綔/鍒嗗彂鍏ㄩ摼璺紙閰嶅悎姝ラ4C闊宠棰戝啀鍔犲伐锛?| 鏂囨。涓轰富 |
| **09** | 澶栭摼宸ュ叿 | 澶栭摼寤鸿杈呭姪宸ュ叿锛堝崰鍧戯紝寰呭缓璁撅級 | 鏂囨。涓轰富 |
| **10** | SEO 瀹¤宸ュ叿 | 鎶€鏈疭EO瀹¤ + On-Page SEO璇勫垎 + 鍏抽敭璇嶈殨椋熸娴?| `seo_technical_auditor.py` `onpage_seo_checker.py` `keyword_cannibalization_checker.py` |
| **11** | 鐢ㄦ埛娲炲療宸ュ叿 | 閲囬泦 Reddit/绔炲搧璇勮 鈫?鍒嗙被鍒嗘瀽 鈫?閫夐/鐥涚偣/璐拱鎰忓悜鎸栨帢 | `reddit_comment_collector.py` `comment_insight_analyzer.py` |
| **12** | GEO 鍙鎬ф鏌?| 7缁村害妫€鏌ュ搧鐗屽湪 AI 鐢熸€佷腑鐨勫彲瑙佹€т俊鍙凤紙Reddit/Quora/璇勪环绔?Wikipedia/濯掍綋/绔炲搧瀵规瘮锛?| `geo_visibility_checker.py` |
| **13** | Open Design锛堣璁″伐鍏凤級 | AI 椹卞姩鐨勫紑婧愯璁″伐鍏凤紝鐢熸垚钀藉湴椤?PPT/绉诲姩绔師鍨?钀ラ攢娴锋姤锛堟湰鍦伴儴缃诧紝鏀寔 Codex/BYOK 鏅鸿氨锛?| [GitHub](https://github.com/nexu-io/open-design) |
| **14** | Web-to-App锛堢綉绔欐墦鍖匒pp锛?| 鎵嬫満绔竴閿妸鐙珛绔?HTML椤圭洰鎵撳寘鎴愬畨鍗?APK锛屾棤闇€鐢佃剳鍜?IDE锛圞otlin + GeckoView 鍙屽唴鏍革紝鍐呯疆 AI 鑳藉姏锛?| [GitHub](https://github.com/shiahonb777/web-to-app) |
| **15** | 杈句汉BD宸ュ叿 | AI 椹卞姩鐨勮揪浜猴紙KOL/绾汉锛夊晢鍔℃嫇灞曡嚜鍔ㄥ寲 鈥?璐﹀彿鍒嗘瀽銆佷釜鎬у寲閭欢銆丄B娴嬭瘯銆佸悎浣滆拷韪?| 鏂规硶璁烘枃妗ｏ紙宸ュ叿寰呭缓锛?|

### 琛ュ厖锛氶潪缂栧彿宸ュ叿 / 澶囬€夋柟妗?

| 宸ュ叿 | 瀹氫綅 | 閫傜敤鍦烘櫙 | 璐圭敤 |
|------|------|---------|------|
| **Google AI Studio** | 闆朵唬鐮?AI 搴旂敤鏋勫缓锛屼笌 Google Workspace 娣卞害鎵撻€?| 璇诲彇 Google Sheets 鏁版嵁鐢熸垚 Dashboard 鈫?鑷姩鍙?Gmail锛涢浂 API 璋冭瘯锛岄浂 Token 璐圭敤锛屽叏鍦ㄨ胺姝岀敓鎬佸唴瀹屾垚 | 鍏嶈垂锛堟湁棰濆害闄愬埗锛?|
| **NotebookLM** | 璋锋瓕鍏嶈垂 AI 鐮旂┒鍔╂墜锛屼笂浼犳枃妗ｅ悗鍙璇濇彁闂?| 蹇€熸秷鍖栭暱鏂囨。/鍙戝竷浼氬唴瀹?琛屼笟鎶ュ憡锛汫oogle I/O 2026 瀹樻柟涔熺敤瀹冨仛浜掑姩鏂囨。 | 鍏嶈垂 |

> **AI Studio 閫傜敤鍦烘櫙**锛氶渶瑕佽繛鎺?Google Sheets/Gmail/Docs 鐨勮交閲忚嚜鍔ㄥ寲锛堝鏁版嵁 Dashboard銆侀偖浠堕€氱煡锛夛紝涓斾笉鎯虫姌鑵捐法骞冲彴 API 鐨勫満鏅€侰laude Code/Codex 閫傚悎澶嶆潅寮€鍙戯紝AI Studio 閫傚悎璋锋瓕鐢熸€佸唴鐨勫揩閫熷師鍨嬨€?

---

## 鏍囧噯宸ヤ綔娴?

### 1. 绔炲搧鐮旂┒闃舵锛堝缓绔欏墠锛?

```text
浜哄伐 Google 鎼滅储锛堟帓闄よ娉曡繃婊ゅぇ骞冲彴锛?    鈫?绛涢€?~40 涓珵鍝佸煙鍚?
    鈫?
02-绔炲搧鐮旂┒宸ュ叿/semrush_to_sheets.py       鈫?SEMrush 鏁版嵁閲囬泦锛圓S/娴侀噺/鎴浘 鈫?Google Sheets锛?
sitemap-mcp-server锛圡CP锛?                 鈫?Sitemap 瑙ｆ瀽鍐呭鏋舵瀯锛堣瑙?1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽锛?
    鈫?
05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_analyzer.py    鈫?鎵归噺鎶撳彇 title/H1/H2锛岃緭鍑哄唴瀹规ā寮忔姤鍛?
```

### 2. 寤虹珯闃舵

```text
01-鍩熷悕鏌ヨ/domain_checker.py              鈫?鍩熷悕鍙敤鎬ф娴?
    鈫?
03-WordPress寤虹珯/                          鈫?寤虹珯鎸囧崡 + Elementor 鎿嶄綔鎵嬪唽
    鈫?
14-Web-to-App锛堝彲閫夛級                      鈫?鐙珛绔欐墦鍖呮垚瀹夊崜 App锛屽鍔犵敤鎴风暀瀛樺拰 Push 瑙﹁揪娓犻亾
```

### 3. 杩愯惀浼樺寲闃舵锛堝缓绔欏悗锛?

```text
05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_duplicate_checker.py      鈫?绔欏唴閲嶅鍐呭妫€娴?
05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_originality_checker.py    鈫?绔欏鍘熷垱鎬ф娴?
10-SEO瀹¤宸ュ叿/seo_technical_auditor.py               鈫?鎶€鏈疭EO瀹¤
10-SEO瀹¤宸ュ叿/onpage_seo_checker.py                  鈫?On-Page SEO璇勫垎
10-SEO瀹¤宸ュ叿/keyword_cannibalization_checker.py     鈫?鍏抽敭璇嶈殨椋熸娴?
12-GEO鍙鎬ф鏌?geo_visibility_checker.py            鈫?GEO鍙鎬ф鏌ワ紙閫夊搧璇勪及 + 瀹氭湡鐩戞祴锛?
```

### 4. 鏁版嵁椹卞姩闃舵锛堟湁娴侀噺鍚庯級

```text
07-鏁版嵁鍒嗘瀽宸ュ叿/                            鈫?Data Studio 浠〃鐩?
11-鐢ㄦ埛娲炲療宸ュ叿/comment_insight_analyzer.py  鈫?璇勮/鍙嶉鍒嗘瀽 鈫?椹卞姩涓嬩竴杞唴瀹?
12-GEO鍙鎬ф鏌?geo_visibility_checker.py  鈫?瀹氭湡璺?GEO 鍙鎬э紝璺熻釜鍙樺寲瓒嬪娍
```

---

## 鐜渚濊禆

```bash
# 绔炲搧鐮旂┒ + 鍐呭鍒嗘瀽 + SEO瀹¤锛堟牳蹇冿級
pip install requests beautifulsoup4 lxml pandas tqdm

# 鍩熷悕鏌ヨ
pip install python-whois

# GEO 鍙鎬ф鏌ワ紙闇€瑕?DataForSEO API 鍑瘉锛?
# 澶嶇敤 DataForSEO MCP 閰嶇疆鐨勮处鍙?
# export DFS_API_LOGIN=your_login
# export DFS_API_PASSWORD=your_password
```

---

## 01 鍩熷悕鏌ヨ

**鏂囦欢**锛歚01-鍩熷悕鏌ヨ/domain_checker.py`

```bash
pip install python-whois
python 01-鍩熷悕鏌ヨ/domain_checker.py
```

杈撳嚭锛歚domain_availability_with_whois.csv`锛堝煙鍚嶅彲鐢ㄦ€?+ 娉ㄥ唽淇℃伅锛?

---

## 02 绔炲搧鐮旂┒宸ュ叿

### 2A 绔炲搧鎸栨帢锛氫汉宸?Google 鎼滅储锛堝凡鏇夸唬 serp_competitor_finder.py锛?

**鍘熺悊**锛氫汉宸ヤ娇鐢?Google 鎼滅储 + 鎺掗櫎璇硶杩囨护澶у钩鍙帮紝鐩存帴绛涢€夌珵鍝併€?

**鎼滅储鎺掗櫎璇硶**锛堢洿鎺ュ鍒朵娇鐢級锛?
```
鍏抽敭璇?-amazon.com -ebay.com -etsy.com -walmart.com -pinterest.com -reddit.com -youtube.com -facebook.com -tiktok.com -wikipedia.org -quora.com -target.com -aliexpress.com -alibaba.com
```

> `serp_competitor_finder.py` 鍜?`sitemap_parser.py` 宸查€€褰癸紝涓嶅啀浣跨敤銆傝瑙?[1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md](02-绔炲搧鐮旂┒宸ュ叿/1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md)

### 2B Sitemap 瑙ｆ瀽锛歴itemap-mcp-server锛圡CP锛?

**鍘熺悊**锛氶€氳繃 sitemap-mcp-server锛圡CP 鏈嶅姟锛夎嚜鍔ㄥ彂鐜板苟瑙ｆ瀽绔炲搧 sitemap.xml锛屾敮鎸佸瓙sitemap杩囨护銆佽矾寰勮繃婊ゃ€佸垎椤点€?

璇﹁ [1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md](02-绔炲搧鐮旂┒宸ュ叿/1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md) 鐨勨€?.4 杞ㄩ亾D锛歋itemap瑙ｆ瀽鈥濈珷鑺傘€?

---

## 03 WordPress 寤虹珯

**鏂囦欢**锛歚03-WordPress寤虹珯/` 涓嬩互鏂囨。涓轰富锛屽惈 1 涓?Node.js 鑴氭湰銆?

| 鏂囨。 | 鍐呭 | 閫傜敤闃舵 |
|------|------|---------|
| `Elementor REST API 鎿嶄綔鎵嬪唽.md` | Elementor 妯℃澘鍒涘缓 + Flexbox 甯冨眬 + Widget 鍒楄〃 + 韪╁潙娓呭崟 | RLM 姝ラ 2B/2C锛堟牳蹇冮〉闈級 |
| `Gutenberg鍗氬鏂囩珷REST-API涓婁紶鎸囧崡.md` | 鍗氬鏂囩珷閫氳繃 `wp-json/wp/v2/posts` 鍙戝竷锛孏utenberg Block HTML 鏍煎紡 | RLM 姝ラ 3锛堝崥瀹㈡枃绔狅級 |
| `Elementor REST API 操作手册.md + templates/elementor-utils.js` | Homepage V3 椤甸潰鐢熸垚涓庝笂浼犺剼鏈?| RLM 姝ラ 2B/2C |
| `椤甸潰鍐呭鎸囧崡/` | 鍚勭被椤甸潰鐨勫唴瀹规鏋讹紙RLM 姝ラ 2A/2B 寮曠敤锛?| RLM 姝ラ 2A/2B |

> **鍒嗗伐鍘熷垯**锛氭牳蹇冮〉闈紙棣栭〉/浜у搧椤?Landing Page锛夌敤 Elementor锛涘崥瀹㈡枃绔狅紙鏁欑▼/鎸囧崡/绉戞櫘锛夌敤 Gutenberg銆?

---

## 05 绔炲搧鍐呭鍒嗘瀽宸ュ叿

### 5A 鍐呭妯″紡鍒嗘瀽锛歚content_analyzer.py`

鎵归噺鎶撳彇绔炲搧鏂囩珷鐨?title/meta/H1/H2锛岃嚜鍔ㄥ垎绫讳负銆岄€夎喘鎸囧崡/鏁欑▼/绉戞櫘/浜у搧椤点€嶇瓑绫诲瀷锛岀敓鎴愯法绔炲搧鍐呭妯″紡鎶ュ憡銆?

```bash
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_analyzer.py \
  --input 02-绔炲搧鐮旂┒宸ュ叿/sitemap_results/<domain>_blog_urls.csv

# 闄愰€燂紙閬垮厤琚皝锛?
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_analyzer.py --input urls.csv --concurrency 3 --delay 2

# 璋冭瘯锛堝彧璺戝墠20鏉★級
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_analyzer.py --input urls.csv --limit 20
```

### 5B 绔欏唴閲嶅妫€娴嬶細`content_duplicate_checker.py`

鍩轰簬 SimHash 绠楁硶姣斿鎵€鏈夐〉闈紝鎵惧嚭绔欏唴閲嶅/杩戜技鐨勯〉闈㈠銆?

```bash
# 浠?sitemap 妫€娴?
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_duplicate_checker.py \
  --input https://yoursite.com/sitemap.xml

# 浠庢湰鍦版枃浠舵娴?
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_duplicate_checker.py --input urls.csv

# 璋冩暣閲嶅闃堝€硷紙姹夋槑璺濈锛岄粯璁?0锛岃秺灏忚秺涓ユ牸锛?
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_duplicate_checker.py --input sitemap.xml --threshold 8
```

杈撳嚭锛?
- `results/duplicate_report_<domain>_<time>.md`锛氶噸澶嶅唴瀹规姤鍛婏紙鎸変弗閲嶇▼搴﹀垎绾э級
- `results/duplicate_pairs_<domain>_<time>.csv`锛氶噸澶嶅璇︽儏

### 5C 绔欏鍘熷垱鎬ф娴嬶細`content_originality_checker.py`

鍩轰簬 N-gram锛坱rigram锛夋瘮瀵圭洰鏍囬〉闈笌绔炲搧鍐呭鐨勯噸鍚堝害锛岃緭鍑烘钀界骇鍘熷垱鎬ц瘎鍒嗐€?

```bash
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_originality_checker.py \
  --target https://yoursite.com/blog/article \
  --competitors competitor_urls.txt

# 璋冩暣 N-gram 澶у皬锛堝澶у垯姣斿鏇翠弗鏍硷級
python 05-绔炲搧鍐呭鍒嗘瀽宸ュ叿/content_originality_checker.py \
  --target URL --competitors urls.txt --ngram 4
```

杈撳嚭锛?
- `results/originality_<domain>_<time>.md`锛氬師鍒涙€ф姤鍛婏紙鍚钀界骇鍒嗘瀽锛?
- `results/originality_paragraphs_<domain>_<time>.csv`锛氭钀界骇瀵规瘮 CSV

---

## 04 鍥剧墖鐢熸垚宸ュ叿

**鏂囦欢**锛歚04-鍥剧墖鐢熸垚宸ュ叿/浜у搧椤靛浘鐗囨彁绀鸿瘝.md`

浜у搧椤垫爣鍑?6 寮犺疆鎾浘锛圚ero/淇冮攢/淇′换/缁嗚妭/瀵规瘮/鐢熸椿鏂瑰紡锛夌殑 AI 鐢熸垚鎻愮ず璇嶏紝閫傜敤浜?Shopify 鍜?WordPress + WooCommerce 浜у搧椤点€?

璇﹁ [浜у搧椤靛浘鐗囨彁绀鸿瘝.md](04-鍥剧墖鐢熸垚宸ュ叿/浜у搧椤靛浘鐗囨彁绀鸿瘝.md)銆?

---

## 07 鏁版嵁鍒嗘瀽宸ュ叿

**鏂囦欢**锛歚07-鏁版嵁鍒嗘瀽宸ュ叿/01-Google-Data-Studio浣跨敤鎸囧崡.md`

缃戠珯涓婄嚎鍚庣殑鏁版嵁鍙鍖栦腑蹇冿紝杩炴帴 GSC + GA4 + Sheets 鎼缓 SEO/娴侀噺浠〃鐩樸€?

**鏍稿績鏁版嵁娴?*锛?

```
绔炲搧鍒嗘瀽鏁版嵁锛圕SV锛夆啋 Google Sheets 鈫?Data Studio 浠〃鐩?
                                        鈫?
GSC 鎼滅储鎺掑悕 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ 鍘熺敓杩炴帴
GA4 娴侀噺琛屼负 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ 鍘熺敓杩炴帴
```

---

## 08 鐭棰戝伐鍏?

**鏂囦欢**锛歚08-鐭棰戝伐鍏?鐭棰戝伐鍏蜂笌鑷姩鍖栨祦绋?md`

绱犳潗閲囬泦/鎷嗚В/鍒涗綔/鍒嗗彂鍏ㄩ摼璺紝閰嶅悎 RLM 姝ラ 4D 闊宠棰戝啀鍔犲伐銆?

---

## 09 澶栭摼宸ュ叿

> **鐘舵€?*锛氬崰鍧戯紝寰呭閾惧缓璁炬寚鍗楅獙璇佸悗鍚姩寮€鍙戙€傝瑙?[README.md](09-澶栭摼宸ュ叿/README.md)銆?

SEMrush 鏁版嵁閲囬泦鍔熻兘宸叉暣鍚堝埌 `02-绔炲搧鐮旂┒宸ュ叿/`锛岃瑙?[1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md](02-绔炲搧鐮旂┒宸ュ叿/1B鏁版嵁澶勭悊宸ュ叿鎵嬪唽.md)銆?

---

## 10 SEO瀹¤宸ュ叿

### 10A 鎶€鏈?SEO 瀹¤锛歚seo_technical_auditor.py`

妫€鏌?HTTPS銆?04銆侀噸瀹氬悜閾俱€丆anonical銆乺obots.txt銆佺粨鏋勫寲鏁版嵁銆丠reflang銆佸宀涢〉闈㈢瓑銆?

```bash
# 浠?sitemap 瀹¤鍏ㄧ珯
python 10-SEO瀹¤宸ュ叿/seo_technical_auditor.py \
  --input https://yoursite.com/sitemap.xml

# 浠庢湰鍦版枃浠?
python 10-SEO瀹¤宸ュ叿/seo_technical_auditor.py --input urls.csv

# 闄愬埗鏁伴噺锛堣皟璇曠敤锛?
python 10-SEO瀹¤宸ュ叿/seo_technical_auditor.py --input sitemap.xml --limit 50
```

杈撳嚭锛?
- `results/technical_audit_<domain>_<time>.md`锛氭妧鏈?SEO 瀹¤鎶ュ憡锛堝惈鍋ュ悍璇勫垎锛?
- `results/technical_issues_<domain>_<time>.csv`锛氶棶棰樻竻鍗?CSV

### 10B On-Page SEO 妫€鏌ワ細`onpage_seo_checker.py`

璇勪及椤甸潰鐨?Title/Meta/H鏍囩/鍐呭/鍥剧墖/鍐呴摼/E-E-A-T锛屾弧鍒?100 鍒嗐€?

```bash
# 妫€鏌ュ崟涓〉闈?
python 10-SEO瀹¤宸ュ叿/onpage_seo_checker.py --input https://yoursite.com/blog/article

# 妫€鏌ュ涓〉闈紙甯﹀叧閿瘝锛?
python 10-SEO瀹¤宸ュ叿/onpage_seo_checker.py --input sitemap.xml --keyword "crystal healing"

# 浠庢湰鍦?URL 鏂囦欢
python 10-SEO瀹¤宸ュ叿/onpage_seo_checker.py --input urls.txt --keyword "target keyword"
```

杈撳嚭锛?
- `results/onpage_seo_report_<time>.md`锛氬悇椤甸潰璇勫垎璇︽儏
- `results/onpage_seo_scores_<time>.csv`锛氳瘎鍒嗘眹鎬?CSV

### 10C 鍏抽敭璇嶈殨椋熸娴嬶細`keyword_cannibalization_checker.py`

鎻愬彇姣忎釜椤甸潰鐨勭洰鏍囧叧閿瘝锛屾壘鍑哄涓〉闈㈢珵浜夊悓涓€鍏抽敭璇嶇殑鎯呭喌銆?

```bash
# 浠?sitemap 妫€娴?
python 10-SEO瀹¤宸ュ叿/keyword_cannibalization_checker.py \
  --input https://yoursite.com/sitemap.xml

# 浠庢湰鍦版枃浠?
python 10-SEO瀹¤宸ュ叿/keyword_cannibalization_checker.py --input urls.csv
```

杈撳嚭锛?
- `results/cannibalization_<domain>_<time>.md`锛氳殨椋熸娴嬫姤鍛婏紙鎸変紭鍏堢骇鍒嗙骇锛?
- `results/cannibalized_keywords_<domain>_<time>.csv`锛氶噸鍙犲叧閿瘝璇︽儏

---

## 11 鐢ㄦ埛娲炲療宸ュ叿

> **鏍稿績鐞嗗康**锛氫笉绛夎嚜宸辩殑缃戠珯/棰戦亾绉疮璇勮锛岀洿鎺ュ幓 Reddit/Amazon/YouTube 閲囬泦绔炲搧鍜岃涓氱殑鐢ㄦ埛鍙嶉锛岄┍鍔ㄥ唴瀹归€夐鍜屼骇鍝佺瓥鐣ャ€?

### 11A Reddit 璇勮閲囬泦锛歚reddit_comment_collector.py`

鍩轰簬 Reddit `.json` 绔偣锛堣瑙?[Reddit鐨凧SON鍔熸硶](11-鐢ㄦ埛娲炲療宸ュ叿/Reddit鐨凧SON鍔熸硶.md)锛夛紝鏃犻渶 API 瀵嗛挜锛岄噰闆嗗笘瀛?+ 璇勮锛岃緭鍑轰负鍒嗘瀽宸ュ叿鍙洿鎺ヤ娇鐢ㄧ殑 CSV銆?

```bash
# 閲囬泦鏁翠釜 subreddit
python 11-鐢ㄦ埛娲炲療宸ュ叿/reddit_comment_collector.py \
  --subreddit crystalhealing --sort hot --limit 15

# 鎼滅储鍏抽敭璇嶏紙璺?subreddit锛?
python 11-鐢ㄦ埛娲炲療宸ュ叿/reddit_comment_collector.py \
  --search "crystal bracelet healing"

# 鎼滅储闄愬畾 subreddit
python 11-鐢ㄦ埛娲炲療宸ュ叿/reddit_comment_collector.py \
  --search "crystal meaning" --subreddit crystals

# 閲囬泦鍗曚釜甯栧瓙
python 11-鐢ㄦ埛娲炲療宸ュ叿/reddit_comment_collector.py \
  --post "https://www.reddit.com/r/.../comments/xxx/"
```

杈撳嚭锛歚results/reddit_<鍏抽敭璇?_<鏃堕棿>.csv`锛堝彲鐩存帴浼犵粰 11B 鍒嗘瀽锛?

### 11B 璇勮娲炲療鍒嗘瀽锛歚comment_insight_analyzer.py`

瀵硅瘎璁烘暟鎹繘琛屾櫤鑳藉垎鏋愶細鑷姩鍒嗙被锛堥棶棰?璐拱鎰忓悜/鎶辨€?鍔熻兘寤鸿/鍚堜綔璇㈢洏/鍦板煙闇€姹傦級銆佹彁鍙栭€夐淇″彿銆佹寲鎺樼棝鐐广€佺瓫閫夐珮浠峰€肩嚎绱€?

**鏍囧噯鐢ㄦ硶锛堟帴 11A 鐨勮緭鍑猴級**锛?

```bash
# 鍒嗘瀽 Reddit 閲囬泦缁撴灉
python 11-鐢ㄦ埛娲炲療宸ュ叿/comment_insight_analyzer.py \
  --input results/reddit_crystalhealing_20260509.csv \
  --source "Reddit r/crystalhealing"

# 鍒嗘瀽鍏朵粬鏉ユ簮鐨?CSV锛堝垪鍚? text/comment/content/body锛?
python 11-鐢ㄦ埛娲炲療宸ュ叿/comment_insight_analyzer.py \
  --input amazon_reviews.csv --source "绔炲搧Amazon璇勮"

# 鍒嗘瀽绾枃鏈紙姣忚涓€鏉★級
python 11-鐢ㄦ埛娲炲療宸ュ叿/comment_insight_analyzer.py \
  --input youtube_comments.txt --source "绔炲搧YouTube璇勮"
```

杈撳嚭锛?
- `results/comment_insight_<time>.md`锛氭礊瀵熸姤鍛婏紙鍒嗙被鍒嗗竷 + 楂樹环鍊艰瘎璁?+ 閫夐寤鸿 + 鐥涚偣 + 鍦板煙闇€姹傦級
- `results/comments_classified_<time>.csv`锛氭瘡鏉¤瘎璁虹殑鍒嗙被缁撴灉
- `results/content_topics_<time>.csv`锛氶€夐寤鸿娓呭崟

### 瀹屾暣宸ヤ綔娴?

```text
11A reddit_comment_collector.py   鈫?閲囬泦绔炲搧/琛屼笟璇勮
    鈫?results/reddit_xxx.csv
11B comment_insight_analyzer.py   鈫?鍒嗙被鍒嗘瀽锛岃緭鍑烘礊瀵?
    鈫?閫夐寤鸿 + 鐥涚偣 + 璐拱鎰忓悜
鈫?椹卞姩 RLM 姝ラ 3 鍐呭绛栫暐
鈫?椹卞姩浜у搧璁捐锛堢敤鎴风棝鐐?鈫?浜у搧鏀硅繘锛?
鈫?椹卞姩甯傚満楠岃瘉锛堝湴鍩熼渶姹?鈫?浼樺厛鏈湴鍖栵級
```

**鏇村鏁版嵁婧?*锛歒ouTube 璇勮鍙€氳繃 DataForSEO MCP 鐩存帴鑾峰彇锛坄serp_youtube_video_comments_live_advanced`锛夛紝Amazon 璇勮鍙敤 Apify Actor 閲囬泦锛屽垎鏋愮幆鑺傜粺涓€鐢?11B銆?

---

## 韪╁潙璁板綍锛氬叏鑷姩 SEO 涓轰粈涔堣涓嶉€?

> 浠ヤ笅缁忛獙鏉ヨ嚜 2025-2026 骞寸殑瀹炴搷楠岃瘉锛岃褰曚簬姝ら伩鍏嶉噸韫堣杈欍€?

### 宸查獙璇佸け鏁堢殑鍋氭硶

| 鍋氭硶 | 瀹炴搷缁撴灉 | 澶辨晥鍘熷洜 |
|------|---------|---------|
| **鍏ㄨ嚜鍔ㄧ▼搴忓寲鐩綍绔?* | 鍋氫簡 4 涓紝3 涓畬鍏ㄦ鎺夛紝1 涓粎鍓?Bing 闆舵槦娴侀噺涓旀棤娉曞彉鐜?| 鎵归噺鐢熸垚鐨勪綆璐ㄩ噺鍐呭鏃犳硶閫氳繃 Google 璐ㄩ噺璇勪及锛屾棤鐪熷疄鐢ㄦ埛浠峰€?|
| **鑷姩鎵归噺澶栭摼** | 涓婁竴涓椂浠ｇ殑浜х墿锛岀幇鍦ㄦ棤浠讳綍鏁堟灉 | Google 宸茶兘璇嗗埆骞跺拷鐣ユ壒閲忓埗閫犵殑浣庤川閲忓閾撅紝鐢氳嚦鍙兘瀵艰嚧鎯╃綒 |
| **AI 涓€閿敓鎴愬畬鏁撮暱鏂?* | 澶氱妯″瀷灏濊瘯锛屽弽澶嶇倰鍓╅キ銆佸彞寮忛€昏緫娣蜂贡銆佸墠鍚庤鎺ユ柇瑁?| 澶х瘒骞呬竴娆℃€ц緭鍑烘椂 AI 闅句互淇濇寔璐ㄩ噺涓€鑷存€?|

### 姝ｇ‘鐨勮嚜鍔ㄥ寲杈圭晫

```text
鉁?閫傚悎鑷姩鍖栫殑鐜妭锛堝伐鍏峰簱宸茶鐩栵級锛?
   - 绔炲搧鏁版嵁閲囬泦涓庡垎鏋愶紙02/05锛?
   - SEO 鎶€鏈璁′笌璇勫垎锛?0锛?
   - 鐢ㄦ埛璇勮閲囬泦涓庡垎绫伙紙11锛?
   - 鍏抽敭璇嶆暟鎹壒閲忚幏鍙栵紙02 semrush_to_sheets.py锛?
   - GEO 鍙鎬т俊鍙锋鏌ワ紙12锛?

鉂?涓嶉€傚悎鑷姩鍖栫殑鐜妭锛?
   - 鍐呭鍐欎綔锛堝簲閫愭浜哄伐鎵撶（锛屽弬瑙?RLM鎵ц鐗堟楠? + 鍐呭Brief妯℃澘锛?
   - 澶栭摼寤鸿锛堝簲璧扮湡瀹炲悎浣滀笌鍐呭浠峰€奸┍鍔級
   - 鐢ㄦ埛闇€姹傜悊瑙ｏ紙蹇呴』浜哄伐鍒ゆ柇锛?
```

### 鏍稿績鏁欒

**鑰佽€佸疄瀹炶皟鐮旂敤鎴枫€佸垎鏋愰渶姹傘€佹弧瓒抽渶姹傦紝鎵嶆槸姝ｇ粡鐨勭敓鎰忛€昏緫銆?* 鑷姩鍖栧伐鍏风殑浠峰€兼槸鎻愭晥锛堝府浜烘洿蹇湴瀹屾垚鏁版嵁閲囬泦鍜屽垎鏋愶級锛岃€屼笉鏄浛浠ｄ汉瀵圭敤鎴烽渶姹傜殑鐞嗚В鍜屽唴瀹硅川閲忕殑鎶婃帶銆?

---

## 12 GEO 鍙鎬ф鏌?

> 璇︾粏鏂囨。瑙?[12-GEO鍙鎬ф鏌?README.md](12-GEO鍙鎬ф鏌?README.md)

### 12A 鍙鎬т俊鍙烽噰闆嗭細`geo_visibility_checker.py`

7 缁村害妫€鏌ュ搧鐗屽湪 AI 鐢熸€佷腑鐨勫彲瑙佹€т俊鍙凤細AI Overview銆丷eddit銆丵uora銆佽瘎浠风綉绔欍€乄ikipedia銆佸獟浣撴姤閬撱€佺珵鍝佸姣斻€?

**鍓嶇疆鏉′欢**锛欴ataForSEO API 鍑瘉锛堝鐢?MCP 閰嶇疆璐﹀彿锛?

```bash
export DFS_API_LOGIN=your_login
export DFS_API_PASSWORD=your_password

# 鍩烘湰鐢ㄦ硶
python 12-GEO鍙鎬ф鏌?geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet"

# 甯︾珵鍝?
python 12-GEO鍙鎬ф鏌?geo_visibility_checker.py \
  --brand "Crystal Healing" \
  --domain "crystalhealing.com" \
  --keywords "healing crystal bracelet" "crystal bracelet meaning" \
  --competitors "Energy Muse" "Tiny Rituals"
```

杈撳嚭锛?
- `results/geo_visibility_<brand>_<time>.md`锛氬彲璇绘姤鍛?
- `results/geo_visibility_<brand>_<time>.json`锛氱粨鏋勫寲鏁版嵁锛堜緵 Layer 2 鍒嗘瀽锛?

### 12B Layer 2 鍒嗘瀽锛圕laude Code锛?

灏?JSON 浜ょ粰 Claude Code锛岃嚜鍔ㄧ敓鎴愬彲瑙佹€ц瘎鍒?+ 宸窛鍒嗘瀽 + 琛屽姩寤鸿 鈫?鍐欏叆 Google Sheets銆?

---

## 鍒犻櫎鍘嗗彶璇存槑

> 鏈洰褰曞湪 2026-04-12 `commit 64ee06e` 涓鏁翠綋鍒犻櫎锛屽師鍥犳槸鍘嗘鏂囨。閲嶆瀯涓皢鏂囦欢鏍囨敞涓?宸茶縼绉?宸叉暣鍚?浣嗘湭鐪熸鎼Щ锛屽鑷村唴瀹归€愭娴佸け銆?026-04-13 鏍规嵁 git 鏃ュ織瀹屾暣鎭㈠锛屽苟琛ュ缓浠庢湭鎻愪氦杩囩殑绔炲搧鎸栨帢鍜屽垎鏋愯剼鏈€?
> 2026-05-09 鍚堝苟鍘?02-绔炲搧鎸栨帢宸ュ叿 鍜?03-绔炲搧鍒嗘瀽宸ュ叿 涓?02-绔炲搧鐮旂┒宸ュ叿锛涙柊澧?04-绔炲搧鍐呭鍒嗘瀽宸ュ叿 2 涓娴嬭剼鏈紱鏂板 10-SEO瀹¤宸ュ叿锛堟妧鏈璁?+ On-Page + 鍏抽敭璇嶈殨椋燂級锛涙柊澧?11-鐢ㄦ埛娲炲療宸ュ叿銆?
> 2026-05-14 鏂板 12-GEO鍙鎬ф鏌ワ紙7缁村害 AI 鐢熸€佸彲瑙佹€т俊鍙烽噰闆?+ Layer 2 LLM 鍒嗘瀽锛夈€?
> 2026-05-23 鏂板 13-Open Design 璁捐宸ュ叿锛堝崰鍧戯紝鍚庢湡瀹夎閮ㄧ讲锛夈€?
> 2026-05-24 鏂板 14-Web-to-App锛堢綉绔欐墦鍖呭畨鍗?APK 寮€婧愬伐鍏凤級銆?
> 2026-05-29 鏂板 15-杈句汉BD宸ュ叿锛圓I 椹卞姩杈句汉鍟嗗姟鎷撳睍鑷姩鍖栨柟娉曡锛夈€傛柊澧?AI Studio / NotebookLM 澶囬€夋柟妗堛€?

