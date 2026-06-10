/**
 * Elementor 页面生成工具库
 *
 * 基于 elementor-upload.js 提取的公共工具函数，供所有页面脚本复用。
 *
 * 使用方式：
 *   const E = require('../templates/elementor-utils');
 *   const data = [E.section({}, [...]), E.heading('Title'), ...];
 *
 * 布局规则（来自 Elementor REST API 操作手册）：
 * - 多列布局用纯 Flexbox（flex_direction: "row"），不用 structure
 * - padding/margin 值必须是字符串（"80" 不是 80）
 * - 嵌套容器必须设 isInner: true + content_width: "full"
 * - 顶层容器不设 content_width（默认 boxed）
 * - flex_gap 格式：{size, column, row, unit}
 */

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ============================================================
// 加载全局凭证 — C:\Users\Dylan\.env（或 HOME/.env）
// ============================================================
function loadGlobalEnv() {
  const envPaths = [
    path.join(os.homedir(), '.env'),
    path.join('D:', '.env')
  ];
  for (const p of envPaths) {
    try {
      const content = fs.readFileSync(p, 'utf-8');
      content.split('\n').forEach(function(line) {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const eq = line.indexOf('=');
        if (eq < 1) return;
        const key = line.slice(0, eq).trim();
        if (!process.env[key]) { process.env[key] = line.slice(eq + 1).trim(); }
      });
      break; // 找到第一个就停
    } catch (e) { /* file not found, skip */ }
  }
}
loadGlobalEnv();

// ============================================================
// 认证配置 — 优先环境变量（已含全局 .env），fallback 到项目 config
// ============================================================
let _creds = { wp_username: '', wp_app_password: '' };
try {
  _creds = require(path.resolve(__dirname, '../../config/api-credentials.json'));
} catch (e) { /* fallback to env only */ }

const SITE = process.env.WP_SITE || 'goearthward.com';
const AUTH = 'Basic ' + Buffer.from(
  (process.env.WP_USER || _creds.wp_username || '') + ':' + (process.env.WP_APP_PASSWORD || _creds.wp_app_password || '')
).toString('base64');

// ============================================================
// ID 生成
// ============================================================
function uid() {
  return Math.random().toString(16).slice(2, 9);
}

// ============================================================
// 容器构建
// ============================================================

/**
 * 顶层容器（section）— 不设 content_width，默认 boxed
 */
function section(settings, elements) {
  return {
    id: uid(),
    elType: 'container',
    settings: Object.assign({
      wd_section_stretch: 'stretch',
      scroll_y: -80,
      flex_direction: 'column'
    }, settings),
    elements: elements,
    isInner: false
  };
}

/**
 * 嵌套容器 — content_width: "full", isInner: true
 */
function wrap(settings, elements) {
  return {
    id: uid(),
    elType: 'container',
    settings: Object.assign({
      content_width: 'full',
      scroll_y: -80
    }, settings),
    elements: elements,
    isInner: true
  };
}

// ============================================================
// 响应式辅助
// ============================================================

/**
 * 响应式 padding 辅助
 * @param {string} t - desktop top
 * @param {string} r - desktop right
 * @param {string} b - desktop bottom
 * @param {string} l - desktop left
 * @param {object} overrides - {tablet: {t,r,b,l}, mobile: {t,r,b,l}}
 */
function rPadding(t, r, b, l, overrides) {
  const pad = { unit: 'px', top: t, right: r, bottom: b, left: l, isLinked: '' };
  if (overrides && overrides.tablet) {
    const tb = overrides.tablet;
    pad.padding_tablet = { unit: 'px', top: tb.t || t, right: tb.r || r, bottom: tb.b || b, left: tb.l || l, isLinked: '' };
  }
  if (overrides && overrides.mobile) {
    const mb = overrides.mobile;
    pad.padding_mobile = { unit: 'px', top: mb.t || t, right: mb.r || r, bottom: mb.b || b, left: mb.l || l, isLinked: '' };
  }
  return pad;
}

/**
 * 响应式宽度（用于 flex_wrap 子容器）
 * desktop → tablet → mobile
 */
function rWidth(desktop, tablet, mobile) {
  return {
    width: { unit: '%', size: desktop, sizes: [] },
    width_tablet: { unit: '%', size: tablet, sizes: [] },
    width_mobile: { unit: '%', size: mobile, sizes: [] }
  };
}

