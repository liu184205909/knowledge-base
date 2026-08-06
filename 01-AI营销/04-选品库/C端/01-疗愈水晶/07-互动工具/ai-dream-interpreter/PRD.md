# AI Dream Interpreter — PRD v2(可执行规格)

> 日期: 2026-07-09
> 状态: 可执行(review C1-C3/M1-M4/m1-m3 + DeepSeek 隐私硬门已落)
> URL: `/tools/ai-dream-interpreter/`
> 架构权威: `02-网站规划/AI-Dream-Interpreter-数据层与工具设计.md` v3
> 数据层基线: `data/core-dream-symbols.json` v1.2(30 梦象,已加 trigger_words)
> LLM 范本: `07-互动工具/ai-tarot-chat/build/snippet.php`(皇冠 AI 塔)
> v2 变更: C1 trigger_words / C2 $t0 / C3 CTA 映射算法 / M1-M4 字段统一+降级baked+函数实现+对象名id / m1-m3 验收/repair/正则 / DeepSeek 隐私硬门

---

## 1. 执行基线(7 条定死)

1. **数据层基线 = `core-dream-symbols.json` v1.2**(30 梦象,含 `trigger_words` + evidence_notes + digest_hint + determinism_blocks + shop_url 全验证)。
2. **public-symbol-index** 从 core 派生(id/symbol/category/keywords/**trigger_words**),前端联想/高亮,不喂 LLM。
3. **server-dream-digest** 从 core 的 `digest_hint + trigger_words + crystal_mapping + compliance_trigger` 派生,注入 prompt + 后端匹配。
4. **后端匹配 = `trigger_words` 字面词 stripos**(C1 修正:keywords 是抽象维度词只给 LLM,**不能用于匹配**)。
5. **合规拦截路径 = `symbol.compliance_trigger.determinism_blocks`**(后端 post-process 按此数组拦截)。
6. **CTA URL 后端填,LLM 不生成**(LLM 出 crystal `name+why`,后端按 name 归一化查 `crystal_mapping` 取已 baked 的 shop_url;**降级已在 core baked,后端不做 L1/L2/L3 判断**)。
7. **验收测试集 = core 的 30 梦象**,跑命中率(核心 trigger_words 命中 ≥80% / fallback ≤20%)。

---

## 2. 文件结构

```
07-互动工具/ai-dream-interpreter/
  PRD.md                          # 本文档
  generate.js                     # 生成 HTML(wp:html + base64)
  build/snippet.php               # ajax handler(action ect_dream_interpret)
  build/ai-dream-interpreter.html # 主页(含 base64 JS)
  build/gen-snippet.js            # Code Snippets REST 注册
  data/
    core-dream-symbols.json       # 源 v1.2(30 梦象,已完成)
    public-symbol-index.json      # 派生(前端轻量,含 trigger_words)
    server-dream-digest.json      # 派生(后端 prompt + 匹配,含 trigger_words)
    cta-by-slug.json              # shop_url 验证记录
    derive-data.py                # 派生脚本(M1,已跑)
```

---

## 3. 数据层

### 3.1 core-dream-symbols.json v1.2(基线,已完成)

30 梦象,8 类 category。单对象 schema(字段顺序):

```json
{
  "id": "sym_xxx",
  "symbol": "...",
  "category": "animal|body|scene|emotion|spiritual|disaster|object|person",
  "dream_type": null,
  "keywords": ["..."],              // 抽象维度词, 给 LLM 做维度提示(如 transformation/fear); NOT 匹配用
  "trigger_words": ["..."],         // 字面识别词, 后端 stripos 匹配用(如 snake/serpent/python)
  "evidence_notes": "...",          // 长版依据, 人审用, NOT 进 prompt
  "digest_hint": "...(300-550 字符, 进 prompt)",
  "crystal_mapping": {
    "primary": {"slug":"...","shop_url":"...","why":"...","shop_url_validated":true,"cta_level":"L1|L2|L3"},
    "variant_xxx": {...}
  },
  "compliance_trigger": {
    "not_medical_advice": true, "not_mental_health_diagnosis": true,
    "not_a_religious_ruling": true, "religious_sensitivity": false,
    "determinism_blocks": []        // 命中: death/pregnant/blood/fire/tornado/drowning/earthquake
  },
  "shop_url_validated": true
}
```

**keywords vs trigger_words 边界(写死)**:keywords 进 server-dream-digest 给 LLM 维度提示;trigger_words 进 server-dream-digest 给后端 stripos 匹配。两者职责分离,**绝不混用**。

### 3.2 public-symbol-index.json(前端派生)

```json
[{"id":"sym_snake","symbol":"snake","category":"animal","keywords":[...],"trigger_words":["snake","serpent",...]}]
```
5 字段。前端输入时联想/高亮(用户打"snake"高亮),非权威,不喂 LLM。base64 ascii 注入。

### 3.3 server-dream-digest.json(后端派生 — M1 修正字段统一)

```json
[{
  "id":"sym_snake","symbol":"snake","category":"animal",
  "keywords":[...],"trigger_words":["snake","serpent",...],
  "digest_hint":"...",
  "crystal_mapping":{
    "primary":{"slug":"black-tourmaline-meaning","why":"...","shop_url":"/product-category/black-tourmaline-crystals/","cta_level":"L1"},
    "variant_transformation":{...}
  },
  "compliance_trigger":{"not_medical_advice":true,"not_mental_health_diagnosis":true,"not_a_religious_ruling":true,"religious_sensitivity":false,"determinism_blocks":[]}
}]
```
**evidence_notes 不进**(只人审)。crystal_mapping 含 `slug/why/shop_url/cta_level`(M1: 后端 CTA 查表用 shop_url+cta_level)。compliance_trigger 全量(含 determinism_blocks)。

### 3.4 derive-data.py(已跑,见 data/)

从 core 生成 public-symbol-index + server-dream-digest(均含 trigger_words)。

---

## 4. 后端 snippet.php(从皇冠 `snippet.php` 派生)

### 4.1 常量与注册(同皇冠骨架)

```php
<?php
if (!defined('ABSPATH')) { exit; }
// 复用皇冠 .env 解析(ABSPATH/.env, DEEPSEEK_API_KEY)
if (getenv('DEEPSEEK_API_KEY') === false) { /* 同皇冠 line 16-34 .env 解析 */ }
define('EDI_DEEPSEEK_KEY', getenv('DEEPSEEK_API_KEY') ?: 'sk-REPLACE');
define('EDI_DEEPSEEK_URL', 'https://api.deepseek.com/v1/chat/completions');
define('EDI_DAILY_LIMIT_IP', 15);
define('EDI_DAILY_LIMIT_GLOBAL', 500);  // 站点级 cost cap
define('EDI_MAX_INPUT', 4000);
define('EDI_MIN_INPUT', 10);
define('EDI_DIGEST_B64', '...');  // server-dream-digest.json 的 ascii base64
// 拦截正则模式数组(m3)
define('EDI_BLOCK_PATTERNS', [
  '/this dream means you (will|are going to)/i',
  '/god is telling you/i',
  '/(sign|omen) that you (are|will) (be )?(sick|ill|die|pregnant)/i',
  '/(crystal|stone) will (cure|heal|protect|guarantee|treat)/i',
  '/(islam|the bible|quran) (says|states|commands) you (must|should)/i',
  '/you have (trauma|depression|anxiety|ptsd) because/i',
  '/you will (die|be betrayed|get (sick|pregnant))/i',
]);
add_action('wp_ajax_ect_dream_interpret', 'edi_interpret_handler');
add_action('wp_ajax_nopriv_ect_dream_interpret', 'edi_interpret_handler');
```

### 4.2 handler(C2 修正: $t0 定义)

```php
function edi_interpret_handler() {
    $t0 = microtime(true);  // C2: STEP 1 前定义, 供 STEP 7 edi_parse_json 判断 elapsed

    // STEP 1: 反滥用 5 道(nonce + same-origin + honeypot + min/max input)
    edi_check_abuse();

    // STEP 2: IP 限流(CF→XFF→REMOTE_ADDR) + global cost cap
    $ip = edi_get_client_ip();
    if (!edi_rate_limit_ip($ip)) { wp_send_json_error(['message'=>'Daily limit reached.'], 429); }
    if (!edi_rate_limit_global()) { wp_send_json_error(['message'=>'Service busy, try later.'], 429); }

    // STEP 3: 输入
    $dream = isset($_POST['dream_text']) ? sanitize_text_field(wp_unslash($_POST['dream_text'])) : '';
    $emotion = isset($_POST['emotion']) ? sanitize_key($_POST['emotion']) : 'balanced';
    $lens = isset($_POST['lens']) ? sanitize_key($_POST['lens']) : 'balanced';
    if (mb_strlen(trim($dream)) < EDI_MIN_INPUT) { wp_send_json_error(['message'=>'Tell us more about your dream.'], 400); }
    if (mb_strlen($dream) > EDI_MAX_INPUT) { $dream = mb_substr($dream, 0, EDI_MAX_INPUT); }

    // STEP 4: 后端权威匹配(C1: trigger_words stripos, 不信前端 hint)
    $digest = json_decode(base64_decode(EDI_DIGEST_B64), true);
    $ranked = edi_match_symbols($dream, $digest);   // 按 trigger_words 命中数排序
    $top = array_slice($ranked, 0, 5);
    $fallback = array_slice($ranked, 5, 10);
    if (empty($top)) { $top = array_slice($digest, 0, 5); $fallback = array_slice($digest, 5, 10); }  // 零命中兜底: 用前几个常见梦象

    // STEP 5: system prompt(server digest + 全局合规常驻 + persona + output contract)
    $system = edi_build_system_prompt(array_merge($top, $fallback), $emotion, $lens);

    // STEP 6: 单次 DeepSeek(json_object, 25s hard timeout)
    $body = wp_json_encode([
        'model'=>'deepseek-chat',
        'messages'=>[['role'=>'system','content'=>$system],['role'=>'user','content'=>$dream]],
        'response_format'=>['type'=>'json_object'],
        'max_tokens'=>1800, 'temperature'=>0.7,
    ]);
    $resp = wp_remote_post(EDI_DEEPSEEK_URL, ['timeout'=>25,
        'headers'=>['Authorization'=>'Bearer '.EDI_DEEPSEEK_KEY,'Content-Type'=>'application/json'],'body'=>$body]);
    if (is_wp_error($resp)) { wp_send_json_error(['message'=>'Briefly unavailable. Try again.'], 502); }
    $content = json_decode(wp_remote_retrieve_body($resp), true)['choices'][0]['message']['content'] ?? '';

    // STEP 7: JSON 兜底(不降级纯文本)
    $result = edi_parse_json($content, microtime(true) - $t0);
    if (!$result) { wp_send_json_error(['message'=>'Could not read this dream. Try rephrasing.'], 502); }

    // STEP 8: 后端 post-process(CTA 填 + compliance 拦截)
    $result = edi_safety_postprocess($result, $top);
    wp_send_json_success(['result' => $result]);
}
```

### 4.3 关键函数实现(M3 补全)

**`edi_get_client_ip()`**(P3):
```php
function edi_get_client_ip() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return trim($_SERVER['HTTP_CF_CONNECTING_IP']);
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    return $_SERVER['REMOTE_ADDR'];
}
```

**`edi_match_symbols()`**(C1 修正: trigger_words):
```php
function edi_match_symbols($dream, $digest) {
    $dream_lower = ' ' . strtolower($dream) . ' ';  // 词边界 padding
    $scored = [];
    foreach ($digest as $obj) {
        $hits = 0;
        foreach ($obj['trigger_words'] as $tw) {
            if (strpos($dream_lower, ' ' . strtolower($tw)) !== false) $hits++;  // 简单前缀词边界
        }
        if ($hits > 0) $scored[] = ['obj'=>$obj, 'hits'=>$hits];
    }
    usort($scored, fn($a,$b)=> $b['hits'] <=> $a['hits']);
    return array_column($scored, 'obj');
}
```

**`edi_safety_postprocess()`**(C3 + M2: CTA 映射 + 降级 baked):
```php
function edi_safety_postprocess($result, $top_symbols) {
    // 1. compliance 拦截正则(m3 patterns)
    $text = json_encode($result);
    foreach (EDI_BLOCK_PATTERNS as $p) {
        if (preg_match($p, $text)) {
            // 命中禁止表达 → 替换为安全模板或置 safety_note
            $result['safety_note'] = 'This reflection is symbolic only — not a prediction, diagnosis, or guarantee.';
            break;
        }
    }
    // 2. determinism_blocks 二次校验(读 compliance_trigger.determinism_blocks)
    foreach ($top_symbols as $s) {
        $db = $s['compliance_trigger']['determinism_blocks'] ?? [];
        if (in_array('death_prediction', $db) && preg_match('/you will (die|pass away|not survive)/i', $text)) { /* 拦截 */ }
        if (in_array('pregnancy_prediction', $db) && preg_match('/(you are|will (be|get)) pregnant/i', $text)) { /* 拦截 */ }
        if (in_array('disaster_prediction', $db) && preg_match('/(a real|an actual) (fire|storm|earthquake|disaster) will/i', $text)) { /* 拦截 */ }
        if (in_array('medical_outcome', $db) && preg_match('/(you (will|are) )?(have|get|develop) (cancer|an? (illness|disease|tumor|infection)|sick)/i', $text)) { /* 拦截 */ }
        if (in_array('bleeding_prediction', $db) && preg_match('/(you will|going to) (bleed|hemorrha|lose blood)/i', $text)) { /* 拦截 */ }
        // religious_sensitivity(用 id 引用, M4)
        if ($s['id'] === 'sym_dead_friend_relative' && $s['compliance_trigger']['religious_sensitivity']) {
            $result['safety_note'] = ($result['safety_note'] ?? '') . ' Not a religious ruling on the afterlife.';
        }
    }
    // 3. CTA 后端填(C3: name 归一化查表; M2: 降级已 baked, 直接取 shop_url)
    $all_maps = [];
    foreach ($top_symbols as $s) {
        foreach ($s['crystal_mapping'] as $v) { $all_maps[strtolower(preg_replace('/[^a-z0-9]/','', $v['slug']))] = $v; }
    }
    foreach ($result['crystal_matches'] as &$cm) {
        $norm = strtolower(preg_replace('/[^a-z0-9]/','', $cm['name']));  // name 归一化
        // 匹配 slug: 尝试 name→meaning 后缀 + 直接
        $key1 = $norm;
        $key2 = $norm . 'meaning';
        if (isset($all_maps[$key2])) { $cm['cta_url'] = $all_maps[$key2]['shop_url']; }
        elseif (isset($all_maps[$key1])) { $cm['cta_url'] = $all_maps[$key1]['shop_url']; }
        else {
            // LLM 出 core 外水晶 → fallback 命中 symbol 的 primary
            $cm['cta_url'] = $top_symbols[0]['crystal_mapping']['primary']['shop_url'] ?? '/crystals-for-dreams/';
        }
    }
    return $result;
}
```

**`edi_parse_json()`**(m2: repair prompt + timeout):
```php
function edi_parse_json($content, $elapsed) {
    $r = json_decode($content, true);
    if ($r) return $r;
    if (preg_match('/\{.*\}/s', $content, $m)) { $r = json_decode($m[0], true); if ($r) return $r; }
    $fixed = rtrim($content); if (substr($fixed,-1) !== '}') $fixed .= '}';
    $r = json_decode($fixed, true); if ($r) return $r;
    // 仅 <8s 轻量 repair(m2: 显式 timeout + prompt)
    if ($elapsed < 8) {
        $repair_body = wp_json_encode([
            'model'=>'deepseek-chat',
            'messages'=>[
                ['role'=>'system','content'=>'Return ONLY a valid JSON object matching the schema. No prose, no code fences.'],
                ['role'=>'user','content'=>$content],
            ],
            'response_format'=>['type'=>'json_object'], 'max_tokens'=>1800,
        ]);
        $resp = wp_remote_post(EDI_DEEPSEEK_URL, ['timeout'=> max(5, 15 - (int)$elapsed),
            'headers'=>['Authorization'=>'Bearer '.EDI_DEEPSEEK_KEY,'Content-Type'=>'application/json'],'body'=>$repair_body]);
        if (!is_wp_error($resp)) { $r = json_decode(wp_remote_retrieve_body($resp), true)['choices'][0]['message']['content'] ?? ''; $r = json_decode($r, true); if ($r) return $r; }
    }
    return null;  // 仍失败 → 502(不降级纯文本)
}
```

**`edi_build_system_prompt()`**(M3: emotion/lens 参数化):persona 固定 + 全局合规常驻(§5)+ server digest(命中候选)+ output contract;emotion/lens 仅影响 user message 附加("User context: emotion=afraid, lens=balanced"),不重构 persona。

**`edi_check_abuse()` / `edi_rate_limit_ip()` / `edi_rate_limit_global()`**:nonce `check_ajax_referer('edi_public','nonce')` + Origin 同源 + honeypot + transient per-IP/global(option 计数)。

---

## 5. System prompt(E2: 全局合规常驻)

```
[PERSONA]
You are a reflective dream interpreter. Symbolic, psychological, cultural lenses.
NOT a clinician/therapist/religious authority/prophet. English only.

