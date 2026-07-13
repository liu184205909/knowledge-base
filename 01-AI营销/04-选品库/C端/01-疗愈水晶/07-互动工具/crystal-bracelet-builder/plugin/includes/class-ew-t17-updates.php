<?php

defined('ABSPATH') || exit;

/**
 * Integrates a trusted EarthWard metadata endpoint with WordPress's plugin update UI.
 */
final class EW_T17_Updates {
    const CACHE_TTL = 21600;

    private static $metadata = null;

    public static function init() {
        add_filter('pre_set_site_transient_update_plugins', array(__CLASS__, 'filter_update_transient'));
        add_filter('plugins_api', array(__CLASS__, 'filter_plugin_information'), 20, 3);
        add_action('admin_menu', array(__CLASS__, 'register_admin_page'));
        add_action('admin_post_ew_t17_publish_release', array(__CLASS__, 'publish_release'));
    }

    public static function filter_update_transient($transient) {
        $plugin = plugin_basename(EW_T17_FILE);

        if (!is_object($transient) || empty($transient->checked[$plugin])) {
            return $transient;
        }

        $metadata = self::get_metadata();
        if (!$metadata) {
            return $transient;
        }

        if (!isset($transient->response) || !is_array($transient->response)) {
            $transient->response = array();
        }

        if (version_compare($metadata['version'], EW_T17_VERSION, '>')) {
            $transient->response[$plugin] = (object) array(
                'id' => self::slug(),
                'slug' => self::slug(),
                'plugin' => $plugin,
                'new_version' => $metadata['version'],
                'url' => $metadata['url'],
                'package' => $metadata['package'],
                'requires' => $metadata['requires'],
                'requires_php' => $metadata['requires_php'],
                'tested' => $metadata['tested'],
            );
        } else {
            unset($transient->response[$plugin]);
        }

        return $transient;
    }

    public static function filter_plugin_information($result, $action, $args) {
        if ('plugin_information' !== $action || !is_object($args) || empty($args->slug) || self::slug() !== $args->slug) {
            return $result;
        }

        $metadata = self::get_metadata();
        if (!$metadata) {
            return $result;
        }

        return (object) array(
            'name' => 'EarthWard T17 Bracelet Builder',
            'slug' => self::slug(),
            'version' => $metadata['version'],
            'homepage' => $metadata['url'],
            'requires' => $metadata['requires'],
            'requires_php' => $metadata['requires_php'],
            'tested' => $metadata['tested'],
            'last_updated' => $metadata['last_updated'],
            'sections' => $metadata['sections'],
            'download_link' => $metadata['package'],
            'external' => true,
        );
    }

    public static function register_admin_page() {
        add_submenu_page(
            'ew-t17-materials',
            __('T17 Release Updates', 'earthward-t17'),
            __('Release Updates', 'earthward-t17'),
            'update_plugins',
            'ew-t17-releases',
            array(__CLASS__, 'render_admin_page')
        );
    }

    public static function render_admin_page() {
        if (!current_user_can('update_plugins')) {
            return;
        }
        $release = get_option('ew_t17_release_metadata', array());
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('T17 Release Updates', 'earthward-t17'); ?></h1>
            <p><?php esc_html_e('Publish a signed-off plugin ZIP URL here. Installed T17 sites will show the newer version in the normal WordPress Updates screen. This does not enable automatic updates.', 'earthward-t17'); ?></p>
            <p><?php esc_html_e('Upload the release ZIP to the WordPress Media Library first, then paste its HTTPS URL. The ZIP must contain the earthward-t17-bracelet-builder directory at its top level.', 'earthward-t17'); ?></p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <?php wp_nonce_field('ew_t17_publish_release'); ?>
                <input type="hidden" name="action" value="ew_t17_publish_release">
                <table class="form-table"><tbody>
                    <tr><th><label for="ew_t17_release_version">Version</label></th><td><input required name="version" id="ew_t17_release_version" class="regular-text" value="<?php echo esc_attr($release['version'] ?? ''); ?>" placeholder="0.1.8"></td></tr>
                    <tr><th><label for="ew_t17_release_package">ZIP URL</label></th><td><input required type="url" name="package" id="ew_t17_release_package" class="large-text" value="<?php echo esc_attr($release['package'] ?? ''); ?>" placeholder="https://goearthward.com/wp-content/uploads/...zip"></td></tr>
                    <tr><th><label for="ew_t17_release_changelog">Changelog</label></th><td><textarea name="changelog" id="ew_t17_release_changelog" class="large-text" rows="7"><?php echo esc_textarea($release['sections']['changelog'] ?? ''); ?></textarea></td></tr>
                </tbody></table>
                <?php submit_button(__('Publish update metadata', 'earthward-t17')); ?>
            </form>
        </div>
        <?php
    }