/**
 * 标准 flex_gap 对象
 */
function gap(size) {
  return { size: size, column: String(size), row: String(size), unit: 'px' };
}

// ============================================================
// Widget 构建（Elementor 标准 + Pro）
// ============================================================

/**
 * heading widget（Elementor 标准标题）
 */
function heading(title, opts) {
  const o = opts || {};
  const fs = o.fontSize || 32;
  const settings = {
    title: title,
    align: o.align || 'center',
    title_color: o.color || '#333333',
    typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fs, sizes: [] },
    typography_font_weight: o.fontWeight || '700',
    _element_width: o.width || 'initial',
    _element_vertical_alignment: o.vAlign || '',
    _padding: o.padding || { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' },
    scroll_y: -80
  };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.round(fs * 0.75), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.round(fs * 0.6), sizes: [] };
  }
  return {
    id: uid(),
    elType: 'widget',
    settings: Object.assign(settings, o.extra || {}),
    elements: [],
    widgetType: 'heading'
  };
}

/**
 * text-editor widget（Elementor 标准富文本）
 */
function textEditor(content, opts) {
  const o = opts || {};
  const fs = o.fontSize || 16;
  const editorHtml = '<p>' + content + '</p>';
  const settings = {
    editor: editorHtml,
    editor_content: editorHtml,
    align: o.align || 'center',
    text_color: o.color || '#666666',
    typography_typography: 'custom',
    typography_font_size: { unit: 'px', size: fs, sizes: [] },
    typography_line_height: { unit: 'px', size: o.lineHeight || 26, sizes: [] },
    _element_width: o.width || 'initial',
    scroll_y: -80
  };
  if (o.responsive !== false) {
    settings.typography_font_size_tablet = { unit: 'px', size: Math.max(14, Math.round(fs * 0.9)), sizes: [] };
    settings.typography_font_size_mobile = { unit: 'px', size: Math.max(13, Math.round(fs * 0.85)), sizes: [] };
  }
  return {
    id: uid(),
    elType: 'widget',
    settings: Object.assign(settings, o.extra || {}),
    elements: [],
    widgetType: 'text-editor'
  };
}

/**
 * image widget（Elementor 标准图片）
 */
function imageWidget(url, opts) {
  const o = opts || {};
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      image: { url: url, id: o.id || 0, alt: o.alt || '', source: 'library', size: '' },
      image_size: o.imageSize || 'full',
      align: o.align || 'center',
      width: o.width ? { unit: '%', size: o.width, sizes: [] } : { unit: '%', size: 100, sizes: [] },
      image_border_radius: o.radius ? { unit: 'px', size: o.radius, sizes: [] } : { unit: 'px', size: 5, sizes: [] },
      scroll_y: -80
    },
    elements: [],
    widgetType: 'image'
  };
}

/**
 * image-box widget（Elementor Pro - 图片+标题+描述卡片）
 */
function imageBox(url, title, desc, linkUrl) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      image: { url: url, id: 0, size: '', source: 'library' },
      title_text: title,
      description_text: desc,
      link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
      title_bottom_space: { unit: 'px', size: 10, sizes: [] },
      image_size: { unit: '%', size: 100, sizes: [] },
      image_border_radius: { unit: 'px', size: 5, sizes: [] },
      hover_animation: 'pulse-shrink',
      scroll_y: -80,
      __globals__: { title_color: 'globals/colors?id=4616873' }
    },
    elements: [],
    widgetType: 'image-box'
  };
}

/**
 * icon-box widget（Elementor Pro - 图标+标题+描述）
 */
function iconBox(title, desc) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      selected_icon: { value: '', library: '' },
      title_text: title,
      description_text: desc,
      text_align: 'center',
      icon_space: { unit: 'px', size: 10, sizes: [] },
      title_bottom_space: { unit: 'px', size: 10, sizes: [] },
      title_typography_typography: 'custom',
      scroll_y: -80,
      __globals__: { title_color: 'globals/colors?id=4616873' }
    },
    elements: [],
    widgetType: 'icon-box'
  };
}

/**
 * button widget（Elementor 标准）
 */
