<?php

defined('ABSPATH') || exit;

final class EW_T17_Install {
    public static function activate() {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        $materials = $wpdb->prefix . 'ew_t17_materials';
        $variants = $wpdb->prefix . 'ew_t17_variants';

        dbDelta("CREATE TABLE {$materials} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            material_key varchar(96) NOT NULL,
            component_type varchar(24) NOT NULL DEFAULT 'bead',
            name_en varchar(190) NOT NULL,
            internal_name varchar(190) NOT NULL DEFAULT '',
            primary_color varchar(48) NOT NULL DEFAULT '',
            color_tags longtext NULL,
            intention_tags longtext NULL,
            image_id bigint(20) unsigned NOT NULL DEFAULT 0,
            image_url text NULL,
            source_name varchar(128) NOT NULL DEFAULT '',
            status varchar(20) NOT NULL DEFAULT 'draft',
            notes text NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY material_key (material_key),
            KEY component_type (component_type),
            KEY status (status)
        ) {$charset};");

        dbDelta("CREATE TABLE {$variants} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            material_id bigint(20) unsigned NOT NULL,
            variant_key varchar(128) NOT NULL,
            size_mm decimal(7,2) NOT NULL DEFAULT 0,
            shape varchar(48) NOT NULL DEFAULT 'round',
            price decimal(12,2) NOT NULL DEFAULT 0,
            weight_g decimal(10,3) NOT NULL DEFAULT 0,
            occupied_length_mm decimal(10,3) NOT NULL DEFAULT 0,
            image_id bigint(20) unsigned NOT NULL DEFAULT 0,
            image_url text NULL,
            stock_status varchar(20) NOT NULL DEFAULT 'instock',
            stock_quantity int(11) NULL,
            compatibility longtext NULL,
            status varchar(20) NOT NULL DEFAULT 'draft',
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY variant_key (variant_key),
            KEY material_id (material_id),
            KEY status (status),
            KEY component_size (size_mm)
        ) {$charset};");

        add_option('ew_t17_db_version', EW_T17_VERSION);
        add_option('ew_t17_custom_product_id', 0);
    }
}
