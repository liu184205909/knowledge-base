/**
 * Shop by Stone 分类页模板
 * URL: /product-category/[crystal-name]-crystals
 *
 * 5个Section:
 * 1. Hero — 水晶名+诗意副标题+描述
 * 2. 精选产品 — WooCommerce products shortcode
 * 3. 水晶简介 — 简短百科介绍（链接到完整百科页）
 * 4. 相关博客 — REST动态文章网格
 * 5. 其他水晶推荐 — collection导航
 *
 * 用法:
 *   node shop-by-stone.js
 */

const E = require('../templates/elementor-utils');
const IMAGES = require('../assets/site-images');

// ============================================================
// 占位图片
// ============================================================
const PLACEHOLDER = IMAGES.shared.card.url;

// ============================================================
// 常见水晶数据（用于导航推荐）
// ============================================================
const ALL_STONES = [
  { name: 'Amethyst',         subtitle: 'The Stone of Peace' },
  { name: 'Rose Quartz',      subtitle: 'The Stone of Love' },
  { name: 'Citrine',          subtitle: 'The Stone of Abundance' },
  { name: 'Black Tourmaline', subtitle: 'The Shield Stone' },
  { name: 'Clear Quartz',     subtitle: 'The Master Healer' },
  { name: 'Tiger Eye',        subtitle: 'The Stone of Courage' },
  { name: 'Moonstone',        subtitle: 'The Stone of New Beginnings' },
  { name: 'Obsidian',         subtitle: 'The Mirror Stone' },
  { name: 'Lepidolite',       subtitle: 'The Stone of Transition' },
  { name: 'Selenite',         subtitle: 'The Stone of Clarity' },
  { name: 'Green Aventurine', subtitle: 'The Stone of Luck' },
  { name: 'Fluorite',         subtitle: 'The Stone of Focus' },
  { name: 'Howlite',          subtitle: 'The Stone of Calm' },
  { name: 'Rhodonite',        subtitle: 'The Stone of Compassion' },
  { name: 'Malachite',        subtitle: 'The Stone of Transformation' },
  { name: 'Hematite',         subtitle: 'The Grounding Stone' }
];

function slugifyName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function relatedPostsGridHtml(crystal, options) {
  var o = options || {};
  var search = escapeHtml(o.search || crystal);
  var limit = Number(o.limit || 4);
  var columns = Number(o.columns || 4);
  return [
    '<div class="lc-related-posts" data-search="' + search + '" data-limit="' + limit + '">',
    '  <div class="lc-post-grid" aria-live="polite"></div>',
    '</div>',
    '<style>',
    '.lc-related-posts{width:100%;}',
    '.lc-related-posts .lc-post-grid{display:grid;grid-template-columns:repeat(' + columns + ',minmax(0,1fr));gap:24px;}',
    '.lc-related-posts .lc-post-card{display:flex;flex-direction:column;gap:12px;text-decoration:none;color:#2d2d2d;background:#fff;border:1px solid #eee7f8;border-radius:8px;overflow:hidden;min-height:100%;}',
    '.lc-related-posts .lc-post-card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;}',
    '.lc-related-posts .lc-post-body{padding:18px;}',
    '.lc-related-posts .lc-post-title{margin:0 0 8px;font-size:18px;line-height:1.35;font-weight:700;color:#2d2d2d;}',
    '.lc-related-posts .lc-post-excerpt{margin:0;font-size:14px;line-height:1.6;color:#6f6a75;}',
    '.lc-related-posts .lc-empty-slot{padding:28px;text-align:center;border:1px dashed #cfc6dd;border-radius:8px;color:#7a7282;background:#fff;}',
    '@media(max-width:1024px){.lc-related-posts .lc-post-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}',
    '@media(max-width:767px){.lc-related-posts .lc-post-grid{grid-template-columns:1fr;}}',
    '</style>',
    '<script>',
    '(function(){',
    '  document.querySelectorAll(".lc-related-posts").forEach(function(root){',
    '    var grid=root.querySelector(".lc-post-grid");',
    '    var search=root.getAttribute("data-search")||"";',
    '    var limit=root.getAttribute("data-limit")||"4";',
    '    var url="/wp-json/wp/v2/posts?search="+encodeURIComponent(search)+"&per_page="+encodeURIComponent(limit)+"&_embed=1";',
    '    fetch(url).then(function(res){return res.ok?res.json():[];}).then(function(posts){',
    '      if(!posts || !posts.length){grid.innerHTML="<div class=\\"lc-empty-slot\\">Related articles will appear here after matching posts are published.</div>";return;}',
    '      grid.innerHTML=posts.map(function(post){',
    '        var media=post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"][0];',
    '        var img=media && media.source_url ? "<img src=\\""+media.source_url+"\\" alt=\\"\\" loading=\\"lazy\\">" : "";',
    '        var title=(post.title && post.title.rendered) || "Article";',
    '        var excerpt=(post.excerpt && post.excerpt.rendered) ? post.excerpt.rendered.replace(/<[^>]*>/g,"").trim().slice(0,140) : "";',
    '        return "<a class=\\"lc-post-card\\" href=\\""+post.link+"\\">"+img+"<div class=\\"lc-post-body\\"><h3 class=\\"lc-post-title\\">"+title+"</h3>"+(excerpt?"<p class=\\"lc-post-excerpt\\">"+excerpt+"</p>":"")+"</div></a>";',
    '      }).join("");',
    '    }).catch(function(){grid.innerHTML="<div class=\\"lc-empty-slot\\">Related articles will appear here after matching posts are published.</div>";});',
    '  });',
    '})();',
    '</script>'
  ].join('');
}

