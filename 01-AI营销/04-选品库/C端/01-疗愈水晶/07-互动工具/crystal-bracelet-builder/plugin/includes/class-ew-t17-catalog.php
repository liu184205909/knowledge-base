<?php

defined('ABSPATH') || exit;

final class EW_T17_Catalog {
    private const COMPONENT_TYPES = array('crystal', 'accessory');
    private const STOCK_STATUSES = array('instock', 'outofstock', 'onbackorder');
    private const ORIENTATION_MODES = array('none', 'tangent', 'radial_out', 'radial_in', 'fixed_left', 'fixed_right', 'mirrorable', 'rotatable');
    private const ORIENTATION_VALUES = array('none', 'left', 'right', 'rotate_0', 'rotate_90', 'rotate_180', 'rotate_270');
    private const POSITION_TYPES = array('any', 'start', 'end', 'interior');
    private const IMPORT_HEADERS = array('material_key', 'component_type', 'library_tab_slug', 'category_slug', 'name_en', 'primary_color', 'color_tags', 'intention_tags', 'material_image_url', 'material_status', 'material_sort_order', 'variant_key', 'size_mm', 'shape', 'price', 'occupied_length_mm', 'display_scale', 'variant_image_url', 'stock_status', 'stock_quantity', 'compatibility', 'compatible_bead_sizes', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'variant_status', 'variant_sort_order', 'source_name');
    private const LEGACY_IMPORT_HEADERS = array('material_key', 'component_type', 'category_slug', 'name_en', 'primary_color', 'color_tags', 'intention_tags', 'material_image_url', 'material_status', 'material_sort_order', 'variant_key', 'size_mm', 'shape', 'price', 'occupied_length_mm', 'display_scale', 'variant_image_url', 'stock_status', 'stock_quantity', 'compatibility', 'compatible_bead_sizes', 'orientation_mode', 'mirrored_variant_key', 'allowed_orientations', 'allowed_positions', 'neighbor_constraints', 'variant_status', 'variant_sort_order', 'source_name');

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_rest_routes'));
        add_action('admin_menu', array(__CLASS__, 'register_admin_page'));
        add_action('admin_enqueue_scripts', array(__CLASS__, 'enqueue_admin_assets'));
        add_action('admin_post_ew_t17_save_material', array(__CLASS__, 'save_material'));
        add_action('admin_post_ew_t17_update_material', array(__CLASS__, 'update_material'));
        add_action('admin_post_ew_t17_save_variant', array(__CLASS__, 'save_variant'));
        add_action('admin_post_ew_t17_update_variant', array(__CLASS__, 'update_variant'));
        add_action('admin_post_ew_t17_update_sort_order', array(__CLASS__, 'update_sort_order'));
        add_action('admin_post_ew_t17_import_catalog', array(__CLASS__, 'import_catalog'));
        add_action('admin_post_ew_t17_save_settings', array(__CLASS__, 'save_settings'));
        add_action('admin_post_ew_t17_save_library_tabs', array(__CLASS__, 'save_library_tabs'));
    }

    private static function component_type($value) {
        $type = sanitize_key((string) $value);
        if ($type === 'bead') {
            return 'crystal';
        }
        if ($type === 'decor') {
            return 'accessory';
        }
        return $type;
    }

    public static function library_tabs($include_disabled = false) {
        $raw = get_option('ew_t17_library_tabs', array());
        $defaults = array(
            array('slug' => 'crystal', 'label' => 'Crystals', 'sort_order' => 10, 'status' => 'live'),
            array('slug' => 'accessory', 'label' => 'Accessories', 'sort_order' => 20, 'status' => 'live'),
        );
        $rows = is_array($raw) && $raw ? $raw : $defaults;
        $tabs = array();
        foreach ($rows as $row) {
            $slug = sanitize_key($row['slug'] ?? '');
            $label = sanitize_text_field($row['label'] ?? '');
            $status = sanitize_key($row['status'] ?? 'live');
            if (!$slug || !$label || !in_array($status, array('live', 'disabled'), true)) continue;
            if (!$include_disabled && $status !== 'live') continue;
            $tabs[$slug] = array('slug' => $slug, 'label' => $label, 'sort_order' => isset($row['sort_order']) ? (int) $row['sort_order'] : 0, 'status' => $status);
        }
        uasort($tabs, static function ($left, $right) { return $left['sort_order'] <=> $right['sort_order']; });
        return array_values($tabs);
    }

    private static function library_tab_slug($value, $component_type = 'crystal') {
        $slug = sanitize_key((string) $value);
        $available = array_column(self::library_tabs(true), 'slug');
        return in_array($slug, $available, true) ? $slug : self::component_type($component_type);
    }

    public static function enqueue_admin_assets($hook_suffix) {
        if (strpos((string) $hook_suffix, 'ew-t17-materials') === false) {
            return;
        }

        wp_enqueue_media();
        wp_add_inline_script('media-editor', <<<'JS'
jQuery(function($) {
    $(document).on('click', '.ew-t17-select-image', function(event) {
        event.preventDefault();
        var button = $(this);
        var imageId = $('#' + button.data('image-target'));
        var imageUrl = $('#' + button.data('image-url-target'));
        var preview = $('#' + button.data('image-preview'));
        var frame = wp.media({
            title: 'Select catalog image',
            button: { text: 'Use image' },
            library: { type: 'image' },
            multiple: false
        });

        frame.on('select', function() {
            var attachment = frame.state().get('selection').first().toJSON();
            imageId.val(attachment.id);
            imageUrl.val(attachment.url);
            preview.attr('src', attachment.url).show();
        });
        frame.open();
    });

    $(document).on('click', '.ew-t17-clear-image', function(event) {
        event.preventDefault();
        var button = $(this);
        $('#' + button.data('image-target')).val('');
        $('#' + button.data('image-url-target')).val('');
        $('#' + button.data('image-preview')).attr('src', '').hide();
    });
});
JS
        );
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
        register_rest_route('ew-t17/v1', '/catalog/import', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array(__CLASS__, 'rest_import_catalog'),
            'permission_callback' => static function () {
                return current_user_can('manage_woocommerce');
            },
        ));
    }

    public static function get_catalog() {
        global $wpdb;
        $materials = $wpdb->get_results("SELECT m.id, m.material_key, m.component_type, m.library_tab_slug, m.category_slug, m.name_en, m.primary_color, m.color_tags, m.intention_tags, m.image_id, m.image_url, m.sort_order FROM " . self::materials_table() . " m WHERE m.status = 'live' AND EXISTS (SELECT 1 FROM " . self::variants_table() . " v WHERE v.material_id = m.id AND v.status = 'live') ORDER BY m.library_tab_slug, m.category_slug, m.sort_order ASC, m.name_en", ARRAY_A);
        $variants = $wpdb->get_results("SELECT * FROM " . self::variants_table() . " WHERE status = 'live' ORDER BY sort_order ASC, size_mm, variant_key", ARRAY_A);
        $grouped = array();

        foreach ($variants as $variant) {
            $grouped[(int) $variant['material_id']][] = self::present_variant($variant);
        }

        $items = array();
        foreach ($materials as $material) {
            $items[] = self::present_material($material, $grouped[(int) $material['id']] ?? array());
        }

        $currency = function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'USD';
        return rest_ensure_response(array(
            'schema_version' => 'ew-t17-v3',
            'currency' => $currency ?: 'USD',
            'tabs' => self::library_tabs(),
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
        $wrap_mode = sanitize_key((string) ($raw['wrap_mode'] ?? 'single'));
        if ($wrap_mode !== 'single') {
            return new WP_Error('ew_t17_invalid_wrap_mode', __('T17 currently supports single-wrap bracelets only.', 'earthward-t17'), array('status' => 400));
        }
        $sequence = isset($raw['sequence']) && is_array($raw['sequence']) ? $raw['sequence'] : array();
        if (!$sequence) {
            return new WP_Error('ew_t17_empty_design', __('Add at least one material before requesting a quote.', 'earthward-t17'), array('status' => 400));
        }
        if (count($sequence) > 80) {
            return new WP_Error('ew_t17_sequence_too_long', __('A bracelet design may contain at most 80 materials.', 'earthward-t17'), array('status' => 400));
        }

        $ids = array_values(array_unique(array_filter(array_map(static function ($item) {
            return isset($item['variant_id']) ? sanitize_key((string) $item['variant_id']) : '';
        }, $sequence))));
        // Packaging is intentionally not a current material-library choice.
        $packaging_variant_id = '';
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
            if (!in_array($row['stock_status'], self::STOCK_STATUSES, true) || $row['stock_status'] === 'outofstock' || ($row['stock_quantity'] !== null && (int) $row['stock_quantity'] < $quantity)) {
                return new WP_Error('ew_t17_out_of_stock', sprintf(__('%s is unavailable in the requested quantity.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
        }

        $total = 0.0;
        $length = 0.0;
        $snapshot = array();
        foreach ($sequence as $position => $item) {
            $key = sanitize_key((string) ($item['variant_id'] ?? ''));
            if (!isset($map[$key])) {
                return new WP_Error('ew_t17_unknown_variant', sprintf(__('Variant %s is unavailable.', 'earthward-t17'), $key), array('status' => 400));
            }
            $row = $map[$key];
            if (array_key_exists('size_mm', $item) && (!is_numeric($item['size_mm']) || abs((float) $item['size_mm'] - (float) $row['size_mm']) > 0.001)) {
                return new WP_Error('ew_t17_variant_size_mismatch', sprintf(__('Variant %s does not match the submitted size.', 'earthward-t17'), $key), array('status' => 400));
            }
            $row['component_type'] = self::component_type($row['component_type'] ?? '');
            if ($row['component_type'] !== 'accessory' && self::orientation_mode($row['orientation_mode'] ?? 'none') !== 'none') {
                return new WP_Error('ew_t17_invalid_variant_rules', sprintf(__('%s cannot use a directional accessory rule.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
            $mirror_pair = self::validate_live_mirror_pair($row);
            if (is_wp_error($mirror_pair)) {
                return $mirror_pair;
            }
            $direction_rules = self::validated_direction_rules($row);
            if (is_wp_error($direction_rules)) {
                return new WP_Error('ew_t17_invalid_variant_rules', sprintf(__('%s has invalid placement rules and cannot be quoted.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
            $orientation = self::requested_orientation($item, $row);
            if (is_wp_error($orientation)) {
                return $orientation;
            }
            if (!self::position_is_allowed($row, $position, count($sequence))) {
                return new WP_Error('ew_t17_invalid_position', sprintf(__('%s cannot be placed at this position.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
            $previous_key = $position > 0 ? sanitize_key((string) ($sequence[$position - 1]['variant_id'] ?? '')) : '';
            $next_key = $position < count($sequence) - 1 ? sanitize_key((string) ($sequence[$position + 1]['variant_id'] ?? '')) : '';
            $previous = $previous_key && isset($map[$previous_key]) ? $map[$previous_key] : null;
            $next = $next_key && isset($map[$next_key]) ? $map[$next_key] : null;
            if (!self::neighbors_are_allowed($row, $previous, $next)) {
                return new WP_Error('ew_t17_invalid_neighbor', sprintf(__('%s is incompatible with an adjacent material.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
            if (!self::neighbor_bead_sizes_are_compatible($row, $previous, $next)) {
                return new WP_Error('ew_t17_incompatible_bead_size', sprintf(__('%s is not compatible with the adjacent bead size.', 'earthward-t17'), $row['name_en']), array('status' => 400));
            }
            $total += (float) $row['price'];
            $length += (float) $row['occupied_length_mm'];
            $snapshot[] = array(
                'position' => $position,
                'variant_id' => $row['variant_key'],
                'material_id' => $row['material_key'],
                'name' => $row['name_en'],
                'component_type' => $row['component_type'],
                'orientation' => $orientation,
                'orientation_mode' => self::orientation_mode($row['orientation_mode'] ?? 'none'),
                'size_mm' => (float) $row['size_mm'],
                'unit_price' => (float) $row['price'],
                'occupied_length_mm' => (float) $row['occupied_length_mm'],
                'display_scale' => (float) $row['display_scale'],
                'image_url' => self::image_url((int) ($row['image_id'] ?? 0), (string) ($row['image_url'] ?? '')),
            );
        }

        $packaging_snapshot = array();

        $target_wrist = max(10, min(30, (float) ($raw['target_wrist_cm'] ?? 16)));
        $fit_allowance = in_array(($raw['fit_preference'] ?? ''), array('snug', 'loose'), true)
            ? (($raw['fit_preference'] ?? '') === 'loose' ? 2.0 : 0.8)
            : 1.3;
        $target_length = ($target_wrist + $fit_allowance) * 10;
        $difference = $length - $target_length;
        $fit_status = abs($difference) <= 6 ? 'fit' : ($difference < 0 ? 'short' : 'long');
        $piece_count = count($snapshot);
        $average_occupied_length = $piece_count > 0 ? $length / $piece_count : 0.0;
        $recommended_piece_count = $average_occupied_length > 0
            ? max(1, min(80, (int) round($target_length / $average_occupied_length)))
            : $piece_count;

        return array(
            'currency' => function_exists('get_woocommerce_currency') ? (get_woocommerce_currency() ?: 'USD') : 'USD',
            'total' => round($total, 2),
            'used_length_mm' => round($length, 1),
            'target_length_mm' => round($target_length, 1),
            'fit_status' => $fit_status,
            'average_occupied_length_mm' => round($average_occupied_length, 2),
            'recommended_piece_count' => $recommended_piece_count,
            'piece_delta' => $recommended_piece_count - $piece_count,
            'wrap_mode' => 'single',
            'snapshot' => $snapshot,
            'packaging_snapshot' => $packaging_snapshot,
            'price_version' => (string) get_option('ew_t17_price_version', 'draft'),
        );
    }

    public static function register_admin_page() {
        add_menu_page(
            __('T17 Materials', 'earthward-t17'),
            __('T17 Materials', 'earthward-t17'),
            'manage_woocommerce',
            'ew-t17-materials',
            array(__CLASS__, 'render_admin_page'),
            'dashicons-art',
            56
        );
        add_submenu_page(
            'ew-t17-materials',
            __('Crystal Library', 'earthward-t17'),
            __('Crystals', 'earthward-t17'),
            'manage_woocommerce',
            'ew-t17-beads',
            array(__CLASS__, 'render_beads_page')
        );
        add_submenu_page(
            'ew-t17-materials',
            __('Accessories Library', 'earthward-t17'),
            __('Accessories', 'earthward-t17'),
            'manage_woocommerce',
            'ew-t17-decor',
            array(__CLASS__, 'render_decor_page')
        );
    }

    public static function render_beads_page() {
        self::render_library_page('crystal');
    }

    public static function render_decor_page() {
        self::render_library_page('accessory');
    }

    public static function render_admin_page() {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        global $wpdb;
        $materials = $wpdb->get_results("SELECT m.*, COUNT(v.id) AS variants FROM " . self::materials_table() . " m LEFT JOIN " . self::variants_table() . " v ON v.material_id = m.id GROUP BY m.id ORDER BY m.component_type, m.sort_order ASC, m.name_en", ARRAY_A);
        $variants = $wpdb->get_results("SELECT v.*, m.material_key, m.name_en AS material_name FROM " . self::variants_table() . " v INNER JOIN " . self::materials_table() . " m ON m.id = v.material_id ORDER BY v.sort_order ASC, v.size_mm, v.variant_key", ARRAY_A);
        $editing_id = absint($_GET['edit_material'] ?? 0);
        $editing = $editing_id ? $wpdb->get_row($wpdb->prepare("SELECT * FROM " . self::materials_table() . " WHERE id = %d", $editing_id), ARRAY_A) : null;
        $editing_variant_id = absint($_GET['edit_variant'] ?? 0);
        $editing_variant = $editing_variant_id ? $wpdb->get_row($wpdb->prepare("SELECT v.*, m.material_key, m.name_en AS material_name FROM " . self::variants_table() . " v INNER JOIN " . self::materials_table() . " m ON m.id = v.material_id WHERE v.id = %d", $editing_variant_id), ARRAY_A) : null;
        $library_tabs = self::library_tabs(true);
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('DIY Materials Library', 'earthward-t17'); ?></h1>
            <p><?php esc_html_e('Materials are managed here, not as WooCommerce products. Add variants with a stable ID, real size, price, and occupied length.', 'earthward-t17'); ?></p>
            <?php self::render_admin_notices(); ?>
            <h2><?php esc_html_e('Editor tabs', 'earthward-t17'); ?></h2>
            <p><?php esc_html_e('Tabs control browsing only. Each material retains its Crystal or Accessories type for pricing, compatibility, and direction validation.', 'earthward-t17'); ?></p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_save_library_tabs'); ?><input type="hidden" name="action" value="ew_t17_save_library_tabs">
                <table class="widefat striped"><thead><tr><th>Slug</th><th>Label</th><th>Sort</th><th>Status</th></tr></thead><tbody>
                <?php foreach ($library_tabs as $tab) : ?><tr><td><input name="tab_slug[]" required pattern="[a-z0-9-]+" value="<?php echo esc_attr($tab['slug']); ?>"></td><td><input name="tab_label[]" required value="<?php echo esc_attr($tab['label']); ?>"></td><td><input name="tab_sort_order[]" type="number" value="<?php echo esc_attr($tab['sort_order']); ?>"></td><td><select name="tab_status[]"><option value="live" <?php selected($tab['status'], 'live'); ?>>Live</option><option value="disabled" <?php selected($tab['status'], 'disabled'); ?>>Disabled</option></select></td></tr><?php endforeach; ?>
                <tr><td><input name="tab_slug[]" pattern="[a-z0-9-]+" placeholder="shaped-stones"></td><td><input name="tab_label[]" placeholder="Shaped stones"></td><td><input name="tab_sort_order[]" type="number" value="30"></td><td><select name="tab_status[]"><option value="live">Live</option><option value="disabled">Disabled</option></select></td></tr>
                </tbody></table>
                <?php submit_button(__('Save editor tabs', 'earthward-t17'), 'secondary', 'submit', false); ?>
            </form>
            <h2 id="ew-t17-add-material"><?php esc_html_e('Add material and first variant', 'earthward-t17'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_save_material'); ?>
                <input type="hidden" name="action" value="ew_t17_save_material">
                <table class="form-table"><tbody>
                    <tr><th><label for="material_key">Material ID</label></th><td><input required name="material_key" id="material_key" class="regular-text" placeholder="amethyst"></td></tr>
                    <tr><th><label for="name_en">English name</label></th><td><input required name="name_en" id="name_en" class="regular-text" placeholder="Amethyst"></td></tr>
                    <tr><th><label for="component_type">Type</label></th><td><select name="component_type" id="component_type"><?php foreach (self::COMPONENT_TYPES as $type) : ?><option value="<?php echo esc_attr($type); ?>" <?php selected(self::component_type(wp_unslash($_GET['new_type'] ?? 'crystal')), $type); ?>><?php echo esc_html(ucfirst($type)); ?></option><?php endforeach; ?></select></td></tr>
                    <tr><th><label for="library_tab_slug">Editor tab</label></th><td><select name="library_tab_slug" id="library_tab_slug"><?php foreach ($library_tabs as $tab) : ?><option value="<?php echo esc_attr($tab['slug']); ?>" <?php selected($tab['slug'], 'crystal'); ?>><?php echo esc_html($tab['label']); ?></option><?php endforeach; ?></select><p class="description">Controls which first-level editor tab shows this material.</p></td></tr>
                    <tr><th><label for="category_slug">Category</label></th><td><input name="category_slug" id="category_slug" class="regular-text" placeholder="crystal / natural-stone / spacer / charm"><p class="description">Stable English browsing category.</p></td></tr>
                    <tr><th><label for="primary_color">Primary color</label></th><td><input name="primary_color" id="primary_color" class="regular-text" placeholder="purple"></td></tr>
                    <tr><th><label for="color_tags">Color tags</label></th><td><input name="color_tags" id="color_tags" class="regular-text" placeholder="purple, violet"><p class="description">Comma separated.</p></td></tr>
                    <tr><th><label for="intention_tags">Intention tags</label></th><td><input name="intention_tags" id="intention_tags" class="regular-text" placeholder="calm, focus"><p class="description">Comma separated browsing tags.</p></td></tr>
                    <?php self::render_image_fields('new_material', 0, ''); ?>
                    <tr><th><label for="source_name">Image/data source</label></th><td><input name="source_name" id="source_name" class="regular-text" placeholder="own / supplier / reference"></td></tr>
                    <tr><th><label for="material_status">Material status</label></th><td><select name="material_status" id="material_status"><option value="draft">Draft</option><option value="live">Live</option></select></td></tr>
                    <tr><th><label for="material_sort_order">Material sort order</label></th><td><input name="material_sort_order" id="material_sort_order" type="number" min="0" step="1" value="0"></td></tr>
                    <tr><th><label for="variant_key">First Variant ID</label></th><td><input required name="variant_key" id="variant_key" class="regular-text" placeholder="amethyst-8mm"></td></tr>
                    <tr><th><label for="size_mm">Size (mm)</label></th><td><input required name="size_mm" id="size_mm" type="number" min="0" step="0.01" value="8"></td></tr>
                    <tr><th><label for="price">Price</label></th><td><input required name="price" id="price" type="number" min="0" step="0.01"></td></tr>
                    <tr><th><label for="occupied_length_mm">Occupied length (mm)</label></th><td><input required name="occupied_length_mm" id="occupied_length_mm" type="number" min="0" step="0.001"></td></tr>
                    <?php self::render_variant_display_fields('first_variant', array()); ?>
                    <?php self::render_orientation_fields('first_variant', array()); ?>
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
                    <tr><th><label for="new_variant_length">Occupied length (mm)</label></th><td><input required name="occupied_length_mm" id="new_variant_length" type="number" min="0" step="0.001"></td></tr>
                    <tr><th><label for="new_variant_shape">Shape</label></th><td><input name="shape" id="new_variant_shape" class="regular-text" value="round"></td></tr>
                    <?php self::render_variant_display_fields('new_variant', array()); ?>
                    <?php self::render_image_fields('new_variant', 0, ''); ?>
                    <tr><th><label for="new_variant_stock_status">Stock status</label></th><td><select name="stock_status" id="new_variant_stock_status"><option value="instock">In stock</option><option value="outofstock">Out of stock</option><option value="onbackorder">On backorder</option></select></td></tr>
                    <tr><th><label for="new_variant_stock_quantity">Stock quantity</label></th><td><input name="stock_quantity" id="new_variant_stock_quantity" type="number" min="0" step="1"><p class="description">Leave empty when stock is not quantity-managed.</p></td></tr>
                    <tr><th><label for="new_variant_compatibility">Compatibility</label></th><td><input name="compatibility" id="new_variant_compatibility" class="regular-text" placeholder="bead, elastic-cord"><p class="description">Comma separated.</p></td></tr>
                    <?php self::render_orientation_fields('new_variant', array()); ?>
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
                    <tr><th><label for="builder_page_id">Existing T17 tool page ID</label></th><td><input name="builder_page_id" id="builder_page_id" type="number" min="0" value="<?php echo esc_attr(get_option('ew_t17_builder_page_id', 0)); ?>"><p class="description">Use the existing /tools/crystal-bracelet-builder/ page ID. This setting only gives official Woo designs a Customize link; it does not create or render a page.</p></td></tr>
                    <tr><th><label for="price_version">Current price version</label></th><td><input name="price_version" id="price_version" class="regular-text" value="<?php echo esc_attr(get_option('ew_t17_price_version', 'draft')); ?>"></td></tr>
                    <?php
                    $tray_logo_id = absint(get_option('ew_t17_tray_logo_id', 0));
                    $tray_logo_url = (string) get_option('ew_t17_tray_logo_url', '');
                    $tray_logo_preview = self::image_url($tray_logo_id, $tray_logo_url);
                    ?>
                    <tr><th><label for="tray_logo_id">Tray center logo</label></th><td><input type="hidden" name="tray_logo_id" id="tray_logo_id" value="<?php echo esc_attr($tray_logo_id); ?>"><button type="button" class="button ew-t17-select-image" data-image-target="tray_logo_id" data-image-url-target="tray_logo_url" data-image-preview="tray_logo_preview"><?php esc_html_e('Select transparent logo', 'earthward-t17'); ?></button> <button type="button" class="button-link-delete ew-t17-clear-image" data-image-target="tray_logo_id" data-image-url-target="tray_logo_url" data-image-preview="tray_logo_preview"><?php esc_html_e('Clear logo', 'earthward-t17'); ?></button><br><img id="tray_logo_preview" src="<?php echo esc_url($tray_logo_preview); ?>" alt="" style="max-width: 160px; height: auto; margin-top: 8px;<?php echo $tray_logo_preview ? '' : ' display: none;'; ?>"><p class="description">Use a transparent PNG or WebP. When empty, the editor shows the Earthward text fallback and never renders a second EW mark.</p></td></tr>
                    <tr><th><label for="tray_logo_url">Tray logo URL</label></th><td><input name="tray_logo_url" id="tray_logo_url" class="regular-text" value="<?php echo esc_attr($tray_logo_url); ?>" placeholder="https://..."><p class="description">Use an external URL only when the logo is not in the Media Library.</p></td></tr>
                    <tr><th><label for="tray_logo_size_px">Tray logo width (px)</label></th><td><input name="tray_logo_size_px" id="tray_logo_size_px" type="number" min="24" max="160" step="1" value="<?php echo esc_attr(get_option('ew_t17_tray_logo_size_px', 54)); ?>"><p class="description">Display width is constrained between 24 and 160 pixels.</p></td></tr>
                </tbody></table>
                <?php submit_button(__('Save T17 settings', 'earthward-t17')); ?>
            </form>
            <h2><?php esc_html_e('Catalog status', 'earthward-t17'); ?></h2>
            <table class="widefat striped"><thead><tr><th>ID</th><th>Name</th><th>Physical type</th><th>Editor tab</th><th>Variants</th><th>Status</th><th>Action</th></tr></thead><tbody>
            <?php foreach ($materials as $material) : ?><tr><td><?php echo esc_html($material['material_key']); ?></td><td><?php echo esc_html($material['name_en']); ?></td><td><?php echo esc_html($material['component_type']); ?></td><td><?php echo esc_html($material['library_tab_slug'] ?? $material['component_type']); ?></td><td><?php echo esc_html($material['variants']); ?></td><td><?php echo esc_html($material['status']); ?></td><td><a href="<?php echo esc_url(add_query_arg('edit_material', $material['id'], admin_url('admin.php?page=ew-t17-materials'))); ?>">Edit</a></td></tr><?php endforeach; ?>
            </tbody></table>
            <h2><?php esc_html_e('Catalog variants', 'earthward-t17'); ?></h2>
            <table class="widefat striped"><thead><tr><th>Variant ID</th><th>Material</th><th>Size</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>
            <?php foreach ($variants as $variant) : ?><tr><td><?php echo esc_html($variant['variant_key']); ?></td><td><?php echo esc_html($variant['material_name'] . ' (' . $variant['material_key'] . ')'); ?></td><td><?php echo esc_html($variant['size_mm']); ?></td><td><?php echo esc_html($variant['price']); ?></td><td><?php echo esc_html($variant['stock_status']); ?></td><td><?php echo esc_html($variant['status']); ?></td><td><a href="<?php echo esc_url(add_query_arg('edit_variant', $variant['id'], admin_url('admin.php?page=ew-t17-materials'))); ?>">Edit</a></td></tr><?php endforeach; ?>
            </tbody></table>
            <?php if ($editing) : ?>
                <h2><?php echo esc_html(sprintf(__('Edit %s', 'earthward-t17'), $editing['name_en'])); ?></h2>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('ew_t17_update_material'); ?>
                    <input type="hidden" name="action" value="ew_t17_update_material"><input type="hidden" name="material_id" value="<?php echo esc_attr($editing['id']); ?>">
                    <table class="form-table"><tbody>
                        <tr><th>Material ID</th><td><code><?php echo esc_html($editing['material_key']); ?></code></td></tr>
                        <tr><th><label for="edit_name_en">English name</label></th><td><input required name="name_en" id="edit_name_en" class="regular-text" value="<?php echo esc_attr($editing['name_en']); ?>"></td></tr>
                        <tr><th><label for="edit_category_slug">Category</label></th><td><input name="category_slug" id="edit_category_slug" class="regular-text" value="<?php echo esc_attr($editing['category_slug']); ?>"></td></tr>
                        <tr><th><label for="edit_library_tab_slug">Editor tab</label></th><td><select name="library_tab_slug" id="edit_library_tab_slug"><?php foreach ($library_tabs as $tab) : ?><option value="<?php echo esc_attr($tab['slug']); ?>" <?php selected($editing['library_tab_slug'] ?? $editing['component_type'], $tab['slug']); ?>><?php echo esc_html($tab['label']); ?></option><?php endforeach; ?></select></td></tr>
                        <tr><th><label for="edit_primary_color">Primary color</label></th><td><input name="primary_color" id="edit_primary_color" class="regular-text" value="<?php echo esc_attr($editing['primary_color']); ?>"></td></tr>
                        <tr><th><label for="edit_color_tags">Color tags</label></th><td><input name="color_tags" id="edit_color_tags" class="regular-text" value="<?php echo esc_attr(implode(', ', self::decode_list($editing['color_tags']))); ?>"><p class="description">Comma separated.</p></td></tr>
                        <tr><th><label for="edit_intention_tags">Intention tags</label></th><td><input name="intention_tags" id="edit_intention_tags" class="regular-text" value="<?php echo esc_attr(implode(', ', self::decode_list($editing['intention_tags']))); ?>"><p class="description">Comma separated. Use these for browsing, not pricing.</p></td></tr>
                        <?php self::render_image_fields('edit_material', (int) $editing['image_id'], $editing['image_url']); ?>
                        <tr><th><label for="edit_source_name">Image/data source</label></th><td><input name="source_name" id="edit_source_name" class="regular-text" value="<?php echo esc_attr($editing['source_name']); ?>"></td></tr>
                        <tr><th><label for="edit_status">Status</label></th><td><select name="status" id="edit_status"><option value="draft" <?php selected($editing['status'], 'draft'); ?>>Draft</option><option value="live" <?php selected($editing['status'], 'live'); ?>>Live</option></select></td></tr>
                        <tr><th><label for="edit_material_sort_order">Sort order</label></th><td><input name="material_sort_order" id="edit_material_sort_order" type="number" min="0" step="1" value="<?php echo esc_attr($editing['sort_order']); ?>"></td></tr>
                    </tbody></table>
                    <?php submit_button(__('Update material', 'earthward-t17')); ?>
                </form>
            <?php endif; ?>
            <?php if ($editing_variant) : ?>
                <h2><?php echo esc_html(sprintf(__('Edit variant %s', 'earthward-t17'), $editing_variant['variant_key'])); ?></h2>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('ew_t17_update_variant'); ?>
                    <input type="hidden" name="action" value="ew_t17_update_variant"><input type="hidden" name="variant_id" value="<?php echo esc_attr($editing_variant['id']); ?>">
                    <table class="form-table"><tbody>
                        <tr><th>Material</th><td><code><?php echo esc_html($editing_variant['material_name'] . ' (' . $editing_variant['material_key'] . ')'); ?></code></td></tr>
                        <tr><th>Variant ID</th><td><code><?php echo esc_html($editing_variant['variant_key']); ?></code></td></tr>
                        <tr><th><label for="edit_variant_size">Size (mm)</label></th><td><input required name="size_mm" id="edit_variant_size" type="number" min="0" step="0.01" value="<?php echo esc_attr($editing_variant['size_mm']); ?>"></td></tr>
                        <tr><th><label for="edit_variant_shape">Shape</label></th><td><input name="shape" id="edit_variant_shape" class="regular-text" value="<?php echo esc_attr($editing_variant['shape']); ?>"></td></tr>
                        <?php self::render_variant_display_fields('edit_variant', $editing_variant); ?>
                        <tr><th><label for="edit_variant_price">Price</label></th><td><input required name="price" id="edit_variant_price" type="number" min="0" step="0.01" value="<?php echo esc_attr($editing_variant['price']); ?>"></td></tr>
                        <tr><th><label for="edit_variant_length">Occupied length (mm)</label></th><td><input required name="occupied_length_mm" id="edit_variant_length" type="number" min="0" step="0.001" value="<?php echo esc_attr($editing_variant['occupied_length_mm']); ?>"></td></tr>
                        <?php self::render_image_fields('edit_variant', (int) $editing_variant['image_id'], $editing_variant['image_url']); ?>
                        <tr><th><label for="edit_variant_stock_status">Stock status</label></th><td><select name="stock_status" id="edit_variant_stock_status"><option value="instock" <?php selected($editing_variant['stock_status'], 'instock'); ?>>In stock</option><option value="outofstock" <?php selected($editing_variant['stock_status'], 'outofstock'); ?>>Out of stock</option><option value="onbackorder" <?php selected($editing_variant['stock_status'], 'onbackorder'); ?>>On backorder</option></select></td></tr>
                        <tr><th><label for="edit_variant_stock_quantity">Stock quantity</label></th><td><input name="stock_quantity" id="edit_variant_stock_quantity" type="number" min="0" step="1" value="<?php echo esc_attr($editing_variant['stock_quantity']); ?>"><p class="description">Leave empty when stock is not quantity-managed.</p></td></tr>
                        <tr><th><label for="edit_variant_compatibility">Compatibility</label></th><td><input name="compatibility" id="edit_variant_compatibility" class="regular-text" value="<?php echo esc_attr(implode(', ', self::decode_list($editing_variant['compatibility']))); ?>"><p class="description">Comma separated.</p></td></tr>
                        <?php self::render_orientation_fields('edit_variant', $editing_variant); ?>
                        <tr><th><label for="edit_variant_status">Status</label></th><td><select name="status" id="edit_variant_status"><option value="draft" <?php selected($editing_variant['status'], 'draft'); ?>>Draft</option><option value="live" <?php selected($editing_variant['status'], 'live'); ?>>Live</option><option value="disabled" <?php selected($editing_variant['status'], 'disabled'); ?>>Disabled</option></select></td></tr>
                    </tbody></table>
                    <?php submit_button(__('Update variant', 'earthward-t17')); ?>
                </form>
            <?php endif; ?>
        </div>
        <?php
    }

    private static function render_library_page($library) {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        global $wpdb;
        $library = $library === 'crystal' ? 'crystal' : 'accessory';
        $page = $library === 'crystal' ? 'ew-t17-beads' : 'ew-t17-decor';
        $status = sanitize_key(wp_unslash($_GET['status'] ?? ''));
        $color = sanitize_key(wp_unslash($_GET['color'] ?? ''));
        $category = sanitize_key(wp_unslash($_GET['category'] ?? ''));
        $where = $library === 'crystal' ? array("m.component_type IN ('crystal', 'bead')") : array("m.component_type IN ('accessory', 'decor')");
        $params = array();
        if (in_array($status, array('draft', 'live', 'disabled'), true)) {
            if ($status === 'disabled') {
                $where[] = 'v.status = %s';
                $params[] = $status;
            } else {
                $where[] = 'm.status = %s AND (v.status = %s OR v.id IS NULL)';
                $params[] = $status;
                $params[] = $status;
            }
        }
        if ($library === 'crystal' && $color !== '') {
            $where[] = 'm.primary_color = %s';
            $params[] = $color;
        }
        if ($category !== '') {
            $where[] = 'm.category_slug = %s';
            $params[] = $category;
        }
        $sql = 'SELECT m.id AS material_id, m.material_key, m.component_type, m.category_slug, m.name_en, m.primary_color, m.image_id AS material_image_id, m.image_url AS material_image_url, m.status AS material_status, m.sort_order AS material_sort_order, v.id AS variant_id, v.variant_key, v.size_mm, v.price, v.image_id AS variant_image_id, v.image_url AS variant_image_url, v.display_scale, v.compatible_bead_sizes, v.orientation_mode, v.status AS variant_status, v.sort_order AS variant_sort_order FROM ' . self::materials_table() . ' m LEFT JOIN ' . self::variants_table() . ' v ON v.material_id = m.id WHERE ' . implode(' AND ', $where) . ' ORDER BY m.sort_order ASC, m.name_en ASC, v.sort_order ASC, v.size_mm ASC, v.variant_key ASC';
        $rows = $params ? $wpdb->get_results($wpdb->prepare($sql, $params), ARRAY_A) : $wpdb->get_results($sql, ARRAY_A);
        $colors = $library === 'crystal' ? $wpdb->get_col("SELECT DISTINCT primary_color FROM " . self::materials_table() . " WHERE component_type IN ('crystal', 'bead') AND primary_color <> '' ORDER BY primary_color") : array();
        $category_sql = $library === 'crystal' ? "SELECT DISTINCT category_slug FROM " . self::materials_table() . " WHERE component_type IN ('crystal', 'bead') AND category_slug <> '' ORDER BY category_slug" : "SELECT DISTINCT category_slug FROM " . self::materials_table() . " WHERE component_type IN ('accessory', 'decor') AND category_slug <> '' ORDER BY category_slug";
        $categories = $wpdb->get_col($category_sql);
        ?>
        <div class="wrap">
            <h1><?php echo esc_html($library === 'crystal' ? __('DIY Crystal Library', 'earthward-t17') : __('DIY Accessories Library', 'earthward-t17')); ?></h1>
            <p><?php esc_html_e('Catalog data is independent from WooCommerce products. Edit material and variant records here; WooCommerce remains for official designs and completed orders.', 'earthward-t17'); ?></p>
            <?php self::render_admin_notices(); ?>
            <p><a class="button button-primary" href="<?php echo esc_url(add_query_arg('new_type', $library === 'crystal' ? 'crystal' : 'accessory', admin_url('admin.php?page=ew-t17-materials#ew-t17-add-material'))); ?>"><?php echo esc_html($library === 'crystal' ? __('Add crystal', 'earthward-t17') : __('Add accessory', 'earthward-t17')); ?></a> <a class="button" href="<?php echo esc_url(admin_url('admin.php?page=ew-t17-materials')); ?>"><?php esc_html_e('Full catalog management', 'earthward-t17'); ?></a></p>
            <form method="get" style="margin: 16px 0;">
                <input type="hidden" name="page" value="<?php echo esc_attr($page); ?>">
                <label><?php esc_html_e('Status', 'earthward-t17'); ?> <select name="status"><option value=""><?php esc_html_e('All statuses', 'earthward-t17'); ?></option><?php foreach (array('draft', 'live', 'disabled') as $option) : ?><option value="<?php echo esc_attr($option); ?>" <?php selected($status, $option); ?>><?php echo esc_html(ucfirst($option)); ?></option><?php endforeach; ?></select></label>
                <label><?php esc_html_e('Category', 'earthward-t17'); ?> <select name="category"><option value=""><?php esc_html_e('All categories', 'earthward-t17'); ?></option><?php foreach ($categories as $option) : ?><option value="<?php echo esc_attr($option); ?>" <?php selected($category, $option); ?>><?php echo esc_html($option); ?></option><?php endforeach; ?></select></label><?php if ($library === 'crystal') : ?><label><?php esc_html_e('Color', 'earthward-t17'); ?> <select name="color"><option value=""><?php esc_html_e('All colors', 'earthward-t17'); ?></option><?php foreach ($colors as $option) : ?><option value="<?php echo esc_attr($option); ?>" <?php selected($color, $option); ?>><?php echo esc_html(ucfirst($option)); ?></option><?php endforeach; ?></select></label><?php endif; ?>
                <?php submit_button(__('Filter', 'earthward-t17'), 'secondary', 'filter_action', false); ?>
            </form>
            <table class="widefat fixed striped"><thead><tr><th style="width:72px"><?php esc_html_e('Image', 'earthward-t17'); ?></th><th><?php esc_html_e('English name', 'earthward-t17'); ?></th><th><?php echo esc_html($library === 'crystal' ? __('Category / color', 'earthward-t17') : __('Category', 'earthward-t17')); ?></th><th><?php esc_html_e('Size / price', 'earthward-t17'); ?></th><th><?php echo esc_html($library === 'crystal' ? __('Display scale', 'earthward-t17') : __('Direction / crystal fit', 'earthward-t17')); ?></th><th><?php esc_html_e('Status', 'earthward-t17'); ?></th><th><?php esc_html_e('Sort', 'earthward-t17'); ?></th><th><?php esc_html_e('Actions', 'earthward-t17'); ?></th></tr></thead><tbody>
            <?php if (!$rows) : ?><tr><td colspan="8"><?php esc_html_e('No catalog entries match this filter.', 'earthward-t17'); ?></td></tr><?php endif; ?>
            <?php foreach ($rows as $row) : $image = self::image_url((int) $row['variant_image_id'], $row['variant_image_url']) ?: self::image_url((int) $row['material_image_id'], $row['material_image_url']); ?>
                <tr><td><?php if ($image) : ?><img src="<?php echo esc_url($image); ?>" alt="" style="width:48px;height:48px;object-fit:contain;"><?php endif; ?></td><td><strong><?php echo esc_html($row['name_en']); ?></strong><br><code><?php echo esc_html($row['material_key']); ?></code><?php if ($row['variant_id']) : ?><br><small><code><?php echo esc_html($row['variant_key']); ?></code></small><?php endif; ?></td><td><?php echo esc_html($row['category_slug'] ?: '-'); ?><?php if ($library === 'crystal' && $row['primary_color']) : ?><br><small><?php echo esc_html($row['primary_color']); ?></small><?php endif; ?></td><td><?php if ($row['variant_id']) : ?><?php echo esc_html($row['size_mm']); ?> mm<br><?php echo esc_html($row['price']); ?><?php else : ?>-<?php endif; ?></td><td><?php if ($row['variant_id']) : ?><?php echo esc_html($library === 'crystal' ? $row['display_scale'] : ($row['orientation_mode'] . ' / ' . implode(', ', self::decode_numeric_list($row['compatible_bead_sizes'])))); ?><?php else : ?>-<?php endif; ?></td><td><?php echo esc_html($row['variant_id'] ? $row['variant_status'] : $row['material_status']); ?></td><td><?php self::render_sort_order_form('material', (int) $row['material_id'], (int) $row['material_sort_order'], $page); ?><?php if ($row['variant_id']) : ?><br><?php self::render_sort_order_form('variant', (int) $row['variant_id'], (int) $row['variant_sort_order'], $page); ?><?php endif; ?></td><td><a href="<?php echo esc_url(add_query_arg('edit_material', $row['material_id'], admin_url('admin.php?page=ew-t17-materials'))); ?>"><?php esc_html_e('Edit material', 'earthward-t17'); ?></a><?php if ($row['variant_id']) : ?><br><a href="<?php echo esc_url(add_query_arg('edit_variant', $row['variant_id'], admin_url('admin.php?page=ew-t17-materials'))); ?>"><?php esc_html_e('Edit variant', 'earthward-t17'); ?></a><?php endif; ?></td></tr>
            <?php endforeach; ?>
            </tbody></table>
        </div>
        <?php
    }

    private static function render_sort_order_form($entity, $id, $sort_order, $return_page) {
        ?>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display:inline-flex;gap:4px;align-items:center;">
            <?php wp_nonce_field('ew_t17_update_sort_order'); ?><input type="hidden" name="action" value="ew_t17_update_sort_order"><input type="hidden" name="entity" value="<?php echo esc_attr($entity); ?>"><input type="hidden" name="record_id" value="<?php echo esc_attr($id); ?>"><input type="hidden" name="return_page" value="<?php echo esc_attr($return_page); ?>"><input aria-label="<?php esc_attr_e('Sort order', 'earthward-t17'); ?>" name="sort_order" type="number" min="0" step="1" value="<?php echo esc_attr($sort_order); ?>" style="width:68px;"><button class="button button-small" type="submit"><?php esc_html_e('Save', 'earthward-t17'); ?></button>
        </form>
        <?php
    }

    public static function save_library_tabs() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_save_library_tabs');
        $slugs = isset($_POST['tab_slug']) && is_array($_POST['tab_slug']) ? $_POST['tab_slug'] : array();
        $labels = isset($_POST['tab_label']) && is_array($_POST['tab_label']) ? $_POST['tab_label'] : array();
        $orders = isset($_POST['tab_sort_order']) && is_array($_POST['tab_sort_order']) ? $_POST['tab_sort_order'] : array();
        $statuses = isset($_POST['tab_status']) && is_array($_POST['tab_status']) ? $_POST['tab_status'] : array();
        $tabs = array();
        foreach ($slugs as $index => $raw_slug) {
            $slug = sanitize_key(wp_unslash($raw_slug));
            $label = sanitize_text_field(wp_unslash($labels[$index] ?? ''));
            if (!$slug && !$label) continue;
            if (!$slug || !$label || isset($tabs[$slug])) {
                wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-tabs', admin_url('admin.php?page=ew-t17-materials')));
                exit;
            }
            $tabs[$slug] = array(
                'slug' => $slug,
                'label' => $label,
                'sort_order' => is_numeric($orders[$index] ?? null) ? (int) $orders[$index] : 0,
                'status' => sanitize_key(wp_unslash($statuses[$index] ?? 'live')) === 'disabled' ? 'disabled' : 'live',
            );
        }
        if (!$tabs) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-tabs', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        update_option('ew_t17_library_tabs', array_values($tabs), false);
        wp_safe_redirect(add_query_arg('ew_t17_updated', 'tabs', admin_url('admin.php?page=ew-t17-materials')));
        exit;
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
        $type = self::component_type(wp_unslash($_POST['component_type'] ?? 'bead'));
        if (!$material_key || !$variant_key || !in_array($type, self::COMPONENT_TYPES, true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $material_status = sanitize_key(wp_unslash($_POST['material_status'] ?? 'draft'));
        $variant_status = sanitize_key(wp_unslash($_POST['first_variant_status'] ?? 'draft'));
        if (!in_array($material_status, array('draft', 'live'), true) || !in_array($variant_status, array('draft', 'live'), true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-status', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $variant_data = self::variant_data_from_request($variant_status);
        if (is_wp_error($variant_data)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $material_written = $wpdb->insert(self::materials_table(), array(
            'material_key' => $material_key,
            'component_type' => $type,
            'library_tab_slug' => self::library_tab_slug(wp_unslash($_POST['library_tab_slug'] ?? ''), $type),
            'category_slug' => sanitize_key(wp_unslash($_POST['category_slug'] ?? '')),
            'name_en' => sanitize_text_field(wp_unslash($_POST['name_en'] ?? '')),
            'primary_color' => sanitize_key(wp_unslash($_POST['primary_color'] ?? '')),
            'color_tags' => wp_json_encode(self::csv_list($_POST['color_tags'] ?? '')),
            'intention_tags' => wp_json_encode(self::csv_list($_POST['intention_tags'] ?? '')),
            'image_id' => self::image_id($_POST['image_id'] ?? 0),
            'image_url' => esc_url_raw(wp_unslash($_POST['image_url'] ?? '')),
            'source_name' => sanitize_text_field(wp_unslash($_POST['source_name'] ?? '')),
            'status' => $material_status,
            'sort_order' => self::sort_order_from_request('material_sort_order'),
            'created_at' => $now,
            'updated_at' => $now,
        ));
        $material_id = (int) $wpdb->insert_id;
        if ($material_written === false || !$material_id) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'material-write-failed', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $variant_written = $wpdb->insert(self::variants_table(), array_merge($variant_data, array(
            'material_id' => $material_id,
            'variant_key' => $variant_key,
            'status' => $variant_status,
            'created_at' => $now,
            'updated_at' => $now,
        )));
        if ($variant_written === false) {
            $wpdb->delete(self::materials_table(), array('id' => $material_id), array('%d'));
            wp_safe_redirect(add_query_arg('ew_t17_error', 'variant-write-failed', admin_url('admin.php?page=ew-t17-materials')));
            exit;
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
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-status', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $written = $wpdb->update(self::materials_table(), array(
            'name_en' => sanitize_text_field(wp_unslash($_POST['name_en'] ?? '')),
            'library_tab_slug' => self::library_tab_slug(wp_unslash($_POST['library_tab_slug'] ?? ''), self::component_type($wpdb->get_var($wpdb->prepare("SELECT component_type FROM " . self::materials_table() . " WHERE id = %d", $material_id)))),
            'category_slug' => sanitize_key(wp_unslash($_POST['category_slug'] ?? '')),
            'primary_color' => sanitize_key(wp_unslash($_POST['primary_color'] ?? '')),
            'color_tags' => wp_json_encode(self::csv_list($_POST['color_tags'] ?? '')),
            'intention_tags' => wp_json_encode(self::csv_list($_POST['intention_tags'] ?? '')),
            'image_id' => self::image_id($_POST['image_id'] ?? 0),
            'image_url' => esc_url_raw(wp_unslash($_POST['image_url'] ?? '')),
            'source_name' => sanitize_text_field(wp_unslash($_POST['source_name'] ?? '')),
            'status' => $status,
            'sort_order' => self::sort_order_from_request('material_sort_order'),
            'updated_at' => current_time('mysql', true),
        ), array('id' => $material_id));
        if ($written === false) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'material-write-failed', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
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
        $material_exists = $material_id ? $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::materials_table() . " WHERE id = %d", $material_id)) : false;
        if (!$material_exists || !$variant_key || !in_array($status, array('draft', 'live', 'disabled'), true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $now = current_time('mysql', true);
        $variant_data = self::variant_data_from_request($status);
        if (is_wp_error($variant_data)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $written = $wpdb->insert(self::variants_table(), array_merge($variant_data, array(
            'material_id' => $material_id,
            'variant_key' => $variant_key,
            'status' => $status,
            'created_at' => $now,
            'updated_at' => $now,
        )));
        if ($written === false) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'variant-write-failed', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    public static function update_variant() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_update_variant');
        global $wpdb;
        $variant_id = absint($_POST['variant_id'] ?? 0);
        $status = sanitize_key(wp_unslash($_POST['status'] ?? 'draft'));
        $exists = $variant_id ? $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::variants_table() . " WHERE id = %d", $variant_id)) : false;
        if (!$exists || !in_array($status, array('draft', 'live', 'disabled'), true)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $variant_data = self::variant_data_from_request($status);
        if (is_wp_error($variant_data)) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'invalid-variant', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        $variant_data['status'] = $status;
        $variant_data['updated_at'] = current_time('mysql', true);
        if ($wpdb->update(self::variants_table(), $variant_data, array('id' => $variant_id)) === false) {
            wp_safe_redirect(add_query_arg('ew_t17_error', 'variant-write-failed', admin_url('admin.php?page=ew-t17-materials')));
            exit;
        }
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    public static function update_sort_order() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to manage T17 materials.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_update_sort_order');
        global $wpdb;
        $entity = sanitize_key(wp_unslash($_POST['entity'] ?? ''));
        $record_id = absint($_POST['record_id'] ?? 0);
        $return_page = sanitize_key(wp_unslash($_POST['return_page'] ?? 'ew-t17-materials'));
        $allowed_pages = array('ew-t17-materials', 'ew-t17-beads', 'ew-t17-decor');
        if (!in_array($return_page, $allowed_pages, true)) {
            $return_page = 'ew-t17-materials';
        }
        $raw_sort_order = trim((string) wp_unslash($_POST['sort_order'] ?? ''));
        if (!$record_id || !preg_match('/^\d+$/', $raw_sort_order)) {
            wp_safe_redirect(add_query_arg(array('page' => $return_page, 'ew_t17_error' => 'invalid-sort-order'), admin_url('admin.php')));
            exit;
        }
        $table = $entity === 'material' ? self::materials_table() : ($entity === 'variant' ? self::variants_table() : '');
        if (!$table || $wpdb->update($table, array('sort_order' => (int) $raw_sort_order, 'updated_at' => current_time('mysql', true)), array('id' => $record_id), array('%d', '%s'), array('%d')) === false) {
            wp_safe_redirect(add_query_arg(array('page' => $return_page, 'ew_t17_error' => 'sort-order-write-failed'), admin_url('admin.php')));
            exit;
        }
        wp_safe_redirect(add_query_arg(array('page' => $return_page, 'ew_t17_notice' => 'sort-order-saved'), admin_url('admin.php')));
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
        if ($headers !== self::IMPORT_HEADERS && $headers !== self::LEGACY_IMPORT_HEADERS) {
            fclose($handle);
            self::redirect_import(0, 0, 'columns');
        }

        global $wpdb;
        $imported = 0;
        $skipped = 0;
        $csv_rows = array();
        while (($csv_values = fgetcsv($handle)) !== false) {
            $csv_rows[] = $csv_values;
        }
        $preflight = self::preflight_import_csv_rows($csv_rows, $headers);
        if (is_wp_error($preflight)) {
            fclose($handle);
            self::redirect_import(0, count($csv_rows), 'preflight');
        }
        $wpdb->query('START TRANSACTION');
        foreach ($csv_rows as $values) {
            if (count($values) !== count($headers)) {
                $skipped++;
                continue;
            }
            $row = array_combine($headers, array_pad(array_slice($values, 0, count($headers)), count($headers), ''));
            if (!$row) {
                $skipped++;
                continue;
            }
            $material_key = sanitize_key($row['material_key'] ?? '');
            $variant_key = sanitize_key($row['variant_key'] ?? '');
            $component_type = self::component_type($row['component_type'] ?? '');
            if (!$material_key || !$variant_key || !sanitize_text_field($row['name_en'] ?? '') || !in_array($component_type, self::COMPONENT_TYPES, true)) {
                $skipped++;
                continue;
            }
            $validation = self::validate_import_row($row);
            if (is_wp_error($validation)) {
                $skipped++;
                continue;
            }
            $existing_variant = $wpdb->get_row($wpdb->prepare("SELECT id, material_id FROM " . self::variants_table() . " WHERE variant_key = %s", $variant_key), ARRAY_A);
            $existing = $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::materials_table() . " WHERE material_key = %s", $material_key));
            if ($existing_variant && (!$existing || (int) $existing_variant['material_id'] !== (int) $existing)) {
                $skipped++;
                continue;
            }
            $material_status = $validation['material_status'];
            $variant_status = $validation['variant_status'];
            $now = current_time('mysql', true);
            $material_data = array(
                'component_type' => $component_type,
                'library_tab_slug' => self::library_tab_slug($row['library_tab_slug'] ?? '', $component_type),
                'category_slug' => sanitize_key($row['category_slug'] ?? ''),
                'name_en' => sanitize_text_field($row['name_en'] ?? ''),
                'primary_color' => sanitize_key($row['primary_color'] ?? ''),
                'color_tags' => wp_json_encode(self::csv_list($row['color_tags'] ?? '')),
                'intention_tags' => wp_json_encode(self::csv_list($row['intention_tags'] ?? '')),
                'image_url' => esc_url_raw($row['material_image_url'] ?? ''),
                'source_name' => sanitize_text_field($row['source_name'] ?? ''),
                'status' => $material_status,
                'sort_order' => isset($row['material_sort_order']) && is_numeric($row['material_sort_order']) ? (int) $row['material_sort_order'] : 0,
                'updated_at' => $now,
            );
            $created_material = false;
            if ($existing) {
                $material_id = (int) $existing;
                if ($wpdb->update(self::materials_table(), $material_data, array('id' => $material_id)) === false) {
                    $skipped++;
                    continue;
                }
            } else {
                $material_data['material_key'] = $material_key;
                $material_data['created_at'] = $now;
                if ($wpdb->insert(self::materials_table(), $material_data) === false) {
                    $skipped++;
                    continue;
                }
                $material_id = (int) $wpdb->insert_id;
                $created_material = true;
            }
            if (!$material_id) {
                $skipped++;
                continue;
            }
            $variant_data = array(
                'material_id' => $material_id,
                'size_mm' => (float) $row['size_mm'],
                'shape' => sanitize_key($row['shape'] ?? 'round') ?: 'round',
                'price' => (float) $row['price'],
                'occupied_length_mm' => (float) $row['occupied_length_mm'],
                'display_scale' => $validation['display_scale'],
                'image_url' => esc_url_raw($row['variant_image_url'] ?? ''),
                'stock_status' => $validation['stock_status'],
                'stock_quantity' => $validation['stock_quantity'],
                'compatibility' => wp_json_encode(self::csv_list($row['compatibility'] ?? '')),
                'compatible_bead_sizes' => wp_json_encode($validation['compatible_bead_sizes']),
                'orientation_mode' => $validation['orientation_mode'],
                'mirrored_variant_key' => sanitize_key($row['mirrored_variant_key'] ?? ''),
                'allowed_orientations' => wp_json_encode($validation['allowed_orientations']),
                'allowed_positions' => wp_json_encode($validation['allowed_positions']),
                'neighbor_constraints' => wp_json_encode($validation['neighbor_constraints']),
                'status' => $variant_status,
                'sort_order' => isset($row['variant_sort_order']) && is_numeric($row['variant_sort_order']) ? (int) $row['variant_sort_order'] : 0,
                'updated_at' => $now,
            );
            if ($existing_variant) {
                $write_ok = $wpdb->update(self::variants_table(), $variant_data, array('id' => (int) $existing_variant['id'])) !== false;
            } else {
                $variant_data['variant_key'] = $variant_key;
                $variant_data['created_at'] = $now;
                $write_ok = $wpdb->insert(self::variants_table(), $variant_data) !== false;
            }
            if (!$write_ok) {
                if ($created_material) {
                    $wpdb->delete(self::materials_table(), array('id' => $material_id), array('%d'));
                }
                $skipped++;
                continue;
            }
            $imported++;
        }
        fclose($handle);
        if ($skipped > 0) {
            $wpdb->query('ROLLBACK');
            self::redirect_import(0, $skipped, 'preflight');
        }
        $wpdb->query('COMMIT');
        self::redirect_import($imported, $skipped, 'done');
    }

    /**
     * Authenticated integration endpoint for the same CSV catalog contract used
     * by the admin importer. It deliberately accepts only the fixed v3 headers
     * and applies the existing full-batch preflight before any write.
     */
    public static function rest_import_catalog(WP_REST_Request $request) {
        $payload = $request->get_json_params();
        $rows = is_array($payload) ? ($payload['rows'] ?? null) : null;
        if (!is_array($rows) || !$rows) {
            return new WP_Error('ew_t17_import_payload', __('Provide a non-empty rows array.', 'earthward-t17'), array('status' => 400));
        }
        if (count($rows) > 1000) {
            return new WP_Error('ew_t17_import_batch_too_large', __('A T17 catalog import may contain at most 1000 variants.', 'earthward-t17'), array('status' => 400));
        }

        $csv_rows = array();
        foreach ($rows as $row) {
            if (!is_array($row) || array_diff(array_keys($row), self::IMPORT_HEADERS) || array_diff(self::IMPORT_HEADERS, array_keys($row))) {
                return new WP_Error('ew_t17_import_payload_shape', __('Each T17 import row must use the complete v3 catalog contract.', 'earthward-t17'), array('status' => 400));
            }
            $csv_rows[] = array_map(static function ($header) use ($row) {
                return is_scalar($row[$header]) || is_null($row[$header]) ? (string) ($row[$header] ?? '') : '';
            }, self::IMPORT_HEADERS);
        }
        $preflight = self::preflight_import_csv_rows($csv_rows, self::IMPORT_HEADERS);
        if (is_wp_error($preflight)) {
            $preflight->add_data(array('status' => 400));
            return $preflight;
        }

        $result = self::apply_import_rows(self::IMPORT_HEADERS, $csv_rows);
        if (is_wp_error($result)) {
            $result->add_data(array('status' => 500));
            return $result;
        }
        return rest_ensure_response($result);
    }

    /**
     * Writes a preflight-approved batch atomically. This is shared by the
     * authenticated REST integration path and intentionally does not accept
     * any client-provided totals or derived values.
     */
    private static function apply_import_rows($headers, $csv_rows) {
        global $wpdb;
        $imported = 0;
        $wpdb->query('START TRANSACTION');
        foreach ($csv_rows as $values) {
            if (count($values) !== count($headers)) {
                $wpdb->query('ROLLBACK');
                return new WP_Error('ew_t17_import_row_shape', __('An import row does not match the catalog contract.', 'earthward-t17'));
            }
            $row = array_combine($headers, array_pad(array_slice($values, 0, count($headers)), count($headers), ''));
            $material_key = sanitize_key($row['material_key'] ?? '');
            $variant_key = sanitize_key($row['variant_key'] ?? '');
            $component_type = self::component_type($row['component_type'] ?? '');
            $validation = self::validate_import_row($row);
            if (!$row || !$material_key || !$variant_key || !sanitize_text_field($row['name_en'] ?? '') || !in_array($component_type, self::COMPONENT_TYPES, true) || is_wp_error($validation)) {
                $wpdb->query('ROLLBACK');
                return new WP_Error('ew_t17_import_preflight_changed', __('The catalog failed validation before write.', 'earthward-t17'));
            }
            $existing_variant = $wpdb->get_row($wpdb->prepare("SELECT id, material_id FROM " . self::variants_table() . " WHERE variant_key = %s", $variant_key), ARRAY_A);
            $existing_material_id = $wpdb->get_var($wpdb->prepare("SELECT id FROM " . self::materials_table() . " WHERE material_key = %s", $material_key));
            if ($existing_variant && (!$existing_material_id || (int) $existing_variant['material_id'] !== (int) $existing_material_id)) {
                $wpdb->query('ROLLBACK');
                return new WP_Error('ew_t17_import_variant_conflict', sprintf(__('Variant key %s belongs to another material.', 'earthward-t17'), $variant_key));
            }
            $now = current_time('mysql', true);
            $material_data = array(
                'component_type' => $component_type,
                'library_tab_slug' => self::library_tab_slug($row['library_tab_slug'] ?? '', $component_type),
                'category_slug' => sanitize_key($row['category_slug'] ?? ''),
                'name_en' => sanitize_text_field($row['name_en'] ?? ''),
                'primary_color' => sanitize_key($row['primary_color'] ?? ''),
                'color_tags' => wp_json_encode(self::csv_list($row['color_tags'] ?? '')),
                'intention_tags' => wp_json_encode(self::csv_list($row['intention_tags'] ?? '')),
                'image_url' => esc_url_raw($row['material_image_url'] ?? ''),
                'source_name' => sanitize_text_field($row['source_name'] ?? ''),
                'status' => $validation['material_status'],
                'sort_order' => isset($row['material_sort_order']) && is_numeric($row['material_sort_order']) ? (int) $row['material_sort_order'] : 0,
                'updated_at' => $now,
            );
            if ($existing_material_id) {
                $material_id = (int) $existing_material_id;
                if ($wpdb->update(self::materials_table(), $material_data, array('id' => $material_id)) === false) {
                    $wpdb->query('ROLLBACK');
                    return new WP_Error('ew_t17_import_material_write', __('A material could not be updated.', 'earthward-t17'));
                }
            } else {
                $material_data['material_key'] = $material_key;
                $material_data['created_at'] = $now;
                if ($wpdb->insert(self::materials_table(), $material_data) === false) {
                    $wpdb->query('ROLLBACK');
                    return new WP_Error('ew_t17_import_material_write', __('A material could not be created.', 'earthward-t17'));
                }
                $material_id = (int) $wpdb->insert_id;
            }
            $variant_data = array(
                'material_id' => $material_id,
                'size_mm' => (float) $row['size_mm'],
                'shape' => sanitize_key($row['shape'] ?? 'round') ?: 'round',
                'price' => (float) $row['price'],
                'occupied_length_mm' => (float) $row['occupied_length_mm'],
                'display_scale' => $validation['display_scale'],
                'image_url' => esc_url_raw($row['variant_image_url'] ?? ''),
                'stock_status' => $validation['stock_status'],
                'stock_quantity' => $validation['stock_quantity'],
                'compatibility' => wp_json_encode(self::csv_list($row['compatibility'] ?? '')),
                'compatible_bead_sizes' => wp_json_encode($validation['compatible_bead_sizes']),
                'orientation_mode' => $validation['orientation_mode'],
                'mirrored_variant_key' => sanitize_key($row['mirrored_variant_key'] ?? ''),
                'allowed_orientations' => wp_json_encode($validation['allowed_orientations']),
                'allowed_positions' => wp_json_encode($validation['allowed_positions']),
                'neighbor_constraints' => wp_json_encode($validation['neighbor_constraints']),
                'status' => $validation['variant_status'],
                'sort_order' => isset($row['variant_sort_order']) && is_numeric($row['variant_sort_order']) ? (int) $row['variant_sort_order'] : 0,
                'updated_at' => $now,
            );
            $write_ok = $existing_variant
                ? $wpdb->update(self::variants_table(), $variant_data, array('id' => (int) $existing_variant['id'])) !== false
                : $wpdb->insert(self::variants_table(), array_merge($variant_data, array('variant_key' => $variant_key, 'created_at' => $now))) !== false;
            if (!$write_ok) {
                $wpdb->query('ROLLBACK');
                return new WP_Error('ew_t17_import_variant_write', __('A variant could not be written.', 'earthward-t17'));
            }
            $imported++;
        }
        $wpdb->query('COMMIT');
        update_option('ew_t17_price_version', 'linganshi-reference-20260722');
        return array('imported' => $imported, 'skipped' => 0, 'atomic' => true, 'price_version' => 'linganshi-reference-20260722');
    }

    public static function save_settings() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(__('You do not have permission to update T17 settings.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_save_settings');
        update_option('ew_t17_custom_product_id', absint($_POST['custom_product_id'] ?? 0));
        update_option('ew_t17_builder_page_id', absint($_POST['builder_page_id'] ?? 0));
        update_option('ew_t17_price_version', sanitize_text_field(wp_unslash($_POST['price_version'] ?? 'draft')));
        update_option('ew_t17_tray_logo_id', absint($_POST['tray_logo_id'] ?? 0));
        update_option('ew_t17_tray_logo_url', esc_url_raw(wp_unslash($_POST['tray_logo_url'] ?? '')));
        update_option('ew_t17_tray_logo_size_px', max(24, min(160, absint($_POST['tray_logo_size_px'] ?? 54))));
        wp_safe_redirect(admin_url('admin.php?page=ew-t17-materials'));
        exit;
    }

    private static function render_image_fields($prefix, $image_id, $image_url) {
        $id_field = $prefix . '_image_id';
        $url_field = $prefix . '_image_url';
        $preview_id = $prefix . '_image_preview';
        $preview_url = self::image_url((int) $image_id, $image_url);
        ?>
        <tr><th><label for="<?php echo esc_attr($id_field); ?>"><?php esc_html_e('Media Library image', 'earthward-t17'); ?></label></th><td><input type="hidden" name="image_id" id="<?php echo esc_attr($id_field); ?>" value="<?php echo esc_attr($image_id); ?>"><button type="button" class="button ew-t17-select-image" data-image-target="<?php echo esc_attr($id_field); ?>" data-image-url-target="<?php echo esc_attr($url_field); ?>" data-image-preview="<?php echo esc_attr($preview_id); ?>"><?php esc_html_e('Select image', 'earthward-t17'); ?></button> <button type="button" class="button-link-delete ew-t17-clear-image" data-image-target="<?php echo esc_attr($id_field); ?>" data-image-url-target="<?php echo esc_attr($url_field); ?>" data-image-preview="<?php echo esc_attr($preview_id); ?>"><?php esc_html_e('Clear image', 'earthward-t17'); ?></button><br><img id="<?php echo esc_attr($preview_id); ?>" src="<?php echo esc_url($preview_url); ?>" alt="" style="max-width: 120px; height: auto; margin-top: 8px;<?php echo $preview_url ? '' : ' display: none;'; ?>"></td></tr>
        <tr><th><label for="<?php echo esc_attr($url_field); ?>"><?php esc_html_e('Image URL', 'earthward-t17'); ?></label></th><td><input name="image_url" id="<?php echo esc_attr($url_field); ?>" class="regular-text" value="<?php echo esc_attr($image_url); ?>" placeholder="https://..."><p class="description"><?php esc_html_e('Use an external URL only when the image is not in the Media Library.', 'earthward-t17'); ?></p></td></tr>
        <?php
    }

    private static function render_orientation_fields($prefix, $variant) {
        $variant = is_array($variant) ? $variant : array();
        $mode = self::orientation_mode($variant['orientation_mode'] ?? 'none');
        $allowed_orientations = implode(', ', self::orientation_list($variant['allowed_orientations'] ?? '', $mode));
        $allowed_positions = implode(', ', self::position_list($variant['allowed_positions'] ?? ''));
        $constraints = self::neighbor_constraints($variant['neighbor_constraints'] ?? '');
        ?>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_orientation_mode">Orientation mode</label></th><td><select name="orientation_mode" id="<?php echo esc_attr($prefix); ?>_orientation_mode"><?php foreach (self::ORIENTATION_MODES as $candidate) : ?><option value="<?php echo esc_attr($candidate); ?>" <?php selected($mode, $candidate); ?>><?php echo esc_html($candidate); ?></option><?php endforeach; ?></select><p class="description">Physical left/right parts must use separate Variant IDs. Do not use CSS mirroring for inventory materials.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_mirrored_variant_key">Opposite physical Variant ID</label></th><td><input name="mirrored_variant_key" id="<?php echo esc_attr($prefix); ?>_mirrored_variant_key" class="regular-text" value="<?php echo esc_attr($variant['mirrored_variant_key'] ?? ''); ?>" placeholder="charm-moon-right"><p class="description">Optional reference to the separately stocked opposite-hand physical part.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_allowed_orientations">Allowed orientations</label></th><td><input name="allowed_orientations" id="<?php echo esc_attr($prefix); ?>_allowed_orientations" class="regular-text" value="<?php echo esc_attr($allowed_orientations); ?>" placeholder="left, right"><p class="description">Comma separated. Defaults are applied from the selected mode when empty.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_allowed_positions">Allowed positions</label></th><td><input name="allowed_positions" id="<?php echo esc_attr($prefix); ?>_allowed_positions" class="regular-text" value="<?php echo esc_attr($allowed_positions); ?>" placeholder="any, start, end, interior"><p class="description">Comma separated; leave empty for any position.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_neighbor_constraints">Neighbor constraints</label></th><td><textarea name="neighbor_constraints" id="<?php echo esc_attr($prefix); ?>_neighbor_constraints" class="large-text code" rows="3" placeholder='{"previous_component_types":["crystal"],"next_component_types":["crystal"]}'><?php echo esc_textarea(wp_json_encode($constraints)); ?></textarea><p class="description">Optional JSON using previous/next component types or variant IDs.</p></td></tr>
        <?php
    }

    private static function render_variant_display_fields($prefix, $variant) {
        $variant = is_array($variant) ? $variant : array();
        $display_scale = isset($variant['display_scale']) ? (float) $variant['display_scale'] : 1;
        $compatible_bead_sizes = implode(', ', self::decode_numeric_list($variant['compatible_bead_sizes'] ?? ''));
        $sort_order = isset($variant['sort_order']) ? (int) $variant['sort_order'] : 0;
        ?>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_display_scale">Display scale</label></th><td><input name="display_scale" id="<?php echo esc_attr($prefix); ?>_display_scale" type="number" min="0.01" max="10" step="0.01" value="<?php echo esc_attr($display_scale); ?>"><p class="description">2D editor scale multiplier. Use 1 for the reference size; larger beads should use a larger value.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_compatible_bead_sizes">Compatible crystal sizes</label></th><td><input name="compatible_bead_sizes" id="<?php echo esc_attr($prefix); ?>_compatible_bead_sizes" class="regular-text" value="<?php echo esc_attr($compatible_bead_sizes); ?>" placeholder="6, 8, 10, 12"><p class="description">For accessories: permitted adjacent crystal diameters in mm. Leave empty when not constrained.</p></td></tr>
        <tr><th><label for="<?php echo esc_attr($prefix); ?>_sort_order">Variant sort order</label></th><td><input name="variant_sort_order" id="<?php echo esc_attr($prefix); ?>_sort_order" type="number" min="0" step="1" value="<?php echo esc_attr($sort_order); ?>"></td></tr>
        <?php
    }

    private static function variant_data_from_request($status = 'draft') {
        $validation = self::validate_import_row(array(
            'size_mm' => $_POST['size_mm'] ?? '',
            'price' => $_POST['price'] ?? '',
            'occupied_length_mm' => $_POST['occupied_length_mm'] ?? '',
            'material_status' => 'draft',
            'variant_status' => $status,
            'stock_status' => $_POST['stock_status'] ?? '',
            'stock_quantity' => $_POST['stock_quantity'] ?? '',
            'orientation_mode' => $_POST['orientation_mode'] ?? '',
            'allowed_orientations' => $_POST['allowed_orientations'] ?? '',
            'allowed_positions' => $_POST['allowed_positions'] ?? '',
            'neighbor_constraints' => $_POST['neighbor_constraints'] ?? '',
        ));
        if (is_wp_error($validation)) {
            return $validation;
        }
        $display_scale = trim((string) wp_unslash($_POST['display_scale'] ?? ''));
        if ($display_scale === '') {
            $display_scale = '1';
        }
        if (!is_numeric($display_scale) || (float) $display_scale <= 0 || (float) $display_scale > 10) {
            return new WP_Error('ew_t17_invalid_display_scale');
        }
        $compatible_bead_sizes = self::numeric_list($_POST['compatible_bead_sizes'] ?? '');
        if (is_wp_error($compatible_bead_sizes)) {
            return $compatible_bead_sizes;
        }
        return array(
            'size_mm' => (float) wp_unslash($_POST['size_mm']),
            'shape' => sanitize_key(wp_unslash($_POST['shape'] ?? 'round')) ?: 'round',
            'price' => (float) wp_unslash($_POST['price']),
            'occupied_length_mm' => (float) wp_unslash($_POST['occupied_length_mm']),
            'display_scale' => (float) $display_scale,
            'image_id' => self::image_id($_POST['image_id'] ?? 0),
            'image_url' => esc_url_raw(wp_unslash($_POST['image_url'] ?? '')),
            'stock_status' => $validation['stock_status'],
            'stock_quantity' => $validation['stock_quantity'],
            'compatibility' => wp_json_encode(self::csv_list($_POST['compatibility'] ?? '')),
            'compatible_bead_sizes' => wp_json_encode($compatible_bead_sizes),
            'sort_order' => self::sort_order_from_request('variant_sort_order'),
            'orientation_mode' => $validation['orientation_mode'],
            'mirrored_variant_key' => sanitize_key(wp_unslash($_POST['mirrored_variant_key'] ?? '')),
            'allowed_orientations' => wp_json_encode($validation['allowed_orientations']),
            'allowed_positions' => wp_json_encode($validation['allowed_positions']),
            'neighbor_constraints' => wp_json_encode($validation['neighbor_constraints']),
        );
    }

    private static function sort_order_from_request($field) {
        $raw = trim((string) wp_unslash($_POST[$field] ?? '0'));
        return preg_match('/^\d+$/', $raw) ? (int) $raw : 0;
    }

    private static function image_id($value) {
        $attachment_id = absint($value);
        return $attachment_id && wp_attachment_is_image($attachment_id) ? $attachment_id : 0;
    }

    private static function preflight_import_csv_rows($rows, $headers) {
        $variants = array();
        foreach ($rows as $offset => $values) {
            $row_number = $offset + 2;
            if (count($values) !== count($headers)) {
                return new WP_Error('ew_t17_import_column_count', sprintf(__('T17 import row %d has an incorrect column count.', 'earthward-t17'), $row_number));
            }
            $row = array_combine($headers, $values);
            if (!is_array($row)) {
                return new WP_Error('ew_t17_import_row_shape', sprintf(__('T17 import row %d could not be read.', 'earthward-t17'), $row_number));
            }
            $material_key = sanitize_key($row['material_key'] ?? '');
            $variant_key = sanitize_key($row['variant_key'] ?? '');
            $component_type = self::component_type($row['component_type'] ?? '');
            if (!$material_key || !$variant_key || !sanitize_text_field($row['name_en'] ?? '') || !in_array($component_type, self::COMPONENT_TYPES, true)) {
                return new WP_Error('ew_t17_import_required_fields', sprintf(__('T17 import row %d is missing a required catalog field.', 'earthward-t17'), $row_number));
            }
            if (isset($variants[$variant_key])) {
                return new WP_Error('ew_t17_import_duplicate_variant', sprintf(__('T17 import row %d duplicates variant %s.', 'earthward-t17'), $row_number, $variant_key));
            }
            $validation = self::validate_import_row($row);
            if (is_wp_error($validation)) {
                return new WP_Error('ew_t17_import_invalid_row', sprintf(__('T17 import row %d is invalid: %s.', 'earthward-t17'), $row_number, $validation->get_error_message()));
            }
            if ($component_type !== 'accessory' && $validation['orientation_mode'] !== 'none') {
                return new WP_Error('ew_t17_import_directional_component', sprintf(__('T17 import row %d uses directional rules outside Accessories.', 'earthward-t17'), $row_number));
            }
            $variants[$variant_key] = array(
                'component_type' => $component_type,
                'orientation_mode' => $validation['orientation_mode'],
                'mirrored_variant_key' => sanitize_key($row['mirrored_variant_key'] ?? ''),
            );
        }
        foreach ($variants as $variant_key => $variant) {
            if (!in_array($variant['orientation_mode'], array('fixed_left', 'fixed_right'), true)) {
                continue;
            }
            $other_key = $variant['mirrored_variant_key'];
            $expected = $variant['orientation_mode'] === 'fixed_left' ? 'fixed_right' : 'fixed_left';
            if ($other_key === '' || !isset($variants[$other_key]) || $variants[$other_key]['component_type'] !== 'accessory' || $variants[$other_key]['orientation_mode'] !== $expected || $variants[$other_key]['mirrored_variant_key'] !== $variant_key) {
                return new WP_Error('ew_t17_import_mirror_pair', sprintf(__('T17 import directional variant %s is missing its reciprocal physical partner.', 'earthward-t17'), $variant_key));
            }
        }
        return true;
    }

    private static function validate_import_row($row) {
        $required_numeric = array('size_mm', 'price', 'occupied_length_mm');
        foreach ($required_numeric as $field) {
            $value = trim((string) ($row[$field] ?? ''));
            if ($value === '' || !is_numeric($value) || (float) $value < 0) {
                return new WP_Error('ew_t17_invalid_import_numeric', $field);
            }
        }
        $material_status_raw = trim((string) ($row['material_status'] ?? ''));
        $variant_status_raw = trim((string) ($row['variant_status'] ?? ''));
        $material_status = $material_status_raw === '' ? 'draft' : sanitize_key($material_status_raw);
        $variant_status = $variant_status_raw === '' ? 'draft' : sanitize_key($variant_status_raw);
        if (!in_array($material_status, array('draft', 'live'), true) || !in_array($variant_status, array('draft', 'live', 'disabled'), true)) {
            return new WP_Error('ew_t17_invalid_import_status', 'status');
        }
        if ($variant_status === 'live' && ((float) $row['size_mm'] <= 0 || (float) $row['price'] <= 0 || (float) $row['occupied_length_mm'] <= 0)) {
            return new WP_Error('ew_t17_live_variant_requires_positive_values', 'live_variant_values');
        }
        $display_scale_raw = trim((string) ($row['display_scale'] ?? ''));
        $display_scale = $display_scale_raw === '' ? 1 : (is_numeric($display_scale_raw) ? (float) $display_scale_raw : 0);
        if ($display_scale <= 0 || $display_scale > 10) {
            return new WP_Error('ew_t17_invalid_import_display_scale', 'display_scale');
        }
        $compatible_bead_sizes = self::numeric_list($row['compatible_bead_sizes'] ?? '');
        if (is_wp_error($compatible_bead_sizes)) {
            return new WP_Error('ew_t17_invalid_import_compatible_bead_sizes', 'compatible_bead_sizes');
        }
        $stock_status_raw = trim((string) ($row['stock_status'] ?? ''));
        $stock_status = $stock_status_raw === '' ? 'instock' : sanitize_key($stock_status_raw);
        if (!in_array($stock_status, self::STOCK_STATUSES, true)) {
            return new WP_Error('ew_t17_invalid_import_stock', 'stock_status');
        }
        $stock_quantity_raw = trim((string) ($row['stock_quantity'] ?? ''));
        if ($stock_quantity_raw !== '' && (!preg_match('/^\\d+$/', $stock_quantity_raw))) {
            return new WP_Error('ew_t17_invalid_import_stock_quantity', 'stock_quantity');
        }
        $orientation_raw = trim((string) ($row['orientation_mode'] ?? 'none'));
        $orientation_mode = self::orientation_mode($orientation_raw);
        if ($orientation_raw !== '' && $orientation_mode !== str_replace('-', '_', sanitize_key($orientation_raw))) {
            return new WP_Error('ew_t17_invalid_import_orientation', 'orientation_mode');
        }
        $orientations = self::validated_orientation_list($row['allowed_orientations'] ?? '', $orientation_mode);
        $positions = self::validated_position_list($row['allowed_positions'] ?? '');
        $constraints = self::validated_neighbor_constraints($row['neighbor_constraints'] ?? '');
        if (is_wp_error($orientations) || is_wp_error($positions) || is_wp_error($constraints)) {
            return new WP_Error('ew_t17_invalid_import_direction_rules');
        }
        return array(
            'material_status' => $material_status,
            'variant_status' => $variant_status,
            'stock_status' => $stock_status,
            'stock_quantity' => $stock_quantity_raw === '' ? null : (int) $stock_quantity_raw,
            'display_scale' => $display_scale,
            'compatible_bead_sizes' => $compatible_bead_sizes,
            'orientation_mode' => $orientation_mode,
            'allowed_orientations' => $orientations,
            'allowed_positions' => $positions,
            'neighbor_constraints' => $constraints,
        );
    }

    private static function validate_live_mirror_pair($row) {
        $mode = self::orientation_mode($row['orientation_mode'] ?? 'none');
        if (!in_array($mode, array('fixed_left', 'fixed_right'), true)) {
            return true;
        }
        $mirror_key = sanitize_key((string) ($row['mirrored_variant_key'] ?? ''));
        if ($mirror_key === '') {
            return new WP_Error('ew_t17_missing_mirrored_variant', __('A fixed directional accessory variant must reference its opposite physical variant.', 'earthward-t17'), array('status' => 400));
        }
        global $wpdb;
        $counterpart = $wpdb->get_row($wpdb->prepare(
            "SELECT v.variant_key, v.orientation_mode, v.mirrored_variant_key, v.status, m.component_type, m.status AS material_status FROM " . self::variants_table() . " v INNER JOIN " . self::materials_table() . " m ON m.id = v.material_id WHERE v.variant_key = %s",
            $mirror_key
        ), ARRAY_A);
        $expected_mode = $mode === 'fixed_left' ? 'fixed_right' : 'fixed_left';
        if (!$counterpart || $counterpart['status'] !== 'live' || $counterpart['material_status'] !== 'live' || self::component_type($counterpart['component_type'] ?? '') !== 'accessory' || self::orientation_mode($counterpart['orientation_mode'] ?? 'none') !== $expected_mode || sanitize_key((string) ($counterpart['mirrored_variant_key'] ?? '')) !== sanitize_key((string) ($row['variant_key'] ?? ''))) {
            return new WP_Error('ew_t17_invalid_mirrored_variant', __('The opposite physical directional accessory variant is unavailable or not reciprocally configured.', 'earthward-t17'), array('status' => 400));
        }
        return true;
    }

    private static function strict_list($value) {
        if (is_array($value)) {
            $items = $value;
        } else {
            $raw = trim((string) wp_unslash($value));
            if ($raw === '') {
                return array();
            }
            if ($raw[0] === '[' || $raw[0] === '{') {
                $items = json_decode($raw, true);
                if (!is_array($items) || !self::is_list_array($items)) {
                    return new WP_Error('ew_t17_invalid_list');
                }
            } else {
                $items = explode(',', $raw);
            }
        }
        $result = array();
        foreach ($items as $item) {
            if (!is_scalar($item)) {
                return new WP_Error('ew_t17_invalid_list');
            }
            $item = sanitize_key((string) $item);
            if ($item === '') {
                return new WP_Error('ew_t17_invalid_list');
            }
            $result[] = $item;
        }
        return array_values(array_unique($result));
    }

    private static function validated_orientation_list($value, $mode) {
        $raw = is_array($value) ? null : trim((string) wp_unslash($value));
        $list = self::strict_list($value);
        if (is_wp_error($list)) {
            return $list;
        }
        $defaults = self::orientation_list('', $mode);
        if (!$list) {
            return $raw === '' || $raw === null ? $defaults : new WP_Error('ew_t17_invalid_orientation_list');
        }
        if (array_diff($list, $defaults)) {
            return new WP_Error('ew_t17_invalid_orientation_list');
        }
        return $list;
    }

    private static function validated_position_list($value) {
        $raw = is_array($value) ? null : trim((string) wp_unslash($value));
        $list = self::strict_list($value);
        if (is_wp_error($list)) {
            return $list;
        }
        if (!$list) {
            return $raw === '' || $raw === null ? array() : new WP_Error('ew_t17_invalid_position_list');
        }
        if (array_diff($list, self::POSITION_TYPES) || (in_array('any', $list, true) && count($list) !== 1)) {
            return new WP_Error('ew_t17_invalid_position_list');
        }
        return $list;
    }

    private static function validated_neighbor_constraints($value) {
        $raw = trim((string) wp_unslash($value));
        if ($raw === '') {
            return array();
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded) || self::is_list_array($decoded) || !$decoded) {
            return new WP_Error('ew_t17_invalid_neighbor_constraints');
        }
        $allowed_keys = array('previous_component_types', 'next_component_types', 'previous_variant_keys', 'next_variant_keys');
        if (array_diff(array_keys($decoded), $allowed_keys)) {
            return new WP_Error('ew_t17_invalid_neighbor_constraints');
        }
        $constraints = array();
        foreach ($decoded as $key => $values) {
            $list = self::strict_list($values);
            if (is_wp_error($list) || !$list) {
                return new WP_Error('ew_t17_invalid_neighbor_constraints');
            }
            $constraints[$key] = $list;
        }
        return $constraints;
    }

    private static function validated_direction_rules($row) {
        $orientation_raw = trim((string) ($row['orientation_mode'] ?? ''));
        $mode = self::orientation_mode($orientation_raw);
        if ($orientation_raw !== '' && $mode !== str_replace('-', '_', sanitize_key($orientation_raw))) {
            return new WP_Error('ew_t17_invalid_orientation_mode');
        }
        $orientations = self::validated_orientation_list($row['allowed_orientations'] ?? '', $mode);
        $positions = self::validated_position_list($row['allowed_positions'] ?? '');
        $constraints = self::validated_neighbor_constraints($row['neighbor_constraints'] ?? '');
        if (is_wp_error($orientations) || is_wp_error($positions) || is_wp_error($constraints)) {
            return new WP_Error('ew_t17_invalid_direction_rules');
        }
        return array(
            'orientation_mode' => $mode,
            'allowed_orientations' => $orientations,
            'allowed_positions' => $positions,
            'neighbor_constraints' => $constraints,
        );
    }

    private static function is_list_array($value) {
        if (!is_array($value)) {
            return false;
        }
        if ($value === array()) {
            return true;
        }
        return array_keys($value) === range(0, count($value) - 1);
    }

    private static function orientation_mode($value) {
        $mode = str_replace('-', '_', sanitize_key(wp_unslash($value)));
        return in_array($mode, self::ORIENTATION_MODES, true) ? $mode : 'none';
    }

    private static function orientation_list($value, $mode = 'none') {
        $mode = self::orientation_mode($mode);
        $list = self::decode_list($value);
        if (!$list && is_string($value) && trim($value) !== '') {
            $list = self::csv_list($value);
        }
        $list = array_values(array_unique(array_intersect(array_filter(array_map('sanitize_key', $list)), self::ORIENTATION_VALUES)));
        if ($mode === 'none') {
            return array('none');
        }
        if ($mode === 'fixed_left') {
            return array('left');
        }
        if ($mode === 'fixed_right') {
            return array('right');
        }
        if ($mode === 'mirrorable') {
            $list = array_values(array_intersect($list, array('left', 'right')));
            return $list ?: array('left', 'right');
        }
        if ($mode === 'rotatable') {
            $list = array_values(array_intersect($list, array('rotate_0', 'rotate_90', 'rotate_180', 'rotate_270')));
            return $list ?: array('rotate_0', 'rotate_90', 'rotate_180', 'rotate_270');
        }
        if (in_array($mode, array('tangent', 'radial_out', 'radial_in'), true)) {
            return array('none');
        }
        return array('none');
    }

    private static function position_list($value) {
        $list = self::decode_list($value);
        if (!$list && is_string($value) && trim($value) !== '') {
            $list = self::csv_list($value);
        }
        $list = array_values(array_unique(array_filter(array_map('sanitize_key', $list))));
        return array_values(array_intersect($list, self::POSITION_TYPES));
    }

    private static function neighbor_constraints($value) {
        $decoded = is_array($value) ? $value : json_decode((string) wp_unslash($value), true);
        if (!is_array($decoded)) {
            return array();
        }
        $allowed_keys = array('previous_component_types', 'next_component_types', 'previous_variant_keys', 'next_variant_keys');
        $constraints = array();
        foreach ($allowed_keys as $key) {
            if (!isset($decoded[$key])) {
                continue;
            }
            $values = is_array($decoded[$key]) ? $decoded[$key] : explode(',', (string) $decoded[$key]);
            $values = array_values(array_unique(array_filter(array_map('sanitize_key', $values))));
            if ($values) {
                $constraints[$key] = $values;
            }
        }
        return $constraints;
    }

    private static function requested_orientation($item, $row) {
        $mode = self::orientation_mode($row['orientation_mode'] ?? 'none');
        $allowed = self::orientation_list($row['allowed_orientations'] ?? '', $mode);
        $requested = isset($item['orientation']) ? sanitize_key((string) $item['orientation']) : $allowed[0];
        if (!in_array($requested, $allowed, true)) {
            return new WP_Error('ew_t17_invalid_orientation', sprintf(__('%s does not support the requested orientation.', 'earthward-t17'), $row['name_en']), array('status' => 400));
        }
        return $requested;
    }

    private static function position_is_allowed($row, $position, $sequence_count) {
        $allowed = self::position_list($row['allowed_positions'] ?? '');
        if (!$allowed || in_array('any', $allowed, true)) {
            return true;
        }
        $positions = array();
        if ($position === 0) {
            $positions[] = 'start';
        }
        if ($position === $sequence_count - 1) {
            $positions[] = 'end';
        }
        if ($position > 0 && $position < $sequence_count - 1) {
            $positions[] = 'interior';
        }
        return (bool) array_intersect($allowed, $positions);
    }

    private static function neighbors_are_allowed($row, $previous, $next) {
        $constraints = self::neighbor_constraints($row['neighbor_constraints'] ?? '');
        foreach (array('previous', 'next') as $side) {
            $neighbor = $side === 'previous' ? $previous : $next;
            $component_key = $side . '_component_types';
            $variant_key = $side . '_variant_keys';
            if (!empty($constraints[$component_key]) && (!$neighbor || !in_array($neighbor['component_type'], $constraints[$component_key], true))) {
                return false;
            }
            if (!empty($constraints[$variant_key]) && (!$neighbor || !in_array($neighbor['variant_key'], $constraints[$variant_key], true))) {
                return false;
            }
        }
        return true;
    }

    private static function neighbor_bead_sizes_are_compatible($row, $previous, $next) {
        $allowed_sizes = self::decode_numeric_list($row['compatible_bead_sizes'] ?? '');
        if (!$allowed_sizes) {
            return true;
        }

        foreach (array($previous, $next) as $neighbor) {
            if (!$neighbor || self::component_type($neighbor['component_type'] ?? '') !== 'crystal') {
                continue;
            }
            $size = isset($neighbor['size_mm']) ? (float) $neighbor['size_mm'] : 0;
            if ($size > 0 && !in_array($size, $allowed_sizes, true)) {
                return false;
            }
        }
        return true;
    }

    private static function present_variant($variant) {
        return array(
            'id' => $variant['variant_key'],
            'size_mm' => (float) $variant['size_mm'],
            'shape' => $variant['shape'],
            'price' => (float) $variant['price'],
            'occupied_length_mm' => (float) $variant['occupied_length_mm'],
            'display_scale' => (float) ($variant['display_scale'] ?? 1),
            'image_url' => self::image_url((int) $variant['image_id'], $variant['image_url']),
            'stock_status' => $variant['stock_status'],
            'stock_quantity' => is_null($variant['stock_quantity']) ? null : (int) $variant['stock_quantity'],
            'compatibility' => self::decode_list($variant['compatibility']),
            'compatible_bead_sizes' => self::decode_numeric_list($variant['compatible_bead_sizes'] ?? ''),
            'sort_order' => (int) ($variant['sort_order'] ?? 0),
            'orientation_mode' => self::orientation_mode($variant['orientation_mode'] ?? 'none'),
            'layout_orientation' => in_array(self::orientation_mode($variant['orientation_mode'] ?? 'none'), array('tangent', 'radial_out', 'radial_in'), true) ? self::orientation_mode($variant['orientation_mode'] ?? 'none') : 'fixed',
            'mirrored_variant_key' => $variant['mirrored_variant_key'] ?? '',
            'allowed_orientations' => self::orientation_list($variant['allowed_orientations'] ?? '', $variant['orientation_mode'] ?? 'none'),
            'allowed_positions' => self::position_list($variant['allowed_positions'] ?? ''),
            'neighbor_constraints' => self::neighbor_constraints($variant['neighbor_constraints'] ?? ''),
        );
    }

    private static function present_material($material, $variants) {
        return array(
            'id' => (int) $material['id'],
            'material_key' => $material['material_key'],
            'component_type' => self::component_type($material['component_type']),
            'library_tab_slug' => self::library_tab_slug($material['library_tab_slug'] ?? '', $material['component_type'] ?? 'crystal'),
            'category_slug' => $material['category_slug'] ?? '',
            'name_en' => $material['name_en'],
            'primary_color' => $material['primary_color'],
            'color_tags' => self::decode_list($material['color_tags']),
            'intention_tags' => self::decode_list($material['intention_tags']),
            'image_url' => self::image_url((int) $material['image_id'], $material['image_url']),
            'sort_order' => (int) ($material['sort_order'] ?? 0),
            'variants' => $variants,
        );
    }

    private static function image_url($attachment_id, $fallback) {
        return $attachment_id ? (wp_get_attachment_image_url($attachment_id, 'medium_large') ?: $fallback) : $fallback;
    }

    private static function decode_list($value) {
        $decoded = json_decode((string) $value, true);
        return is_array($decoded) ? $decoded : array();
    }

    private static function decode_numeric_list($value) {
        $decoded = self::decode_list($value);
        $numbers = array();
        foreach ($decoded as $item) {
            if (is_numeric($item) && (float) $item > 0) {
                $numbers[] = (float) $item;
            }
        }
        return array_values(array_unique($numbers, SORT_REGULAR));
    }

    private static function numeric_list($value) {
        $raw = trim((string) wp_unslash($value));
        if ($raw === '') {
            return array();
        }
        $items = explode(',', $raw);
        $numbers = array();
        foreach ($items as $item) {
            $item = trim($item);
            if (!is_numeric($item) || (float) $item <= 0 || (float) $item > 100) {
                return new WP_Error('ew_t17_invalid_compatible_bead_sizes');
            }
            $numbers[] = (float) $item;
        }
        return array_values(array_unique($numbers, SORT_REGULAR));
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
        if (sanitize_key($_GET['ew_t17_notice'] ?? '') === 'sort-order-saved') {
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Sort order saved.', 'earthward-t17') . '</p></div>';
        }
    }
}
