<?php

defined('ABSPATH') || exit;

final class EW_T17_Frontend {
    public static function init() {
        add_action('wp_enqueue_scripts', array(__CLASS__, 'register_assets'));
        add_shortcode('ew_t17_bracelet_builder', array(__CLASS__, 'render_shortcode'));
    }

    public static function register_assets() {
        wp_register_style('ew-t17-builder', EW_T17_URL . 'assets/css/t17-builder.css', array(), EW_T17_VERSION);
        wp_register_script('ew-t17-builder', EW_T17_URL . 'assets/js/t17-builder.js', array(), EW_T17_VERSION, true);
    }

    public static function render_shortcode($atts) {
        $atts = shortcode_atts(array('official_product_id' => 0), $atts, 'ew_t17_bracelet_builder');
        $product_id = absint($atts['official_product_id']);
        $recipe = $product_id ? json_decode((string) get_post_meta($product_id, '_ew_t17_recipe_json', true), true) : null;
        $scene = $product_id ? (string) get_post_meta($product_id, '_ew_t17_primary_scene', true) : '';

        wp_enqueue_style('ew-t17-builder');
        wp_enqueue_script('ew-t17-builder');
        wp_localize_script('ew-t17-builder', 'EW_T17', array(
            'restUrl' => esc_url_raw(rest_url('ew-t17/v1/')),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ew_t17_builder'),
            'cartUrl' => function_exists('wc_get_cart_url') ? wc_get_cart_url() : '',
            'currencySymbol' => function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '$',
            'strings' => array(
                'catalogEmpty' => __('The material catalog is being prepared. Please return soon.', 'earthward-t17'),
                'quoteError' => __('We could not update your design price.', 'earthward-t17'),
                'finishDesign' => __('Finish Design', 'earthward-t17'),
            ),
        ));

        ob_start();
        ?>
        <section class="ew-t17-builder" data-product-id="<?php echo esc_attr($product_id); ?>" data-scene="<?php echo esc_attr($scene); ?>" data-recipe="<?php echo esc_attr(wp_json_encode($recipe ?: new stdClass())); ?>">
            <div class="ew-t17-builder__notice" aria-live="polite"></div>
            <div class="ew-t17-builder__workbench">
                <section class="ew-t17-builder__stage" aria-label="<?php esc_attr_e('Bracelet design', 'earthward-t17'); ?>">
                    <div class="ew-t17-builder__topline">
                        <button class="ew-t17-wrist" type="button" data-action="edit-wrist"><span>Wrist</span><strong>16 cm</strong></button>
                        <span class="ew-t17-fit" data-fit="empty"><?php esc_html_e('Start with a material', 'earthward-t17'); ?></span>
                    </div>
                    <div class="ew-t17-canvas" aria-live="polite"><img class="ew-t17-tray" src="<?php echo esc_url(EW_T17_URL . 'assets/images/tray-default.png'); ?>" alt=""><div class="ew-t17-ring"></div><div class="ew-t17-canvas__empty"><?php esc_html_e('Choose a design or add materials to begin.', 'earthward-t17'); ?></div></div>
                    <div class="ew-t17-builder__metrics"><span><small><?php esc_html_e('Used length', 'earthward-t17'); ?></small><strong data-metric="length">0 mm</strong></span><span><small><?php esc_html_e('Weight', 'earthward-t17'); ?></small><strong data-metric="weight">0 g</strong></span><span><small><?php esc_html_e('Pieces', 'earthward-t17'); ?></small><strong data-metric="pieces">0</strong></span></div>
                    <div class="ew-t17-builder__actions"><button type="button" data-action="reset"><?php esc_html_e('Reset', 'earthward-t17'); ?></button><button type="button" data-action="save"><?php esc_html_e('Save', 'earthward-t17'); ?></button><button type="button" class="is-primary" data-action="finish"><?php esc_html_e('Finish Design', 'earthward-t17'); ?></button></div>
                </section>
                <section class="ew-t17-builder__catalog" aria-label="<?php esc_attr_e('Materials', 'earthward-t17'); ?>">
                    <div class="ew-t17-builder__catalog-head"><div class="ew-t17-tabs" role="tablist"><button type="button" class="is-active" data-type="bead" role="tab">Beads</button><button type="button" data-type="decor" role="tab">Decor</button><button type="button" data-type="finish" role="tab">Finish</button></div><button type="button" class="ew-t17-search" data-action="toggle-search" aria-label="<?php esc_attr_e('Search materials', 'earthward-t17'); ?>">⌕</button></div>
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
}