function buttonWidget(text, linkUrl) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      text: text,
      link: { url: linkUrl || '', is_external: '', nofollow: '', custom_attributes: '' },
      size: 'md',
      align: 'center',
      scroll_y: -80
    },
    elements: [],
    widgetType: 'button'
  };
}

/**
 * spacer widget
 */
function spacer(size) {
  return {
    id: uid(),
    elType: 'widget',
    settings: { spacer: size || '40' },
    elements: [],
    widgetType: 'spacer'
  };
}

/**
 * divider widget
 */
function divider() {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      style: 'solid',
      weight: { unit: 'px', size: 1, sizes: [] },
      color: '#e0e0e0',
      width: '100%',
      align: 'center',
      gap: { unit: 'px', size: 10, sizes: [] }
    },
    elements: [],
    widgetType: 'divider'
  };
}

/**
 * accordion widget（手风琴 FAQ）
 * @param {Array} items - [{title, content}]
 */
function accordion(items) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      tabs: items.map(item => ({
        _id: uid(),
        tab_title: item.title,
        tab_content: item.content
      })),
      border_border: 'solid',
      border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
      border_color: '#e0e0e0',
      scroll_y: -80
    },
    elements: [],
    widgetType: 'accordion'
  };
}

/**
 * social-icons widget
 * @param {Array} icons - [{name, url}] name: facebook/instagram/pinterest/tiktok/youtube/twitter
 */
function socialIcons(icons) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      social_icon_list: icons.map(ic => ({
        _id: uid(),
        social: ic.name,
        link: { url: ic.url, is_external: 'on', nofollow: '', custom_attributes: '' }
      })),
      shape: 'circle',
      align: 'center',
      scroll_y: -80
    },
    elements: [],
    widgetType: 'social-icons'
  };
}

/**
 * html widget（自定义 HTML）
 */
function htmlWidget(code) {
  return {
    id: uid(),
    elType: 'widget',
    settings: { html: code, scroll_y: -80 },
    elements: [],
    widgetType: 'html'
  };
}

/**
 * shortcode widget - use for real WordPress/WooCommerce dynamic modules.
 */
function shortcodeWidget(shortcode) {
  return {
    id: uid(),
    elType: 'widget',
    settings: { shortcode: shortcode, scroll_y: -80 },
    elements: [],
    widgetType: 'shortcode'
  };
}

/** WoodMart: wd_products_widget */
function wdProductsWidget(count) {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      order: 'desc',
      scroll_y: -80,
      number: { unit: 'px', size: String(count || 4), sizes: [] }
    },
    elements: [],
    widgetType: 'wd_products_widget'
  };
}

/** WoodMart: wd_products_tabs */
function wdProductsTabs() {
  return {
    id: uid(),
    elType: 'widget',
    settings: {
      title: 'Healing Crystal',
      design: 'simple',
      color: '#007bc4',
      tabs_items: [
        { _id: uid(), image_size: 'custom', title: 'New', items_per_page: '6', pagination: 'arrows', columns: { size: '3' }, orderby: 'post__in' },
        { _id: uid(), image_size: 'custom', title: 'FEATURED', items_per_page: '6', pagination: 'arrows', columns: { size: '3' }, orderby: 'rand', query_type: 'AND', order: 'DESC' }
      ],
      scroll_y: -80,
      items_per_page: '6',
      pagination: 'arrows',
      columns: { unit: 'px', size: '3', sizes: [] }
    },
    elements: [],
    widgetType: 'wd_products_tabs'
  };
}

// ============================================================
// API 工具
// ============================================================
function apiRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const hasBody = body !== undefined && body !== null;
    const payload = hasBody ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const options = {
      hostname: SITE, port: 443, path: path, method: method,
      headers: { 'Authorization': AUTH, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { resolve({ raw: data, status: res.statusCode }); } });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * 创建页面并注入 Elementor 数据
 * @param {string} title - 页面标题
 * @param {string} slug - URL slug
 * @param {Array} elementorData - Elementor JSON 数组
 * @param {string} status - draft / publish
 */
