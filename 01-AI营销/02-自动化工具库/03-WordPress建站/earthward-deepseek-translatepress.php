<?php
/**
 * Plugin Name: Earthward DeepSeek Translate for TranslatePress
 * Plugin URI: https://goearthward.com
 * Description: 注入品牌术语表/调性/合规禁用词/HTML结构保护/原文净化的 DeepSeek 翻译引擎。配套规则文档见知识库《TranslatePress-翻译规则与术语表.md》。
 * Version: 1.2.0
 * Author: Earthward
 * Requires Plugins: translatepress-multilingual
 *
 * v1.2.0 修复加载顺序：类定义 + hook 注册包进 plugins_loaded（优先级 20，确保 TranslatePress 先加载）。
 *      原顶部 guard `if(!class_exists('TRP_Machine_Translator')) return` 在 TP 之前加载时提前退出，hook 永不注册。
 *      加诊断 error_log（plugins_loaded 触发 / TRP 就绪 / hook 注册 / filter 被调用）。
 *
 * v1.1.0 修复（评审反馈）：
 *   - B1: TranslatePress 父类 translate() 已把 %/$/# 替换成 1TP1/1TP2/1TP3，占位符校验改为检测 1TP\d+
 *   - B2: 检查 finish_reason=length（截断）和 body.error，失败整批回退 + error_log
 *   - B3: 译文数组长度校验，count 不一致整批回退（避免位置错位雪崩）
 *   - s5: build_system_prompt 用 normalize_code 归一化（zh-tw→zh）查术语表
 *   - M1: verify_request_parameters 失败记日志
 *   - M2: 按字符数分批（BATCH_MAX_CHARS=12000）+ max_tokens 动态
 *   - M6: 补 9 颗 Top 石种 × 13 语言术语
 *   - M7: 结构失败回退 + error_log + do_action hook（可观测）
 *   - M8: is_wp_error / 非 200 分支补回退原文
 *   - M5: 术语表 apply_filters 可扩展
 *   - m4/m5: 统一文档与代码术语值
 *   - m9: few-shot 样本注入 system prompt
 *
 * 部署方式（二选一）：
 *   A) 独立插件：本文件打 zip 上传后台「插件 → 添加新插件 → 上传插件」→ 启用
 *   B) mu-plugin：上传到 wp-content/mu-plugins/（始终启用）
 *
 * 配套规则文档：知识库 01-AI营销/02-自动化工具库/03-WordPress建站/TranslatePress-翻译规则与术语表.md
 * 父类参考：TranslatePress includes/class-machine-translator.php（phpzio/translatepress 镜像）
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 延迟到 plugins_loaded（优先级 20，确保 TranslatePress 已加载 TRP_Machine_Translator）。
add_action( 'plugins_loaded', function () {
    if ( ! class_exists( 'TRP_Machine_Translator' ) ) {
        error_log( 'earthward-deepseek: plugins_loaded — TRP_Machine_Translator 未加载，跳过注册' );
        return;
    }
    error_log( 'earthward-deepseek: plugins_loaded — TP 就绪，定义引擎类并注册 hook' );

    class Earthward_DeepSeek_Translator extends TRP_Machine_Translator {

    const ENGINE_KEY       = 'earthward_deepseek';
    const FIELD_API_KEY    = 'earthward-deepseek-api-key';
    const API_URL          = 'https://api.deepseek.com/v1/chat/completions';
    const MODEL            = 'deepseek-chat';
    const BATCH_MAX_COUNT  = 30;    // 单批最大条数
    const BATCH_MAX_CHARS  = 12000; // 单批最大字符数（约 4K token，留足输出预算）
    const TIMEOUT          = 90;    // DeepSeek 高峰生成长文可能 30-60s

    /**
     * 默认术语表：品类核心词 + Top 9 石种（13 语言）。
     * 数据源：规则文档 §3.1 + §3.2（ⓘ 标注的需 SEMrush 二次验证定稿）。
     * 可通过 apply_filters('earthward_deepseek_glossary', ...) 覆盖/扩展，定稿后不必改插件代码。
     */
    private static function default_glossary() {
        return array(
            'de' => array(
                'healing crystals' => 'Heilsteine', 'crystal jewelry' => 'Kristallschmuck',
                'crystal bracelet' => 'Natursteinarmband', 'gemstone' => 'Edelstein',
                'amethyst' => 'Amethyst', 'rose quartz' => 'Rosenquarz',
                'clear quartz' => 'Bergkristall', 'citrine' => 'Citrin',
                'black tourmaline' => 'schwarzer Turmalin', 'smoky quartz' => 'Rauchquarz',
                'moonstone' => 'Mondstein', 'labradorite' => 'Labradorit',
                'selenite' => 'Selenit', 'carnelian' => 'Karneol', 'obsidian' => 'Obsidian',
            ),
            'es' => array(
                'healing crystals' => 'piedras de sanación', 'crystal jewelry' => 'joyería de cristales',
                'crystal bracelet' => 'pulsera de cristales', 'gemstone' => 'piedra preciosa',
                'amethyst' => 'amatista', 'rose quartz' => 'cuarzo rosa',
                'clear quartz' => 'cuarzo transparente', 'citrine' => 'citrino',
                'black tourmaline' => 'turmalina negra', 'smoky quartz' => 'cuarzo ahumado',
                'moonstone' => 'piedra lunar', 'labradorite' => 'labradorita',
                'selenite' => 'selenita', 'carnelian' => 'cornalina', 'obsidian' => 'obsidiana',
            ),
            'fr' => array(
                'healing crystals' => 'pierres de guérison', 'crystal jewelry' => 'bijoux en cristal',
                'crystal bracelet' => 'bracelet en pierre naturelle', 'gemstone' => 'pierre précieuse',
                'amethyst' => 'améthyste', 'rose quartz' => 'quartz rose',
                'clear quartz' => 'quartz clair', 'citrine' => 'citrine',
                'black tourmaline' => 'tourmaline noire', 'smoky quartz' => 'quartz fumé',
                'moonstone' => 'pierre de lune', 'labradorite' => 'labradorite',
                'selenite' => 'sélénite', 'carnelian' => 'cornaline', 'obsidian' => 'obsidienne',
            ),
            'it' => array(
                'healing crystals' => 'pietre curative', 'crystal jewelry' => 'gioielli in cristallo',
                'crystal bracelet' => 'bracciale in pietra naturale', 'gemstone' => 'pietra preziosa',
                'amethyst' => 'ametista', 'rose quartz' => 'quarzo rosa',
                'clear quartz' => 'quarzo trasparente', 'citrine' => 'citrino',
                'black tourmaline' => 'tormalina nera', 'smoky quartz' => 'quarzo affumicato',
                'moonstone' => 'pietra di luna', 'labradorite' => 'labradorite',
                'selenite' => 'selenite', 'carnelian' => 'cornalina', 'obsidian' => 'ossidiana',
            ),
            'ja' => array(
                'healing crystals' => 'パワーストーン', 'crystal jewelry' => 'クリスタルジュエリー',
                'crystal bracelet' => '天然石ブレスレット', 'gemstone' => 'ジェムストーン',
                'amethyst' => 'アメジスト', 'rose quartz' => 'ローズクォーツ',
                'clear quartz' => 'クリアクォーツ', 'citrine' => 'シトリン',
                'black tourmaline' => 'ブラックトルマリン', 'smoky quartz' => 'スモーキークォーツ',
                'moonstone' => 'ムーンストーン', 'labradorite' => 'ラブラドライト',
                'selenite' => 'セレナイト', 'carnelian' => 'カーネリアン', 'obsidian' => 'オブシディアン',
            ),
            'ko' => array(
                'healing crystals' => '파워스톤', 'crystal jewelry' => '크리스탈 주얼리',
                'crystal bracelet' => '천연석 팔찌', 'gemstone' => '보석',
                'amethyst' => '자수정', 'rose quartz' => '장미석',
                'clear quartz' => '클리어 쿼츠', 'citrine' => '시트린',
                'black tourmaline' => '흑전기석', 'smoky quartz' => '스모키 쿼츠',
                'moonstone' => '문스톤', 'labradorite' => '라브라도라이트',
                'selenite' => '셀레나이트', 'carnelian' => '카넬리안', 'obsidian' => '흑요석',
            ),
            'zh' => array( // zh-TW 台港消费市场通俗用语
                'healing crystals' => '能量水晶', 'crystal jewelry' => '水晶飾品',
                'crystal bracelet' => '水晶手鍊', 'gemstone' => '寶石',
                'amethyst' => '紫水晶', 'rose quartz' => '粉水晶',
                'clear quartz' => '白水晶', 'citrine' => '黃水晶',
                'black tourmaline' => '黑碧璽', 'smoky quartz' => '茶水晶',
                'moonstone' => '月光石', 'labradorite' => '拉長石',
                'selenite' => '雪花石膏', 'carnelian' => '紅玉髓', 'obsidian' => '黑曜石',
            ),
            'nl' => array(
                'healing crystals' => 'geneeskrachtige stenen', 'crystal jewelry' => 'kristallen sieraden',
                'crystal bracelet' => 'armband van natuursteen', 'gemstone' => 'edelsteen',
                'amethyst' => 'amethist', 'rose quartz' => 'rozenkwarts',
                'clear quartz' => 'bergkristal', 'citrine' => 'citrine',
                'black tourmaline' => 'zwarte toermalijn', 'smoky quartz' => 'rookkwarts',
                'moonstone' => 'maansteen', 'labradorite' => 'labradoriet',
                'selenite' => 'seleniet', 'carnelian' => 'carneool', 'obsidian' => 'obsidiaan',
            ),
            'pl' => array(
                'healing crystals' => 'kamienie lecznicze', 'crystal jewelry' => 'biżuteria z kryształów',
                'crystal bracelet' => 'bransoletka z kamienia', 'gemstone' => 'kamień szlachetny',
                'amethyst' => 'ametyst', 'rose quartz' => 'różowy kwarc',
                'clear quartz' => 'górski kryształ', 'citrine' => 'cytryn',
                'black tourmaline' => 'czarny turmalin', 'smoky quartz' => 'dymny kwarc',
                'moonstone' => 'kamień księżycowy', 'labradorite' => 'labrador',
                'selenite' => 'selenit', 'carnelian' => 'karneol', 'obsidian' => 'obsydian',
            ),
            'id' => array(
                'healing crystals' => 'batu kristal', 'crystal jewelry' => 'perhiasan kristal',
                'crystal bracelet' => 'gelang batu alam', 'gemstone' => 'batu permata',
                'amethyst' => 'batu kecubung', 'rose quartz' => 'kuarsa mawar',
                'clear quartz' => 'kuarsa bening', 'citrine' => 'batu citrin',
                'black tourmaline' => 'turmalin hitam', 'smoky quartz' => 'kuarsa asap',
                'moonstone' => 'batu bulan', 'labradorite' => 'labradorit',
                'selenite' => 'selenit', 'carnelian' => 'akik', 'obsidian' => 'batu obsidian',
            ),
            'ar' => array(
                'healing crystals' => 'أحجار الشفاء', 'crystal jewelry' => 'مجوهرات الكريستال',
                'crystal bracelet' => 'سوار من الأحجار الطبيعية', 'gemstone' => 'حجر كريم',
                'amethyst' => 'جمشت', 'rose quartz' => 'الكوارتز الوردي',
                'clear quartz' => 'الكوارتز الصافي', 'citrine' => 'سيترين',
                'black tourmaline' => 'التورمالين الأسود', 'smoky quartz' => 'الكوارتز الدخاني',
                'moonstone' => 'حجر القمر', 'labradorite' => 'لابرادوريت',
                'selenite' => 'سيلينايت', 'carnelian' => 'عقيق أحمر', 'obsidian' => 'السبج',
            ),
            'pt' => array( // pt-BR
                'healing crystals' => 'pedras de cura', 'crystal jewelry' => 'joias de cristal',
                'crystal bracelet' => 'pulseira de cristais', 'gemstone' => 'pedra preciosa',
                'amethyst' => 'ametista', 'rose quartz' => 'quartzo rosa',
                'clear quartz' => 'quartzo transparente', 'citrine' => 'citrino',
                'black tourmaline' => 'turmalina negra', 'smoky quartz' => 'quartzo defumado',
                'moonstone' => 'pedra da lua', 'labradorite' => 'labradorita',
                'selenite' => 'selenita', 'carnelian' => 'cornalina', 'obsidian' => 'obsidiana',
            ),
        );
    }

    /**
     * 术语表（经 filter，可外部覆盖）。
     * @param string $target_code 已归一化的主语言代码（zh/de/ja 等）
     */
    private function core_glossary( $target_code ) {
        $all  = apply_filters( 'earthward_deepseek_glossary', self::default_glossary(), $target_code );
        return $all[ $target_code ] ?? array();
    }

    private static function do_not_translate() {
        return array( 'Earthward', 'goearthward.com', "Return to what's real." );
    }

    /**
     * Few-shot 样本（按目标语言）。规则文档 §9。
     */
    private static function few_shot_samples() {
        return array(
            'ja' => "风格样本（英→日）：\n原文：Rose Quartz is known as the stone of unconditional love, often used as a gentle reminder to practice self-compassion.\n译文：ローズクォーツは無条件の愛の石として知られ、自分自身への思いやりを忘れないための、やさしい存在です。",
            'fr' => "Exemple de style (en→fr) :\n原文 : Every crystal should feel beautiful, but it should also come with clear sourcing, care guidance, and realistic expectations.\n译文 : Chaque cristal doit être magnifique, mais aussi s'accompagner d'une origine claire, de conseils d'entretien et d'attentes réalistes.",
            'de' => "Stilbeispiel (en→de, 含禁用词改写)：\n原文：This crystal will cure anxiety and remove all negative energy.\n译文：Dieser Kristall kann dich als Teil deiner Selbstfürsorge dabei unterstützen, mehr innere Ruhe zu finden.（cure→unterstützen bei）",
            'zh' => "風格樣本（英→繁中）：\n原文：Rose Quartz is known as the stone of unconditional love.\n譯文：粉水晶被視為無條件之愛的象徵，溫柔提醒我們練習疼愛自己。",
        );
    }

    /** 归一化语言代码：zh-tw/zh-TW → zh，pt-br → pt，en-us → en */
    private static function normalize_code( $code ) {
        $parts = explode( '-', (string) $code );
        return strtolower( $parts[0] );
    }

    private function build_system_prompt( $target_lang_name, $target_code ) {
        $norm           = self::normalize_code( $target_code );
        $glossary       = $this->core_glossary( $norm );
        $glossary_str   = '';
        foreach ( $glossary as $en => $loc ) {
            $glossary_str .= "- \"{$en}\" → \"{$loc}\"\n";
        }
        $dont_str   = implode( ' / ', self::do_not_translate() );
        $tone_hint  = $this->get_tone_hint( $norm );
        $few_shot   = self::few_shot_samples()[ $norm ] ?? '';
        $few_shot_block = $few_shot ? "\n\n【参考样本】\n{$few_shot}" : '';

        return <<<EOT
你是 Earthward（goearthward.com）水晶疗愈首饰品牌的专业本地化翻译引擎，把英文翻译成 {$target_lang_name}。严格遵循以下规则，不得自由发挥：

【品牌调性】沉稳、自然、温和、可信、灵性但不玄乎。像懂水晶的朋友和向导，不像夸张销售员。不夸张、不绝对化、不恐吓。{$tone_hint}

【术语表 - 强制映射】遇左列英文必须用右列译法，不得字典直译：
{$glossary_str}

【不译品牌词】以下保持英文原样，不得翻译：{$dont_str}。
注意："Lucky Crystals" 是站点已知 bug，一律按 "Earthward" 处理。

【合规禁用词 - 源文含则改写后再译】
- heal / cure / treat（疾病语境）→ support / accompany / serve as a reminder
- attract wealth / guarantee fortune → symbolize abundance / represent prosperity intentions
- 100% guaranteed / absolutely will → known for / commonly used for / traditionally believed
- replace medical treatment → complement your wellness routine
- purify negative energy / remove bad luck → support energetic balance / promote a sense of renewal
- magic / supernatural power → meaningful ritual / symbolic intention
涉及功效时保留三句话框架（传统语境 + 个人体验 + 证据边界），第三句（证据边界）不得压缩或删除。

【HTML 结构保护 - 最高优先级】
只译 HTML 文本节点。以下必须原样保留，不得翻译、改写、删除：
- HTML 标签：<b></b> <strong> <a href="..."> <span> 等
- 短代码：[contact-form-7 id="123"] 等
- 占位符：1TP1、1TP2、1TP3（系统内部占位符，分别代表 %、$、#，必须原样保留不得改写或删除，否则破坏前端）
- Gutenberg 注释：<!-- wp:html --> <!-- /wp:paragraph -->
- URL 与链接
价格货币按目标市场本地化格式（如德语 32,00 €、日语 ￥3,200）。

【原文净化】
- 遇非常规英文词（拼写错误/乱码如 Prokchion、Potitiviby、Thher Powver）→ 该条原样返回，不译。
- "diamond" 在水晶品类语境 → 按 crystal / stone 处理，不译为"钻石"。

【输出格式】严格输出 JSON：{"translations": ["译文1", "译文2", ...]}
- 数组顺序与输入条目一一对应，条目数必须等于输入条目数
- 不得加编号、不得解释、不得用换行符分隔条目{$few_shot_block}
EOT;
    }

    private function get_tone_hint( $norm_code ) {
        $hints = array(
            'de' => '德语用 du（亲近，不用 Sie）；复合词正确连写；阴阳性正确。',
            'fr' => '法语用 tu；阴阳性、形容词性数配合正确。',
            'ja' => '日语用敬体（です/ます）；外来词优先片假名音译；标点用全角（、。「」）。',
            'ko' => '韩语用 합쇼체（-ㅂ니다）或 해요체（-해요），全站一致。',
            'it' => '意大利语阴阳性正确，敬称统一用 tu。',
            'zh' => '繁体中文，用台港消费市场通俗用语（非大陆规范名、非简体）；标点「」、，。、。',
            'ar' => '现代标准阿拉伯语（MSA），不用方言；数字用西方数字 0-9；不添加 LRM/RLM 控制字符，不改写 HTML 的 dir 属性。',
            'pt' => '巴西葡语（pt-BR），用 você 称呼。',
            'pl' => '波兰语阴阳性、格变正确。',
            'nl' => '荷兰语 de/het 词性正确。',
            'id' => '印尼语，正式但通俗。',
        );
        return $hints[ $norm_code ] ?? '';
    }

    private function get_language_name( $code ) {
        $map = array(
            'de' => 'German', 'es' => 'Spanish', 'fr' => 'French', 'it' => 'Italian',
            'ja' => 'Japanese', 'ko' => 'Korean', 'zh' => 'Chinese (Traditional)',
            'nl' => 'Dutch', 'pl' => 'Polish', 'id' => 'Indonesian',
            'ar' => 'Arabic', 'pt' => 'Portuguese (Brazil)',
        );
        $norm = self::normalize_code( $code );
        return $map[ $norm ] ?? $norm;
    }

    /**
     * 发送翻译请求到 DeepSeek。
     *
     * @param string $source_language  源语言（已适配，如 en）
     * @param string $language_code    目标语言（已适配，如 zh-tw）
     * @param array  $strings_array    待译字符串（索引数组）
     * @param int    $chunk_chars      本批字符数（用于动态 max_tokens）
     * @return array|WP_Error
     */
    public function send_request( $source_language, $language_code, $strings_array, $chunk_chars = 0 ) {
        $target_name = $this->get_language_name( $language_code );
        $system      = $this->build_system_prompt( $target_name, $language_code );

        $user = '把以下 ' . count( $strings_array ) . " 条英文翻译成 {$target_name}。保留所有 HTML 标签和 1TP1/1TP2/1TP3 占位符原样。\n输入：\n" . wp_json_encode( array_values( $strings_array ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );

        // 动态 max_tokens：按批字符数估算，夹在 [2000, 8000]。
        $max_tokens = (int) min( 8000, max( 2000, $chunk_chars * 3 ) );

        $data = array(
            'model'           => self::MODEL,
            'temperature'     => 0.2, // DeepSeek JSON mode 要求 temperature > 0
            'response_format' => array( 'type' => 'json_object' ),
            'messages'        => array(
                array( 'role' => 'system', 'content' => $system ),
                array( 'role' => 'user',   'content' => $user ),
            ),
            'max_tokens'      => $max_tokens,
        );

        $args = apply_filters( 'earthward_deepseek_request_args', array(
            'timeout' => self::TIMEOUT,
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->get_api_key(),
                'Content-Type'  => 'application/json',
            ),
            'body'    => wp_json_encode( $data ),
        ), $data );

        return wp_remote_post( self::API_URL, $args );
    }

    /**
     * 翻译一批字符串。
     */
    public function translate_array( $new_strings, $target_language_code, $source_language_code ) {
        if ( empty( $this->get_api_key() ) ) {
            return array();
        }
        if ( null === $source_language_code ) {
            $source_language_code = $this->settings['default-language'];
        }
        if ( empty( $new_strings ) ) {
            return array();
        }

        // M1: verify 失败要记日志，否则"配了不翻"无法排查。
        if ( ! $this->verify_request_parameters( $target_language_code, $source_language_code ) ) {
            error_log( "earthward-deepseek: verify_request_parameters failed src=$source_language_code tgt=$target_language_code (检查 machine_translation_codes ISO 映射是否缺失)" );
            return array();
        }

        $source_language = apply_filters( 'earthward_deepseek_source_language', $this->machine_translation_codes[ $source_language_code ] ?? $source_language_code, $source_language_code, $target_language_code );
        $target_language = apply_filters( 'earthward_deepseek_target_language', $this->machine_translation_codes[ $target_language_code ] ?? $target_language_code, $source_language_code, $target_language_code );

        $translated_strings = array();
        $chunks             = $this->chunk_by_chars( $new_strings, self::BATCH_MAX_CHARS, self::BATCH_MAX_COUNT );

        foreach ( $chunks as $chunk ) {
            $keys        = array_keys( $chunk );
            $indexed     = array_values( $chunk );
            $chunk_chars = array_sum( array_map( 'mb_strlen', $indexed ) );

            $response = $this->send_request( $source_language, $target_language, $indexed, $chunk_chars );

            // 日志
            if ( ! empty( $this->machine_translator_logger ) && method_exists( $this->machine_translator_logger, 'log' ) ) {
                $this->machine_translator_logger->log( array(
                    'strings'     => maybe_serialize( $chunk ),
                    'response'    => maybe_serialize( $response ),
                    'lang_source' => $source_language,
                    'lang_target' => $target_language,
                ) );
            }

            // M8: WP_Error → 整批回退原文。
            if ( is_wp_error( $response ) ) {
                error_log( 'earthward-deepseek: wp_remote_post error: ' . $response->get_error_message() );
                foreach ( $keys as $key ) {
                    $translated_strings[ $key ] = $chunk[ $key ];
                }
                continue;
            }

            $http_code = $response['response']['code'] ?? 0;
            if ( 200 !== (int) $http_code ) {
                error_log( "earthward-deepseek: HTTP $http_code body=" . wp_substr( (string) ( $response['body'] ?? '' ), 0, 300 ) );
                foreach ( $keys as $key ) {
                    $translated_strings[ $key ] = $chunk[ $key ];
                }
                continue;
            }

            if ( ! empty( $this->machine_translator_logger ) && method_exists( $this->machine_translator_logger, 'count_towards_quota' ) ) {
                $this->machine_translator_logger->count_towards_quota( $chunk );
            }

            $body = json_decode( (string) ( $response['body'] ?? '' ), true );

            // B2: DeepSeek 返回 error 字段（余额不足/限流等）。
            if ( ! empty( $body['error'] ) ) {
                error_log( 'earthward-deepseek: API error: ' . wp_json_encode( $body['error'] ) );
                foreach ( $keys as $key ) {
                    $translated_strings[ $key ] = $chunk[ $key ];
                }
                if ( ! empty( $this->machine_translator_logger ) && method_exists( $this->machine_translator_logger, 'quota_exceeded' ) && $this->machine_translator_logger->quota_exceeded() ) {
                    break;
                }
                continue;
            }

            $choice       = is_array( $body ) && isset( $body['choices'][0] ) ? $body['choices'][0] : null;
            $content      = is_array( $choice ) ? (string) ( $choice['message']['content'] ?? '' ) : '';
            $finish_reason = is_array( $choice ) ? (string) ( $choice['finish_reason'] ?? '' ) : '';

            // B2: 截断检查。
            if ( 'length' === $finish_reason ) {
                error_log( "earthward-deepseek: finish_reason=length (truncated, " . count( $indexed ) . " strings, {$chunk_chars} chars) — 建议减小 BATCH_MAX_CHARS" );
                foreach ( $keys as $key ) {
                    $translated_strings[ $key ] = $chunk[ $key ];
                }
                continue;
            }

            // 防御 markdown fence（JSON mode 一般不会，但稳妥）。
            $content = trim( $content );
            if ( 0 === strpos( $content, '```' ) ) {
                $content = preg_replace( '/^```(?:json)?\s*|\s*```$/', '', $content );
            }

            $parsed       = json_decode( $content, true );
            $translations = is_array( $parsed ) && isset( $parsed['translations'] ) ? $parsed['translations'] : null;

            // B3: 长度校验，不一致整批回退（避免位置错位雪崩）。
            if ( ! is_array( $translations ) || count( $translations ) !== count( $indexed ) ) {
                $got = is_array( $translations ) ? count( $translations ) : 'non-array';
                error_log( "earthward-deepseek: translation count mismatch (expected " . count( $indexed ) . ", got {$got}) — 整批回退" );
                foreach ( $keys as $key ) {
                    $translated_strings[ $key ] = $chunk[ $key ];
                }
                continue;
            }

            foreach ( $keys as $i => $key ) {
                $original = $chunk[ $key ];
                $tr       = isset( $translations[ $i ] ) ? (string) $translations[ $i ] : '';

                if ( '' === $tr || ! $this->structure_valid( $original, $tr ) ) {
                    // M7: 结构失败回退原文 + 日志 + hook（可观测，运营可挂告警）。
                    error_log( 'earthward-deepseek: structure_valid failed key=' . $key . ' orig=' . wp_substr( $original, 0, 80 ) );
                    do_action( 'earthward_deepseek_translation_failed', $key, $original, $tr, 'structure' );
                    $translated_strings[ $key ] = $original;
                } else {
                    $translated_strings[ $key ] = $tr;
                }
            }

            if ( ! empty( $this->machine_translator_logger ) && method_exists( $this->machine_translator_logger, 'quota_exceeded' ) && $this->machine_translator_logger->quota_exceeded() ) {
                break;
            }
        }

        return $translated_strings;
    }

    /**
     * 按字符数 + 条数双重约束分批（M2）。保留原 key。
     */
    private function chunk_by_chars( $strings, $max_chars, $max_count ) {
        $chunks        = array();
        $current       = array();
        $current_chars = 0;

        foreach ( $strings as $key => $val ) {
            $len = mb_strlen( $val );
            // 单条超阈值 → 独占一批（仍翻译，靠 max_tokens 动态适配；截断由 finish_reason 兜底）。
            if ( $len > $max_chars ) {
                if ( ! empty( $current ) ) {
                    $chunks[]      = $current;
                    $current       = array();
                    $current_chars = 0;
                }
                $chunks[] = array( $key => $val );
                continue;
            }
            if ( $current_chars + $len > $max_chars || count( $current ) >= $max_count ) {
                $chunks[]      = $current;
                $current       = array();
                $current_chars = 0;
            }
            $current[ $key ] = $val;
            $current_chars  += $len;
        }
        if ( ! empty( $current ) ) {
            $chunks[] = $current;
        }
        return $chunks;
    }

    /**
     * HTML 结构校验（B1 修复 + §7.2）。
     * 原文与译文的 HTML 标签名集合、TranslatePress 内部占位符（1TP\d+）集合、原始占位符（兜底）集合必须一致。
     *
     * @param string $orig  原文（引擎收到，%/$/# 已被 TP 父类替换成 1TP1/1TP2/1TP3）
     * @param string $trans 译文
     * @return bool
     */
    private function structure_valid( $orig, $trans ) {
        if ( $orig === $trans ) {
            return true;
        }

        // 1. HTML 标签名集合（小写化排序比对；自闭合 <br/> <img/> 也覆盖）。
        $norm_tags = function ( $html ) {
            preg_match_all( '#</?[a-z][a-z0-9-]*#i', $html, $m );
            $tags = array_map( 'strtolower', $m[0] );
            sort( $tags );
            return $tags;
        };
        if ( $norm_tags( $orig ) !== $norm_tags( $trans ) ) {
            return false;
        }

        // 2. TranslatePress 内部占位符 1TP\d+（B1 核心：引擎收到的 %/$/# 已被替换为 1TP1/1TP2/1TP3）。
        $norm_tp = function ( $text ) {
            preg_match_all( '/1TP\d+/', $text, $m );
            $phs = $m[0];
            sort( $phs );
            return $phs;
        };
        if ( $norm_tp( $orig ) !== $norm_tp( $trans ) ) {
            return false;
        }

        // 3. 兜底：原始占位符（防 trp_exclude_words_from_automatic_translation filter 被禁用、原文仍含 %s/{$var}/{{x}}）。
        $norm_ph = function ( $text ) {
            preg_match_all( '/%[sdf]|\{\$[a-z_]+\}|\{\{[a-z_]+\}\}/i', $text, $m );
            $phs = $m[0];
            sort( $phs );
            return $phs;
        };
        if ( $norm_ph( $orig ) !== $norm_ph( $trans ) ) {
            return false;
        }

        return true;
    }

    // —— 父类方法适配 ——

    public function get_api_key() {
        return isset( $this->settings['trp_machine_translation_settings'][ self::FIELD_API_KEY ] )
            ? $this->settings['trp_machine_translation_settings'][ self::FIELD_API_KEY ] : '';
    }

    public function get_api_url() {
        return self::API_URL;
    }

    public function get_referer() {
        return $this->get_api_url();
    }

    public function is_correctly_configured() {
        return ! empty( $this->get_api_key() );
    }

    public function check_formal_api_key() {
        return $this->is_correctly_configured();
    }
}

