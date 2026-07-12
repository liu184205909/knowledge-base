<?php

defined('ABSPATH') || exit;

final class EW_T17_Commerce {
    public static function init() {
        add_action('woocommerce_product_options_general_product_data', array(__CLASS__, 'render_product_fields'));
        add_action('woocommerce_process_product_meta', array(__CLASS__, 'save_product_fields'));
        add_action('wp_ajax_ew_t17_add_custom', array(__CLASS__, 'add_custom_to_cart'));
        add_action('wp_ajax_nopriv_ew_t17_add_custom', array(__CLASS__, 'add_custom_to_cart'));
        add_action('woocommerce_before_calculate_totals', array(__CLASS__, 'recalculate_cart'), 20);
        add_filter('woocommerce_get_item_data', array(__CLASS__, 'cart_item_data'), 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', array(__CLASS__, 'save_order_snapshot'), 10, 4);
    }

    public static function render_product_fields() {
        global $post;
        if (!$post || get_post_type($post) !== 'product') {
            return;
        }
        echo '<div class="options_group">';
        woocommerce_wp_checkbox(array(
            'id' => '_ew_t17_official_design',
            'label' => __('T17 official design product', 'earthward-t17'),
            'description' => __('This Woo product has an editable T17 bracelet recipe.', 'earthward-t17'),
        ));
        woocommerce_wp_checkbox(array(
            'id' => '_ew_t17_customize_enabled',
            'label' => __('Allow Customize this design', 'earthward-t17'),
        ));
        woocommerce_wp_text_input(array(
            'id' => '_ew_t17_primary_scene',
            'label' => __('Primary scene', 'earthward-t17'),
            'placeholder' => 'calm-grounding',
        ));
        woocommerce_wp_text_input(array(
            'id' => '_ew_t17_design_version',
            'label' => __('Design version', 'earthward-t17'),
            'placeholder' => '2026-07-12',
        ));
        woocommerce_wp_text_input(array(
            'id' => '_ew_t17_price_version',
            'label' => __('Price version', 'earthward-t17'),
            'placeholder' => '2026-q3-draft',
        ));
        woocommerce_wp_textarea_input(array(
            'id' => '_ew_t17_recipe_json',
            'label' => __('T17 recipe JSON', 'earthward-t17'),
            'description' => __('Stores target_wrist_cm, fit_preference, and sequence items using variant_id.', 'earthward-t17'),
            'desc_tip' => true,
        ));
        echo '</div>';
    }

    public static function save_product_fields($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) {
            return;
        }
        $fields = array(
            '_ew_t17_official_design' => isset($_POST['_ew_t17_official_design']) ? 'yes' : 'no',
            '_ew_t17_customize_enabled' => isset($_POST['_ew_t17_customize_enabled']) ? 'yes' : 'no',
            '_ew_t17_primary_scene' => sanitize_key(wp_unslash($_POST['_ew_t17_primary_scene'] ?? '')),
            '_ew_t17_design_version' => sanitize_text_field(wp_unslash($_POST['_ew_t17_design_version'] ?? '')),
            '_ew_t17_price_version' => sanitize_text_field(wp_unslash($_POST['_ew_t17_price_version'] ?? '')),
        );
        foreach ($fields as $key => $value) {
            $product->update_meta_data($key, $value);
        }
        $recipe = wp_unslash($_POST['_ew_t17_recipe_json'] ?? '');
        $decoded = json_decode($recipe, true);
        if ($recipe !== '' && is_array($decoded)) {
            $product->update_meta_data('_ew_t17_recipe_json', wp_json_encode($decoded));
        } elseif ($recipe === '') {
            $product->delete_meta_data('_ew_t17_recipe_json');
        }
        $product->save();
    }

