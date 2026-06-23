# Intention Category 鍐呭妗嗘灦

> **閫傜敤**锛歚/{intention-slug}`锛堝 /calm-mindfulness/锛夎喘涔版壙鎺ュ瀷 **Hub 椤?*锛圵ordPress page + Elementor锛?> **鍙傜収**锛歔妯℃澘-Crystals-for-Condition鏂囩珷妗嗘灦.md](妯℃澘-Crystals-for-Condition鏂囩珷妗嗘灦.md)锛堝唴瀹规繁搴︼級+ about.js / Elementor REST API 操作手册.md + templates/elementor-utils.js generateHomepage锛?*UI 瑙嗚**锛? [鍝佺墝璇皟閰嶇疆](../鍝佺墝璇皟閰嶇疆.md) 搂4/搂5 + [2A-缃戠珯缁撴瀯](../../02-缃戠珯瑙勫垝/2A-缃戠珯缁撴瀯.md) 搂4.2
> **鏁版嵁**锛歔intention-tag-map.md](../../02-缃戠珯瑙勫垝/浜у搧瑙勫垝/intention-tag-map.md)锛? tag鈫掔煶绉嶏級+ [stone-core-data.md](../../02-缃戠珯瑙勫垝/浜у搧瑙勫垝/stone-core-data.md)锛堟按鏅跺崱鐧剧瀛楁锛? [product-structure-plan.md](../../02-缃戠珯瑙勫垝/浜у搧瑙勫垝/product-structure-plan.md) 搂涓€ + seed-crystals.json锛堝叧閿瘝锛?> **鎶€鏈?*锛歐ordPress **page** + **Elementor 8 section** + REST `update`锛?context=edit锛? 椤靛凡瀛樺湪鐢?updatePage锛?> **淇**锛?026-06-22 V2锛圲I 瀵归綈 about/棣栭〉锛涙按鏅跺崱鐢?stone-core-data 鐧剧瀛楁锛涘幓 S5锛汣TA+Related 鍒嗗紑锛況elated 鍥剧敤 intention heroImage锛?
---

## 0. 瀹氫綅锛圛ntention 鏄喘涔?Hub锛屼笉鏄?condition 闀挎枃锛?
| 椤甸潰 | 涓績 | 褰㈡€?| URL |
|---|---|---|---|
| Crystal Meaning锛堢櫨绉戯級 | 姘存櫠 | post锛屼笁瑙嗚 | `/gemstone/{slug}-meaning/` |
| Condition 椤?| 闂 | post锛孲EO 闀挎枃 1200-1800 璇?| `/crystals-for-{condition}/` |
| **Intention Page锛堟湰鏂囷級** | **璐拱** | **page锛孍lementor 钀ラ攢椤碉紝鍐呭娣卞害 > 棣栭〉** | `/{intention}` |

- **UI 鍙傝€冮椤?about**锛堜笉鏄?condition锛夛細Elementor 钀ラ攢椤佃瑙?鈥斺€?Hero 鍏ㄥ睆鍥?overlay / 鍥炬枃宸﹀彸浜ゆ浛 / 鍗＄墖缃戞牸 / 鍦烘櫙鍗?/ CTA banner
- **鍐呭娣卞害 > 棣栭〉**锛垀1300 璇嶏紝棣栭〉姒傝 ~500 璇嶏級锛涗笁瑙嗚涓嶅睍寮€锛屽唴閾剧櫨绉?- intention = Hub锛宑ondition = Spoke锛涘紩瀵兼繁璇诲埌 condition锛宑ondition closing 寮曞洖 intention

---

## 1. URL 缁撴瀯

`/{intention-slug}/`锛堟牴绾?WordPress page锛?A 搂涓夛級銆? slug锛歝alm-mindfulness / love-relationships / protection-clearing / abundance-success / health-vitality / personal-empowerment / transformation / spiritual-connection

> 鈿狅笍 涓嶇敤杩囨椂 B 濂楋紙sleep-calm/anxiety-relief/focus-clarity锛屽凡褰掓。 _archive/锛夈€? tag锛坈alm/love/...锛夋槸浜у搧鎵?tag锛屸墵 椤甸潰 slug銆?
---

## 2. 鍏冧俊鎭?+ TKD + 鎶€鏈?
| 瀛楁 | 瑙勫垯 |
|---|---|
| Post Type | WordPress **page**锛圗lementor锛岄潪 post锛墊
| H1 | 涓婚 Page Title 鍖鸿緭鍑猴紙瀹炴祴閲嶅锛屾湰椤典笉鍐?H1锛墊
| rank_math_title | `{Intention} Crystals: {Hook}` |
| rank_math_focus_keyword | 瑙?搂9 |

鎶€鏈細8 椤靛凡瀛樺湪锛坕d 16879-16886锛夆啋 `updatePage(pageId, data, status)`锛宍POST /wp-json/wp/v2/pages/{id}?context=edit`锛宮eta `_elementor_data`+`_elementor_edit_mode:builder`+`_elementor_template_type:wp-page`锛屼笉浼?slug/title銆?*Elementor 鑷韩缂撳瓨**锛歊EST 鏀?_data 鍚庡墠绔笉鍒锋柊锛堟墜鍐屄?7锛岄潪缂撳瓨鎻掍欢锛夛紝闇€鍚庡彴 Elementor鈫掑伐鍏封啋銆岄噸鏂扮敓鎴愭枃浠朵笌鏁版嵁銆嶃€?
---

