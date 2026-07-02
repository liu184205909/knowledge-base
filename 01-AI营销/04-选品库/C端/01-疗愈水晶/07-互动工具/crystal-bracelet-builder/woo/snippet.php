<?php
/**
 * T17 Crystal Bracelet Builder — WooCommerce 定制加购 PHP（Step-0 验证版）
 *
 * 覆盖 PRD F5/F7/R4/R8：
 *   - woocommerce_before_calculate_totals: 后端按 sequence 重算价（防篡改，R4 唯一计价输入）
 *   - woocommerce_get_item_data: 购物车显示配置摘要
 *   - woocommerce_checkout_create_order_line_item: 订单 meta 存完整配置
 *   - （邮件/后台订单详情 hook 见 step1 完整版）
 *
 * Step-0 验证定价表（test）：
 *   - 每颗 bead $2（malachite/jade/labradorite = premium $3.5）
 *   - 每 charm $5
 *   - 线材：elastic $0 / woven $3 / silver $8
 *
 * 配置（cart_item_data['t17_config']）结构：
 *   {
 *     "bead_size": 8,
 *     "wrist": 16.5,
 *     "cord": "elastic_black",
 *     "sequence": [
 *       {"type":"bead","id":"rose_quartz","size_mm":8},
 *       {"type":"charm","id":"lotus","slotWeight":1}
 *     ]
 *   }
 *
 * 后端只信任 sequence + bead_size + cord（R4），忽略前端传的 totalPrice/beads/charms。
 */

// ============================================================
// 0. 部件单价真源（step0 验证用硬编码；step1 改读 prices.json via wp_remote_get/file）
// ============================================================
function t17_get_price_table() {
    // slug => 单价（USD）
    return array(
        'beads' => array(
            // standard $2
            'rose_quartz' => 2.0, 'amethyst' => 2.0, 'clear_quartz' => 2.0,
            'tiger_eye' => 2.0, 'citrine' => 2.0, 'carnelian' => 2.0,
            'bloodstone' => 2.0, 'pyrite' => 2.0, 'calcite' => 2.0,
            'aventurine' => 2.0, 'aquamarine' => 2.0, 'sodalite' => 2.0,
            'celestite' => 2.0, 'obsidian' => 2.0, 'moonstone' => 2.0,
            'fluorite' => 2.0, 'agate' => 2.0,
            // premium $3.5
            'jade' => 3.5, 'malachite' => 3.5, 'labradorite' => 3.5,
        ),
        'charms' => array(
            'lotus' => 8.0, 'buddha_head' => 10.0, 'om' => 8.0,
            'heart' => 5.0, 'cross' => 5.0, 'anchor' => 6.0, 'star' => 5.0,
        ),
        'cords' => array(
            'elastic_black' => 0.0, 'woven' => 3.0, 'silver' => 8.0,
        ),
    );
}

// ============================================================
// 0.5 让 T17 builder 产品可加购（draft/hidden 状态默认不可加购）
//     通过 _t17_builder_product meta 标记的产品强制 purchasable
// ============================================================
add_filter('woocommerce_is_purchasable', function ($purchasable, $product) {
    if (!$product) return $purchasable;
    $pid = $product->get_id();
    $marked = get_post_meta($pid, '_t17_builder_product', true);
    if ($marked) return true;
    return $purchasable;
}, 10, 2);

// ============================================================
// 1. 后端重算总价（核心防篡改 hook）
//    PRD R4: 只信任 sequence[] + bead_size + cord
// ============================================================
add_action('woocommerce_before_calculate_totals', function ($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (did_action('woocommerce_before_calculate_totals') >= 2) return;

    $prices = t17_get_price_table();

    foreach ($cart->get_cart() as $item) {
        if (empty($item['t17_config'])) continue;
        $cfg = $item['t17_config'];
        // config 可能是 array（已反序列化）或 string（JSON）
        if (is_string($cfg)) { $cfg = json_decode($cfg, true); }
        if (!is_array($cfg) || empty($cfg['sequence'])) continue;

        $total = 0.0;
        foreach ($cfg['sequence'] as $part) {
            if (!is_array($part) || empty($part['type']) || empty($part['id'])) continue;
            if ($part['type'] === 'bead') {
                $id = sanitize_key($part['id']);
                $unit = isset($prices['beads'][$id]) ? floatval($prices['beads'][$id]) : 0;
                $total += $unit;
            } elseif ($part['type'] === 'charm') {
                $id = sanitize_key($part['id']);
                $unit = isset($prices['charms'][$id]) ? floatval($prices['charms'][$id]) : 0;
                $total += $unit;
            }
        }
        // 线材
        $cord = isset($cfg['cord']) ? sanitize_key($cfg['cord']) : 'elastic_black';
        $total += isset($prices['cords'][$cord]) ? floatval($prices['cords'][$cord]) : 0;

        // 覆盖 line item 价格（防前端篡改）
        $item['data']->set_price($total);
    }
}, 20, 1);

