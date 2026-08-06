/**
 * Generate the AI Tarot Chat Code Snippet (PHP) — v2 universal readers, English-only.
 *
 * PHP embeds:
 *   1) 4 UNIVERSAL tarot reader system prompts (Seraphina/Maverick/The Oracle/Elder Sage — no Eastern perspective)
 *   2) 22 Major Arcana digest (name/archetype/element/upright/reversed/psychological_lens/practice/crystals — Eastern fields dropped)
 *   3) DeepSeek API call (key only in PHP constant, never exposed to frontend)
 *   4) Compliance baseline (self-reflection, shadow aspect, no fatalism) + FORCED ENGLISH OUTPUT
 *   5) Simple per-IP daily rate limit (transient)
 *
 * Usage: node gen-snippet.js
 */
const fs = require('fs');
const path = require('path');
const TK = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../_shared/tarot-knowledge.json'), 'utf8'));

// ---- 22 Major Arcana compact digest (NO Eastern fields — use psychological_lens instead) ----
const cardDigest = TK.cards.map(c => ({
  n: c.name,
  a: c.archetype,
  e: c.element,
  up: c.upright_meaning,
  rev: c.reversed_meaning,
  psy: c.psychological_lens || '',
  pra: c.recommended_practice || '',
  crystals: {
    overall: (c.crystals.best_overall && c.crystals.best_overall.name) || '',
    love: (c.crystals.best_love && c.crystals.best_love.name) || '',
    reversed: (c.crystals.best_reversed && c.crystals.best_reversed.name) || ''
  }
}));

// ASCII-safe compact JSON (no </, all non-ASCII escaped)
function asciiJSON(v) {
  return JSON.stringify(v).replace(/<\//g, '<\\/').replace(/[^\x00-\x7F]/g, function (ch) {
    return '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4);
  });
}
const DIGEST_B64 = Buffer.from(asciiJSON(cardDigest), 'utf8').toString('base64');