## 3. 椤甸潰妗嗘灦锛圴2锛? section锛孶I 瀵归綈 about/棣栭〉锛?
| # | Section | H | 鍐呭 | 瀵归綈 |
|---|---|---|---|---|
| S1 | Hero | 鈥?| 鍏ㄥ睆鑳屾櫙鍥?heroImage)+overlay+涓诲紶(heroSubtitle)+Shop CTA | about S1 |
| S2 | 鎰忓浘鍏遍福 | H2 | 鍥炬枃宸﹀彸锛欰 Quick Answer(quickAnswer)+鍚堣閿氱偣 | about S2 |
| S3 | 鎰忓浘鏁呬簨 | H2 | 鍥炬枃鍙嶅悜锛歎nderstanding(understanding 150-250璇? | about S3 |
| S4 | 姘存櫠鍗?| H2+H3 | 3鍒楀崱锛氬浘+鍚?Meanings/Best for/Chakras/Mineral锛?*stone-core-data**锛?Learn link | about S4 |
| S5 | Shop | H2 | wdProductsWidget | 棣栭〉 S3 |
| S6 | FAQ | H2 | accordion 5-7闂紙鍚?scientifically proven + 鍚堣闂級| condition M9 |
| S7 | CTA banner | 鈥?| 鍏ㄥ睆 heroImage+overlay+Find Your X Crystal+Shop | about S8 |
| S8 | Related | H2 | 鐩稿叧 intention 鍗?heroImage)+condition 娣辫鎸夐挳 | about+棣栭〉 |

**V2 璋冩暣**锛氣憼 鍘讳娇鐢ㄥ満鏅?S5锛坆est_for 宸插惈鍦烘櫙锛夆憽 姘存櫠鍗＄敤 stone-core-data锛堝幓鎵嬪啓 why/desc锛夆憿 S7/S8 CTA+Related 鍒嗗紑 鈶?related 鍥剧敤 intention heroImage銆傛按鏅跺崱瀛楁锛歯ame/image/link + meanings/best_for/chakras/mineral锛坈olor路hardness锛夈€?
---

## 4. S5 浜у搧琛旀帴

`wdProductsWidget(count)`锛坋lementor-utils锛夋殏鏃犳剰鍥剧瓫閫夈€侭 姝ユ墿鎴愭寜鎰忓浘 tag 鎷夛紙tagsIds锛夈€傝繃娓★細鐭崇 category id OR銆?
---

## 5. 鍥剧墖閰嶇疆

| 鍥?| 鏉ユ簮 |
|---|---|
| heroImage | 鐢熷浘锛坓enerate-intention-images锛宮oleapi gpt-image-2锛屾剰鍥句富棰樺満鏅級|
| 姘存櫠鍗″浘 | 鐢熷浘 crystal-{slug}.webp锛坈loseup锛岃法椤靛鐢級|
| related 鍗″浘 | 瀵瑰簲 intention heroImage锛? 椤典簰濉級|

鍥惧凡涓婁紶 WP锛坢edia 42972-43006锛?026/06锛夈€俢onfig image 瀛?WP url銆?
---

