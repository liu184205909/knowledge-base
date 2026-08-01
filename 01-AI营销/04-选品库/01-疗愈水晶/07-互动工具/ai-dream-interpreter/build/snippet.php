<?php
/**
 * AI Dream Interpreter — admin-ajax endpoint (snippet for Code Snippets plugin) v2
 * Action: ect_dream_interpret
 * POST: dream_text, emotion, lens, nonce (edi_public), honeypot (edi_hp)
 * Returns: {success:true, data:{result}} | {success:false, data:{message}}
 *
 * v2 修: safety_postprocess 命中即重置(Critical) + Origin 严格比较(Major) + XFF 可信代理(Major) + trigger_words 词边界(Minor)
 *
 * 安全/隐私硬约束:
 *   - DeepSeek key 仅 PHP 常量, 不暴露前端
 *   - 不记 dream_text(无日志调用)
 *   - 不信前端 hint, 后端 trigger_words 权威重匹配
 *   - LLM 不输出 URL, 后端 normalize 查 crystal_mapping 填 cta_url
 *   - 命中 block/determinism → safe fallback 重置违规内容(非贴声明)
 *   - 所有错误通用文案, 不泄上游
 */
if (!defined('ABSPATH')) { exit; }

// ============ 常量 ============
if (getenv('DEEPSEEK_API_KEY') === false) {
    $_envFile = ABSPATH . '.env';
    if (is_readable($_envFile)) {
        foreach (file($_envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $_line) {
            $_line = trim($_line);
            if ($_line === '' || $_line[0] === '#') continue;
            if (strpos($_line, '=') === false) continue;
            list($_k, $_v) = explode('=', $_line, 2);
            $_k = trim($_k); $_v = trim($_v);
            $_len = strlen($_v);
            if ($_len >= 2 && (($_v[0] === '"' && $_v[$_len - 1] === '"') || ($_v[0] === "'" && $_v[$_len - 1] === "'"))) {
                $_v = substr($_v, 1, -1);
            }
            if (getenv($_k) === false) putenv($_k . '=' . $_v);
        }
    }
}
define('EDI_DEEPSEEK_KEY', getenv('DEEPSEEK_API_KEY') ?: 'sk-REPLACE_WITH_KEY');
define('EDI_DEEPSEEK_URL', 'https://api.deepseek.com/v1/chat/completions');
define('EDI_DAILY_LIMIT_IP', 15);
define('EDI_DAILY_LIMIT_GLOBAL', 500);
define('EDI_MAX_INPUT', 4000);
define('EDI_MIN_INPUT', 10);
define('EDI_DIGEST_FILE', ABSPATH . 'wp-content/uploads/edi/server-dream-digest.json');
// digest base64 内联(M4: 自包含部署, 对齐皇冠 EAC_DIGEST_B64; gen-snippet.js 部署时用 server-dream-digest.json base64 替换 ___DIGEST_B64___)
define('EDI_DIGEST_B64', '___DIGEST_B64___');
// 可信代理段(配置: 实际前置代理/CDN 的源 IP; XFF 仅当 REMOTE_ADDR 属此列表才信)
define('EDI_TRUSTED_PROXIES', array('127.0.0.1', '::1'));

// 拦截正则(禁止表达)
define('EDI_BLOCK_PATTERNS', [
    '/this dream means you (will|are going to)/i',
    '/god is telling you/i',
    '/(sign|omen) that you (are|will) (be )?(sick|ill|die|pregnant)/i',
    '/(crystal|stone) will (cure|heal|protect|guarantee|treat)/i',
    '/(islam|the bible|quran) (says|states|commands) you (must|should)/i',
    '/you have (trauma|depression|anxiety|ptsd) because/i',
    '/you will (die|be betrayed)/i',
]);

add_action('wp_ajax_ect_dream_interpret', 'edi_interpret_handler');
add_action('wp_ajax_nopriv_ect_dream_interpret', 'edi_interpret_handler');

// wp_footer 注入 EDI_WP(ajaxUrl + nonce) — 供前端 base64 JS 用(M3 前后端胶水; nonce 用于 check_ajax_referer('edi_public'))
add_action('wp_footer', 'edi_inject_wp_vars');
function edi_inject_wp_vars() {
    echo "<script>window.EDI_WP = {ajaxUrl: '" . esc_js(admin_url('admin-ajax.php')) . "', nonce: '" . esc_js(wp_create_nonce('edi_public')) . "'};</script>\n";
}

// ============ handler (8 步) ============
function edi_interpret_handler() {
    $t0 = microtime(true);

    // STEP 1: 反滥用(nonce + origin 严格 + honeypot)
    edi_check_abuse();

    // STEP 2: IP 限流(per-IP + global cost cap)
    $ip = edi_get_client_ip();
    if (!edi_rate_limit($ip, EDI_DAILY_LIMIT_IP)) {
        wp_send_json_error(array('message' => 'Daily limit reached. Please come back tomorrow.'), 429);
    }
    if (!edi_rate_limit('global_' . date('Y-m-d'), EDI_DAILY_LIMIT_GLOBAL)) {
        wp_send_json_error(array('message' => 'Service busy, please try again later.'), 429);
    }

    // STEP 3: 输入(不记日志)
    $dream = isset($_POST['dream_text']) ? sanitize_text_field(wp_unslash($_POST['dream_text'])) : '';
    $emotion = isset($_POST['emotion']) ? sanitize_key($_POST['emotion']) : 'balanced';
    $lens = isset($_POST['lens']) ? sanitize_key($_POST['lens']) : 'balanced';
    if (mb_strlen(trim($dream)) < EDI_MIN_INPUT) {
        wp_send_json_error(array('message' => 'Tell us a bit more about your dream.'), 400);
    }
    if (mb_strlen($dream) > EDI_MAX_INPUT) {
        $dream = mb_substr($dream, 0, EDI_MAX_INPUT);
    }

    // STEP 4: 读 digest(优先 base64 内联 EDI_DIGEST_B64; 回退外部 EDI_DIGEST_FILE)+ trigger_words 匹配(后端权威, 不信前端 hint)
    $digest_raw = base64_decode(EDI_DIGEST_B64, true);
    if (!$digest_raw || $digest_raw === '___DIGEST_B64___') {
        // base64 未填/占位 → 回退外部文件
        if (defined('EDI_DIGEST_FILE') && is_readable(EDI_DIGEST_FILE)) {
            $digest_raw = file_get_contents(EDI_DIGEST_FILE);
        } else {
            wp_send_json_error(array('message' => 'Briefly unavailable. Please try again.'), 502);
        }
    }
    $digest = json_decode($digest_raw, true);
    if (!is_array($digest) || empty($digest)) {
        wp_send_json_error(array('message' => 'Briefly unavailable. Please try again.'), 502);
    }
    $ranked = edi_match_symbols($dream, $digest);
    if (!empty($ranked)) {
        $top = array_slice($ranked, 0, 5);
        $fallback = array_slice($ranked, 5, 10);
    } else {
        $top = array_slice($digest, 0, 5);
        $fallback = array_slice($digest, 5, 10);
    }
    $digest_block = array_merge($top, $fallback);

    // STEP 5: system prompt
    $system = edi_build_system_prompt($digest_block);

    // STEP 6: DeepSeek(json_object, 25s hard)
    $body = wp_json_encode(array(
        'model' => 'deepseek-chat',
        'messages' => array(
            array('role' => 'system', 'content' => $system),
            array('role' => 'user', 'content' => "User context: emotion={$emotion}, lens={$lens}.\n\nDream: " . $dream),
        ),
        'response_format' => array('type' => 'json_object'),
        'max_tokens' => 1800,
        'temperature' => 0.7,
    ));
    $resp = wp_remote_post(EDI_DEEPSEEK_URL, array(
        'timeout' => 25,
        'headers' => array(
            'Authorization' => 'Bearer ' . EDI_DEEPSEEK_KEY,
            'Content-Type' => 'application/json',
        ),
        'body' => $body,
    ));
    if (is_wp_error($resp)) {
        wp_send_json_error(array('message' => 'The interpreter is briefly unavailable. Please try again.'), 502);
    }
    $resp_data = json_decode(wp_remote_retrieve_body($resp), true);
    $content = isset($resp_data['choices'][0]['message']['content']) ? $resp_data['choices'][0]['message']['content'] : '';
    if ($content === '') {
        wp_send_json_error(array('message' => 'Could not read this dream. Try rephrasing.'), 502);
    }

    // STEP 7: JSON 兜底(不降级纯文本)
    $result = edi_parse_json($content, microtime(true) - $t0);
    if (!is_array($result)) {
        wp_send_json_error(array('message' => 'Could not read this dream. Try rephrasing.'), 502);
    }

    // STEP 8: 后端 postprocess(命中违规 → safe fallback 重置; CTA 后端填)
    $result = edi_safety_postprocess($result, $top);

    wp_send_json_success(array('result' => $result));
}

// ============ 反滥用 ============
function edi_check_abuse() {
    if (!check_ajax_referer('edi_public', 'nonce', false)) {
        wp_send_json_error(array('message' => 'Invalid request.'), 403);
    }
    // Origin 严格比较(Major 修: parse host 杜绝 evil-goearthward.com 绕过)
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    $home_host = parse_url(home_url(), PHP_URL_HOST);
    if ($origin !== '' && $home_host) {
        $origin_host = parse_url($origin, PHP_URL_HOST);
        if ($origin_host !== $home_host && $origin_host !== 'www.' . $home_host) {
            wp_send_json_error(array('message' => 'Invalid request.'), 403);
        }
    }
    // honeypot
    if (!empty($_POST['edi_hp'])) {
        wp_send_json_error(array('message' => 'Invalid request.'), 403);
    }
}

function edi_get_client_ip() {
    $remote = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
    // CF 优先(走 Cloudflare 时 CF-Connecting-IP 可信)
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return trim($_SERVER['HTTP_CF_CONNECTING_IP']);
    // XFF 仅当 REMOTE_ADDR 属可信代理段才信(Major 修: 防伪造 IP 绕限流)
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) && in_array($remote, EDI_TRUSTED_PROXIES, true)) {
        return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    }
    return $remote;
}

