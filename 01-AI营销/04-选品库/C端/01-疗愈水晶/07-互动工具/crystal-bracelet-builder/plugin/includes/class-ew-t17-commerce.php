<?php

defined('ABSPATH') || exit;

final class EW_T17_Commerce {
    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_rest_routes'));
        add_action('woocommerce_product_options_general_product_data', array(__CLASS__, 'render_product_fields'));
        add_action('woocommerce_process_product_meta', array(__CLASS__, 'save_product_fields'));
        add_action('woocommerce_after_add_to_cart_button', array(__CLASS__, 'render_customize_button'));
        add_action('wp_ajax_ew_t17_add_custom', array(__CLASS__, 'add_custom_to_cart'));
        add_action('wp_ajax_nopriv_ew_t17_add_custom', array(__CLASS__, 'add_custom_to_cart'));
        add_filter('woocommerce_add_to_cart_validation', array(__CLASS__, 'validate_official_add_to_cart'), 10, 5);
        add_filter('woocommerce_add_cart_item_data', array(__CLASS__, 'freeze_official_cart_snapshot'), 10, 4);
        add_action('woocommerce_before_calculate_totals', array(__CLASS__, 'recalculate_cart'), 20);
        add_filter('woocommerce_get_item_data', array(__CLASS__, 'cart_item_data'), 10, 2);
        add_action('woocommerce_after_checkout_validation', array(__CLASS__, 'validate_official_checkout'), 10, 2);
        add_action('woocommerce_checkout_create_order_line_item', array(__CLASS__, 'save_order_snapshot'), 10, 4);
    }

    public static function register_rest_routes() {
        register_rest_route('ew-t17/v1', '/official-design/(?P<product_id>\d+)', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array(__CLASS__, 'get_official_design'),
            'permission_callback' => '__return_true',
        ));
    }

    public static function get_official_design(WP_REST_Request $request) {
        $product = self::official_product_for_id(absint($request['product_id']));
        if (!$product || $product->get_meta('_ew_t17_customize_enabled') !== 'yes') {
            return new WP_Error('ew_t17_official_design_not_found', __('This official T17 design is not available for customization.', 'earthward-t17'), array('status' => 404));
        }
        $quoted = self::quote_official_recipe((string) $product->get_meta('_ew_t17_recipe_json'));
        if (is_wp_error($quoted)) {
            return new WP_Error('ew_t17_official_design_unavailable', $quoted->get_error_message(), array('status' => 409));
        }
        return rest_ensure_response(array(
            'product_id' => $product->get_id(),
            'name' => $product->get_name(),
            'recipe' => $quoted['recipe'],
            'quote' => $quoted['quote'],
            'design_version' => (string) $product->get_meta('_ew_t17_design_version'),
            'price_version' => (string) $product->get_meta('_ew_t17_price_version'),
            'primary_scene' => (string) $product->get_meta('_ew_t17_primary_scene'),
            'preview_image_url' => get_the_post_thumbnail_url($product->get_id(), 'large') ?: '',
        ));
    }

    public static function render_product_fields() {
        global $post;
        if (!$post || get_post_type($post) !== 'product' || !function_exists('woocommerce_wp_checkbox')) {
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
            'description' => __('Stores a single-wrap wrist, fit preference, optional packaging, and sequence items using variant_id.', 'earthward-t17'),
            'desc_tip' => true,
        ));
        echo '</div>';
    }

    public static function save_product_fields($product_id) {
        if (!function_exists('wc_get_product')) {
            self::add_admin_error(__('WooCommerce is unavailable, so T17 product settings were not saved.', 'earthward-t17'));
            return;
        }
        $product = wc_get_product($product_id);
        if (!$product) {
            return;
        }
        $recipe_input = isset($_POST['_ew_t17_recipe_json']) ? trim((string) wp_unslash($_POST['_ew_t17_recipe_json'])) : '';
        $recipe = $recipe_input === '' ? null : self::validate_recipe_json($recipe_input);
        $official_design = isset($_POST['_ew_t17_official_design']) ? 'yes' : 'no';

        if (is_wp_error($recipe)) {
            self::add_admin_error($recipe->get_error_message());
            $official_design = 'no';
        } elseif ($official_design === 'yes' && !$recipe) {
            self::add_admin_error(__('An official T17 design requires a valid recipe with at least one live variant.', 'earthward-t17'));
            $official_design = 'no';
        }

        $fields = array(
            '_ew_t17_official_design' => $official_design,
            '_ew_t17_customize_enabled' => $official_design === 'yes' && isset($_POST['_ew_t17_customize_enabled']) ? 'yes' : 'no',
            '_ew_t17_primary_scene' => sanitize_key(wp_unslash($_POST['_ew_t17_primary_scene'] ?? '')),
            '_ew_t17_design_version' => sanitize_text_field(wp_unslash($_POST['_ew_t17_design_version'] ?? '')),
            '_ew_t17_price_version' => sanitize_text_field(wp_unslash($_POST['_ew_t17_price_version'] ?? '')),
        );
        foreach ($fields as $key => $value) {
            $product->update_meta_data($key, $value);
        }
        if (is_array($recipe)) {
            $product->update_meta_data('_ew_t17_recipe_json', wp_json_encode($recipe));
        } elseif ($recipe_input === '') {
            $product->delete_meta_data('_ew_t17_recipe_json');
        }
        $product->save();
    }

    public static function render_customize_button() {
        global $product;
        if (!class_exists('WC_Product') || !($product instanceof WC_Product)) {
            return;
        }
        if ($product->get_meta('_ew_t17_official_design') !== 'yes' || $product->get_meta('_ew_t17_customize_enabled') !== 'yes') {
            return;
        }
        if (is_wp_error(self::quote_official_recipe((string) $product->get_meta('_ew_t17_recipe_json')))) {
            return;
        }
        $builder_page_id = (int) get_option('ew_t17_builder_page_id', 0);
        $builder_url = $builder_page_id ? get_permalink($builder_page_id) : '';
        if (!$builder_url) {
            return;
        }
        $url = add_query_arg('t17_design', $product->get_id(), $builder_url);
        echo '<a class="button ew-t17-customize-product" href="' . esc_url($url) . '">' . esc_html__('Customize this design', 'earthward-t17') . '</a>';
    }

    public static function add_custom_to_cart() {
        check_ajax_referer('ew_t17_builder', 'nonce');
        if (!class_exists('EW_T17_Catalog')) {
            wp_send_json_error(array('message' => __('The T17 materials catalog is unavailable. Please try again later.', 'earthward-t17')), 503);
        }
        $woocommerce = function_exists('WC') ? WC() : null;
        if (!$woocommerce || !isset($woocommerce->cart) || !$woocommerce->cart) {
            wp_send_json_error(array('message' => __('WooCommerce cart is unavailable.', 'earthward-t17')), 500);
        }
        $config_json = isset($_POST['config']) && is_string($_POST['config']) ? wp_unslash($_POST['config']) : '';
        $config = json_decode($config_json, true);
        if (!is_array($config) || json_last_error() !== JSON_ERROR_NONE) {
            wp_send_json_error(array('message' => __('The bracelet configuration is invalid. Please refresh and try again.', 'earthward-t17')), 400);
        }
        $config = self::normalize_recipe($config);
        if (is_wp_error($config)) {
            wp_send_json_error(array('message' => $config->get_error_message()), 400);
        }
        $quote = EW_T17_Catalog::quote_config($config);
        if (is_wp_error($quote)) {
            $error_data = $quote->get_error_data();
            wp_send_json_error(array('message' => $quote->get_error_message()), is_array($error_data) && isset($error_data['status']) ? (int) $error_data['status'] : 400);
        }
        if (!is_array($quote) || !isset($quote['total'], $quote['snapshot']) || !is_array($quote['snapshot'])) {
            wp_send_json_error(array('message' => __('The T17 quote could not be finalized. Please try again later.', 'earthward-t17')), 500);
        }
        $product_id = (int) get_option('ew_t17_custom_product_id', 0);
        $product = $product_id && function_exists('wc_get_product') ? wc_get_product($product_id) : false;
        if (!$product || !$product->is_purchasable()) {
            wp_send_json_error(array('message' => __('Configure the hidden Custom Crystal Bracelet product before enabling custom checkout.', 'earthward-t17')), 500);
        }

        $quote['snapshot'] = self::merge_sequence_orientations($config['sequence'], $quote['snapshot']);
        $snapshot = array(
            'schema_version' => 'ew-t17-v3',
            'order_mode' => 'custom',
            'target_wrist_cm' => max(10, min(30, (float) ($config['target_wrist_cm'] ?? 16))),
            'wrap_mode' => $config['wrap_mode'],
            'fit_preference' => self::normalize_fit_preference($config['fit_preference'] ?? 'regular'),
            'sequence' => $quote['snapshot'],
            'packaging' => array_merge($config['packaging'], array('resolved_variant' => $quote['packaging_snapshot'] ?? array())),
            'preview_data' => $config['preview_data'],
            'preview_image_url' => $config['preview_image_url'],
            'quote' => $quote,
            'created_at' => current_time('c'),
        );
        $snapshot_json = wp_json_encode($snapshot);
        if (!$snapshot_json) {
            wp_send_json_error(array('message' => __('The bracelet configuration could not be saved. Please try again.', 'earthward-t17')), 500);
        }
        $key = $woocommerce->cart->add_to_cart($product_id, 1, 0, array(), array(
            'ew_t17_snapshot' => $snapshot,
            'ew_t17_snapshot_json' => $snapshot_json,
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
        if (!is_object($cart) || !is_callable(array($cart, 'get_cart')) || (is_admin() && !wp_doing_ajax())) {
            return;
        }
        foreach ($cart->get_cart() as $item) {
            if (($item['ew_t17_snapshot']['order_mode'] ?? '') !== 'custom' || !isset($item['ew_t17_snapshot']['quote']['total']) || !is_numeric($item['ew_t17_snapshot']['quote']['total']) || empty($item['data'])) {
                continue;
            }
            // The server validates the live catalog at add-to-cart time. Keep the accepted
            // quote immutable afterwards so a later catalog change cannot alter an open cart.
            $item['data']->set_price((float) $item['ew_t17_snapshot']['quote']['total']);
        }
    }

    public static function validate_official_add_to_cart($passed, $product_id, $quantity, $variation_id = 0, $variations = array()) {
        if (!$passed) {
            return false;
        }
        $product = self::official_product_for_id($variation_id ?: $product_id);
        if (!$product) {
            return true;
        }
        $snapshot = self::build_official_snapshot($product);
        if (!is_wp_error($snapshot)) {
            return true;
        }
        wc_add_notice($snapshot->get_error_message(), 'error');
        return false;
    }

    public static function freeze_official_cart_snapshot($cart_item_data, $product_id, $variation_id, $quantity) {
        if (!empty($cart_item_data['ew_t17_snapshot']) || !function_exists('wc_get_product')) {
            return $cart_item_data;
        }
        $product = self::official_product_for_id($variation_id ?: $product_id);
        if (!$product) {
            return $cart_item_data;
        }
        $snapshot = self::build_official_snapshot($product);
        if (is_wp_error($snapshot)) {
            return $cart_item_data;
        }
        $snapshot_json = wp_json_encode($snapshot);
        if (!$snapshot_json) {
            return $cart_item_data;
        }
        $cart_item_data['ew_t17_snapshot'] = $snapshot;
        $cart_item_data['ew_t17_snapshot_json'] = $snapshot_json;
        $cart_item_data['ew_t17_unique_key'] = wp_hash($snapshot_json . microtime(true));
        return $cart_item_data;
    }

    public static function validate_official_checkout($data, $errors) {
        $woocommerce = function_exists('WC') ? WC() : null;
        $cart = $woocommerce && isset($woocommerce->cart) ? $woocommerce->cart : null;
        if (!$cart || !is_callable(array($cart, 'get_cart'))) {
            return;
        }
        foreach ($cart->get_cart() as $cart_item) {
            $official_product = !empty($cart_item['data']) ? self::official_product_for_id($cart_item['data']->get_id()) : null;
            if (empty($cart_item['ew_t17_snapshot']) || !is_array($cart_item['ew_t17_snapshot'])) {
                if ($official_product) {
                    $errors->add('ew_t17_missing_official_snapshot', __('This official T17 design must be removed and added to the cart again before checkout.', 'earthward-t17'));
                }
                continue;
            }
            $quote = self::quote_frozen_snapshot($cart_item['ew_t17_snapshot']);
            if (is_wp_error($quote)) {
                $errors->add('ew_t17_cart_design_unavailable', sprintf(__('A bracelet in your cart is no longer available: %s', 'earthward-t17'), $quote->get_error_message()));
            }
        }
    }

    public static function cart_item_data($data, $item) {
        if (empty($item['ew_t17_snapshot']) || !is_array($item['ew_t17_snapshot'])) {
            return $data;
        }
        $snapshot = $item['ew_t17_snapshot'];
        $data[] = array('name' => __('Wrist', 'earthward-t17'), 'value' => wc_clean(($snapshot['target_wrist_cm'] ?? 0) . ' cm'));
        $data[] = array('name' => __('Materials', 'earthward-t17'), 'value' => wc_clean(count($snapshot['sequence'] ?? array()) . ' items'));
        $data[] = array('name' => __('Fit', 'earthward-t17'), 'value' => wc_clean($snapshot['fit_preference'] ?? 'regular'));
        return $data;
    }

    public static function save_order_snapshot($item, $cart_item_key, $values, $order) {
        $has_custom_snapshot = !empty($values['ew_t17_snapshot']) && is_array($values['ew_t17_snapshot']);
        if (!$has_custom_snapshot) {
            return;
        }
        $snapshot = $values['ew_t17_snapshot'];
        $snapshot_json = $has_custom_snapshot && isset($values['ew_t17_snapshot_json']) && is_string($values['ew_t17_snapshot_json'])
            ? $values['ew_t17_snapshot_json']
            : '';
        if ($snapshot_json !== '') {
            $frozen_snapshot = json_decode($snapshot_json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($frozen_snapshot)) {
                $snapshot = $frozen_snapshot;
            } else {
                $snapshot_json = '';
            }
        }
        if ($snapshot_json === '') {
            $snapshot_json = wp_json_encode($snapshot);
        }
        if (!$snapshot_json) {
            return;
        }

        $quote = isset($snapshot['quote']) && is_array($snapshot['quote']) ? $snapshot['quote'] : array();
        $sequence = isset($snapshot['sequence']) && is_array($snapshot['sequence']) ? $snapshot['sequence'] : array();
        $currency = sanitize_text_field((string) ($quote['currency'] ?? ''));
        $total = isset($quote['total']) && is_numeric($quote['total']) ? (float) $quote['total'] : 0.0;

        $item->add_meta_data('_ew_t17_design_snapshot', $snapshot_json, true);
        $item->add_meta_data('T17 schema', sanitize_text_field((string) ($snapshot['schema_version'] ?? 'ew-t17-v3')), true);
        $item->add_meta_data('T17 order type', sanitize_text_field((string) ($snapshot['order_mode'] ?? 'custom')), true);
        $item->add_meta_data('T17 configured at', sanitize_text_field((string) ($snapshot['created_at'] ?? '')), true);
        if (!empty($snapshot['design_product_id'])) {
            $item->add_meta_data('T17 official product ID', absint($snapshot['design_product_id']), true);
        }
        if (!empty($snapshot['design_version'])) {
            $item->add_meta_data('T17 design version', sanitize_text_field((string) $snapshot['design_version']), true);
        }
        if (!empty($snapshot['primary_scene'])) {
            $item->add_meta_data('T17 primary scene', sanitize_key((string) $snapshot['primary_scene']), true);
        }
        $item->add_meta_data('T17 wrist', wc_clean(($snapshot['target_wrist_cm'] ?? 0) . ' cm'), true);
        $item->add_meta_data('T17 fit', wc_clean((string) ($snapshot['fit_preference'] ?? 'regular')), true);
        if (!empty($snapshot['packaging'])) {
            $item->add_meta_data('T17 packaging', wc_clean(self::format_packaging($snapshot['packaging'])), true);
        }
        if (!empty($snapshot['preview_image_url'])) {
            $item->add_meta_data('T17 preview image', esc_url_raw((string) $snapshot['preview_image_url']), true);
        }
        $item->add_meta_data('T17 material count', count($sequence), true);
        $item->add_meta_data('T17 material sequence', self::format_material_sequence($sequence), true);
        $item->add_meta_data('T17 calculated length', wc_clean((string) ($quote['used_length_mm'] ?? '') . ' / ' . (string) ($quote['target_length_mm'] ?? '') . ' mm'), true);
        $item->add_meta_data('T17 fit status', wc_clean((string) ($quote['fit_status'] ?? '')), true);
        $item->add_meta_data('T17 total', self::format_total($total, $currency), true);
        $item->add_meta_data('T17 price version', sanitize_text_field((string) ($quote['price_version'] ?? '')), true);
    }

    private static function validate_recipe_json($recipe_json) {
        $result = self::quote_official_recipe($recipe_json);
        return is_wp_error($result) ? $result : $result['recipe'];
    }

    private static function has_valid_recipe($recipe_json) {
        return !is_wp_error(self::quote_official_recipe($recipe_json));
    }

    private static function quote_official_recipe($recipe_json) {
        $decoded = json_decode($recipe_json, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return new WP_Error('ew_t17_invalid_recipe_json', __('T17 recipe JSON must be a valid object.', 'earthward-t17'));
        }
        $recipe = self::normalize_recipe($decoded);
        if (is_wp_error($recipe)) {
            return $recipe;
        }
        if (!class_exists('EW_T17_Catalog')) {
            return new WP_Error('ew_t17_catalog_unavailable', __('The T17 materials catalog is unavailable, so this official recipe cannot be validated.', 'earthward-t17'));
        }
        $quote = EW_T17_Catalog::quote_config($recipe);
        if (is_wp_error($quote) || !is_array($quote) || !isset($quote['snapshot']) || !is_array($quote['snapshot'])) {
            $message = is_wp_error($quote) ? $quote->get_error_message() : __('The T17 materials catalog could not return a production quote.', 'earthward-t17');
            return new WP_Error('ew_t17_invalid_recipe', sprintf(__('T17 recipe validation failed: %s', 'earthward-t17'), $message));
        }
        $quote['snapshot'] = self::merge_sequence_orientations($recipe['sequence'], $quote['snapshot']);
        return array('recipe' => $recipe, 'quote' => $quote);
    }

    private static function normalize_recipe($recipe) {
        if (!is_array($recipe) || !isset($recipe['target_wrist_cm'], $recipe['fit_preference'], $recipe['sequence']) || !is_array($recipe['sequence'])) {
            return new WP_Error('ew_t17_invalid_recipe_shape', __('T17 recipe JSON must include target_wrist_cm, fit_preference, and a sequence array.', 'earthward-t17'));
        }
        $wrap_mode = sanitize_key((string) ($recipe['wrap_mode'] ?? 'single'));
        if ($wrap_mode !== 'single') {
            return new WP_Error('ew_t17_invalid_recipe_wrap_mode', __('T17 currently supports single-wrap recipes only.', 'earthward-t17'));
        }
        if (!is_numeric($recipe['target_wrist_cm']) || (float) $recipe['target_wrist_cm'] < 10 || (float) $recipe['target_wrist_cm'] > 30) {
            return new WP_Error('ew_t17_invalid_recipe_wrist', __('T17 recipe target_wrist_cm must be between 10 and 30.', 'earthward-t17'));
        }
        $fit_preference = sanitize_key((string) $recipe['fit_preference']);
        if (!in_array($fit_preference, array('snug', 'regular', 'loose'), true)) {
            return new WP_Error('ew_t17_invalid_recipe_fit', __('T17 recipe fit_preference must be snug, regular, or loose.', 'earthward-t17'));
        }
        if (count($recipe['sequence']) < 1 || count($recipe['sequence']) > 80) {
            return new WP_Error('ew_t17_invalid_recipe_sequence', __('T17 recipe sequence must contain between 1 and 80 variants.', 'earthward-t17'));
        }

        $sequence = array();
        foreach ($recipe['sequence'] as $item) {
            $variant_id = is_array($item) && isset($item['variant_id']) ? sanitize_key((string) $item['variant_id']) : '';
            if ($variant_id === '') {
                return new WP_Error('ew_t17_invalid_recipe_variant', __('Every T17 recipe sequence item must include a valid variant_id.', 'earthward-t17'));
            }
            $normalized_item = array('variant_id' => $variant_id);
            if (array_key_exists('size_mm', $item)) {
                if (!is_numeric($item['size_mm']) || (float) $item['size_mm'] <= 0) {
                    return new WP_Error('ew_t17_invalid_recipe_variant_size', __('T17 recipe item size_mm must be a positive number when provided.', 'earthward-t17'));
                }
                $normalized_item['size_mm'] = (float) $item['size_mm'];
            }
            if (array_key_exists('orientation', $item)) {
                $orientation = self::normalize_orientation($item['orientation']);
                if (is_wp_error($orientation)) {
                    return $orientation;
                }
                $normalized_item['orientation'] = $orientation;
            }
            $sequence[] = $normalized_item;
        }

        $packaging = self::normalize_packaging($recipe['packaging'] ?? array());
        if (is_wp_error($packaging)) {
            return $packaging;
        }
        $preview_data = self::normalize_preview_data($recipe['preview_data'] ?? array());
        if (is_wp_error($preview_data)) {
            return $preview_data;
        }
        $preview_image_url = isset($recipe['preview_image_url']) ? esc_url_raw((string) $recipe['preview_image_url']) : '';
        return array(
            'target_wrist_cm' => (float) $recipe['target_wrist_cm'],
            'wrap_mode' => 'single',
            'fit_preference' => $fit_preference,
            'sequence' => $sequence,
            'packaging' => $packaging,
            'preview_data' => $preview_data,
            'preview_image_url' => $preview_image_url,
        );
    }

    private static function normalize_packaging($packaging) {
        if ($packaging === null || $packaging === array()) {
            return array();
        }
        if (!is_array($packaging)) {
            return new WP_Error('ew_t17_invalid_packaging', __('T17 packaging must be an object.', 'earthward-t17'));
        }
        $allowed = array('variant_id', 'label', 'notes');
        if (array_diff(array_keys($packaging), $allowed)) {
            return new WP_Error('ew_t17_invalid_packaging', __('T17 packaging contains unsupported fields.', 'earthward-t17'));
        }
        $variant_id = isset($packaging['variant_id']) ? sanitize_key((string) $packaging['variant_id']) : '';
        $label = isset($packaging['label']) ? sanitize_text_field((string) $packaging['label']) : '';
        $notes = isset($packaging['notes']) ? sanitize_textarea_field((string) $packaging['notes']) : '';
        if ($variant_id === '' && $label === '' && $notes === '') {
            return array();
        }
        if ($variant_id === '') {
            return new WP_Error('ew_t17_invalid_packaging', __('T17 packaging must reference a Finish variant.', 'earthward-t17'));
        }
        return array_filter(array('variant_id' => $variant_id, 'label' => $label, 'notes' => $notes), static function ($value) { return $value !== ''; });
    }

    private static function normalize_preview_data($preview_data) {
        if ($preview_data === null || $preview_data === array()) {
            return array();
        }
        if (!is_array($preview_data)) {
            return new WP_Error('ew_t17_invalid_preview_data', __('T17 preview data must be an object.', 'earthward-t17'));
        }
        $json = wp_json_encode($preview_data);
        if (!$json || strlen($json) > 20000) {
            return new WP_Error('ew_t17_invalid_preview_data', __('T17 preview data is invalid or too large.', 'earthward-t17'));
        }
        return $preview_data;
    }

    private static function format_packaging($packaging) {
        if (!is_array($packaging)) {
            return '';
        }
        return trim(implode(' | ', array_filter(array(
            sanitize_text_field((string) ($packaging['label'] ?? '')),
            sanitize_key((string) ($packaging['variant_id'] ?? '')),
            sanitize_textarea_field((string) ($packaging['notes'] ?? '')),
        ))));
    }

    private static function normalize_fit_preference($fit_preference) {
        $fit_preference = sanitize_key((string) $fit_preference);
        return in_array($fit_preference, array('snug', 'regular', 'loose'), true) ? $fit_preference : 'regular';
    }

    private static function official_product_for_id($product_id) {
        if (!function_exists('wc_get_product')) {
            return null;
        }
        $product = wc_get_product($product_id);
        if (!class_exists('WC_Product') || !($product instanceof WC_Product)) {
            return null;
        }
        if ($product->get_meta('_ew_t17_official_design') === 'yes') {
            return $product;
        }
        $parent_id = is_callable(array($product, 'get_parent_id')) ? (int) $product->get_parent_id() : 0;
        if (!$parent_id) {
            return null;
        }
        $parent = wc_get_product($parent_id);
        return $parent instanceof WC_Product && $parent->get_meta('_ew_t17_official_design') === 'yes' ? $parent : null;
    }

    private static function build_official_snapshot($product) {
        if (!class_exists('WC_Product') || !($product instanceof WC_Product) || $product->get_meta('_ew_t17_official_design') !== 'yes') {
            return new WP_Error('ew_t17_not_official_design', __('This product is not configured as an official T17 design.', 'earthward-t17'));
        }
        $quoted_recipe = self::quote_official_recipe((string) $product->get_meta('_ew_t17_recipe_json'));
        if (is_wp_error($quoted_recipe)) {
            return new WP_Error('ew_t17_official_design_unavailable', sprintf(__('This official T17 design is currently unavailable: %s', 'earthward-t17'), $quoted_recipe->get_error_message()));
        }
        $recipe = $quoted_recipe['recipe'];
        $quote = $quoted_recipe['quote'];
        $product_price_version = (string) $product->get_meta('_ew_t17_price_version');
        if ($product_price_version !== '') {
            $quote['price_version'] = $product_price_version;
        }

        return array(
            'schema_version' => 'ew-t17-official-v1',
            'order_mode' => 'official-design',
            'design_product_id' => $product->get_id(),
            'design_version' => (string) $product->get_meta('_ew_t17_design_version'),
            'primary_scene' => (string) $product->get_meta('_ew_t17_primary_scene'),
            'target_wrist_cm' => $recipe['target_wrist_cm'],
            'wrap_mode' => $recipe['wrap_mode'],
            'fit_preference' => $recipe['fit_preference'],
            'sequence' => $quote['snapshot'],
            'packaging' => array_merge($recipe['packaging'], array('resolved_variant' => $quote['packaging_snapshot'] ?? array())),
            'preview_data' => $recipe['preview_data'],
            'preview_image_url' => $recipe['preview_image_url'] ?: (get_the_post_thumbnail_url($product->get_id(), 'large') ?: ''),
            'quote' => $quote,
            'created_at' => current_time('c'),
        );
    }

    private static function format_material_sequence($sequence) {
        $rows = array();
        foreach ($sequence as $index => $row) {
            if (!is_array($row)) {
                continue;
            }
            $name = sanitize_text_field((string) ($row['name'] ?? $row['material_id'] ?? $row['variant_id'] ?? 'Unknown material'));
            $size = isset($row['size_mm']) && is_numeric($row['size_mm']) ? ' ' . (float) $row['size_mm'] . 'mm' : '';
            $component = sanitize_text_field((string) ($row['component_type'] ?? ''));
            $variant = sanitize_key((string) ($row['variant_id'] ?? ''));
            $orientation = self::format_orientation($row['orientation'] ?? null);
            $detail = trim($name . $size . ($component !== '' ? ' (' . $component . ')' : '') . ($variant !== '' ? ' [' . $variant . ']' : '') . $orientation);
            $rows[] = sprintf('%02d. %s', $index + 1, $detail);
        }
        return $rows ? implode("\n", $rows) : __('No material sequence was captured.', 'earthward-t17');
    }

    private static function quote_frozen_snapshot($snapshot) {
        if (!class_exists('EW_T17_Catalog') || empty($snapshot['sequence']) || !is_array($snapshot['sequence'])) {
            return new WP_Error('ew_t17_missing_snapshot', __('The bracelet configuration is incomplete.', 'earthward-t17'));
        }
        return EW_T17_Catalog::quote_config(array(
            'sequence' => $snapshot['sequence'],
            'target_wrist_cm' => $snapshot['target_wrist_cm'] ?? 16,
            'wrap_mode' => $snapshot['wrap_mode'] ?? 'single',
            'fit_preference' => $snapshot['fit_preference'] ?? 'regular',
            'packaging' => $snapshot['packaging'] ?? array(),
        ));
    }

    private static function normalize_orientation($orientation) {
        $allowed = array('none', 'left', 'right', 'rotate_0', 'rotate_90', 'rotate_180', 'rotate_270');
        if (is_string($orientation)) {
            return self::normalize_orientation_string($orientation, $allowed);
        }
        if (!is_array($orientation) || !isset($orientation['mode']) || !is_string($orientation['mode'])) {
            return new WP_Error('ew_t17_invalid_recipe_orientation', __('T17 recipe orientation must be an allowed direction or an object with an allowed mode.', 'earthward-t17'));
        }
        $mode = sanitize_key($orientation['mode']);
        if ($mode === 'rotate' || $mode === 'rotated') {
            $degrees = $orientation['degrees'] ?? $orientation['rotation_degrees'] ?? $orientation['rotation_deg'] ?? 0;
            if (!is_numeric($degrees) || !in_array((int) $degrees, array(0, 90, 180, 270), true)) {
                return new WP_Error('ew_t17_invalid_recipe_orientation', __('T17 recipe rotation must be 0, 90, 180, or 270 degrees.', 'earthward-t17'));
            }
            return 'rotate_' . (int) $degrees;
        }
        return self::normalize_orientation_string($mode, $allowed);
    }

    private static function normalize_orientation_string($orientation, $allowed) {
        $value = sanitize_key($orientation);
        $legacy = array(
            'default' => 'none',
            'fixed_left' => 'left',
            'fixed_right' => 'right',
            'mirrored' => 'right',
            'rotate' => 'rotate_0',
            'rotated' => 'rotate_0',
        );
        $value = $legacy[$value] ?? $value;
        if (!in_array($value, $allowed, true)) {
            return new WP_Error('ew_t17_invalid_recipe_orientation', __('T17 recipe orientation must use an allowed direction.', 'earthward-t17'));
        }
        return $value;
    }

    private static function merge_sequence_orientations($source_sequence, $quoted_sequence) {
        if (!is_array($source_sequence) || !is_array($quoted_sequence)) {
            return is_array($quoted_sequence) ? $quoted_sequence : array();
        }
        foreach ($source_sequence as $index => $source_item) {
            if (!is_array($source_item) || !array_key_exists('orientation', $source_item)) {
                continue;
            }
            if (!isset($quoted_sequence[$index]) || !is_array($quoted_sequence[$index])) {
                $quoted_sequence[$index] = array('variant_id' => sanitize_key((string) ($source_item['variant_id'] ?? '')));
            }
            $quoted_sequence[$index]['orientation'] = $source_item['orientation'];
        }
        return $quoted_sequence;
    }

    private static function format_orientation($orientation) {
        if ($orientation === null || $orientation === '' || $orientation === 'default' || $orientation === 'none') {
            return '';
        }
        if (is_string($orientation)) {
            return ' {' . sanitize_text_field($orientation) . '}';
        }
        if (!is_array($orientation) || empty($orientation['mode'])) {
            return '';
        }
        $label = sanitize_text_field((string) $orientation['mode']);
        foreach (array('rotation_deg', 'rotation_degrees', 'degrees') as $rotation_key) {
            if (isset($orientation[$rotation_key]) && is_numeric($orientation[$rotation_key])) {
                $label .= ' ' . (float) $orientation[$rotation_key] . 'deg';
                break;
            }
        }
        return ' {' . $label . '}';
    }

    private static function format_total($total, $currency) {
        $amount = number_format_i18n((float) $total, 2);
        return $currency !== '' ? $currency . ' ' . $amount : $amount;
    }

    private static function add_admin_error($message) {
        if (class_exists('WC_Admin_Meta_Boxes') && is_callable(array('WC_Admin_Meta_Boxes', 'add_error'))) {
            WC_Admin_Meta_Boxes::add_error($message);
        }
    }
}
