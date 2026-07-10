<?php
/**
 * Earthward Related Tools cross-link (snippet 19) — the_content 版 2026-07-10
 * the_content filter: Keep explore append 到工具 content 末尾(非 footer), 含 dream
 */
add_filter('the_content', 'ew_related_tools_content');
function ew_related_tools_content($content) {
    if (!is_singular() || is_admin() || empty($content)) return $content;
    $slug = get_post_field('post_name', get_queried_object_id());
    if (!$slug) return $content;

    $HOME = 'https://goearthward.com/';
    $TOOLS = array(
        'crystal-tarot-reading'         => array('t'=>'Crystal Tarot Reading',   'u'=>'/tools/crystal-tarot-reading/',         'd'=>'Draw cards and decode their meaning with matching crystals', 'i'=>"\xF0\x9F\x94\xAE"),
        'yes-no-tarot'                  => array('t'=>'Yes or No Tarot',          'u'=>'/tools/yes-no-tarot/',                   'd'=>'A clear yes, no, or maybe from a single card', 'i'=>"\xE2\x9C\x85"),
        'crystal-oracle-cards'          => array('t'=>'Crystal Oracle Cards',     'u'=>'/tools/crystal-oracle-cards/',           'd'=>'Pull a crystal oracle card for instant guidance', 'i'=>"\xF0\x9F\x94\xAE"),
        'tarot-birth-card'              => array('t'=>'Tarot Birth Card',         'u'=>'/tools/tarot-birth-card/',               'd'=>'Calculate your two lifetime tarot birth cards', 'i'=>"\xF0\x9F\x8E\x82"),
        'ai-tarot-chat'                 => array('t'=>'AI Tarot Chat',            'u'=>'/tools/ai-tarot-chat/',                  'd'=>'Chat with an AI tarot reader about anything on your heart', 'i'=>"\xF0\x9F\x92\xAC"),
        'zodiac-compatibility-checker'  => array('t'=>'Zodiac Compatibility',     'u'=>'/tools/zodiac-compatibility-checker/',   'd'=>'Check the compatibility between two zodiac signs', 'i'=>"\xE2\x99\x8A"),
        'chinese-zodiac-checker'        => array('t'=>'Chinese Zodiac Checker',   'u'=>'/tools/chinese-zodiac-checker/',         'd'=>'Find your Chinese zodiac animal and lucky crystals', 'i'=>"\xF0\x9F\x90\x89"),
        'numerology-calculator'         => array('t'=>'Life Path Calculator',     'u'=>'/tools/numerology-calculator/',          'd'=>'Calculate your life path number and its stones', 'i'=>"\xF0\x9F\x94\xA2"),
        'birthstone-finder'             => array('t'=>'Birthstone Finder',        'u'=>'/tools/birthstone-finder/',              'd'=>'Discover your birthstone by month', 'i'=>"\xF0\x9F\x92\x8E"),
        'moon-calendar'                 => array('t'=>'Moon Phase Calendar',      'u'=>'/tools/moon-calendar/',                  'd'=>'Track moon phases and the crystals for each phase', 'i'=>"\xF0\x9F\x95\x95"),
        'crystal-quiz'                  => array('t'=>'Crystal Quiz',             'u'=>'/tools/crystal-quiz/',                   'd'=>'Find your perfect crystal by color', 'i'=>"\xE2\x9C\xA8"),
        'chakra-test'                   => array('t'=>'Chakra Test',              'u'=>'/tools/chakra-test/',                    'd'=>'Find which of your seven chakras is blocked', 'i'=>"\xF0\x9F\x8C\x88"),
        'element-test'                  => array('t'=>'Element Test',             'u'=>'/tools/element-test/',                   'd'=>'Discover your dominant elemental energy', 'i'=>"\xF0\x9F\x94\xA5"),
        'crystal-compatibility-checker' => array('t'=>'Crystal Compatibility',    'u'=>'/tools/crystal-compatibility-checker/',  'd'=>'Check whether two crystals work together', 'i'=>"\xF0\x9F\xA4\x9D"),
        'crystal-meaning-search'        => array('t'=>'Crystal Meaning Search',   'u'=>'/crystal-meaning-search/',               'd'=>'Search 390 crystal meanings and properties', 'i'=>"\xF0\x9F\x94\x8D"),
        'crystal-cleansing-timer'       => array('t'=>'Cleansing Timer',          'u'=>'/tools/crystal-cleansing-timer/',        'd'=>'Time and schedule your crystal cleansing', 'i'=>"\xE2\x8F\xB1\xEF\xB8\x8F"),
        'bracelet-size-calculator'      => array('t'=>'Bracelet Size Calculator', 'u'=>'/bracelet-size-calculator/',             'd'=>'Find your perfect bracelet fit', 'i'=>"\xF0\x9F\x93\xBF"),
        'ring-size-calculator'          => array('t'=>'Ring Size Calculator',     'u'=>'/ring-size-calculator/',                 'd'=>'Find your ring size in any system', 'i'=>"\xF0\x9F\x92\x8D"),
        'crystal-bracelet-builder'      => array('t'=>'Crystal Bracelet Builder', 'u'=>'/tools/crystal-bracelet-builder/',        'd'=>'Design bead by bead', 'i'=>"\xF0\x9F\x93\xBF"),
        'daily-tarot'                   => array('t'=>'Daily Tarot',              'u'=>'/tools/daily-tarot/',                     'd'=>"Today's tarot card and crystal for the whole community", 'i'=>"\xF0\x9F\x8C\x85"),
        'mbti-tarot'                    => array('t'=>'MBTI Tarot',               'u'=>'/tools/mbti-tarot/',                      'd'=>'Find your MBTI tarot birth card and crystals', 'i'=>"\xF0\x9F\xA7\xAC"),
        'ai-dream-interpreter'          => array('t'=>'AI Dream Interpreter',     'u'=>'/tools/ai-dream-interpreter/',            'd'=>'Decode your dream with AI and matching crystals', 'i'=>"\xF0\x9F\x8C\x99"),
    );
    $MAP = array(
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
        'ai-dream-interpreter'          => array('ai-tarot-chat', 'mbti-tarot', 'numerology-calculator'),
    );

    if (!isset($MAP[$slug])) return $content;
    $recs = $MAP[$slug];
    $cards = '';
    foreach ($recs as $rk) {
        if (!isset($TOOLS[$rk])) continue;
        $t = $TOOLS[$rk];
        $href = $HOME . ltrim($t['u'], '/');
        $cards .= '<a class="ew-rl-card" href="' . esc_url($href) . '">'
            . '<span class="ew-rl-ico">' . $t['i'] . '</span>'
            . '<span class="ew-rl-tx"><strong>' . esc_html($t['t']) . '</strong><em>' . esc_html($t['d']) . '</em></span>'
            . '</a>';
    }
    if (!$cards) return $content;

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

    $html = '<style>' . $css . '</style>'
        . '<section class="ew-related"><h2 class="ew-rl-h">Keep exploring</h2>'
        . '<p class="ew-rl-sub">More free tools to guide your journey</p>'
        . '<div class="ew-rl-grid">' . $cards . '</div></section>';

    return $content . $html;
}