## 6. 鍚堣杈圭晫锛堢户鎵?condition 搂6锛? 鎰忓浘鐗瑰寲锛?
绂佺敤锛歨eal/cure/treat鈫抯upport锛沞nergy/vibration鈫抪resence锛?attract/guarantee/100%"鈫抯ymbolize/represent銆? 鎰忓浘鏁忔劅鐐癸細
- Health锛堟渶鏁忔劅锛岀鍖荤枟鍖栵級鈫?"support wellbeing alongside professional care, not a treatment"
- Protection锛堜笉鎸＄伨锛夆啋 "symbolic grounding anchors, not a substitute for safety"
- Abundance锛堜笉鑷村瘜锛夆啋 "represent prosperity intentions, not promises of riches"
- Love锛堜笉鎸藉洖锛夆啋 "support self-love, not a substitute for relationship work"

鍚堣閿氱偣 3 浣嶇疆锛歋2 quickAnswer 鏈?+ S6 FAQ 鍚堣闂?+ footer銆?
---

## 7. 鍘籄I鍖?
閬垮厤 AI 鍙ュ紡锛圛n conclusion/important to note锛夛紱鍏蜂綋鍦烘櫙锛涗笉瀵圭О鍙ラ暱锛涘姘存櫠鎻忚堪鍘绘ā鏉裤€?
---

## 8. 鍐呴摼锛坕ntention hub锛?A 搂4.2锛?
S4 鈫?Crystal Meaning 鐧剧锛汼8 鈫?鐩稿叧 intention + condition 娣辫銆傛瘡椤?5-15 鍐呴摼銆?
---

## 9. 鍏剰鍥炬竻鍗曪紙鍏抽敭璇?+ 閫夌煶 + condition 瀵瑰簲锛?
| Intention (slug) | focus_keyword (volume) | 閫夌煶(tag-map) | condition 娣辫 |
|---|---|---|---|
| Calm (calm-mindfulness) | crystals for calm | amethyst/lepidolite/howlite/amazonite/selenite/angelite | anxiety/stress/sleep |
| Love (love-relationships) | crystals for love (880) | rose-quartz/moonstone/rhodonite/lapis/aventurine/carnelian | love/self-love/emotional-healing |
| Protection (protection-clearing) | crystals for protection (9900) | black-tourmaline/obsidian/tiger-eye/amethyst/labradorite/hematite | protection/grounding |
| Abundance (abundance-success) | crystals for abundance (1000) | citrine/pyrite/aventurine/tiger-eye/quartz/carnelian | abundance/money/success |
| Health (health-vitality) | crystals for health (1000)鈿狅笍 | ruby/bloodstone/red-jasper/carnelian/hematite/jade | health/strength/motivation |
| Personal (personal-empowerment) | crystals for confidence (590) | tiger-eye/carnelian/citrine/pyrite/labradorite/quartz | confidence/courage/motivation |
| Transformation (transformation) | crystals for new beginnings (590) | labradorite/moonstone/malachite/lepidolite/serpentine/aventurine | new-beginnings/transformation |
| Spiritual (spiritual-connection) | crystals for spiritual growth | amethyst/quartz/selenite/lapis/labradorite/kyanite | spiritual/meditation/intuition |

---

## 10. 鏂规硶璁哄榻?
intention = Elementor 钀ラ攢椤碉紙UI 棣栭〉/about锛屽唴瀹规繁搴︽帴杩?condition 浣嗘洿杞伙級锛屼笁瑙嗚涓嶅睍寮€锛屾按鏅跺崱鐢?stone-core-data 鐧剧瀛楁锛堟湁渚濇嵁锛岄潪鎵嬪啓锛夈€傛瘮 condition 杞汇€佹瘮棣栭〉娣便€?
---

**鐘舵€?*锛歏2锛坕ntention-category.js + calm config 宸叉仮澶?V2锛? config 寰呮寜 calm 妯℃澘閲嶅缓锛夈€備笅涓€姝ワ細calm 瀹氱 鈫?鎵归噺 7 config 鈫?妗嗘灦鏂囨。鎸佺画鏍″噯 鈫?閲嶉摵锛堟竻 Elementor 缂撳瓨鐪?V2锛夈€?