// ============================================================
// 引擎注册（仿 hollisho RegisterMachineTranslationEngines，已对照父类源码）
// ============================================================

// 1) 引擎下拉选项
add_filter( 'trp_machine_translation_engines', function ( $engines ) {
    $engines[] = array(
        'value' => Earthward_DeepSeek_Translator::ENGINE_KEY,
        'label' => esc_html__( 'DeepSeek (Earthward 定制)', 'earthward-deepseek' ),
    );
    error_log( 'earthward-deepseek: trp_machine_translation_engines filter 被 TP 调用' );
    return $engines;
} );

// 2) ENGINE_KEY → 引擎类名映射（TranslatePress 用此 filter 路由实例化）
add_filter( 'trp_automatic_translation_engines_classes', function ( $classes ) {
    $classes[ Earthward_DeepSeek_Translator::ENGINE_KEY ] = 'Earthward_DeepSeek_Translator';
    return $classes;
} );

// 3) 设置页 API Key 输入字段
add_action( 'trp_machine_translation_extra_settings_middle', function ( $settings ) {
    $translation_engine = $settings['translation-engine'] ?? '';
    if ( Earthward_DeepSeek_Translator::ENGINE_KEY !== $translation_engine ) {
        return;
    }
    ?>
    <tr>
        <th scope="row"><?php esc_html_e( 'DeepSeek API Key', 'earthward-deepseek' ); ?></th>
        <td>
            <input type="text" class="trp-text-input"
                   name="trp_machine_translation_settings[<?php echo esc_attr( Earthward_DeepSeek_Translator::FIELD_API_KEY ); ?>]"
                   value="<?php echo esc_attr( $settings[ Earthward_DeepSeek_Translator::FIELD_API_KEY ] ?? '' ); ?>"/>
            <p class="description">
                <?php
                echo wp_kses(
                    sprintf(
                        __( '从 <a href="%s" target="_blank">platform.deepseek.com</a> 获取 API Key。', 'earthward-deepseek' ),
                        'https://platform.deepseek.com'
                    ),
                    array( 'a' => array( 'href' => array(), 'target' => array() ) )
                );
                ?>
            </p>
        </td>
    </tr>
    <?php
} );

