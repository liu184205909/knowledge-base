<?php

defined('ABSPATH') || exit;

final class EW_T17_Frontend {
    public static function init() {
        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_assets'));
        add_shortcode('ew_t17_bracelet_builder', array(__CLASS__, 'render_shortcode'));
        add_shortcode('ew_t17_official_designs', array(__CLASS__, 'render_official_designs'));
        add_shortcode('ew_t17_builder_landing', array(__CLASS__, 'render_landing'));
        add_shortcode('ew_t17_builder_seo', array(__CLASS__, 'render_seo_content'));
    }

    public static function register_assets() {
        wp_register_style('ew-t17-builder', EW_T17_URL . 'assets/css/t17-builder-ui.css', array(), EW_T17_VERSION);
        wp_register_script('ew-t17-builder', EW_T17_URL . 'assets/js/t17-builder-ui.js', array(), EW_T17_VERSION, true);
    }

    public static function render_shortcode($atts) {
        $atts = shortcode_atts(array('official_product_id' => 0), $atts, 'ew_t17_bracelet_builder');
        $product_id = absint($atts['official_product_id']);
        if (!$product_id && isset($_GET['t17_product'])) {
            $product_id = absint($_GET['t17_product']);
        }
        $recipe = $product_id ? json_decode((string) get_post_meta($product_id, '_ew_t17_recipe_json', true), true) : null;
        $scene = $product_id ? (string) get_post_meta($product_id, '_ew_t17_primary_scene', true) : '';
        $library_tabs = EW_T17_Catalog::library_tabs();

        wp_enqueue_style('ew-t17-builder');
        wp_enqueue_script('ew-t17-builder');
        wp_localize_script('ew-t17-builder', 'EW_T17_UI_CONFIG', array(
            'restUrl' => esc_url_raw(rest_url('ew-t17/v1/')),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ew_t17_builder'),
            'cartUrl' => function_exists('wc_get_cart_url') ? wc_get_cart_url() : '',
            'currencySymbol' => function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '$',
            'physicsMotion' => 'essential',
            'mockMode' => false,
            'trayImage' => EW_T17_URL . 'assets/images/tray-default.png',
            'trayBrand' => array(
                'imageUrl' => ($tray_logo_id = absint(get_option('ew_t17_tray_logo_id', 0))) ? (string) wp_get_attachment_image_url($tray_logo_id, 'full') : esc_url_raw((string) get_option('ew_t17_tray_logo_url', '')),
                'widthPx' => max(24, min(160, absint(get_option('ew_t17_tray_logo_size_px', 54)))),
                'alt' => 'Earthward',
                'textFallback' => 'Earthward',
            ),
            'strings' => array(
                'catalogEmpty' => __('The material catalog is being prepared. Please return soon.', 'earthward-t17'),
                'quoteError' => __('We could not update your design price.', 'earthward-t17'),
                'finishDesign' => __('Finish Design', 'earthward-t17'),
            ),
        ));
        ob_start();
        include EW_T17_DIR . 'assets/partials/t17-builder-fragment.php';
        return ob_get_clean();

        // Legacy shortcode markup below is intentionally unreachable during
        // this transition and will be removed once the v3 package is accepted.
        ob_start();
        ?>
        <section class="ew-t17-builder" id="t17-builder" data-product-id="<?php echo esc_attr($product_id); ?>" data-scene="<?php echo esc_attr($scene); ?>" data-recipe="<?php echo esc_attr(wp_json_encode($recipe ?: new stdClass())); ?>" data-insertion-policy="after-selected-or-append" data-insertion-position="append" data-selected-item-index="" data-selected-variant-key="" data-selected-component-type="" data-orientation-state="none">
            <div class="ew-t17-builder__notice" aria-live="polite"></div>
            <div class="screen-reader-text" role="status" aria-live="polite" aria-atomic="true" data-editor-status data-insertion-position="append" data-selected-item-index="" data-selected-variant-key="" data-selected-component-type="" data-orientation-state="none"><?php esc_html_e('No material is selected. New materials will be appended to the bracelet.', 'earthward-t17'); ?></div>
            <div class="ew-t17-builder__workbench">
                <section class="ew-t17-builder__stage" aria-label="<?php esc_attr_e('Bracelet design', 'earthward-t17'); ?>">
                    <div class="ew-t17-builder__topline">
                        <button class="ew-t17-wrist" type="button" data-action="edit-wrist"><span>Wrist</span><strong>16 cm</strong></button>
                        <span class="ew-t17-fit" data-fit="empty"><?php esc_html_e('Start with a material', 'earthward-t17'); ?></span>
                    </div>
                    <div class="ew-t17-canvas" aria-live="polite">
                        <img class="ew-t17-tray" src="<?php echo esc_url(EW_T17_URL . 'assets/images/tray-default.png'); ?>" alt="">
                        <div class="ew-t17-ring"></div>
                        <div class="ew-t17-canvas__empty"><?php esc_html_e('Choose a design or add materials to begin.', 'earthward-t17'); ?></div>
                        <aside class="ew-t17-selection-toolbox" data-selection-toolbox hidden aria-live="polite">
                            <span data-selection-label><?php esc_html_e('Selected bead', 'earthward-t17'); ?></span>
                            <button type="button" data-selection-action="remove"><?php esc_html_e('Remove', 'earthward-t17'); ?></button>
                            <button type="button" class="ew-t17-selection-toolbox__close" data-selection-action="close" aria-label="<?php esc_attr_e('Dismiss selected bead controls', 'earthward-t17'); ?>">&times;</button>
                        </aside>
                    </div>
                    <div class="ew-t17-builder__metrics"><span><small><?php esc_html_e('Used length', 'earthward-t17'); ?></small><strong data-metric="length">0 mm</strong></span><span><small><?php esc_html_e('Pieces', 'earthward-t17'); ?></small><strong data-metric="pieces">0</strong></span></div>
                    <div class="ew-t17-builder__actions"><button type="button" data-action="reset"><?php esc_html_e('Reset', 'earthward-t17'); ?></button><button type="button" data-action="save"><?php esc_html_e('Save', 'earthward-t17'); ?></button><button type="button" class="is-primary" data-action="finish"><?php esc_html_e('Finish Design', 'earthward-t17'); ?></button></div>
                </section>
                <section class="ew-t17-builder__catalog" aria-label="<?php esc_attr_e('Materials', 'earthward-t17'); ?>">
                    <div class="ew-t17-builder__catalog-head"><div class="ew-t17-tabs" role="tablist"><?php foreach ($library_tabs as $index => $tab) : ?><button type="button" class="<?php echo $index === 0 ? 'is-active' : ''; ?>" data-type="<?php echo esc_attr($tab['slug']); ?>" role="tab"><?php echo esc_html($tab['label']); ?></button><?php endforeach; ?></div><button type="button" class="ew-t17-search" data-action="toggle-search" aria-label="<?php esc_attr_e('Search materials', 'earthward-t17'); ?>">⌕</button></div>
                    <label class="ew-t17-search-field"><span class="screen-reader-text"><?php esc_html_e('Search materials', 'earthward-t17'); ?></span><input type="search" placeholder="Search materials" data-search></label>
                    <div class="ew-t17-builder__filters" data-filters></div>
                    <div class="ew-t17-builder__grid" data-grid></div>
                </section>
            </div>
            <dialog class="ew-t17-builder__dialog" data-dialog="wrist"><form method="dialog"><button class="ew-t17-builder__close" value="cancel" aria-label="<?php esc_attr_e('Close', 'earthward-t17'); ?>">×</button><p class="ew-t17-builder__eyebrow">Wrist setting</p><h2><?php esc_html_e('Your wrist fit', 'earthward-t17'); ?></h2><label>Wrist circumference <input type="number" data-wrist-input min="10" max="30" step="0.1" value="16"> cm</label><fieldset><legend><?php esc_html_e('Fit preference', 'earthward-t17'); ?></legend><label><input type="radio" name="fit" value="snug"> Snug</label><label><input type="radio" name="fit" value="regular" checked> Regular</label><label><input type="radio" name="fit" value="loose"> Loose</label></fieldset><button class="is-primary" value="confirm" data-action="confirm-wrist"><?php esc_html_e('Apply wrist setting', 'earthward-t17'); ?></button></form></dialog>
            <dialog class="ew-t17-builder__dialog" data-dialog="finish"><form method="dialog"><button class="ew-t17-builder__close" value="cancel" aria-label="<?php esc_attr_e('Close', 'earthward-t17'); ?>">×</button><p class="ew-t17-builder__eyebrow">Design summary</p><h2><?php esc_html_e('Ready to make?', 'earthward-t17'); ?></h2><div class="ew-t17-builder__summary" data-summary></div><button class="is-primary" value="confirm" data-action="add-cart"><?php esc_html_e('Add custom bracelet to cart', 'earthward-t17'); ?></button></form></dialog>
        </section>
        <?php
        return ob_get_clean();
    }

