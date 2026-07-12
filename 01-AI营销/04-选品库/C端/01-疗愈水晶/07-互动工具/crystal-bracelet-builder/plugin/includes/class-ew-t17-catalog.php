<?php

defined('ABSPATH') || exit;

final class EW_T17_Catalog {
    private const COMPONENT_TYPES = array('bead', 'decor', 'finish');

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_rest_routes'));
        add_action('admin_menu', array(__CLASS__, 'register_admin_page'));
        add_action('admin_post_ew_t17_save_material', array(__CLASS__, 'save_material'));
        add_action('admin_post_ew_t17_update_material', array(__CLASS__, 'update_material'));
        add_action('admin_post_ew_t17_save_variant', array(__CLASS__, 'save_variant'));
        add_action('admin_post_ew_t17_import_catalog', array(__CLASS__, 'import_catalog'));
        add_action('admin_post_ew_t17_save_settings', array(__CLASS__, 'save_settings'));
    }

    public static function materials_table() {
        global $wpdb;
        return $wpdb->prefix . 'ew_t17_materials';
    }

    public static function variants_table() {
        global $wpdb;
        return $wpdb->prefix . 'ew_t17_variants';
    }

    public static function register_rest_routes() {
        register_rest_route('ew-t17/v1', '/catalog', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array(__CLASS__, 'get_catalog'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route('ew-t17/v1', '/quote', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array(__CLASS__, 'quote'),
            'permission_callback' => '__return_true',
        ));
    }

    public static function get_catalog() {
        global $wpdb;
        $materials = $wpdb->get_results("SELECT * FROM " . self::materials_table() . " WHERE status = 'live' ORDER BY component_type, name_en", ARRAY_A);
        $variants = $wpdb->get_results("SELECT * FROM " . self::variants_table() . " WHERE status = 'live' ORDER BY size_mm, variant_key", ARRAY_A);
        $grouped = array();

        foreach ($variants as $variant) {
            $grouped[(int) $variant['material_id']][] = self::present_variant($variant);
        }

        $items = array();
        foreach ($materials as $material) {
            $material['id'] = (int) $material['id'];
            $material['color_tags'] = self::decode_list($material['color_tags']);
            $material['intention_tags'] = self::decode_list($material['intention_tags']);
            $material['image_url'] = self::image_url((int) $material['image_id'], $material['image_url']);
            $material['variants'] = $grouped[$material['id']] ?? array();
            $items[] = $material;
        }

        $currency = function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'USD';
        return rest_ensure_response(array(
            'schema_version' => 'ew-t17-v3',
            'currency' => $currency ?: 'USD',
            'materials' => $items,
        ));
    }

    public static function quote(WP_REST_Request $request) {
        $result = self::quote_config($request->get_json_params());
        if (is_wp_error($result)) {
            return $result;
        }
        return rest_ensure_response($result);
    }

    public static function quote_config($raw) {
        global $wpdb;
        $raw = is_array($raw) ? $raw : array();
        $sequence = isset($raw['sequence']) && is_array($raw['sequence']) ? array_slice($raw['sequence'], 0, 80) : array();
        if (!$sequence) {
            return new WP_Error('ew_t17_empty_design', __('Add at least one material before requesting a quote.', 'earthward-t17'), array('status' => 400));
        }

        $ids = array_values(array_unique(array_filter(array_map(static function ($item) {
            return isset($item['variant_id']) ? sanitize_key((string) $item['variant_id']) : '';
        }, $sequence))));
        if (!$ids) {
            return new WP_Error('ew_t17_invalid_design', __('The design has no valid variants.', 'earthward-t17'), array('status' => 400));
        }

        $placeholders = implode(',', array_fill(0, count($ids), '%s'));
        $sql = $wpdb->prepare(
            "SELECT v.*, m.name_en, m.component_type, m.material_key FROM " . self::variants_table() . " v INNER JOIN " . self::materials_table() . " m ON m.id = v.material_id WHERE v.status = 'live' AND m.status = 'live' AND v.variant_key IN ($placeholders)",
            $ids
        );
        $rows = $wpdb->get_results($sql, ARRAY_A);
        $map = array();
        foreach ($rows as $row) {
            $map[$row['variant_key']] = $row;
        }

        $requested_quantities = array();
        foreach ($sequence as $item) {
            $key = sanitize_key((string) ($item['variant_id'] ?? ''));
            $requested_quantities[$key] = ($requested_quantities[$key] ?? 0) + 1;
        }
        foreach ($requested_quantities as $key => $quantity) {
            if (!isset($map[$key])) {
                continue;
            }
            $row = $map[$key];
            if ($row['stock_status'] === 'outofstock' || ($row['stock_quantity'] !== null && (int) $row['stock_quantity'] < $quantity)) {
                return new WP_Error('ew_t17_out_of_stock', sprintf(__('%s is unavailable in the requested quantity.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
        }

        $total = 0.0;
        $weight = 0.0;
        $length = 0.0;
        $snapshot = array();
        foreach ($sequence as $position => $item) {
            $key = sanitize_key((string) ($item['variant_id'] ?? ''));
            if (!isset($map[$key])) {
                return new WP_Error('ew_t17_unknown_variant', sprintf(__('Variant %s is unavailable.', 'earthward-t17'), $key), array('status' => 400));
            }
            $row = $map[$key];
            $total += (float) $row['price'];
            $weight += (float) $row['weight_g'];
            $length += (float) $row['occupied_length_mm'];
            $snapshot[] = array(
                'position' => $position,
                'variant_id' => $row['variant_key'],
                'material_id' => $row['material_key'],
                'name' => $row['name_en'],
                'component_type' => $row['component_type'],
                'size_mm' => (float) $row['size_mm'],
                'unit_price' => (float) $row['price'],
                'weight_g' => (float) $row['weight_g'],
                'occupied_length_mm' => (float) $row['occupied_length_mm'],
            );
        }

        $target_wrist = max(10, min(30, (float) ($raw['target_wrist_cm'] ?? 16)));
        $fit_allowance = in_array(($raw['fit_preference'] ?? ''), array('snug', 'loose'), true)
            ? (($raw['fit_preference'] ?? '') === 'loose' ? 2.0 : 0.8)
            : 1.3;
        $target_length = ($target_wrist + $fit_allowance) * 10;
        $difference = $length - $target_length;
        $fit_status = abs($difference) <= 6 ? 'fit' : ($difference < 0 ? 'short' : 'long');

        return array(
            'currency' => function_exists('get_woocommerce_currency') ? (get_woocommerce_currency() ?: 'USD') : 'USD',
            'total' => round($total, 2),
            'weight_g' => round($weight, 2),
            'used_length_mm' => round($length, 1),
            'target_length_mm' => round($target_length, 1),
            'fit_status' => $fit_status,
            'snapshot' => $snapshot,
            'price_version' => (string) get_option('ew_t17_price_version', 'draft'),
        );
    }

    public static function register_admin_page() {
        add_menu_page(
            __('T17 Materials', 'earthward-t17'),
            __('T17 Builder', 'earthward-t17'),
            'manage_woocommerce',
            'ew-t17-materials',
            array(__CLASS__, 'render_admin_page'),
            'dashicons-art',
            56
        );
    }

    public static function render_admin_page() {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        global $wpdb;
        $materials = $wpdb->get_results("SELECT m.*, COUNT(v.id) AS variants FROM " . self::materials_table() . " m LEFT JOIN " . self::variants_table() . " v ON v.material_id = m.id GROUP BY m.id ORDER BY m.updated_at DESC", ARRAY_A);
        $editing_id = absint($_GET['edit_material'] ?? 0);
        $editing = $editing_id ? $wpdb->get_row($wpdb->prepare("SELECT * FROM " . self::materials_table() . " WHERE id = %d", $editing_id), ARRAY_A) : null;
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('T17 Material Catalog', 'earthward-t17'); ?></h1>
            <p><?php esc_html_e('Materials are managed here, not as WooCommerce products. Add variants with a stable ID, real size, price, weight, and occupied length.', 'earthward-t17'); ?></p>
            <?php self::render_admin_notices(); ?>
            <h2><?php esc_html_e('Add material and first variant', 'earthward-t17'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_save_material'); ?>
                <input type="hidden" name="action" value="ew_t17_save_material">
                <table class="form-table"><tbody>
                    <tr><th><label for="material_key">Material ID</label></th><td><input required name="material_key" id="material_key" class="regular-text" placeholder="amethyst"></td></tr>
                    <tr><th><label for="name_en">English name</label></th><td><input required name="name_en" id="name_en" class="regular-text" placeholder="Amethyst"></td></tr>
                    <tr><th><label for="component_type">Type</label></th><td><select name="component_type" id="component_type"><?php foreach (self::COMPONENT_TYPES as $type) : ?><option value="<?php echo esc_attr($type); ?>"><?php echo esc_html(ucfirst($type)); ?></option><?php endforeach; ?></select></td></tr>
                    <tr><th><label for="primary_color">Primary color</label></th><td><input name="primary_color" id="primary_color" class="regular-text" placeholder="purple"></td></tr>
                    <tr><th><label for="color_tags">Color tags</label></th><td><input name="color_tags" id="color_tags" class="regular-text" placeholder="purple, violet"><p class="description">Comma separated.</p></td></tr>
                    <tr><th><label for="intention_tags">Intention tags</label></th><td><input name="intention_tags" id="intention_tags" class="regular-text" placeholder="calm, focus"><p class="description">Comma separated browsing tags.</p></td></tr>
                    <tr><th><label for="image_url">Image URL</label></th><td><input name="image_url" id="image_url" class="regular-text" placeholder="https://..."></td></tr>
                    <tr><th><label for="source_name">Image/data source</label></th><td><input name="source_name" id="source_name" class="regular-text" placeholder="own / supplier / reference"></td></tr>
                    <tr><th><label for="material_status">Material status</label></th><td><select name="material_status" id="material_status"><option value="draft">Draft</option><option value="live">Live</option></select></td></tr>
                    <tr><th><label for="variant_key">First Variant ID</label></th><td><input required name="variant_key" id="variant_key" class="regular-text" placeholder="amethyst-8mm"></td></tr>
                    <tr><th><label for="size_mm">Size (mm)</label></th><td><input required name="size_mm" id="size_mm" type="number" min="0" step="0.01" value="8"></td></tr>
                    <tr><th><label for="price">Price</label></th><td><input required name="price" id="price" type="number" min="0" step="0.01"></td></tr>
                    <tr><th><label for="weight_g">Weight (g)</label></th><td><input required name="weight_g" id="weight_g" type="number" min="0" step="0.001"></td></tr>
                    <tr><th><label for="occupied_length_mm">Occupied length (mm)</label></th><td><input required name="occupied_length_mm" id="occupied_length_mm" type="number" min="0" step="0.001"></td></tr>
                    <tr><th><label for="first_variant_status">First Variant status</label></th><td><select name="first_variant_status" id="first_variant_status"><option value="draft">Draft</option><option value="live">Live</option></select></td></tr>
                </tbody></table>
                <?php submit_button(__('Save draft material', 'earthward-t17')); ?>
            </form>
            <h2><?php esc_html_e('Bulk import catalog CSV', 'earthward-t17'); ?></h2>
            <p><?php esc_html_e('Import creates or updates materials and variants by their stable IDs. Use the included CSV template and keep product names in English.', 'earthward-t17'); ?> <a href="<?php echo esc_url(EW_T17_URL . 'assets/catalog-template.csv'); ?>" download>Download template</a></p>
            <form method="post" enctype="multipart/form-data" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_import_catalog'); ?>
                <input type="hidden" name="action" value="ew_t17_import_catalog">
                <input required type="file" name="catalog_csv" accept=".csv,text/csv">
                <?php submit_button(__('Import CSV', 'earthward-t17'), 'secondary', 'submit', false); ?>
            </form>
            <h2><?php esc_html_e('Add variant to an existing material', 'earthward-t17'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_save_variant'); ?>
                <input type="hidden" name="action" value="ew_t17_save_variant">
                <table class="form-table"><tbody>
                    <tr><th><label for="variant_material_id">Material</label></th><td><select required name="material_id" id="variant_material_id"><option value="">Select material</option><?php foreach ($materials as $material) : ?><option value="<?php echo esc_attr($material['id']); ?>"><?php echo esc_html($material['name_en'] . ' (' . $material['material_key'] . ')'); ?></option><?php endforeach; ?></select></td></tr>
                    <tr><th><label for="new_variant_key">Variant ID</label></th><td><input required name="variant_key" id="new_variant_key" class="regular-text" placeholder="amethyst-10mm"></td></tr>
                    <tr><th><label for="new_variant_size">Size (mm)</label></th><td><input required name="size_mm" id="new_variant_size" type="number" min="0" step="0.01"></td></tr>
                    <tr><th><label for="new_variant_price">Price</label></th><td><input required name="price" id="new_variant_price" type="number" min="0" step="0.01"></td></tr>
                    <tr><th><label for="new_variant_weight">Weight (g)</label></th><td><input required name="weight_g" id="new_variant_weight" type="number" min="0" step="0.001"></td></tr>
                    <tr><th><label for="new_variant_length">Occupied length (mm)</label></th><td><input required name="occupied_length_mm" id="new_variant_length" type="number" min="0" step="0.001"></td></tr>
                    <tr><th><label for="new_variant_status">Status</label></th><td><select name="status" id="new_variant_status"><option value="draft">Draft</option><option value="live">Live</option><option value="disabled">Disabled</option></select></td></tr>
                </tbody></table>
                <?php submit_button(__('Save variant', 'earthward-t17')); ?>
            </form>
            <h2><?php esc_html_e('Commerce settings', 'earthward-t17'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_save_settings'); ?>
                <input type="hidden" name="action" value="ew_t17_save_settings">
                <table class="form-table"><tbody>
                    <tr><th><label for="custom_product_id">Hidden custom product ID</label></th><td><input name="custom_product_id" id="custom_product_id" type="number" min="0" value="<?php echo esc_attr(get_option('ew_t17_custom_product_id', 0)); ?>"><p class="description">The hidden Woo product used only for DIY checkout.</p></td></tr>
                    <tr><th><label for="builder_page_id">Builder page ID</label></th><td><input name="builder_page_id" id="builder_page_id" type="number" min="0" value="<?php echo esc_attr(get_option('ew_t17_builder_page_id', 0)); ?>"><p class="description">The WordPress page containing the [ew_t17_bracelet_builder] shortcode.</p></td></tr>
                    <tr><th><label for="price_version">Current price version</label></th><td><input name="price_version" id="price_version" class="regular-text" value="<?php echo esc_attr(get_option('ew_t17_price_version', 'draft')); ?>"></td></tr>
                </tbody></table>
                <?php submit_button(__('Save commerce settings', 'earthward-t17')); ?>
            </form>
            <h2><?php esc_html_e('Catalog status', 'earthward-t17'); ?></h2>
            <table class="widefat striped"><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Variants</th><th>Status</th><th>Action</th></tr></thead><tbody>
            <?php foreach ($materials as $material) : ?><tr><td><?php echo esc_html($material['material_key']); ?></td><td><?php echo esc_html($material['name_en']); ?></td><td><?php echo esc_html($material['component_type']); ?></td><td><?php echo esc_html($material['variants']); ?></td><td><?php echo esc_html($material['status']); ?></td><td><a href="<?php echo esc_url(add_query_arg('edit_material', $material['id'], admin_url('admin.php?page=ew-t17-materials'))); ?>">Edit</a></td></tr><?php endforeach; ?>
            </tbody></table>
            <?php if ($editing) : ?>
                <h2><?php echo esc_html(sprintf(__('Edit %s', 'earthward-t17'), $editing['name_en'])); ?></h2>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('ew_t17_update_material'); ?>
                    <input type="hidden" name="action" value="ew_t17_update_material"><input type="hidden" name="material_id" value="<?php echo esc_attr($editing['id']); ?>">
                    <table class="form-table"><tbody>
                        <tr><th>Material ID</th><td><code><?php echo esc_html($editing['material_key']); ?></code></td></tr>
                        <tr><th><label for="edit_name_en">English name</label></th><td><input required name="name_en" id="edit_name_en" class="regular-text" value="<?php echo esc_attr($editing['name_en']); ?>"></td></tr>
                        <tr><th><label for="edit_primary_color">Primary color</label></th><td><input name="primary_color" id="edit_primary_color" class="regular-text" value="<?php echo esc_attr($editing['primary_color']); ?>"></td></tr>
                        <tr><th><label for="edit_color_tags">Color tags</label></th><td><input name="color_tags" id="edit_color_tags" class="regular-text" value="<?php echo esc_attr(implode(', ', self::decode_list($editing['color_tags']))); ?>"><p class="description">Comma separated.</p></td></tr>
                        <tr><th><label for="edit_intention_tags">Intention tags</label></th><td><input name="intention_tags" id="edit_intention_tags" class="regular-text" value="<?php echo esc_attr(implode(', ', self::decode_list($editing['intention_tags']))); ?>"><p class="description">Comma separated. Use these for browsing, not pricing.</p></td></tr>
                        <tr><th><label for="edit_image_url">Image URL</label></th><td><input name="image_url" id="edit_image_url" class="regular-text" value="<?php echo esc_attr($editing['image_url']); ?>"></td></tr>
                        <tr><th><label for="edit_source_name">Image/data source</label></th><td><input name="source_name" id="edit_source_name" class="regular-text" value="<?php echo esc_attr($editing['source_name']); ?>"></td></tr>
                        <tr><th><label for="edit_status">Status</label></th><td><select name="status" id="edit_status"><option value="draft" <?php selected($editing['status'], 'draft'); ?>>Draft</option><option value="live" <?php selected($editing['status'], 'live'); ?>>Live</option></select></td></tr>
                    </tbody></table>
                    <?php submit_button(__('Update material', 'earthward-t17')); ?>
                </form>
            <?php endif; ?>
        </div>
        <?php
    }

    public static function save_material() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_save_material');
        global $wpdb;
        $now = current_time('mysql', true);
        $material_key = sanitize_key(wp_unslash($_POST['material_key'] ?? ''));
        $variant_key = sanitize_key(wp_unslash($_POST['variant_key'] ?? ''));
        $type = sanitize_key(wp_unslash($_POST['component_type'] ?? 'bead'));
        if (!$material_key || !$variant_key || !in_array($type, self::COMPONENT_TYPES, true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $material_status = sanitize_key(wp_unslash($_POST['material_status'] ?? 'draft'));
        $variant_status = sanitize_key(wp_unslash($_POST['first_variant_status'] ?? 'draft'));
        if (!in_array($material_status, array('draft', 'live'), true)) $material_status = 'draft';
        if (!in_array($variant_status, array('draft', 'live'), true)) $variant_status = 'draft';
        $wpdb->insert(self::materials_table(), array(
            'material_key' => $material_key,
            'component_type' => $type,
            'name_en' => sanitize_text_field(wp_unslash($_POST['name_en'] ?? '')),
            'primary_color' => sanitize_key(wp_unslash($_POST['primary_color'] ?? '')),
            'color_tags' => wp_json_encode(self::csv_list($_POST['color_tags'] ?? '')),
            'intention_tags' => wp_json_encode(self::csv_list($_POST['intention_tags'] ?? '')),
            'image_url' => esc_url_raw(wp_unslash($_POST['image_url'] ?? '')),
            'source_name' => sanitize_text_field(wp_unslash($_POST['source_name'] ?? '')),
            'status' => $material_status,
            'created_at' => $now,
            'updated_at' => $now,
        ));
        $material_id = (int) $wpdb->insert_id;
        if ($material_id) {
            $wpdb->insert(self::variants_table(), array(
                'material_id' => $material_id,
                'variant_key' => $variant_key,
                'size_mm' => (float) ($_POST['size_mm'] ?? 0),
                'price' => (float) ($_POST['price'] ?? 0),
                'weight_g' => (float) ($_POST['weight_g'] ?? 0),
                'occupied_length_mm' => (float) ($_POST['occupied_length_mm'] ?? 0),
                'status' => $variant_status,
                'created_at' => $now,
                'updated_at' => $now,
            ));
        }
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    public static function update_material() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_update_material');
        global $wpdb;
        $material_id = absint($_POST['material_id'] ?? 0);
        if (!$material_id) {
            wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
            exit;
        }
        $status = sanitize_key(wp_unslash($_POST['status'] ?? 'draft'));
        if (!in_array($status, array('draft', 'live'), true)) {
            $status = 'draft';
        }
        $wpdb->update(self::materials_table(), array(
            'name_en' => sanitize_text_field(wp_unslash($_POST['name_en'] ?? '')),
            'primary_color' => sanitize_key(wp_unslash($_POST['primary_color'] ?? '')),
            'color_tags' => wp_json_encode(self::csv_list($_POST['color_tags'] ?? '')),
            'intention_tags' => wp_json_encode(self::csv_list($_POST['intention_tags'] ?? '')),
            'image_url' => esc_url_raw(wp_unslash($_POST['image_url'] ?? '')),
            'source_name' => sanitize_text_field(wp_unslash($_POST['source_name'] ?? '')),
            'status' => $status,
            'updated_at' => current_time('mysql', true),
        ), array('id' => $material_id));
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    public static function save_variant() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_save_variant');
        global $wpdb;
        $material_id = absint($_POST['material_id'] ?? 0);
        $variant_key = sanitize_key(wp_unslash($_POST['variant_key'] ?? ''));
        $status = sanitize_key(wp_unslash($_POST['status'] ?? 'draft'));
        if (!$material_id || !$variant_key || !in_array($status, array('draft', 'live', 'disabled'), true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $now = current_time('mysql', true);
        $wpdb->insert(self::variants_table(), array(
            'material_id' => $material_id,
            'variant_key' => $variant_key,
            'size_mm' => (float) ($_POST['size_mm'] ?? 0),
            'price' => (float) ($_POST['price'] ?? 0),
            'weight_g' => (float) ($_POST['weight_g'] ?? 0),
            'occupied_length_mm' => (float) ($_POST['occupied_length_mm'] ?? 0),
            'status' => $status,
            'created_at' => $now,
            'updated_at' => $now,
        ));
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    public static function import_catalog() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to import T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_import_catalog');
        $file = $_FILES['catalog_csv'] ?? null;
        if (!$file || !empty($file['error']) || !is_uploaded_file($file['tmp_name'])) {
            self::redirect_import(0, 0, 'upload');
        }
        $handle = fopen($file['tmp_name'], 'r');
        if (!$handle) {
            self::redirect_import(0, 0, 'read');
        }
        $headers = fgetcsv($handle);
        if (!$headers) {
            fclose($handle);
            self::redirect_import(0, 0, 'headers');
        }
        $headers = array_map(static function ($header) { return sanitize_key((string) $header); }, $headers);
        $required = array('material_key', 'component_type', 'name_en', 'variant_key', 'size_mm', 'price', 'weight_g', 'occupied_length_mm');
        if (array_diff($required, $headers)) {
            fclose($handle);
            self::redirect_import(0, 0, 'columns');
        }

        global $wpdb;
        $imported = 0;
        $skipped = 0;
        while (($values = fgetcsv($handle)) !== false) {
            $row = array_combine($headers, array_pad(array_slice($values, 0, count($headers)), count($headers), ''));
            if (!$row) {
                $skipped++;
                continue;
            }
            $material_key = sanitize_key($row['material_key'] ?? '');
            $variant_key = sanitize_key($row['variant_key'] ?? '');
            $component_type = sanitize_key($row['component_type'] ?? '');
            if (!$material_key || !$variant_key || !in_array($component_type, self::COMPONENT_TYPES, true)) {
                $skipped++;
                continue;
            }
            $material_status = in_array($row['material_status'] ?? '', array('draft', 'live'), true) ? $row['material_status'] : 'draft';
            $variant_status = in_array($row['variant_status'] ?? '', array('draft', 'live', 'disabled'), true) ? $row['variant_status'] : 'draft';
            $now = current_time('mysql', true);
            $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::materials_table() . " WHERE material_key = %s", $material_key));
            $material_data = array(
                'component_type' => $component_type,
                'name_en' => sanitize_text_field($row['name_en'] ?? ''),
                'primary_color' => sanitize_key($row['primary_color'] ?? ''),
                'color_tags' => wp_json_encode(self::csv_list($row['color_tags'] ?? '')),
                'intention_tags' => wp_json_encode(self::csv_list($row['intention_tags'] ?? '')),
                'image_url' => esc_url_raw($row['material_image_url'] ?? ''),
                'source_name' => sanitize_text_field($row['source_name'] ?? ''),
                'status' => $material_status,
                'updated_at' => $now,
            );
            if ($existing) {
                $material_id = (int) $existing;
                $wpdb->update(self::materials_table(), $material_data, array('id' => $material_id));
            } else {
                $material_data['material_key'] = $material_key;
                $material_data['created_at'] = $now;
                $wpdb->insert(self::materials_table(), $material_data);
                $material_id = (int) $wpdb->insert_id;
            }
            if (!$material_id) {
                $skipped++;
                continue;
            }
            $variant_data = array(
                'material_id' => $material_id,
                'size_mm' => max(0, (float) ($row['size_mm'] ?? 0)),
                'shape' => sanitize_key($row['shape'] ?? 'round') ?: 'round',
                'price' => max(0, (float) ($row['price'] ?? 0)),
                'weight_g' => max(0, (float) ($row['weight_g'] ?? 0)),
                'occupied_length_mm' => max(0, (float) ($row['occupied_length_mm'] ?? 0)),
                'image_url' => esc_url_raw($row['variant_image_url'] ?? ''),
                'stock_status' => sanitize_key($row['stock_status'] ?? 'instock') ?: 'instock',
                'stock_quantity' => ($row['stock_quantity'] ?? '') === '' ? null : absint($row['stock_quantity']),
                'compatibility' => wp_json_encode(self::csv_list($row['compatibility'] ?? '')),
                'status' => $variant_status,
                'updated_at' => $now,
            );
            $variant_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::variants_table() . " WHERE variant_key = %s", $variant_key));
            if ($variant_id) {
                $wpdb->update(self::variants_table(), $variant_data, array('id' => (int) $variant_id));
            } else {
                $variant_data['variant_key'] = $variant_key;
                $variant_data['created_at'] = $now;
                $wpdb->insert(self::variants_table(), $variant_data);
            }
            $imported++;
        }
        fclose($handle);
        self::redirect_import($imported, $skipped, 'done');
    }

    public static function save_settings() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to update T17 settings.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_save_settings');
        update_option('ew_t17_custom_product_id', absint($_POST['custom_product_id'] ?? 0));
        update_option('ew_t17_builder_page_id', absint($_POST['builder_page_id'] ?? 0));
        update_option('ew_t17_price_version', sanitize_text_field(wp_unslash($_POST['price_version'] ?? 'draft')));
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    private static function present_variant($variant) {
        return array(
            'id' => $variant['variant_key'],
            'size_mm' => (float) $variant['size_mm'],
            'shape' => $variant['shape'],
            'price' => (float) $variant['price'],
            'weight_g' => (float) $variant['weight_g'],
            'occupied_length_mm' => (float) $variant['occupied_length_mm'],
            'image_url' => self::image_url((int) $variant['image_id'], $variant['image_url']),
            'stock_status' => $variant['stock_status'],
            'stock_quantity' => is_null($variant['stock_quantity']) ? null : (int) $variant['stock_quantity'],
            'compatibility' => self::decode_list($variant['compatibility']),
        );
    }

    private static function image_url($attachment_id, $fallback) {
        return $attachment_id ? (wp_get_attachment_image_url($attachment_id, 'medium_large') ?: $fallback) : $fallback;
    }

    private static function decode_list($value) {
        $decoded = json_decode((string) $value, true);
        return is_array($decoded) ? $decoded : array();
    }

    private static function csv_list($value) {
        $items = array_map('sanitize_key', explode(',', (string) wp_unslash($value)));
        return array_values(array_filter($items));
    }

    private static function redirect_import($imported, $skipped, $status) {
        wp_safe_redirect(add_query_arg(array('page' => 'ew-t17-materials', 'ew_t17_import' => sanitize_key($status), 'imported' => absint($imported), 'skipped' => absint($skipped)), admin_url('admin.php')));
        exit;
    }

    private static function render_admin_notices() {
        $import_status = sanitize_key($_GET['ew_t17_import'] ?? '');
        if ($import_status === 'done') {
            printf('<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html(sprintf(__('Imported or updated %1$d rows. Skipped %2$d invalid rows.', 'earthward-t17'), absint($_GET['imported'] ?? 0), absint($_GET['skipped'] ?? 0))));
        } elseif ($import_status) {
            printf('<div class="notice notice-error"><p>%s</p></div>', esc_html(__('Catalog CSV was not imported. Check the required columns and upload a valid CSV file.', 'earthward-t17')));
        }
        if (sanitize_key($_GET['ew_t17_error'] ?? '') !== '') {
            echo '<div class="notice notice-error"><p>' . esc_html__('The material or variant could not be saved. Check its stable ID and required fields.', 'earthward-t17') . '</p></div>';
        }
    }
}