function edi_rate_limit($key, $limit) {
    $rk = 'edi_rl_' . md5($key);
    $cnt = (int) get_transient($rk);
    if ($cnt <= 0) { set_transient($rk, 0, DAY_IN_SECONDS); $cnt = 0; }
    if ($cnt >= $limit) return false;
    set_transient($rk, $cnt + 1, DAY_IN_SECONDS);
    return true;
}

// ============ 匹配(C1: trigger_words; Minor 修: 短词词边界) ============
function edi_match_symbols($dream, $digest) {
    $dream_lower = ' ' . strtolower($dream) . ' ';
    $scored = array();
    foreach ($digest as $obj) {
        $hits = 0;
        $tws = (isset($obj['trigger_words']) && is_array($obj['trigger_words'])) ? $obj['trigger_words'] : array();
        foreach ($tws as $tw) {
            $tw_lower = strtolower($tw);
            if (strpos($tw, ' ') !== false || strlen($tw_lower) >= 6) {
                // 长 phrase(含空格或 ≥6 字符): stripos 子串匹配(安全, 如 "falling out"/"black tourmaline")
                if (strpos($dream_lower, $tw_lower) !== false) $hits++;
            } else {
                // 短词(<6 字符): 词边界正则(避免 cat→catastrophe, rat→frustrated)
                if (preg_match('/\b' . preg_quote($tw_lower, '/') . '\b/', $dream_lower)) $hits++;
            }
        }
        if ($hits > 0) $scored[] = array('obj' => $obj, 'hits' => $hits);
    }
    usort($scored, function($a, $b) { return $b['hits'] - $a['hits']; });
    return array_column($scored, 'obj');
}

