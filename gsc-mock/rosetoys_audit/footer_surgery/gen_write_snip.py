# -*- coding: utf-8 -*-
# 生成写回 snippet payload（read+write 双路由）
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r'D:/Code/knowledge-base/gsc-mock/rosetoys_audit/footer_surgery/'

php = r"""add_action('rest_api_init', function() {
  register_rest_route('fsurgery/v1', '/read', array(
    'methods' => 'GET',
    'permission_callback' => function() { return current_user_can('manage_options'); },
    'callback' => function($req) {
      $out = array();
      $pid = intval($req->get_param('post'));
      if ($pid) {
        $out['meta'] = array();
        foreach (get_post_meta($pid) as $k => $v) { $out['meta'][$k] = maybe_unserialize($v[0]); }
        $out['post'] = array('post_type' => get_post_type($pid), 'status' => get_post_status($pid));
      }
      $opt = get_option('xts-woodmart-options');
      if (is_array($opt)) {
        $out['xts_footer'] = array();
        foreach ($opt as $k => $v) { if (preg_match('/footer|prefooter/i', $k)) $out['xts_footer'][$k] = $v; }
      }
      return $out;
    }
  ));
  register_rest_route('fsurgery/v1', '/write', array(
    'methods' => 'POST',
    'permission_callback' => function() { return current_user_can('manage_options'); },
    'callback' => function($req) {
      $out = array('steps' => array());
      $b = $req->get_json_params();
      if (!empty($b['opt'])) {
        $opt = get_option('xts-woodmart-options');
        $before = array();
        foreach ($b['opt'] as $k => $v) { $before[$k] = isset($opt[$k]) ? $opt[$k] : null; $opt[$k] = $v; }
        $ok = update_option('xts-woodmart-options', $opt);
        $after = get_option('xts-woodmart-options');
        $out['steps']['option'] = array('ok' => (bool)$ok, 'before' => $before, 'after_keys' => array('prefooter_content_type' => isset($after['prefooter_content_type']) ? $after['prefooter_content_type'] : null, 'prefooter_html_block' => isset($after['prefooter_html_block']) ? $after['prefooter_html_block'] : null, 'footer_html_block' => isset($after['footer_html_block']) ? $after['footer_html_block'] : null));
      }
      if (!empty($b['posts'])) {
        foreach ($b['posts'] as $pid => $ops) {
          $pid = intval($pid);
          if (!empty($ops['elementor_data'])) {
            $r1 = update_post_meta($pid, '_elementor_data', wp_slash($ops['elementor_data']));
            delete_post_meta($pid, '_elementor_element_cache');
            $chk = get_post_meta($pid, '_elementor_data', true);
            $out['steps']['post_' . $pid . '_data'] = array('ok' => (bool)$r1, 'len_in' => strlen($ops['elementor_data']), 'len_stored' => strlen($chk));
          }
          if (isset($ops['post_content'])) {
            $r2 = wp_update_post(array('ID' => $pid, 'post_content' => wp_slash($ops['post_content'])), true);
            $out['steps']['post_' . $pid . '_content'] = array('ok' => !is_wp_error($r2), 'id' => is_wp_error($r2) ? $r2->get_error_message() : $r2);
          }
        }
      }
      wp_cache_flush();
      $out['steps']['cache_flush'] = true;
      if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
        $out['steps']['elementor_clear'] = true;
      }
      return $out;
    }
  ));
});"""

payload = {"title": "fsurgery-read-TEMP", "scope": "global", "active": True, "code": php}
open(base + 'snip_write.json', 'w', encoding='utf-8').write(json.dumps(payload, ensure_ascii=False))
print('snippet payload written, code len:', len(php))