// 4) 保存时清洗 API Key
add_action( 'trp_machine_translation_sanitize_settings', function ( $settings, $mt_settings ) {
    if ( ! empty( $mt_settings[ Earthward_DeepSeek_Translator::FIELD_API_KEY ] ) ) {
        $settings[ Earthward_DeepSeek_Translator::FIELD_API_KEY ] = sanitize_text_field( $mt_settings[ Earthward_DeepSeek_Translator::FIELD_API_KEY ] );
    }
    return $settings;
}, 20, 2 );

// 5) 语言代码适配（en_US→en, zh_TW→zh-tw, pt_BR→pt）
add_filter( 'earthward_deepseek_target_language', function ( $lang, $src_code, $tgt_code ) {
    $map = array(
        'zh_HK' => 'zh-tw', 'zh_TW' => 'zh-tw', 'zh_CN' => 'zh-cn',
        'en_GB' => 'en', 'en_US' => 'en', 'en_CA' => 'en', 'en_AU' => 'en', 'en_NZ' => 'en', 'en_ZA' => 'en',
        'pt_BR' => 'pt', 'pt_PT' => 'pt',
    );
    if ( isset( $map[ $tgt_code ] ) ) {
        return $map[ $tgt_code ];
    }
    $parts = explode( '_', $tgt_code );
    return $parts[0];
}, 20, 3 );

add_filter( 'earthward_deepseek_source_language', function ( $lang, $src_code, $tgt_code ) {
    $map = array(
        'zh_HK' => 'zh-tw', 'zh_TW' => 'zh-tw', 'zh_CN' => 'zh-cn',
        'en_GB' => 'en', 'en_US' => 'en', 'en_CA' => 'en', 'en_AU' => 'en',
        'pt_BR' => 'pt', 'pt_PT' => 'pt',
    );
    if ( isset( $map[ $src_code ] ) ) {
        return $map[ $src_code ];
    }
    $parts = explode( '_', $src_code );
    return $parts[0];
}, 20, 3 );

    error_log( 'earthward-deepseek: 引擎类与全部 hook 已注册' );
}, 20 ); // end plugins_loaded