// ============ system prompt(E2: 全局合规常驻) ============
function edi_build_system_prompt($digest_block) {
    $persona = "You are a reflective dream interpreter. You offer symbolic, psychological, and cultural lenses. You are NOT a clinician, therapist, religious authority, or prophet. Output in English only.";
    $compliance = "GLOBAL COMPLIANCE (always apply):\n- Interpret dreams as reflective, symbolic, personal. Do NOT diagnose mental illness.\n- Do NOT claim a dream predicts death, illness, pregnancy, betrayal, divine command, or guaranteed future events.\n- Any religious framing = cultural/interpretive context only; NEVER issue a ruling.\n- Crystals = ritual/reflection tools, NOT treatments/cures/guarantees/protection promises.\n- Do NOT name or cite any dream dictionary, website, or scholar.";
    $digest_txt = "DREAM SYMBOL DIGEST (match the user's dream to these; use each symbol's hint + dimensions):\n";
    foreach ($digest_block as $obj) {
        $digest_txt .= "- " . (isset($obj['symbol']) ? $obj['symbol'] : '') . " (" . (isset($obj['category']) ? $obj['category'] : '') . "): " . (isset($obj['digest_hint']) ? $obj['digest_hint'] : '') . "\n";
        $crystals = array();
        if (isset($obj['crystal_mapping']) && is_array($obj['crystal_mapping'])) {
            foreach ($obj['crystal_mapping'] as $v) {
                $cname = ucwords(str_replace(array('-meaning', '-'), array('', ' '), isset($v['slug']) ? $v['slug'] : ''));
                $crystals[] = $cname . ' (' . (isset($v['why']) ? trim($v['why']) : '') . ')';
            }
        }
        if ($crystals) $digest_txt .= "  Crystals: " . implode('; ', $crystals) . ". NOT cures.\n";
        if (!empty($obj['keywords'])) $digest_txt .= "  Dimensions: " . implode(', ', array_slice($obj['keywords'], 0, 4)) . ".\n";
    }
    $contract = "OUTPUT CONTRACT: Return ONLY a valid JSON object: {summary, symbols[array of {name,meaning,confidence}], psychological_lens, spiritual_lens, crystal_matches[array of {name,why}], reflection_prompt, follow_up_questions[array of 2 or 3 short, personal, non-leading questions], safety_note}. Do NOT include any cta_url field (backend fills it). Follow-up questions must seek context, never imply prediction, diagnosis, or religious authority. Do NOT cite sources.";
    return $persona . "\n\n" . $compliance . "\n\n" . $digest_txt . "\n" . $contract;
}