[GLOBAL COMPLIANCE — 常驻, 不随 digest 裁剪]
- Reflective/symbolic/personal. Do NOT diagnose mental illness.
- Do NOT predict death/illness/pregnancy/betrayal/divine command/guaranteed future.
- Religious framing = cultural/interpretive only; NEVER issue a ruling.
- Crystals = ritual/reflection tools, NOT treatments/cures/guarantees/protection.
- Do NOT name/cite any dream dictionary, website, or scholar.

[SERVER DIGEST — top5 + fallback]
Symbol: snake (animal). [digest_hint]
  Crystals: Black Tourmaline (boundary/protection), Labradorite (transformation). NOT cures.
  Dimensions: [keywords - 给 LLM 做维度提示]
...

[OUTPUT CONTRACT]
Return ONLY valid JSON: {summary, symbols[], psychological_lens, spiritual_lens,
crystal_matches[{name,why}], reflection_prompt, safety_note}.
Do NOT include cta_url (backend fills). Do NOT cite sources.
```

---

## 6. Output JSON contract(E1: LLM 不出 URL)

LLM 输出:`{summary, symbols[{name,meaning,confidence}], psychological_lens, spiritual_lens, crystal_matches[{name,why}], reflection_prompt, safety_note}`
后端 post-process 补 `cta_url`(§4.3):`crystal_matches[{name,why,cta_url}]`。

---

## 7. 前端

UI:Hero(4000 字输入 + emotion/lens + honeypot + nonce)/ loading skeleton(15s soft timeout)/ 结果 6 模块 / crystal cards(cta_url 后端填)/ SEO 区。public-symbol-index 联想(含 trigger_words 高亮)。base64 JS `atob→eval`(参考皇冠 line 206-211)。POST `window.EDI_AJAX_URL` action=ect_dream_interpret。

---

## 8. generate.js + WP 部署

generate.js 生成 wp:html + base64 + ascii public-symbol-index。部署:derive-data.py 派生 → EDI_DIGEST_B64 填 snippet.php → Code Snippets REST 注册(curl 非 urllib,查重防双 active)→ 复用 .env DEEPSEEK_API_KEY → 建 page 嵌 wp:html → TKD(rank_math updateMeta 带 UA)→ mega menu(snippet19)。

---

## 9. 验收(m1: 12 条脚本化定义)

| # | 条目 | 脚本化方式 |
|---|---|---|
| 1 | 命中率 ≥80% / fallback ≤20% | 30 梦象输入(trigger_words 在 dream text 里),统计 `edi_match_symbols` 命中数;命中 top5 算 core 命中,兜底算 fallback |
| 2 | JSON schema 校验 | 50/500/2000/4000 字 4 档输入 ×5,assert schema 字段齐全 |
| 3 | JSON 失败不降级纯文本 | mock DeepSeek 返非法 JSON,断言 502(非纯文本) |
| 4 | 宗教 0 ruling | 输入 snake-spiritual/pregnant-biblical/dead-relative,正则扫 ruling 词 |
| 5 | 医疗/预言拦截 | 7 determinism 对象构造预言输入,断言 EDI_BLOCK_PATTERNS 命中 |
| 6 | 水晶 0 治疗/保证 | 正则扫 crystal_matches 输出 |
| 7 | Shop URL 200 或降级 | curl 所有 result.cta_url;L2(`/shop/?s=`)额外验 DOM 含 `.wd-products`(v3 §10.2) |
| 8 | P95 <15s | 30 跑计时取分位 |
| 9 | 限流 | 第 16 次 429 / 501 次全站 429 |
| 10 | 反滥用 | nonce 失败/无 origin/honeypot/min<10 各构造 |
| 11 | 隐私无原文落库(m1) | 扫 3 处:`grep -ri "dream_text" wp-content/debug.log*`(应空)/ DeepSeek 请求 body 不打 WP log / transient key 仅 `edi_rl_<hash>` 不含原文 |
| 12 | SEO 文案(m1 半脚本化) | 脚本校验:Title/Meta/H1/FAQ 字段齐全 + `ai dream interpreter` 出现 ≥3 次;**意图承接度需人审**(标注半脚本化) |

---

## 10. DeepSeek 隐私硬门(开发前必须落实)

基于 DeepSeek Open Platform Terms + Privacy Policy 核验(API key 不应暴露浏览器 → **支持 admin-ajax 后端代理**;平台要求开发者向终端用户披露隐私处理;隐私政策会收集 input/prompts):

1. **页面文案**(hero/隐私区):"Your dream text is sent to a third-party AI service (DeepSeek) to generate this interpretation. We do not store your dream text, and you don't need an account."
2. **后端日志**(§4.2 handler):**绝不记 `dream_text`**。错误日志只记:`request_id`(随机)/ HTTP status / latency / matched symbol ids / error type。WP debug.log + 任何自定义日志均遵守。
3. **transient**:仅存限流计数 `edi_rl_<ip_hash>_<date>`,不含原文。
4. **DeepSeek 请求 body**:不打 WP 日志(只在 wp_remote_post 失败时记 status,不记 body)。
5. 隐私政策页同步更新(第三方 AI 处理条款)。
6. **server access log**:确认 Nginx/Apache access log 不记 `$request_body`(检查 log format 无该字段;WP admin-ajax POST body 默认不进 access log,但自定义 log format 可能记 — 必须核验)。§9 验收第 11 条扫描范围含此检查。

---

## 11. 里程碑

| # | 产出 | 状态 |
|---|---|---|
| M1 | derive-data.py + public/server-digest(含 trigger_words) | ✅ 完成 |
| M2 | dream snippet.php(§4 实现,含 C2/C3/M3) | 待开(review 已过) |
| M3 | 前端 HTML(generate.js + UI + base64) | M2 后 |
| M4 | WP 部署(snippet 注册 + page + TKD + mega menu) | M3 后 |
| M5 | 30 梦象验收(§9)+ 真实 DeepSeek 联调 | M4 后 |
| 硬门 | DeepSeek 隐私(§10) | 开发前 + 上线前 |

---

*PRD v2 完成于 2026-07-09 | review(C1-C3/M1-M4/m1-m3)已落 + DeepSeek 隐私硬门 | 基于 core v1.2(30 梦象,含 trigger_words)| 下游:M2 snippet.php*