/**
 * 生成 Shop by Stone 分类页
 *
 * @param {Object} config
 * @param {string} config.crystal          — 水晶名，如 "Amethyst"
 * @param {string} config.poeticTitle      — 诗意副标题，如 "The Stone of Peace"
 * @param {string} config.heroImage        — Hero 背景图 URL
 * @param {string} config.description      — 水晶描述文案（200-300词简介）
 * @param {string} config.encyclopediaUrl  — 完整百科页链接
 * @param {string} config.blogSearch       — 文章搜索词，默认使用水晶名
 * @param {number} config.blogLimit        — 文章数量，默认4
 * @param {number} config.blogColumns      — 桌面列数，默认4
 * @param {Array}  config.relatedStones    — [{name, subtitle, image}]（4-6个）
 */
function generateStonePage(config) {
  config = config || {};
  var crystal = config.crystal || 'Amethyst';
  var poeticTitle = config.poeticTitle || 'The Stone of Wisdom';
  var crystalSlug = slugifyName(crystal);
  var encyclopediaUrl = config.encyclopediaUrl || '/crystal-guide/' + crystalSlug + '-meaning';
  var relatedStones = config.relatedStones || [];
  var productCategorySlug = config.productCategorySlug || crystalSlug;

  // ----------------------------------------------------------
  // Section 1: Hero — 水晶名 + 诗意副标题 + 描述
  // ----------------------------------------------------------
  var heroSection = E.section({
    _padding: E.rPadding('80', '40', '60', '40', { tablet: { t: '60', r: '30', b: '40', l: '30' }, mobile: { t: '40', r: '20', b: '30', l: '20' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.textEditor(
      '<a href="/">Home</a> &gt; <a href="/collections">Shop by Stone</a> &gt; ' + crystal,
      { align: 'left', fontSize: 14, color: '#999999' }
    ),
    E.heading(crystal + ' Crystals', {
      fontSize: 44,
      color: '#333333',
      align: 'center',
      fontWeight: '700',
      padding: { unit: 'px', top: '10', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.heading(poeticTitle, {
      fontSize: 22,
      color: '#7C3AED',
      align: 'center',
      fontWeight: '400',
      extra: { title_color: '#7C3AED', typography_font_style: 'italic' },
      padding: { unit: 'px', top: '0', right: '0', bottom: '15', left: '0', isLinked: '' }
    }),
    E.textEditor(
      config.heroDescription || 'Discover the timeless beauty and powerful energy of ' + crystal + '. Each piece in our collection is ethically sourced, energetically cleansed, and ready to support your journey. Whether you seek peace, love, protection, or abundance, ' + crystal + ' holds the wisdom to guide you.',
      { fontSize: 17, color: '#666666', lineHeight: 26 }
    ),
    E.spacer('15'),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      content_width: 'full'
    }, [
      E.buttonWidget('Shop ' + crystal + ' Below', '#products'),
      E.buttonWidget('Learn ' + crystal + ' Meaning', encyclopediaUrl)
    ])
  ]);

  // ----------------------------------------------------------
  // Section 2: 精选产品 — WooCommerce products shortcode
  // ----------------------------------------------------------
  var productsSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    extra: { _element_id: 'products' }
  }, [
    E.heading('Shop ' + crystal + ' Collection', {
      fontSize: 32,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '5', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Each bracelet is handcrafted with genuine ' + crystal + ', ethically sourced and energetically cleansed under moonlight.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.shortcodeWidget(config.productShortcode || '[products limit="8" columns="4" category="' + productCategorySlug + '"]')
  ]);

  // ----------------------------------------------------------
  // Section 3: 水晶简介 — 简短百科介绍 + 链接到完整百科页
  // ----------------------------------------------------------
  var introSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#FFFFFF'
  }, [
    E.heading('About ' + crystal, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(40)
    }, [
      // 左侧图片
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('45', '100', '100')), [
        E.imageWidget(config.heroImage || PLACEHOLDER, {
          width: 100,
          radius: 10
        })
      ]),
      // 右侧百科简介
      E.wrap(Object.assign({
        flex_direction: 'column'
      }, E.rWidth('55', '100', '100')), [
        E.textEditor(
          config.description || crystal + ' has been treasured for centuries as one of the most powerful healing stones in the mineral kingdom. Its unique crystalline structure and vibrational frequency make it a versatile ally for spiritual growth, emotional healing, and physical well-being.<br><br>In the scientific realm, ' + crystal + ' is prized for its geological properties and the fascinating processes that formed it deep within the Earth over millions of years. From a spiritual perspective, it is revered across cultures as a stone of profound metaphysical power, connecting the wearer to higher states of consciousness and divine wisdom.<br><br>Psychologically, ' + crystal + ' supports mindfulness practices by serving as a tangible focal point for intention-setting. When worn as a bracelet, it becomes a constant, gentle reminder of your goals and the energy you wish to cultivate in your daily life.',
          { align: 'left', fontSize: 16, color: '#555555', lineHeight: 26, responsive: false }
        ),
        E.spacer('15'),
        E.buttonWidget('Read Full ' + crystal + ' Encyclopedia', encyclopediaUrl)
      ])
    ])
  ]);

  // ----------------------------------------------------------
  // Section 4: 相关博客 — REST动态文章网格
  // ----------------------------------------------------------
  var blogSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } }),
    background_background: 'classic',
    background_color: '#F9F5FF'
  }, [
    E.heading('Learn More About ' + crystal, {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '20', left: '0', isLinked: '' }
    }),
    E.htmlWidget(relatedPostsGridHtml(crystal, {
      search: config.blogSearch || crystal,
      limit: config.blogLimit || 4,
      columns: config.blogColumns || 4
    }))
  ]);

  // ----------------------------------------------------------
  // Section 5: 其他水晶推荐 — collection导航
  // ----------------------------------------------------------
  var defaultRelated = ALL_STONES
    .filter(function (s) { return s.name !== crystal; })
    .slice(0, 6);
  var related = relatedStones.length > 0 ? relatedStones : defaultRelated;

  var stoneNavCards = related.map(function (stone) {
    var stoneSlug = slugifyName(stone.slug || stone.name);
    return E.wrap(Object.assign({
      flex_direction: 'column',
      flex_justify_content: 'space-between',
      _padding: E.rPadding('24', '22', '24', '22'),
      background_background: 'classic',
      background_color: '#FFFFFF',
      border_border: 'solid',
      border_width: { unit: 'px', top: '1', right: '1', bottom: '1', left: '1', isLinked: true },
      border_color: '#eee7f8',
      border_radius: { unit: 'px', top: '8', right: '8', bottom: '8', left: '8', isLinked: true }
    }, E.rWidth('25', '50', '100')), [
      E.heading(stone.name, {
        fontSize: 18,
        color: '#333333',
        align: 'center',
        fontWeight: '600',
        padding: { unit: 'px', top: '0', right: '0', bottom: '6', left: '0', isLinked: '' }
      }),
      E.textEditor(
        stone.subtitle || 'Explore this crystal collection.',
        { align: 'center', fontSize: 14, color: '#777777', lineHeight: 21 }
      ),
      E.buttonWidget('View Collection', '/product-category/' + stoneSlug + '-crystals')
    ]);
  });

  var stoneNavSection = E.section({
    _padding: E.rPadding('60', '40', '60', '40', { tablet: { t: '40', r: '20', b: '40', l: '20' }, mobile: { t: '30', r: '15', b: '30', l: '15' } })
  }, [
    E.heading('Explore More Crystals', {
      fontSize: 28,
      color: '#333333',
      padding: { unit: 'px', top: '0', right: '0', bottom: '10', left: '0', isLinked: '' }
    }),
    E.textEditor(
      'Every crystal in our collection carries its own unique energy and story. Discover the stone that resonates with your soul.',
      { fontSize: 16, color: '#888888', lineHeight: 24 }
    ),
    E.wrap({
      flex_direction: 'row',
      flex_gap: E.gap(15),
      flex_wrap: 'wrap'
    }, stoneNavCards)
  ]);

  return [
    heroSection,
    productsSection,
    introSection,
    blogSection,
    stoneNavSection
  ];
}

