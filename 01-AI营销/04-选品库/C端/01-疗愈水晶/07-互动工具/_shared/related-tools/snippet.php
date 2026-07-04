<?php
/**
 * Earthward — Related Tools cross-linking (global, scope=global)
 *
 * Injects a "Keep exploring" card grid at the bottom of every tool page,
 * linking to 2-3 related tools. Tool->tool only — every target is a published
 * page, so there are NO dead links and NO future-schedule 404s.
 *
 * Implementation: wp_footer + JS DOM insertion. This works on ALL page templates
 * (default + Elementor Canvas + WoodMart custom), unlike a the_content filter
 * which the 3 root-level tool pages (built May) bypass.
 *
 * One snippet maintains all 21 tools (two config arrays below).
 */
if (!defined('ABSPATH')) { exit; }

add_action('wp_footer', 'ew_related_tools_footer');

function ew_related_tools_footer() {
    if (is_admin() || !is_singular('page')) return;
    $slug = get_post_field('post_name', get_the_ID());
    if (empty($slug)) return;

    // 21 tool display metadata: slug => [title, url-path, one-line desc, icon]
    $tools = array(
        'crystal-tarot-reading'         => array('t'=>'Crystal Tarot Reading',   'u'=>'/tools/crystal-tarot-reading/',         'd'=>'Draw cards and decode their meaning with matching crystals', 'i'=>'🔮'),
        'yes-no-tarot'                  => array('t'=>'Yes or No Tarot',          'u'=>'/tools/yes-no-tarot/',                   'd'=>'A clear yes, no, or maybe from a single card', 'i'=>'✅'),
        'crystal-oracle-cards'          => array('t'=>'Crystal Oracle Cards',     'u'=>'/tools/crystal-oracle-cards/',           'd'=>'Pull a crystal oracle card for instant guidance', 'i'=>'🔮'),
        'tarot-birth-card'              => array('t'=>'Tarot Birth Card',         'u'=>'/tools/tarot-birth-card/',               'd'=>'Calculate your two lifetime tarot birth cards', 'i'=>'🎂'),
        'ai-tarot-chat'                 => array('t'=>'AI Tarot Chat',            'u'=>'/tools/ai-tarot-chat/',                  'd'=>'Chat with an AI tarot reader about anything on your heart', 'i'=>'💬'),
        'zodiac-compatibility-checker'  => array('t'=>'Zodiac Compatibility',     'u'=>'/tools/zodiac-compatibility-checker/',  'd'=>'Check the compatibility between two zodiac signs', 'i'=>'♊'),
        'chinese-zodiac-checker'        => array('t'=>'Chinese Zodiac Checker',   'u'=>'/tools/chinese-zodiac-checker/',        'd'=>'Find your Chinese zodiac animal and lucky crystals', 'i'=>'🐉'),
        'numerology-calculator'         => array('t'=>'Life Path Calculator',     'u'=>'/tools/numerology-calculator/',         'd'=>'Calculate your life path number and its stones', 'i'=>'🔢'),
        'birthstone-finder'             => array('t'=>'Birthstone Finder',        'u'=>'/tools/birthstone-finder/',             'd'=>'Discover your birthstone by month', 'i'=>'💎'),
        'moon-calendar'                 => array('t'=>'Moon Phase Calendar',      'u'=>'/tools/moon-calendar/',                 'd'=>'Track moon phases and the crystals for each phase', 'i'=>'🌕'),
        'crystal-quiz'                  => array('t'=>'Crystal Quiz',             'u'=>'/tools/crystal-quiz/',                  'd'=>'Find your perfect crystal by color', 'i'=>'✨'),
        'chakra-test'                   => array('t'=>'Chakra Test',              'u'=>'/tools/chakra-test/',                   'd'=>'Find which of your seven chakras is blocked', 'i'=>'🌈'),
        'element-test'                  => array('t'=>'Element Test',             'u'=>'/tools/element-test/',                  'd'=>'Discover your dominant elemental energy', 'i'=>'🔥'),
        'crystal-compatibility-checker' => array('t'=>'Crystal Compatibility',    'u'=>'/tools/crystal-compatibility-checker/','d'=>'Check whether two crystals work together', 'i'=>'🤝'),
        'crystal-meaning-search'        => array('t'=>'Crystal Meaning Search',   'u'=>'/crystal-meaning-search/',              'd'=>'Search 390 crystal meanings and properties', 'i'=>'🔍'),
        'crystal-cleansing-timer'       => array('t'=>'Cleansing Timer',          'u'=>'/tools/crystal-cleansing-timer/',       'd'=>'Time and schedule your crystal cleansing', 'i'=>'⏱️'),
        'bracelet-size-calculator'      => array('t'=>'Bracelet Size Calculator', 'u'=>'/bracelet-size-calculator/',            'd'=>'Find your perfect bracelet fit', 'i'=>'📿'),
        'ring-size-calculator'          => array('t'=>'Ring Size Calculator',     'u'=>'/ring-size-calculator/',                'd'=>'Find your ring size in any system', 'i'=>'💍'),
        'crystal-bracelet-builder'      => array('t'=>'Crystal Bracelet Builder', 'u'=>'/tools/crystal-bracelet-builder/',      'd'=>'Design bead by bead', 'i'=>'📿'),
        'daily-tarot'                   => array('t'=>'Daily Tarot',              'u'=>'/tools/daily-tarot/',                   'd'=>"Today's tarot card and crystal for the whole community", 'i'=>'🌅'),
        'mbti-tarot'                    => array('t'=>'MBTI Tarot',               'u'=>'/tools/mbti-tarot/',                    'd'=>'Find your MBTI tarot birth card and crystals', 'i'=>'🧬'),
    );

    // recommendation graph: current tool slug => 2-3 related tool slugs (same family first, then cross)
    $map = array(
        'crystal-tarot-reading'         => array('ai-tarot-chat', 'daily-tarot', 'yes-no-tarot'),
        'yes-no-tarot'                  => array('crystal-tarot-reading', 'ai-tarot-chat', 'tarot-birth-card'),
        'crystal-oracle-cards'          => array('crystal-tarot-reading', 'ai-tarot-chat', 'crystal-quiz'),
        'tarot-birth-card'              => array('crystal-tarot-reading', 'ai-tarot-chat', 'mbti-tarot'),
        'ai-tarot-chat'                 => array('crystal-tarot-reading', 'daily-tarot', 'tarot-birth-card'),
        'zodiac-compatibility-checker'  => array('chinese-zodiac-checker', 'numerology-calculator', 'moon-calendar'),
        'chinese-zodiac-checker'        => array('zodiac-compatibility-checker', 'birthstone-finder', 'numerology-calculator'),
        'numerology-calculator'         => array('tarot-birth-card', 'mbti-tarot', 'chinese-zodiac-checker'),
        'birthstone-finder'             => array('chinese-zodiac-checker', 'numerology-calculator', 'moon-calendar'),
        'moon-calendar'                 => array('daily-tarot', 'birthstone-finder', 'crystal-cleansing-timer'),
        'daily-tarot'                   => array('crystal-tarot-reading', 'ai-tarot-chat', 'moon-calendar'),
        'mbti-tarot'                    => array('tarot-birth-card', 'numerology-calculator', 'crystal-quiz'),
        'crystal-quiz'                  => array('chakra-test', 'mbti-tarot', 'crystal-bracelet-builder'),
        'chakra-test'                   => array('crystal-quiz', 'element-test', 'crystal-cleansing-timer'),
        'element-test'                  => array('crystal-quiz', 'chakra-test', 'crystal-compatibility-checker'),
        'crystal-compatibility-checker' => array('crystal-quiz', 'crystal-meaning-search', 'chakra-test'),
        'crystal-meaning-search'        => array('crystal-compatibility-checker', 'crystal-quiz', 'crystal-cleansing-timer'),
        'crystal-cleansing-timer'       => array('crystal-meaning-search', 'moon-calendar', 'chakra-test'),
        'bracelet-size-calculator'      => array('ring-size-calculator', 'crystal-quiz', 'crystal-bracelet-builder'),
        'ring-size-calculator'          => array('bracelet-size-calculator', 'crystal-quiz', 'crystal-bracelet-builder'),
        'crystal-bracelet-builder'      => array('bracelet-size-calculator', 'crystal-meaning-search', 'crystal-quiz'),
    );

    if (!isset($map[$slug])) return;

    $home = home_url('/');
    $cards = '';
    foreach ($map[$slug] as $rk) {
        if (!isset($tools[$rk])) continue;
        $t = $tools[$rk];
        $cards .= '<a class="ew-rl-card" href="' . esc_url($home . ltrim($t['u'], '/')) . '">'
            . '<span class="ew-rl-ico">' . $t['i'] . '</span>'
            . '<span class="ew-rl-tx"><strong>' . esc_html($t['t']) . '</strong><em>' . esc_html($t['d']) . '</em></span>'
            . '</a>';
    }
    if (empty($cards)) return;

    $css = '.ew-related{margin:40px 0 8px;padding:24px;background:#FAFAFA;border:1px solid #E8E2D5;border-radius:14px}'
        . '.ew-rl-h{font-size:22px;font-weight:700;color:#1A1A2E;margin:0 0 4px;letter-spacing:.01em}'
        . '.ew-rl-sub{font-size:14px;color:#5A5A6E;margin:0 0 16px}'
        . '.ew-rl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}'
        . '.ew-rl-card{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fff;border:1px solid #E8E2D5;border-radius:10px;text-decoration:none;color:#1A1A2E;transition:border-color .2s,box-shadow .2s,transform .15s}'
        . '.ew-rl-card:hover{border-color:#CFAA3E;box-shadow:0 4px 12px rgba(26,26,46,.08);transform:translateY(-2px)}'
        . '.ew-rl-ico{font-size:26px;flex-shrink:0;line-height:1}'
        . '.ew-rl-tx{display:flex;flex-direction:column;gap:3px;min-width:0}'
        . '.ew-rl-tx strong{font-size:15px;font-weight:700;color:#1A1A2E;line-height:1.25}'
        . '.ew-rl-tx em{font-size:13px;font-style:normal;color:#5A5A6E;line-height:1.35}'
        . '@media(max-width:768px){.ew-rl-grid{grid-template-columns:1fr}}';

    $section = '<section class="ew-related"><h2 class="ew-rl-h">Keep exploring</h2><p class="ew-rl-sub">More free tools to guide your journey</p><div class="ew-rl-grid">' . $cards . '</div></section>';

    $style_json = wp_json_encode('<style>' . $css . '</style>');
    $html_json = wp_json_encode($section);
    echo '<script>(function(){var css=' . $style_json . ',html=' . $html_json . ',c=document.querySelector("main .wd-entry-content")||document.querySelector("article.type-page .entry-content")||document.querySelector(".site-content .wd-entry-content")||document.querySelector("main .entry-content")||document.querySelector(".wd-content-area")||document.querySelector("main");document.head.insertAdjacentHTML("beforeend",css);if(c){c.insertAdjacentHTML("beforeend",html);}})();</script>' . "\n";
}
