<?php
/**
 * Paste into a PHP Code Snippet that runs only on the T17 builder page.
 * This is configuration only; visual markup and JavaScript remain in frontend/.
 */
defined('ABSPATH') || exit;

// Restrict this snippet to the T17 preview/production page before enabling it.
// Replace the placeholder IDs with the approved page IDs during deployment.
if (!is_page(array(50236, 54723))) {
    return;
}
?>
<script>
window.EW_T17_UI_CONFIG = <?php echo wp_json_encode(array(
  'restUrl' => esc_url_raw(rest_url('ew-t17/v1/')),
  'ajaxUrl' => esc_url_raw(admin_url('admin-ajax.php')),
  'nonce' => wp_create_nonce('ew_t17_builder'),
  'cartUrl' => function_exists('wc_get_cart_url') ? esc_url_raw(wc_get_cart_url()) : '',
  'currencySymbol' => function_exists('get_woocommerce_currency_symbol') ? get_woocommerce_currency_symbol() : '$',
  'trayImage' => '', // Set to the approved WordPress Media URL for the preserved wood tray.
)); ?>;
</script>
