<?php
/**
 * Earthward Customize Bracelet CTA (snippet 20) — the_content 版 2026-07-16
 * the_content filter (priority 20, 跑在 snippet19 Keep exploring=10 之后):
 * 在所有 /tools/ 工具页 content 末尾(Keep exploring 之后) append 定制手链 banner.
 * 排除 crystal-bracelet-builder 自身 + 3 个根级页(meaning-search/bracelet-size/ring-size).
 *
 * CTA 纯导航(非功效断言),无医疗/财富担保措辞.
 */
add_filter('the_content', 'ew_customize_bracelet_cta', 20);
function ew_customize_bracelet_cta($content) {
    if (!is_singular() || is_admin() || empty($content)) return $content;
    $slug = get_post_field('post_name', get_queried_object_id());
    if (!$slug) return $content;

    // 21 个 /tools/ 工具 slug (排除 builder 自身 + 3 个根级路径工具)
    $TOOLS_SLUGS = array(
        'crystal-tarot-reading' => 1, 'yes-no-tarot' => 1, 'crystal-oracle-cards' => 1,
        'tarot-birth-card' => 1, 'ai-tarot-chat' => 1, 'zodiac-compatibility-checker' => 1,
        'chinese-zodiac-checker' => 1, 'numerology-calculator' => 1, 'birthstone-finder' => 1,
        'moon-calendar' => 1, 'crystal-quiz' => 1, 'chakra-test' => 1, 'element-test' => 1,
        'crystal-compatibility-checker' => 1, 'crystal-cleansing-timer' => 1,
        'daily-tarot' => 1, 'mbti-tarot' => 1, 'ai-dream-interpreter' => 1,
        'kua-number-calculator' => 1, 'bagua-map' => 1, 'feng-shui-wealth-corner' => 1,
    );
    if (!isset($TOOLS_SLUGS[$slug])) return $content;

    $BUILDER_URL = 'https://goearthward.com/tools/crystal-bracelet-builder/';

    $css = '.ew-cb-banner{margin:32px 0 8px;padding:28px 26px;background:#2D6A4F;border-radius:14px;'
        . 'display:flex;align-items:center;justify-content:space-between;gap:20px;'
        . 'box-shadow:0 4px 14px rgba(45,106,79,.18)}'
        . '.ew-cb-cta-wrap{display:flex;align-items:center;gap:16px;min-width:0;flex:1}'
        . '.ew-cb-ico{font-size:34px;line-height:1;flex-shrink:0}'
        . '.ew-cb-txt{display:flex;flex-direction:column;gap:4px;min-width:0}'
        . '.ew-cb-h{font-size:20px;font-weight:700;color:#fff;line-height:1.25;letter-spacing:.01em}'
        . '.ew-cb-sub{font-size:14px;color:rgba(255,255,255,.88);line-height:1.4}'
        . '.ew-cb-btn{flex-shrink:0;display:inline-block;padding:13px 24px;background:#fff;color:#2D6A4F;'
        . 'font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;white-space:nowrap;'
        . 'transition:transform .15s,box-shadow .2s}'
        . '.ew-cb-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.18)}'
        . '@media(max-width:600px){.ew-cb-banner{flex-direction:column;align-items:stretch;text-align:center}'
        . '.ew-cb-cta-wrap{justify-content:center}.ew-cb-btn{text-align:center}}';

    $html = '<style>' . $css . '</style>'
        . '<section class="ew-cb-banner">'
        . '<div class="ew-cb-cta-wrap">'
        . '<span class="ew-cb-ico">' . "\xE2\x9C\xA8" . '</span>'
        . '<div class="ew-cb-txt">'
        . '<span class="ew-cb-h">Customize a bracelet</span>'
        . '<span class="ew-cb-sub">Design your own with the stones you just discovered</span>'
        . '</div></div>'
        . '<a class="ew-cb-btn" href="' . esc_url($BUILDER_URL) . '">Customize a bracelet &rarr;</a>'
        . '</section>';

    return $content . $html;
}