    public static function render_official_designs($atts) {
        if (!function_exists('wc_get_products')) {
            return '';
        }

        $atts = shortcode_atts(array('limit' => 12, 'scene' => ''), $atts, 'ew_t17_official_designs');
        $meta_query = array(array('key' => '_ew_t17_official_design', 'value' => 'yes'));
        if ($atts['scene'] !== '') {
            $meta_query[] = array('key' => '_ew_t17_primary_scene', 'value' => sanitize_key($atts['scene']));
        }
        $products = wc_get_products(array(
            'status' => 'publish',
            'limit' => max(1, min(48, absint($atts['limit']))),
            'meta_query' => $meta_query,
            'orderby' => 'date',
            'order' => 'DESC',
        ));
        if (!$products) {
            return '';
        }

        ob_start();
        ?>
        <section class="ew-t17-official-designs" id="t17-official-designs" aria-label="<?php esc_attr_e('Official bracelet designs', 'earthward-t17'); ?>">
            <?php foreach ($products as $product) : ?>
                <?php
                $product_url = $product->get_permalink();
                $scene = sanitize_key((string) $product->get_meta('_ew_t17_primary_scene'));
                $scene_label = $scene !== '' ? ucwords(str_replace('-', ' ', $scene)) : '';
                $can_buy_directly = $product->is_type('simple') && $product->is_purchasable() && $product->is_in_stock();
                $builder_page_id = (int) get_option('ew_t17_builder_page_id', 0);
                $builder_url = $builder_page_id ? get_permalink($builder_page_id) : '';
                $can_customize = $product->get_meta('_ew_t17_customize_enabled') === 'yes' && $builder_url;
                $customize_url = $can_customize ? add_query_arg('t17_product', $product->get_id(), $builder_url) : '';
                ?>
                <article class="ew-t17-official-designs__item">
                    <a href="<?php echo esc_url($product_url); ?>" class="ew-t17-official-designs__image"><?php echo $product->get_image('woocommerce_thumbnail'); ?></a>
                    <div class="ew-t17-official-designs__body">
                        <?php if ($scene_label !== '') : ?><p class="ew-t17-official-designs__scene"><?php echo esc_html($scene_label); ?></p><?php endif; ?>
                        <h3><a href="<?php echo esc_url($product_url); ?>"><?php echo esc_html($product->get_name()); ?></a></h3>
                        <p><?php echo wp_kses_post($product->get_price_html()); ?></p>
                        <div class="ew-t17-official-designs__actions">
                            <?php if ($can_buy_directly) : ?>
                                <a class="ew-t17-official-designs__buy" href="<?php echo esc_url($product->add_to_cart_url()); ?>"><?php esc_html_e('Add to cart', 'earthward-t17'); ?></a>
                            <?php else : ?>
                                <a class="ew-t17-official-designs__buy" href="<?php echo esc_url($product_url); ?>"><?php esc_html_e('View design', 'earthward-t17'); ?></a>
                            <?php endif; ?>
                            <?php if ($customize_url) : ?>
                                <a class="ew-t17-official-designs__customize" href="<?php echo esc_url($customize_url); ?>"><?php esc_html_e('Customize', 'earthward-t17'); ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </section>
        <?php
        return ob_get_clean();
    }

