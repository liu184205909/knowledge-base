<?php
/**
 * Plugin Name: EarthWard T17 Bracelet Builder
 * Description: Variant-driven 2D crystal bracelet builder with WooCommerce order snapshots.
 * Version: 0.1.10
 * Author: EarthWard
 * Text Domain: earthward-t17
 * Update URI: https://goearthward.com/earthward-t17-bracelet-builder/
 */

defined('ABSPATH') || exit;

define('EW_T17_VERSION', '0.1.10');
define('EW_T17_FILE', __FILE__);
define('EW_T17_DIR', plugin_dir_path(__FILE__));
define('EW_T17_URL', plugin_dir_url(__FILE__));

require_once EW_T17_DIR . 'includes/class-ew-t17-install.php';
require_once EW_T17_DIR . 'includes/class-ew-t17-catalog.php';
require_once EW_T17_DIR . 'includes/class-ew-t17-commerce.php';
require_once EW_T17_DIR . 'includes/class-ew-t17-updates.php';

register_activation_hook(__FILE__, array('EW_T17_Install', 'activate'));

add_action('plugins_loaded', static function () {
    EW_T17_Install::maybe_upgrade();
    EW_T17_Catalog::init();
    EW_T17_Commerce::init();
    EW_T17_Updates::init();
});
