<?php

defined('ABSPATH') || exit;

final class EW_T17_Install {
    private const REQUIRED_MATERIAL_COLUMNS = array(
        'category_slug',
        'sort_order',
    );

    private const REQUIRED_VARIANT_COLUMNS = array(
        'orientation_mode',
        'mirrored_variant_key',
        'allowed_orientations',
        'allowed_positions',
        'neighbor_constraints',
        'display_scale',
        'compatible_bead_sizes',
        'sort_order',
    );

    public static function maybe_upgrade() {
        if ((string) get_option('ew_t17_db_version', '') === EW_T17_VERSION && self::schema_is_healthy()) {
            return;
        }
        self::activate();
    }

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
            category_slug varchar(64) NOT NULL DEFAULT '',
            name_en varchar(190) NOT NULL,
            internal_name varchar(190) NOT NULL DEFAULT '',
            primary_color varchar(48) NOT NULL DEFAULT '',
            color_tags longtext NULL,
            intention_tags longtext NULL,
            image_id bigint(20) unsigned NOT NULL DEFAULT 0,
            image_url text NULL,
            source_name varchar(128) NOT NULL DEFAULT '',
            status varchar(20) NOT NULL DEFAULT 'draft',
            sort_order int(11) NOT NULL DEFAULT 0,
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
            display_scale decimal(8,3) NOT NULL DEFAULT 1,
            image_id bigint(20) unsigned NOT NULL DEFAULT 0,
            image_url text NULL,
            stock_status varchar(20) NOT NULL DEFAULT 'instock',
            stock_quantity int(11) NULL,
            compatibility longtext NULL,
            compatible_bead_sizes longtext NULL,
            orientation_mode varchar(24) NOT NULL DEFAULT 'none',
            mirrored_variant_key varchar(128) NOT NULL DEFAULT '',
            allowed_orientations longtext NULL,
            allowed_positions longtext NULL,
            neighbor_constraints longtext NULL,
            status varchar(20) NOT NULL DEFAULT 'draft',
            sort_order int(11) NOT NULL DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY variant_key (variant_key),
            KEY material_id (material_id),
            KEY status (status),
            KEY component_size (size_mm)
        ) {$charset};");

        if (!self::schema_is_healthy()) {
            update_option('ew_t17_db_upgrade_error', __('T17 catalog tables are missing one or more required catalog columns.', 'earthward-t17'));
            return;
        }

        update_option('ew_t17_db_version', EW_T17_VERSION);
        delete_option('ew_t17_db_upgrade_error');
        add_option('ew_t17_custom_product_id', 0);
        add_option('ew_t17_builder_page_id', 0);
    }

    private static function schema_is_healthy() {
        global $wpdb;
        $materials = $wpdb->prefix . 'ew_t17_materials';
        $variants = $wpdb->prefix . 'ew_t17_variants';
        $material_columns = $wpdb->get_col("SHOW COLUMNS FROM {$materials}", 0);
        $columns = $wpdb->get_col("SHOW COLUMNS FROM {$variants}", 0);
        return is_array($material_columns)
            && is_array($columns)
            && !array_diff(self::REQUIRED_MATERIAL_COLUMNS, $material_columns)
            && !array_diff(self::REQUIRED_VARIANT_COLUMNS, $columns);
    }
}
