<?php
/**
 * Plugin Name: EarthWard T17 Playground QA
 * Description: Count-only endpoint for the isolated local WordPress acceptance site.
 */

defined('ABSPATH') || exit;

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
            ));
            return rest_ensure_response(array(
                'materials' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$materials}"),
                'variants' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$variants}"),
                'material_image_urls' => (int) $wpdb->get_var("SELECT COUNT(DISTINCT image_url) FROM {$materials} WHERE image_url <> ''"),
                'variant_image_urls' => (int) $wpdb->get_var("SELECT COUNT(DISTINCT image_url) FROM {$variants} WHERE image_url <> ''"),
                'draft_materials' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$materials} WHERE status = 'draft'"),
                'draft_variants' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$variants} WHERE status = 'draft'"),
                'attachments' => count($attachment_ids),
                'attachment_ids_unique' => count($attachment_ids) === count(array_unique(array_map('intval', $attachment_ids))),
            ));
        },
    ));
});

