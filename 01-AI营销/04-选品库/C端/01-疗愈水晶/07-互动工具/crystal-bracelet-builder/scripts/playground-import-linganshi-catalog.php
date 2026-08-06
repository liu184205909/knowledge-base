<?php
/**
 * Local WordPress Playground acceptance import for the Linganshi draft catalog.
 *
 * This file is mounted into an isolated Playground instance. It is not loaded by
 * the production plugin and must never be copied to a public WordPress site.
 */

defined('ABSPATH') || exit;

$asset_dir = '/wordpress/wp-content/uploads/linganshi-draft';
$source_csv = '/tmp/t17-data/linganshi-235-draft-catalog-20260720.import.csv';
$runtime_csv = '/tmp/t17-linganshi-playground-import.csv';
$qa_plugin = '/wordpress/wp-content/mu-plugins/ew-t17-playground-qa.php';

if (!is_dir($asset_dir)) {
    throw new RuntimeException('Linganshi asset mount is missing: ' . $asset_dir);
}
if (!is_readable($source_csv)) {
    throw new RuntimeException('Linganshi import CSV is missing: ' . $source_csv);
}

$asset_files = glob($asset_dir . '/linganshi-*.webp') ?: array();
sort($asset_files, SORT_STRING);
if (count($asset_files) !== 235) {
    throw new RuntimeException('Expected 235 mounted WebP assets, found ' . count($asset_files));
}

wp_mkdir_p(dirname($qa_plugin));
$qa_plugin_code = <<<'PHP'
<?php
/** Local Playground-only QA endpoint. */
add_action('rest_api_init', static function () {
    register_rest_route('ew-t17-qa/v1', '/counts', array(
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => static function () {
            global $wpdb;
            $materials = $wpdb->prefix . 'ew_t17_materials';
            $variants = $wpdb->prefix . 'ew_t17_variants';
            $attachment_ids = get_posts(array(
                'post_type' => 'attachment',
                'post_status' => 'inherit',
                'posts_per_page' => -1,
                'fields' => 'ids',
                'meta_key' => '_ew_t17_linganshi_material_key',
            ));
            $asset_files = glob('/wordpress/wp-content/uploads/linganshi-draft/linganshi-*.webp') ?: array();
            return rest_ensure_response(array(
                'materials' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$materials}"),
                'variants' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$variants}"),
                'material_image_urls' => (int) $wpdb->get_var("SELECT COUNT(DISTINCT image_url) FROM {$materials} WHERE image_url <> ''"),
                'variant_image_urls' => (int) $wpdb->get_var("SELECT COUNT(DISTINCT image_url) FROM {$variants} WHERE image_url <> ''"),
                'draft_materials' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$materials} WHERE status = 'draft'"),
                'draft_variants' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$variants} WHERE status = 'draft'"),
                'linganshi_attachments' => count($attachment_ids),
                'mounted_webp_assets' => count($asset_files),
                'attachment_ids_unique' => count($attachment_ids) === count(array_unique(array_map('intval', $attachment_ids))),
            ));
        },
    ));
});
PHP;
if (file_put_contents($qa_plugin, $qa_plugin_code) === false) {
    throw new RuntimeException('Could not create the Playground QA endpoint.');
}

require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

$upload_base_url = content_url('/uploads/linganshi-draft/');
$attachment_count = 0;
foreach ($asset_files as $asset_file) {
    $filename = basename($asset_file);
    $material_key = pathinfo($filename, PATHINFO_FILENAME);
    $existing = get_posts(array(
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => '_ew_t17_linganshi_material_key',
        'meta_value' => $material_key,
    ));
    if ($existing) {
        $attachment_count++;
        continue;
    }
    $attachment_id = wp_insert_attachment(array(
        'post_mime_type' => 'image/webp',
        'post_title' => $material_key,
        'post_status' => 'inherit',
        'guid' => $upload_base_url . rawurlencode($filename),
    ), $asset_file, 0, true);
    if (is_wp_error($attachment_id)) {
        throw new RuntimeException('Attachment insert failed for ' . $filename . ': ' . $attachment_id->get_error_message());
    }
    update_post_meta($attachment_id, '_ew_t17_linganshi_material_key', $material_key);
    $attachment_count++;
}
if ($attachment_count !== 235) {
    throw new RuntimeException('Expected 235 attachment records, found ' . $attachment_count);
}

$input = fopen($source_csv, 'rb');
$output = fopen($runtime_csv, 'wb');
if (!$input || !$output) {
    throw new RuntimeException('Could not open the Playground import CSV.');
}
$headers = fgetcsv($input);
if (!$headers) {
    throw new RuntimeException('The Playground import CSV has no header row.');
}
$header_map = array_flip($headers);
foreach (array('material_key', 'material_image_url', 'variant_image_url') as $required_header) {
    if (!isset($header_map[$required_header])) {
        throw new RuntimeException('Missing CSV header: ' . $required_header);
    }
}
fputcsv($output, $headers);
$variant_rows = 0;
while (($row = fgetcsv($input)) !== false) {
    $material_key = (string) ($row[$header_map['material_key']] ?? '');
    $image_url = $upload_base_url . rawurlencode($material_key . '.webp');
    $row[$header_map['material_image_url']] = $image_url;
    $row[$header_map['variant_image_url']] = $image_url;
    fputcsv($output, $row);
    $variant_rows++;
}
fclose($input);
fclose($output);
if ($variant_rows !== 348) {
    throw new RuntimeException('Expected 348 Variant rows, found ' . $variant_rows);
}

wp_set_current_user(1);
$_REQUEST['_wpnonce'] = wp_create_nonce('ew_t17_import_catalog');
$_POST['_wpnonce'] = $_REQUEST['_wpnonce'];
$_FILES['catalog_csv'] = array(
    'name' => basename($runtime_csv),
    'type' => 'text/csv',
    'tmp_name' => $runtime_csv,
    'error' => UPLOAD_ERR_OK,
    'size' => filesize($runtime_csv),
);

update_option('ew_t17_playground_expected_counts', array(
    'materials' => 235,
    'variants' => 348,
    'attachments' => 235,
));

EW_T17_Catalog::import_catalog();