// ============================================================
// Main — 示例：生成 Amethyst Crystals 页面
// ============================================================
async function main() {
  var config = {
    crystal: 'Amethyst',
    poeticTitle: 'The Stone of Peace',
    heroDescription: 'Amethyst has enchanted humanity for millennia with its deep purple hues and profound spiritual energy. From ancient Greek amulets to modern meditation practices, this extraordinary crystal continues to be one of the most sought-after stones for peace, intuition, and spiritual growth. Discover our hand-selected Amethyst collection and let its calming wisdom transform your daily life.',
    description: 'Amethyst is a variety of quartz that gets its stunning purple color from natural irradiation of iron impurities within the crystal lattice. Found in locations from Brazil to Zambia, each piece carries the unique geological fingerprint of its origin.<br><br>In the spiritual tradition, Amethyst is considered the premier stone for the Crown and Third Eye chakras. It opens the gateway to higher consciousness, enhances intuition, and creates a protective shield of spiritual light around the wearer. Ancient Greeks believed it could prevent intoxication, and the word "amethystos" literally means "not intoxicated."<br><br>From a psychological perspective, Amethyst is a powerful ally for mindfulness and stress reduction. Its calming energy helps quiet an overactive mind, making it an ideal companion for meditation, sleep, and emotional healing. When worn as a bracelet, Amethyst serves as a gentle, constant reminder to return to your center and breathe.',
    encyclopediaUrl: '/crystal-guide/amethyst-meaning',
    relatedStones: [
      { name: 'Rose Quartz', subtitle: 'The Stone of Love' },
      { name: 'Clear Quartz', subtitle: 'The Master Healer' },
      { name: 'Lepidolite', subtitle: 'The Stone of Transition' },
      { name: 'Selenite', subtitle: 'The Stone of Clarity' },
      { name: 'Black Tourmaline', subtitle: 'The Shield Stone' }
    ]
  };

  var data = generateStonePage(config);
  await E.createPage(
    config.crystal + ' Crystals — ' + config.poeticTitle,
    slugifyName(config.crystal) + '-crystals',
    data,
    'draft'
  );
}

if (require.main === module) {
  main().catch(function (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  });
}

module.exports = generateStonePage;