// ============ JSON 兜底(E4 + m2) ============
function edi_parse_json($content, $elapsed) {
    $r = json_decode($content, true);
    if (is_array($r)) return $r;
    if (preg_match('/\{.*\}/s', $content, $m)) { $r = json_decode($m[0], true); if (is_array($r)) return $r; }
    $fixed = rtrim($content);
    if (substr($fixed, -1) !== '}') $fixed .= '}';
    $r = json_decode($fixed, true);
    if (is_array($r)) return $r;
    if ($elapsed < 8) {
        $repair_body = wp_json_encode(array(
            'model' => 'deepseek-chat',
            'messages' => array(
                array('role' => 'system', 'content' => 'Return ONLY a valid JSON object matching the schema. No prose, no code fences, no explanation.'),
                array('role' => 'user', 'content' => $content),
            ),
            'response_format' => array('type' => 'json_object'),
            'max_tokens' => 1800,
        ));
        $resp = wp_remote_post(EDI_DEEPSEEK_URL, array(
            'timeout' => max(5, 12 - (int)$elapsed),
            'headers' => array('Authorization' => 'Bearer ' . EDI_DEEPSEEK_KEY, 'Content-Type' => 'application/json'),
            'body' => $repair_body,
        ));
        if (!is_wp_error($resp)) {
            $rc = json_decode(wp_remote_retrieve_body($resp), true);
            $rc = isset($rc['choices'][0]['message']['content']) ? $rc['choices'][0]['message']['content'] : '';
            if ($rc) { $r = json_decode($rc, true); if (is_array($r)) return $r; }
        }
    }
    return null;
}