async function createPage(title, slug, elementorData, status) {
  console.log('Creating page: ' + title + ' (' + slug + ')');

  // Step 1: 创建空白页面
  const page = await apiRequest('/wp-json/wp/v2/pages', 'POST', {
    title: title, status: status || 'draft', slug: slug, content: ''
  });
  const pageId = page.id;
  if (!pageId) {
    console.error('  Failed to create page: ' + JSON.stringify(page).slice(0, 200));
    return null;
  }
  console.log('  Page ID: ' + pageId);

  // Step 2: 注入 Elementor 数据
  const jsonStr = JSON.stringify(elementorData);
  console.log('  JSON: ' + jsonStr.length + ' chars, ' + elementorData.length + ' sections');

  const result = await apiRequest('/wp-json/wp/v2/pages/' + pageId + '?context=edit', 'POST', {
    title: title, status: status || 'draft', content: '',
    meta: {
      _elementor_data: jsonStr,
      _elementor_edit_mode: 'builder',
      _elementor_template_type: 'wp-page'
    }
  });

  if (result.id) {
    console.log('  SUCCESS: https://' + SITE + '/?page_id=' + pageId + '&preview=true');
    return result;
  } else {
    console.error('  FAILED: ' + JSON.stringify(result).slice(0, 500));
    return null;
  }
}

// ============================================================
// 图片上传
// ============================================================

/**
 * 上传本地图片文件到 WordPress 媒体库
 * @param {string} filePath - 本地图片文件绝对路径
 * @param {string} fileName - 上传后的文件名
 * @param {string} [altText] - 图片 alt 文本
 * @returns {Promise<{id: number, source_url: string, alt_text: string}>}
 */
async function uploadMedia(filePath, fileName, altText) {
  const boundary = '----FormBoundary' + Math.random().toString(16).slice(2);
  const fileData = fs.readFileSync(filePath);

  // multipart/form-data body
  const header = Buffer.from(
    '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name="file"; filename="' + fileName + '"\r\n' +
    'Content-Type: image/png\r\n\r\n'
  );
  const footer = Buffer.from('\r\n--' + boundary + '--\r\n');

  let altPart = Buffer.alloc(0);
  if (altText) {
    altPart = Buffer.from(
      '--' + boundary + '\r\n' +
      'Content-Disposition: form-data; name="alt_text"\r\n\r\n' +
      altText + '\r\n'
    );
  }

  const body = Buffer.concat([altPart, header, fileData, footer]);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: SITE, port: 443, path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'Content-Length': body.length
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.id) {
            console.log('  Uploaded: ' + fileName + ' → media_id=' + result.id);
            resolve({ id: result.id, source_url: result.source_url, alt_text: result.alt_text || altText || '' });
          } else {
            console.error('  Upload failed for ' + fileName + ': ' + JSON.stringify(result).slice(0, 300));
            resolve(null);
          }
        } catch (e) {
          console.error('  Upload parse error: ' + data.slice(0, 200));
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * 批量上传图片到 WordPress 媒体库
 * @param {Array<{filePath: string, fileName: string, alt: string}>} files
 * @returns {Promise<Array<{id: number, source_url: string, alt_text: string}>>}
 */
async function uploadMediaBatch(files) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    console.log('[' + (i + 1) + '/' + files.length + '] Uploading: ' + f.fileName);
    const result = await uploadMedia(f.filePath, f.fileName, f.alt);
    if (result) {
      results.push(result);
    } else {
      console.error('  Skipping ' + f.fileName + ' due to upload failure');
      results.push(null);
    }
    // 小延迟避免触发速率限制
    if (i < files.length - 1) await new Promise(r => setTimeout(r, 500));
  }
  return results;
}

/**
 * 检查 WordPress API 连接和认证
 * @returns {Promise<boolean>}
 */
async function checkConnection() {
  try {
    const result = await apiRequest('/wp-json/wp/v2/users/me', 'GET');
    if (result.id) {
      console.log('WP connected as: ' + (result.name || result.slug || result.id));
      return true;
    } else {
      console.error('WP auth failed: ' + JSON.stringify(result).slice(0, 200));
      return false;
    }
  } catch (e) {
    console.error('WP connection error: ' + e.message);
    return false;
  }
}

// ============================================================
// 导出
// ============================================================
module.exports = {
  uid, section, wrap, rPadding, rWidth, gap,
  heading, textEditor, imageWidget, imageBox, iconBox,
  buttonWidget, spacer, divider, accordion, socialIcons,
  htmlWidget, shortcodeWidget, wdProductsWidget, wdProductsTabs,
  apiRequest, createPage, uploadMedia, uploadMediaBatch, checkConnection,
  SITE, AUTH
};