    public static function render_landing() {
        wp_enqueue_style('ew-t17-builder');
        ob_start();
        ?>
        <section class="ew-t17-landing" aria-labelledby="ew-t17-landing-title">
            <img class="ew-t17-landing__media" src="<?php echo esc_url(EW_T17_URL . 'assets/images/tray-default.png'); ?>" alt="<?php esc_attr_e('Wooden tray for crystal bracelet design', 'earthward-t17'); ?>">
            <div class="ew-t17-landing__content">
                <p><?php esc_html_e('EarthWard Custom Crystal Bracelet', 'earthward-t17'); ?></p>
                <h1 id="ew-t17-landing-title"><?php esc_html_e('Design a bracelet with meaning', 'earthward-t17'); ?></h1>
                <div class="ew-t17-landing__actions"><a href="#t17-builder"><?php esc_html_e('Design your own', 'earthward-t17'); ?></a><a href="#t17-official-designs"><?php esc_html_e('Shop official designs', 'earthward-t17'); ?></a></div>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }

    public static function render_seo_content() {
        wp_enqueue_style('ew-t17-builder');
        ob_start();
        ?>
        <section class="ew-t17-seo" aria-label="<?php esc_attr_e('About custom crystal bracelets', 'earthward-t17'); ?>">
            <details>
                <summary><?php esc_html_e('About custom crystal bracelets', 'earthward-t17'); ?></summary>
                <div>
                    <h2><?php esc_html_e('A bracelet assembled around your choices', 'earthward-t17'); ?></h2>
                    <p><?php esc_html_e('Start with a finished EarthWard design or build from individual beads and accents. Each item in the editor shows its size and price so the design remains clear before it reaches the cart.', 'earthward-t17'); ?></p>
                    <h3><?php esc_html_e('Wrist fit and materials', 'earthward-t17'); ?></h3>
                    <p><?php esc_html_e('Set your wrist measurement first, then review the used length and fit indicator as you add materials. A final order records the selected variants, their sequence, and the wrist setting for production.', 'earthward-t17'); ?></p>
                    <h3><?php esc_html_e('Ordering a custom design', 'earthward-t17'); ?></h3>
                    <p><?php esc_html_e('Your design is confirmed in the cart using the current material availability and price. Production timing, shipping, and return terms are shown at checkout and in the store policies.', 'earthward-t17'); ?></p>
                </div>
            </details>
        </section>
        <?php
        return ob_get_clean();
    }
}