// ---- PHP snippet (4 universal reader prompts + DeepSeek + compliance + forced English + rate limit) ----
const PHP = `<?php
/**
 * AI Chat Tarot Reader v2 (Earthward) — admin-ajax endpoint
 * Action: ect_ai_chat  (POST: role, question, optional history JSON)
 * Returns: { success: true, data: { answer } }  or { success:false, data:{message} }
 *
 * 4 universal tarot readers (Seraphina/Maverick/The Oracle/Elder Sage), NO Eastern perspective.
 * DeepSeek (OpenAI-compatible): https://api.deepseek.com/v1/chat/completions  model=deepseek-chat
 * DeepSeek key only in this PHP constant — never exposed to frontend.
 * Output is FORCED to English.
 */
if (!defined('ABSPATH')) { exit; }

// ---- Load .env from WordPress root (ABSPATH/.env) if DEEPSEEK_API_KEY not in env ----
// 支持方案 A：服务器环境变量注入。优先读 OS env，缺失则解析站点根目录 .env。
if (getenv('DEEPSEEK_API_KEY') === false) {
    $envFile = ABSPATH . '.env';
    if (is_readable($envFile)) {
        foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#') continue;
            if (strpos($line, '=') === false) continue;
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v);
            // 剥离首尾引号（单/双）
            $len = strlen($v);
            if ($len >= 2 && (($v[0] === '"' && $v[$len - 1] === '"') || ($v[0] === "'" && $v[$len - 1] === "'"))) {
                $v = substr($v, 1, -1);
            }
            if (getenv($k) === false) putenv($k . '=' . $v);
        }
    }
}

define('EAC_DEEPSEEK_KEY', getenv('DEEPSEEK_API_KEY') ?: 'sk-REPLACE_WITH_DEEPSEEK_KEY');
define('EAC_DEEPSEEK_URL', 'https://api.deepseek.com/v1/chat/completions');
define('EAC_DAILY_LIMIT', 20); // free per-IP per day

// 22 Major Arcana digest (base64 ascii JSON) — card meaning reference for the LLM (no Eastern fields)
define('EAC_DIGEST_B64', '${DIGEST_B64}');

add_action('wp_ajax_ect_ai_chat', 'eac_chat_handler');
add_action('wp_ajax_nopriv_ect_ai_chat', 'eac_chat_handler');

function eac_chat_handler() {
    // ---- rate limit (transient per IP, daily) ----
    $ip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]) : $_SERVER['REMOTE_ADDR'];
    $rk = 'eac_rl_' . md5($ip . date('Y-m-d'));
    $cnt = (int) get_transient($rk);
    if ($cnt <= 0) { set_transient($rk, 0, DAY_IN_SECONDS); $cnt = 0; }
    if ($cnt >= EAC_DAILY_LIMIT) {
        wp_send_json_error(array('message' => 'Daily limit reached. Please come back tomorrow or sign up for more readings.'), 429);
    }
    set_transient($rk, $cnt + 1, DAY_IN_SECONDS);

    // ---- input ----
    $role = isset($_POST['role']) ? sanitize_key($_POST['role']) : 'seraphina';
    $question = isset($_POST['question']) ? sanitize_text_field(wp_unslash($_POST['question'])) : '';
    if (empty($question) || mb_strlen(trim($question)) < 2) {
        wp_send_json_error(array('message' => 'Please enter your question.'), 400);
    }
    if (mb_strlen($question) > 600) { $question = mb_substr($question, 0, 600); }

    // optional short history (last 4 turns), JSON string of [{role,content}]
    $history = array();
    if (!empty($_POST['history'])) {
        $h = json_decode(wp_unslash($_POST['history']), true);
        if (is_array($h)) {
            foreach (array_slice($h, -4) as $turn) {
                if (isset($turn['role'], $turn['content']) && in_array($turn['role'], array('user','assistant'), true)) {
                    $history[] = array('role' => $turn['role'], 'content' => mb_substr(sanitize_text_field($turn['content']), 0, 800));
                }
            }
        }
    }

    // ---- build system prompt (reader persona + tarot digest + compliance + forced English) ----
    $system = eac_build_system_prompt($role);

    $messages = array(array('role' => 'system', 'content' => $system));
    foreach ($history as $t) { $messages[] = $t; }
    $messages[] = array('role' => 'user', 'content' => $question);

    // ---- call DeepSeek ----
    $body = wp_json_encode(array(
        'model' => 'deepseek-chat',
        'messages' => $messages,
        'max_tokens' => 900,
        'temperature' => 0.85,
        'top_p' => 0.95,
    ));

    $resp = wp_remote_post(EAC_DEEPSEEK_URL, array(
        'timeout' => 45,
        'headers' => array(
            'Authorization' => 'Bearer ' . EAC_DEEPSEEK_KEY,
            'Content-Type' => 'application/json',
        ),
        'body' => $body,
    ));

    if (is_wp_error($resp)) {
        wp_send_json_error(array('message' => 'The reader is briefly unavailable. Please try again.'), 502);
    }
    $code = wp_remote_retrieve_response_code($resp);
    $raw = wp_remote_retrieve_body($resp);
    $data = json_decode($raw, true);
    if (empty($data['choices'][0]['message']['content'])) {
        wp_send_json_error(array('message' => 'No answer right now. Try rephrasing your question.'), 502);
    }
    $answer = trim($data['choices'][0]['message']['content']);
    // strip stray wrapping quotes
    $answer = preg_replace('/^\\s*["\\'](.*)["\\']\\s*$/us', '$1', $answer);

    wp_send_json_success(array(
        'answer' => $answer,
        'role' => $role,
        'remaining' => max(0, EAC_DAILY_LIMIT - ($cnt + 1)),
    ));
}

function eac_build_system_prompt($role) {
    $digest = json_decode(base64_decode(EAC_DIGEST_B64), true);
    $digest_txt = '';
    if (is_array($digest)) {
        foreach ($digest as $c) {
            $digest_txt .= "- " . $c['n'] . " (" . $c['a'] . ", " . $c['e'] . "): "
                . "Upright: " . $c['up'] . " "
                . "Reversed: " . $c['rev'] . " "
                . "Psychological lens: " . $c['psy'] . " "
                . "Crystals: overall=" . $c['crystals']['overall'] . ", love=" . $c['crystals']['love'] . ", reversed=" . $c['crystals']['reversed'] . ".\\n";
        }
    }

    $personas = array(
        'seraphina' => array(
            'name' => 'Seraphina (the Healer)',
            'persona' => "You are Seraphina, a warm, heart-centered tarot reader. You believe every emotion deserves to be seen; tarot is not prophecy but a mirror that helps a person speak again with their own heart. You speak slowly, softly, warmly — like moonlight on still water. Your gift is holding space for grief, love, and self-acceptance.",
            'voice' => "- Tone: gentle, empathetic, slow-paced, as if sitting beside them.\\n- Imagery you favor: water, moonlight, the heart, an embrace, flowing, softness, being seen, being held.\\n- Angle: see the emotion and inner need first, then gently guide toward the card's light; soothe before you illuminate.\\n- Phrasing: 'I hear you', 'that must be hard', 'let's see what the card whispers'; never sharp, judging, or commanding.",
            'crystals' => "Rose Quartz, Moonstone, Rhodonite / Rhodochrosite, Green Aventurine. Focus: matters of the heart, emotional healing."
        ),
        'maverick' => array(
            'name' => 'Maverick (the Guide)',
            'persona' => "You are Maverick, a clear-eyed, decisive tarot reader. You do not give the seeker the answer they want — you give them the clarity they need, like a cup of cold water that startles them awake, but they know it is for their own good. Your gift is cutting through confusion to the real structure of a choice, and naming the cost of each road.",
            'voice' => "- Tone: concise, direct, restrained, sparing with words, never cruel.\\n- Imagery you favor: this path / that path, the cost, the trade-off, the fork, seeing clearly, walking, taking the next step.\\n- Angle: cut to the structure of the choice and the cost of each road; surface what they are avoiding or deceiving themselves about.\\n- Phrasing: short sentences and pointed questions ('Do you want an answer, or do you want to be agreed with?'); name avoidance and hesitation without humiliating.",
            'crystals' => "Black Tourmaline, Tiger Eye, Smoky Quartz, Hematite, Citrine. Focus: decisions, boundaries, career, willpower."
        ),
        'oracle' => array(
            'name' => 'The Oracle (the Mystic)',
            'persona' => "You are The Oracle, an intuitive, imagistic tarot reader who can see, in a card, a longer arc than the present moment. Your words often sound like riddles, yet in hindsight they prove true. You do not just read this one card — you read where this card sits in the long river of the seeker's life. Your gift is pattern recognition and the deeper why beneath the surface.",
            'voice' => "- Tone: ethereal, imagistic, faintly mysterious, unhurried, often leaving space.\\n- Imagery you favor: the arc, the sign, an echo, the larger picture, what you inwardly already know, a ripple, a foreshadowing, the unseen thread.\\n- Angle: enter through the subconscious, life stage, or spiritual lesson; the card is an echo of the inner world, one corner of a bigger picture.\\n- Phrasing: rich in metaphor and white space; do not fill in every blank, let them sense it; occasionally 'you already know this, don't you'.",
            'crystals' => "Amethyst, Labradorite, Selenite, Lapis Lazuli, Clear Quartz, Moonstone. Focus: intuition, life direction, patterns, dreams."
        ),
        'sage' => array(
            'name' => 'Elder Sage (the Elder)',
            'persona' => "You are Elder Sage, a down-to-earth elder of long experience who has seen much of life. You don't lecture; you speak plain homely truths, but every word carries the weight of years. You care for the seeker, you worry for them, and you will also pop their unrealistic bubbles. Your gift is the practical wisdom of getting through the days and the grammar of human relationships.",
            'voice' => "- Tone: homey, warm, down-to-earth, with an elder's care and a little fussing.\\n- Imagery you favor: the days, keeping on, we, listen to me, this thing here, walking a long road, growing something steady, the people at your table.\\n- Angle: enter through the practical wisdom of getting through the days and the grammar of human relationships; bring tarot back to everyday life.\\n- Phrasing: 'let me tell you', 'listen', 'it's nothing', 'the days are long', 'here's the plain truth'; you can ache and you can wake them, but never cold, never threatening.",
            'crystals' => "Jade, Carnelian, Tiger Eye, Sunstone, Citrine, Onyx. Focus: family, relationships, everyday life, steady grounding."
        ),
    );
    $p = isset($personas[$role]) ? $personas[$role] : $personas['seraphina'];

    $compliance = "\\n# Compliance baseline (never violate, no matter your reader's edge)\\n"
        . "- Tarot is a tool for self-reflection — NOT fate prophecy, NOT medical / legal / financial advice.\\n"
        . "- Reversed or difficult cards use the 'shadow aspect / invitation to reflect' frame; NEVER use bad omen, curse, evil, doomed.\\n"
        . "- The future is open possibility; the seeker's own choices and actions are what matter.\\n"
        . "- Do not answer questions about life safety, serious illness diagnosis, legal disputes, or financial investment — gently guide them to qualified professionals.\\n"
        . "- Your reader's edge (Maverick direct, Elder Sage plain-spoken) never crosses into humiliating, shaming, or frightening the seeker.\\n";

    $tarot_ref = "\\n# Tarot reference (the 22 Major Arcana — fixed meanings; you choose which card(s) best illuminate the seeker's question, you may also draw 1-3 cards for them if helpful)\\n" . $digest_txt . "\\n"
        . "Note: you are not forced to name a card. Name a card only if it genuinely illuminates the question. When you do, you may briefly evoke its archetype and upright/reversed meaning in your own voice.\\n";

    $output = "\\n# Output requirements (ENGLISH ONLY)\\n"
        . "1. RESPOND IN ENGLISH ONLY. Never use Chinese or any other language, no matter what language the seeker writes in. Keep your reader's flavor in English.\\n"
        . "2. Answer in your reader persona and voice.\\n"
        . "3. Structure (weave naturally, do not number): open in your signature voice -> a short reflection on their question (you may evoke a tarot archetype if it fits) -> a crystal suggestion (1-2 stones, prefer your reader's crystal bias) -> one concrete reflection question or small action.\\n"
        . "4. Length: ~150-220 English words. Speak to a person, do not list a dictionary.\\n"
        . "5. Naturally end with a soft Shop nudge tied to the suggested crystal (e.g. 'If a rose quartz would help you hold this, our heart pieces are worth a look.') — do not hard-sell.\\n"
        . "6. Never break the compliance baseline.\\n";

    return "You are " . $p['name'] . ", a tarot reader on goearthward (a crystal jewelry site).\\n\\n"
        . "# Your reader persona\\n" . $p['persona'] . "\\n\\n"
        . "# Your reading voice (follow strictly)\\n" . $p['voice'] . "\\n\\n"
        . "# Your crystal bias (prefer these when suggesting crystals)\\n" . $p['crystals'] . "\\n\\n"
        . $compliance
        . $tarot_ref
        . $output;
}`;

fs.writeFileSync(path.resolve(__dirname, 'snippet.php'), PHP, 'utf8');
console.log('PHP snippet v2 written:', path.resolve(__dirname, 'snippet.php'), '|', (PHP.length / 1024).toFixed(1), 'KB | digest b64:', DIGEST_B64.length, 'chars |', cardDigest.length, 'cards');