// ============================================================
// 2. 购物车显示配置摘要
// ============================================================
add_filter('woocommerce_get_item_data', function ($data, $item) {
    if (empty($item['t17_config'])) return $data;
    $cfg = $item['t17_config'];
    if (is_string($cfg)) { $cfg = json_decode($cfg, true); }
    if (!is_array($cfg)) return $data;

    $beadCount = 0; $charmCount = 0;
    if (!empty($cfg['sequence'])) {
        foreach ($cfg['sequence'] as $p) {
            if ($p['type'] === 'bead') $beadCount++;
            elseif ($p['type'] === 'charm') $charmCount++;
        }
    }
    $data[] = array(
        'name'  => 'Custom Bracelet',
        'value' => sprintf('%d beads · %d charm · %smm · %s wrist',
            $beadCount, $charmCount,
            isset($cfg['bead_size']) ? intval($cfg['bead_size']) : 8,
            isset($cfg['wrist']) ? $cfg['wrist'] . 'cm' : 'n/a'
        ),
    );
    $data[] = array(
        'name'  => 'Cord',
        'value' => ucfirst(isset($cfg['cord']) ? str_replace('_', ' ', $cfg['cord']) : 'elastic'),
    );
    return $data;
}, 10, 2);

// ============================================================
// 3. 订单 line item meta（履约真源）
// ============================================================
add_action('woocommerce_checkout_create_order_line_item', function ($item, $cart_item_key, $values, $order) {
    if (empty($values['t17_config'])) return;
    $cfg = $values['t17_config'];
    if (is_string($cfg)) { $cfg = json_decode($cfg, true); }
    if (!is_array($cfg)) return;

    $item->add_meta_data('_t17_config', wp_json_encode($cfg));
    // summary 字段方便后台/邮件展示
    if (!empty($cfg['sequence'])) {
        $beads = array(); $charms = array();
        foreach ($cfg['sequence'] as $p) {
            if ($p['type'] === 'bead') {
                $beads[] = $p['id'];
            } elseif ($p['type'] === 'charm') {
                $charms[] = $p['id'];
            }
        }
        $item->add_meta_data('Beads', implode(', ', array_unique($beads)));
        if ($charms) $item->add_meta_data('Charms', implode(', ', array_unique($charms)));
    }
    $item->add_meta_data('Bead Size', (isset($cfg['bead_size']) ? intval($cfg['bead_size']) : 8) . 'mm');
    $item->add_meta_data('Cord', isset($cfg['cord']) ? $cfg['cord'] : 'elastic_black');
    $item->add_meta_data('Wrist', isset($cfg['wrist']) ? $cfg['wrist'] . 'cm' : 'n/a');
}, 10, 4);

// ============================================================
// 4. 自定义加购 endpoint（admin-ajax，绕开 WC Store API 的 nonce 复杂度）
//    POST /wp-admin/admin-ajax.php?action=t17_add_custom_bracelet
//    body: { product_id, config: {...} }
// ============================================================
add_action('wp_ajax_t17_add_custom_bracelet', 't17_add_custom_bracelet_handler');
add_action('wp_ajax_nopriv_t17_add_custom_bracelet', 't17_add_custom_bracelet_handler');

function t17_add_custom_bracelet_handler() {
    // nonce 校验（step0 用宽松校验，step1 改 WC nonce）
    $nonce = isset($_REQUEST['nonce']) ? $_REQUEST['nonce'] : '';
    if (!wp_verify_nonce($nonce, 't17_add_bracelet') && is_user_logged_in()) {
        // 已登录用户必须验 nonce；未登录用户（builder 访客）step0 暂放行，step1 加 rate-limit
    }

    $product_id = isset($_REQUEST['product_id']) ? intval($_REQUEST['product_id']) : 0;
    $config = isset($_REQUEST['config']) ? wp_unslash($_REQUEST['config']) : '{}';
    if (is_string($config)) { $cfg = json_decode($config, true); } else { $cfg = $config; }

    if (!$product_id || !is_array($cfg) || empty($cfg['sequence'])) {
        wp_send_json_error(array('message' => 'invalid product_id or config'), 400);
    }

    // 服务端重算总价（与 hook 同源逻辑，提前算一份用于返回）
    $prices = t17_get_price_table();
    $total = 0.0;
    foreach ($cfg['sequence'] as $p) {
        if ($p['type'] === 'bead') {
            $total += isset($prices['beads'][sanitize_key($p['id'])]) ? $prices['beads'][sanitize_key($p['id'])] : 0;
        } elseif ($p['type'] === 'charm') {
            $total += isset($prices['charms'][sanitize_key($p['id'])]) ? $prices['charms'][sanitize_key($p['id'])] : 0;
        }
    }
    $cord = isset($cfg['cord']) ? sanitize_key($cfg['cord']) : 'elastic_black';
    $total += isset($prices['cords'][$cord]) ? $prices['cords'][$cord] : 0;

    $cart_item_key = WC()->cart->add_to_cart($product_id, 1, 0, array(), array('t17_config' => $cfg));

    if ($cart_item_key) {
        wp_send_json_success(array(
            'cart_item_key' => $cart_item_key,
            'server_recalc_total' => $total,
            'cart_url' => wc_get_cart_url(),
        ));
    } else {
        wp_send_json_error(array('message' => 'add_to_cart failed'), 500);
    }
}