    public static function add_custom_to_cart() {
        check_ajax_referer('ew_t17_builder', 'nonce');
        if (!function_exists('WC') || !WC()->cart) {
            wp_send_json_error(array('message' => __('WooCommerce cart is unavailable.', 'earthward-t17')), 500);
        }
        $config = json_decode(wp_unslash($_POST['config'] ?? ''), true);
        $quote = EW_T17_Catalog::quote_config($config);
        if (is_wp_error($quote)) {
            wp_send_json_error(array('message' => $quote->get_error_message()), $quote->get_error_data()['status'] ?? 400);
        }
        $product_id = (int) get_option('ew_t17_custom_product_id', 0);
        $product = $product_id ? wc_get_product($product_id) : false;
        if (!$product || !$product->is_purchasable()) {
            wp_send_json_error(array('message' => __('Configure the hidden Custom Crystal Bracelet product before enabling custom checkout.', 'earthward-t17')), 500);
        }

        $snapshot = array(
            'schema_version' => 'ew-t17-v3',
            'target_wrist_cm' => (float) ($config['target_wrist_cm'] ?? 16),
            'fit_preference' => sanitize_key($config['fit_preference'] ?? 'regular'),
            'sequence' => $quote['snapshot'],
            'quote' => $quote,
            'created_at' => current_time('c'),
        );
        $key = WC()->cart->add_to_cart($product_id, 1, 0, array(), array(
            'ew_t17_snapshot' => $snapshot,
            'ew_t17_unique_key' => wp_hash(wp_json_encode($snapshot) . microtime(true)),
        ));
        if (!$key) {
            wp_send_json_error(array('message' => __('Unable to add the custom bracelet to cart.', 'earthward-t17')), 500);
        }
        wp_send_json_success(array(
            'cart_url' => wc_get_cart_url(),
            'total' => $quote['total'],
            'snapshot' => $snapshot,
        ));
    }

    public static function recalculate_cart($cart) {
        if (is_admin() && !wp_doing_ajax()) {
            return;
        }
        foreach ($cart->get_cart() as $item) {
            if (empty($item['ew_t17_snapshot']['sequence']) || empty($item['data'])) {
                continue;
            }
            $raw = array(
                'target_wrist_cm' => $item['ew_t17_snapshot']['target_wrist_cm'] ?? 16,
                'fit_preference' => $item['ew_t17_snapshot']['fit_preference'] ?? 'regular',
                'sequence' => array_map(static function ($row) {
                    return array('variant_id' => $row['variant_id'] ?? '');
                }, $item['ew_t17_snapshot']['sequence']),
            );
            $quote = EW_T17_Catalog::quote_config($raw);
            if (!is_wp_error($quote)) {
                $item['data']->set_price((float) $quote['total']);
                $item['ew_t17_snapshot']['quote'] = $quote;
            }
        }
    }

    public static function cart_item_data($data, $item) {
        if (empty($item['ew_t17_snapshot'])) {
            return $data;
        }
        $snapshot = $item['ew_t17_snapshot'];
        $data[] = array('name' => __('Wrist', 'earthward-t17'), 'value' => wc_clean(($snapshot['target_wrist_cm'] ?? 0) . ' cm'));
        $data[] = array('name' => __('Materials', 'earthward-t17'), 'value' => wc_clean(count($snapshot['sequence'] ?? array()) . ' items'));
        $data[] = array('name' => __('Fit', 'earthward-t17'), 'value' => wc_clean($snapshot['fit_preference'] ?? 'regular'));
        return $data;
    }

    public static function save_order_snapshot($item, $cart_item_key, $values, $order) {
        if (empty($values['ew_t17_snapshot'])) {
            return;
        }
        $snapshot = $values['ew_t17_snapshot'];
        $item->add_meta_data('_ew_t17_design_snapshot', wp_json_encode($snapshot), true);
        $item->add_meta_data('T17 wrist', ($snapshot['target_wrist_cm'] ?? 0) . ' cm', true);
        $item->add_meta_data('T17 materials', implode(', ', array_map(static function ($row) {
            return $row['name'] . ' ' . $row['size_mm'] . 'mm';
        }, $snapshot['sequence'] ?? array())), true);
        $item->add_meta_data('T17 server total', $snapshot['quote']['total'] ?? 0, true);
        $item->add_meta_data('T17 price version', $snapshot['quote']['price_version'] ?? '', true);
    }
}
