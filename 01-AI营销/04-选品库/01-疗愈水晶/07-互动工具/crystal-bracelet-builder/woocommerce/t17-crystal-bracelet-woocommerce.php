<?php
/**
 * T17 Crystal Bracelet Builder WooCommerce hooks.
 *
 * Deploy via Code Snippets or a child theme after creating the hidden simple
 * virtual product "Custom Crystal Bracelet".
 *
 * Required configuration:
 * - Set T17_CRYSTAL_BRACELET_PRODUCT_ID to the WooCommerce product ID.
 * - Upload prices.json somewhere readable by PHP, or keep this file in sync
 *   with the generated ../data/prices.json path if deployed in a plugin/theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('T17_CRYSTAL_BRACELET_PRODUCT_ID')) {
    define('T17_CRYSTAL_BRACELET_PRODUCT_ID', 0);
}

if (!defined('T17_CRYSTAL_BRACELET_PRICES_PATH')) {
    define('T17_CRYSTAL_BRACELET_PRICES_PATH', WP_CONTENT_DIR . '/uploads/builder/prices.json');
}

function t17_crystal_bracelet_prices() {
    static $prices = null;
    if ($prices !== null) {
        return $prices;
    }

    $path = T17_CRYSTAL_BRACELET_PRICES_PATH;
    if (!is_readable($path)) {
        $prices = array();
        return $prices;
    }

    $decoded = json_decode(file_get_contents($path), true);
    $prices = is_array($decoded) ? $decoded : array();
    return $prices;
}

function t17_crystal_bracelet_clean_config($raw) {
    if (!is_string($raw) || $raw === '') {
        return null;
    }

    $config = json_decode(wp_unslash($raw), true);
    if (!is_array($config)) {
        return null;
    }

    $bead_size = isset($config['bead_size']) ? absint($config['bead_size']) : 8;
    if (!in_array($bead_size, array(6, 8, 10, 12), true)) {
        $bead_size = 8;
    }

    $sequence = array();
    if (!empty($config['sequence']) && is_array($config['sequence'])) {
        foreach ($config['sequence'] as $item) {
            if (empty($item['type']) || empty($item['id'])) {
                continue;
            }

            $type = sanitize_key($item['type']);
            $id = sanitize_key($item['id']);

            if ($type === 'bead') {
                $sequence[] = array(
                    'type' => 'bead',
                    'id' => $id,
                    'size_mm' => $bead_size,
                );
            } elseif ($type === 'charm') {
                $sequence[] = array(
                    'type' => 'charm',
                    'id' => $id,
                    'slotWeight' => isset($item['slotWeight']) ? max(1, absint($item['slotWeight'])) : 1,
                );
            }
        }
    }

    return array(
        'schemaVersion' => isset($config['schemaVersion']) ? sanitize_text_field($config['schemaVersion']) : '',
        'partsVersion' => isset($config['partsVersion']) ? sanitize_text_field($config['partsVersion']) : '',
        'bead_size' => $bead_size,
        'wrist_cm' => isset($config['wrist_cm']) ? floatval($config['wrist_cm']) : 0,
        'target_cm' => isset($config['target_cm']) ? floatval($config['target_cm']) : 0,
        'target_slots' => isset($config['target_slots']) ? absint($config['target_slots']) : 0,
        'cord' => isset($config['cord']) ? sanitize_key($config['cord']) : '',
        'sequence' => $sequence,
    );
}

function t17_crystal_bracelet_calculate_total($config) {
    $prices = t17_crystal_bracelet_prices();
    if (empty($prices) || empty($config['sequence'])) {
        return 0;
    }

    $total = 0;
    $bead_size = (string) $config['bead_size'];

    foreach ($config['sequence'] as $item) {
        if ($item['type'] === 'bead') {
            $id = $item['id'];
            if (isset($prices['beads'][$id][$bead_size])) {
                $total += (float) $prices['beads'][$id][$bead_size];
            }
        } elseif ($item['type'] === 'charm') {
            $id = $item['id'];
            if (isset($prices['charms'][$id])) {
                $total += (float) $prices['charms'][$id];
            }
        }
    }

    if (!empty($config['cord']) && isset($prices['cords'][$config['cord']])) {
        $total += (float) $prices['cords'][$config['cord']];
    }

    return round($total, 2);
}

add_filter('woocommerce_add_cart_item_data', function ($cart_item_data, $product_id) {
    if ((int) $product_id !== (int) T17_CRYSTAL_BRACELET_PRODUCT_ID || empty($_POST['t17_config'])) {
        return $cart_item_data;
    }

    $config = t17_crystal_bracelet_clean_config($_POST['t17_config']);
    if (!$config || empty($config['sequence'])) {
        return $cart_item_data;
    }

    $cart_item_data['t17_config'] = $config;
    $cart_item_data['t17_total'] = t17_crystal_bracelet_calculate_total($config);
    $cart_item_data['unique_key'] = md5(wp_json_encode($config) . microtime(true));
    return $cart_item_data;
}, 10, 2);

add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) {
        return;
    }

    if (!$cart || !method_exists($cart, 'get_cart')) {
        return;
    }

    foreach ($cart->get_cart() as $cart_item) {
        if (empty($cart_item['t17_config']) || empty($cart_item['data'])) {
            continue;
        }

        $total = t17_crystal_bracelet_calculate_total($cart_item['t17_config']);
        if ($total > 0) {
            $cart_item['data']->set_price($total);
        }
    }
}, 20);

add_filter('woocommerce_get_item_data', function ($item_data, $cart_item) {
    if (empty($cart_item['t17_config'])) {
        return $item_data;
    }

    $config = $cart_item['t17_config'];
    $item_data[] = array('key' => 'Wrist', 'value' => wc_clean($config['wrist_cm'] . ' cm'));
    $item_data[] = array('key' => 'Bead size', 'value' => wc_clean($config['bead_size'] . ' mm'));
    $item_data[] = array('key' => 'Cord', 'value' => wc_clean($config['cord']));
    $item_data[] = array('key' => 'Slots', 'value' => wc_clean(count($config['sequence']) . ' / ' . $config['target_slots']));
    return $item_data;
}, 10, 2);

add_action('woocommerce_checkout_create_order_line_item', function ($item, $cart_item_key, $values) {
    if (empty($values['t17_config'])) {
        return;
    }

    $config = $values['t17_config'];
    $item->add_meta_data('T17 bracelet config', wp_json_encode($config, JSON_UNESCAPED_SLASHES), true);
    $item->add_meta_data('T17 wrist', $config['wrist_cm'] . ' cm', true);
    $item->add_meta_data('T17 bead size', $config['bead_size'] . ' mm', true);
    $item->add_meta_data('T17 cord', $config['cord'], true);
    $item->add_meta_data('T17 server total', t17_crystal_bracelet_calculate_total($config), true);
}, 10, 3);