// ============ safety postprocess(Critical: 命中→safe fallback 重置; C3 CTA) ============
function edi_safety_postprocess($result, $top_symbols) {
    if (!is_array($result)) return $result;
    $text = wp_json_encode($result);
    $blocked = false;

    // 1. block patterns
    foreach (EDI_BLOCK_PATTERNS as $p) {
        if (preg_match($p, $text)) { $blocked = true; break; }
    }

    // 2. determinism_blocks(读 compliance_trigger.determinism_blocks)
    $det_patterns = array(
        'death_prediction'      => '/you (will|are going to) (die|pass away|not survive)/i',
        'pregnancy_prediction'  => '/(you are|you will (be|get)|going to (be|get)) pregnant/i',
        'disaster_prediction'   => '/(a real|an actual) (fire|storm|earthquake|disaster|tornado) (will|is going to)/i',
        'medical_outcome'       => '/(you (will|are) )?(have|get|develop) (cancer|an? (illness|disease|tumor|infection)|sick)/i',
        'bleeding_prediction'   => '/(you will|going to) (bleed|hemorrha|lose blood)/i',
    );
    if (!$blocked) {
        foreach ($top_symbols as $s) {
            $db = (isset($s['compliance_trigger']['determinism_blocks']) && is_array($s['compliance_trigger']['determinism_blocks']))
                ? $s['compliance_trigger']['determinism_blocks'] : array();
            foreach ($db as $block) {
                if (isset($det_patterns[$block]) && preg_match($det_patterns[$block], $text)) { $blocked = true; break 2; }
            }
        }
    }

    // 命中违规 → safe fallback 重置(Critical 修: 移除违规 LLM 文本, 保留结构 + crystal name)
    if ($blocked) {
        $result = edi_safe_fallback($result);
    } else {
        // religious_sensitivity(dead_friend, 未命中 block 时追加措辞)
        foreach ($top_symbols as $s) {
            if (isset($s['id']) && $s['id'] === 'sym_dead_friend_relative'
                && !empty($s['compliance_trigger']['religious_sensitivity'])) {
                $result['safety_note'] = (isset($result['safety_note']) ? $result['safety_note'] . ' ' : '')
                    . 'Not a religious ruling on the afterlife.';
            }
        }
    }

    // 3. CTA 后端填(C3 + moonstone normalize)
    if (!isset($result['crystal_matches']) || !is_array($result['crystal_matches'])) {
        $result['crystal_matches'] = array();
    }
    $lookup = array();
    foreach ($top_symbols as $s) {
        if (empty($s['crystal_mapping']) || !is_array($s['crystal_mapping'])) continue;
        foreach ($s['crystal_mapping'] as $v) {
            if (empty($v['slug'])) continue;
            $shop = isset($v['shop_url']) ? $v['shop_url'] : '/crystals-for-dreams/';
            $base = str_replace('-meaning', '', $v['slug']);
            $keys = array(edi_norm($v['slug']), edi_norm($base), edi_norm(str_replace('-', '', $base)));
            if ($base === 'moonstone') { $keys[] = 'rainbowmoonstone'; $keys[] = 'rainbowmoonstonemeaning'; }
            foreach ($keys as $k) { if (!isset($lookup[$k])) $lookup[$k] = $shop; }
        }
    }
    $primary_fallback = !empty($top_symbols[0]['crystal_mapping']['primary']['shop_url'])
        ? $top_symbols[0]['crystal_mapping']['primary']['shop_url']
        : '/crystals-for-dreams/';
    foreach ($result['crystal_matches'] as &$cm) {
        if (!is_array($cm)) continue;
        $norm = edi_norm(isset($cm['name']) ? $cm['name'] : '');
        if (isset($lookup[$norm])) {
            $cm['cta_url'] = $lookup[$norm];
        } elseif (isset($lookup[$norm . 'meaning'])) {
            $cm['cta_url'] = $lookup[$norm . 'meaning'];
        } else {
            $cm['cta_url'] = $primary_fallback;
        }
    }
    unset($cm);
    return $result;
}

// ============ safe fallback(Critical: 命中违规时重置 result, 移除 LLM 文本) ============
function edi_safe_fallback($result) {
    $safe = array(
        'summary' => 'This dream points to inner material worth reflecting on symbolically. The imagery often reflects emotions, transitions, or patterns in waking life rather than literal outcomes.',
        'symbols' => array(),
        'psychological_lens' => 'A reflective reading treats this dream as symbolic — pointing to emotions, stressors, or changes you may be processing. It is not a prediction or diagnosis.',
        'spiritual_lens' => 'From a spiritual or cultural lens, dreams are often read as invitations to reflect, not as omens or directives.',
        'reflection_prompt' => 'What feeling or situation in your waking life might this dream be reflecting?',
        'follow_up_questions' => array('Which feeling stayed with you most strongly after waking?', 'What detail felt most important in the dream scene?'),
        'safety_note' => 'This reflection is symbolic only — not a prediction, diagnosis, religious ruling, or guarantee of any outcome. If this dream felt distressing, consider speaking with a qualified professional or trusted support person.',
    );
    // 保留 crystal_matches 的 name(CTA 后端填), 但 why 替换为 generic(原 why 可能含违规)
    if (isset($result['crystal_matches']) && is_array($result['crystal_matches'])) {
        $sc = array();
        foreach ($result['crystal_matches'] as $cm) {
            if (is_array($cm) && !empty($cm['name'])) {
                $sc[] = array('name' => $cm['name'], 'why' => 'Offered as a tactile cue for journaling or reflection — not a treatment, cure, or guarantee.');
            }
        }
        $safe['crystal_matches'] = $sc;
    } else {
        $safe['crystal_matches'] = array();
    }
    return $safe;
}

function edi_norm($s) {
    return strtolower(preg_replace('/[^a-z0-9]/i', '', $s));
}