    public static function publish_release() {
        if (!current_user_can('update_plugins')) {
            wp_die(__('You do not have permission to publish T17 updates.', 'earthward-t17'));
        }
        check_admin_referer('ew_t17_publish_release');
        $metadata = self::normalize_metadata(array(
            'version' => wp_unslash($_POST['version'] ?? ''),
            'package' => wp_unslash($_POST['package'] ?? ''),
            'url' => admin_url('admin.php?page=ew-t17-releases'),
            'requires' => '6.4',
            'requires_php' => '7.4',
            'tested' => get_bloginfo('version'),
            'last_updated' => current_time('Y-m-d'),
            'sections' => array('changelog' => wp_unslash($_POST['changelog'] ?? '')),
        ));
        if (!$metadata) {
            wp_safe_redirect(add_query_arg('ew_t17_release_error', 'invalid', admin_url('admin.php?page=ew-t17-releases')));
            exit;
        }
        update_option('ew_t17_release_metadata', $metadata, false);
        delete_site_transient('update_plugins');
        self::$metadata = $metadata;
        wp_safe_redirect(add_query_arg('ew_t17_release_updated', '1', admin_url('admin.php?page=ew-t17-releases')));
        exit;
    }

    private static function get_endpoint() {
        $endpoint = defined('EW_T17_UPDATE_ENDPOINT') ? EW_T17_UPDATE_ENDPOINT : '';
        $endpoint = apply_filters('ew_t17_update_endpoint', $endpoint);

        return self::is_https_url($endpoint) ? esc_url_raw($endpoint, array('https')) : '';
    }

    private static function get_metadata() {
        if (null !== self::$metadata) {
            return self::$metadata;
        }

        $local = self::normalize_metadata(get_option('ew_t17_release_metadata', array()));
        if ($local) {
            self::$metadata = $local;
            return self::$metadata;
        }

        $endpoint = self::get_endpoint();
        if (!$endpoint) {
            self::$metadata = false;
            return false;
        }

        $cache_key = 'ew_t17_update_' . substr(md5($endpoint), 0, 16);
        $cached = get_site_transient($cache_key);
        if (is_array($cached)) {
            self::$metadata = $cached;

            return self::$metadata;
        }

        $response = wp_safe_remote_get($endpoint, array(
            'timeout' => 5,
            'redirection' => 2,
            'sslverify' => true,
            'limit_response_size' => 65536,
            'headers' => array('Accept' => 'application/json'),
        ));

        if (is_wp_error($response) || 200 !== wp_remote_retrieve_response_code($response)) {
            self::$metadata = false;

            return false;
        }

        $metadata = self::normalize_metadata(json_decode(wp_remote_retrieve_body($response), true));
        if (!$metadata) {
            self::$metadata = false;

            return false;
        }

        set_site_transient($cache_key, $metadata, self::CACHE_TTL);
        self::$metadata = $metadata;

        return self::$metadata;
    }

    private static function normalize_metadata($metadata) {
        if (!is_array($metadata)) {
            return false;
        }

        $version = self::version_string(isset($metadata['version']) ? $metadata['version'] : '');
        $package = isset($metadata['package']) ? $metadata['package'] : '';
        if (!$version || !self::is_https_url($package)) {
            return false;
        }

        $sections = array();
        if (!empty($metadata['sections']) && is_array($metadata['sections'])) {
            foreach ($metadata['sections'] as $name => $content) {
                $name = sanitize_key($name);
                if ($name && is_scalar($content)) {
                    $sections[$name] = wp_kses_post(substr((string) $content, 0, 16384));
                }
            }
        }

        return array(
            'version' => $version,
            'package' => esc_url_raw($package, array('https')),
            'url' => self::is_https_url(isset($metadata['url']) ? $metadata['url'] : '') ? esc_url_raw($metadata['url'], array('https')) : '',
            'requires' => self::version_string(isset($metadata['requires']) ? $metadata['requires'] : ''),
            'requires_php' => self::version_string(isset($metadata['requires_php']) ? $metadata['requires_php'] : ''),
            'tested' => self::version_string(isset($metadata['tested']) ? $metadata['tested'] : ''),
            'last_updated' => substr(sanitize_text_field(isset($metadata['last_updated']) ? $metadata['last_updated'] : ''), 0, 100),
            'sections' => $sections,
        );
    }

    private static function is_https_url($url) {
        if (!is_string($url) || '' === trim($url)) {
            return false;
        }

        $parts = wp_parse_url($url);

        return is_array($parts)
            && isset($parts['scheme'], $parts['host'])
            && 'https' === strtolower($parts['scheme'])
            && '' !== $parts['host']
            && empty($parts['user'])
            && empty($parts['pass']);
    }

    private static function version_string($value) {
        $value = trim(sanitize_text_field((string) $value));

        return preg_match('/^[0-9][0-9A-Za-z._+-]{0,99}$/', $value) ? $value : '';
    }

    private static function slug() {
        return 'earthward-t17-bracelet-builder';
    }
}
