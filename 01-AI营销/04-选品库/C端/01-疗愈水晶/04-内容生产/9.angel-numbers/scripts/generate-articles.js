/**
 * Angel Numbers 骨架生成器（100 篇）
 * 读 angel-numbers-config.json → 12 模块骨架（参数化 Numerology/Crystal角色/Related + AI 占位）
 * 框架 v2 对齐：Introduction + Quick Answer + Spiritual + Numerology + Love + Money + Best Crystals + Why + What to Do + Misconceptions(条件) + FAQ + Related
 * 用法：node generate-articles.js --slug=111 | (全100篇)
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const config = require('../../../07-互动工具/_shared/angel-numbers-config.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const list = slugArg ? config.numbers.filter(n => n.slug === slugArg) : config.numbers;

// 线上特殊 slug → 标准零售显示名（attributes 里 quartz slug 对应 Clear Quartz，title 仅写 "Quartz"）
const DISPLAY_NAME_OVERRIDES = { quartz: 'Clear Quartz' };
function stoneName(slug) {
  if (DISPLAY_NAME_OVERRIDES[slug]) return DISPLAY_NAME_OVERRIDES[slug];
  const a = ATTR[slug + '-meaning'];
  // attributes title 是 SEO 文章标题 "X Meaning: Healing Properties & Uses"，剥后缀取水晶名
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function stoneData(slug) {
  const a = ATTR[slug + '-meaning'] || {};
  return {
    slug, name: stoneName(slug),
    overview: a.overview || {},
    meaning: `/gemstone/${slug}-meaning/`,
    shop: `/product-category/${slug}-crystals/`,
    reason: '' // 从 config crystals 角色取
  };
}

let made = 0; const index = [];
for (const cfg of list) {
  const num = cfg.number;
  const isHub = cfg.is_hub;

  // 水晶 5 角色
  const crystals = {};
  for (const [role, info] of Object.entries(cfg.crystals)) {
    crystals[role] = { ...stoneData(info.slug), reason: info.reason };
  }
  const crystalList = Object.values(crystals);

  // ---- 参数化模块 ----

  // Introduction（占位，AI 写主体 + 嵌入 unique_angle/emotional_state）
  const intro = `{{AI_INTRODUCTION}}`;

  // Quick Answer（参数化 3 点 bullet + 占位主体）
  const m1 = `<h2>What Does ${num} Mean? (Quick Answer)</h2>\n<p>{{AI_QUICK_ANSWER}}</p>\n<ul>\n<li><strong>Core meaning:</strong> ${cfg.theme}</li>\n<li><strong>Key message:</strong> ${cfg.unique_angle}</li>\n<li><strong>Action:</strong> ${cfg.recommended_action}</li>\n</ul>`;

  // Spiritual Meaning（占位，AI 基于 unique_angle 写）
  const m2 = `<h2>The Spiritual Meaning of ${num}</h2>\n<p>{{AI_SPIRITUAL_MEANING}}</p>`;

  // Numerology（参数化 + 占位深化）
  const numer = cfg.numerology;
  let m3 = `<h2>The Numerology Behind ${num}</h2>\n<p>{{AI_NUMEROLOGY_INTRO}}</p>\n<ul>\n<li><strong>Single digit:</strong> ${numer.single_digit} (${cfg.primary_intent})</li>\n<li><strong>Reduced sum:</strong> ${numer.reduced_sum} → ${numer.reduced_meaning}</li>`;
  if (numer.is_master_number) m3 += `\n<li><strong>Master number:</strong> ${num} is a master number (${numer.master_note || 'carries intensified energy'})</li>`;
  else if (numer.master_note) m3 += `\n<li><strong>Note:</strong> ${numer.master_note}</li>`;
  m3 += `\n</ul>\n<p>{{AI_NUMEROLOGY_DEEPEN}}</p>`;

  // Love & Twin Flame（占位，按 module_weights 调）
  const loveWeight = cfg.module_weights?.M4_love || 'normal';
  const m4 = `<h2>${num} in Love &amp; Twin Flame</h2>\n<p>{{AI_LOVE${loveWeight === 'light' ? '_LIGHT' : ''}}}</p>`;

  // Money & Career（占位，按 module_weights 调）
  const moneyWeight = cfg.module_weights?.M5_money || 'normal';
  const m5 = `<h2>${num} in Money &amp; Career</h2>\n<p>{{AI_MONEY${moneyWeight === 'heavy' ? '_HEAVY' : moneyWeight === 'light' ? '_LIGHT' : ''}}}</p>`;

  // Best Crystals（参数化 5 角色 + 占位描述）
  let m6 = `<h2>Best Crystals for Angel Number ${num}</h2>\n<p>{{AI_CRYSTAL_TRANSITION}}</p>\n`;
  for (const [role, c] of Object.entries(crystals)) {
    const roleLabel = {
      best_overall: `Best Overall Crystal for ${num}`,
      best_love: 'Best Crystal for Love',
      best_protection: 'Best Crystal for Protection &amp; Grounding',
      best_manifestation: 'Best Crystal for Manifestation',
      best_daily_wear: 'Best Crystal to Wear Daily',
    }[role];
    m6 += `<h3>${roleLabel}</h3>\n<p>{{AI_CRYSTAL_${c.slug}}}</p>\n<p><em>${c.name}</em> — ${c.reason}. <a href="${c.meaning}">Read full ${c.name} meaning</a> · <a href="${c.shop}">Shop ${c.name}</a></p>\n`;
  }
  m6 += `<h3>How to Use These Crystals When You See ${num}</h3>\n<p>{{AI_CRYSTAL_HOWTO}}</p>`;

  // Why Keep Seeing（占位）
  const m7 = `<h2>Why Do You Keep Seeing ${num}?</h2>\n<p>{{AI_WHY_SEEING}}</p>`;

  // What to Do（占位 + recommended_action 提示）
  const m8 = `<h2>What to Do When You See ${num}</h2>\n<p>{{AI_WHAT_TO_DO}}</p>`;

  // Common Misconceptions（条件模块）
  let m9 = '';
  if (cfg.needs_misconception_section) {
    m9 = `<h2>Common Misconceptions About ${num}</h2>\n<p>{{AI_MISCONCEPTIONS}}</p>\n`;
  }

  // FAQ（占位）
  const m10 = `<h2>Frequently Asked Questions</h2>\n{{AI_FAQ}}`;

  // Related + Closing（参数化）
  const related = cfg.related_numbers.map(rn => {
    const rc = config.numbers.find(n => n.number === rn);
    return rc ? `<li><a href="/angel-numbers/${rc.slug}/">${rc.number} Angel Number</a> — ${rc.theme}</li>` : '';
  }).filter(Boolean).join('\n');
  const m11 = `<h2>Related Angel Numbers</h2>\n${related && `<ul>\n${related}\n</ul>` || ''}\n<p>{{AI_CLOSING}}</p>`;

  // Gentle Note（全站组件）
  const gentleNote = `<p class="gentle-note"><em>Crystal and angel number meanings are based on spiritual traditions, symbolism, and personal mindfulness practices. They are not a substitute for medical, financial, or professional advice.</em></p>`;

  // 组装
  const content = [intro, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, gentleNote, m11].filter(Boolean).join('\n\n');

  // TKD
  const title = isHub
    ? `Angel Numbers Guide: Meanings, Love & Crystals`
    : `${num} Angel Number Meaning: Love, Money & Crystals`;

  const article = {
    title, slug: cfg.slug, url: `/angel-numbers/${cfg.slug}/`,
    number: num, is_hub: isHub,
    theme: cfg.theme, unique_angle: cfg.unique_angle,
    primary_intent: cfg.primary_intent, secondary_intent: cfg.secondary_intent,
    emotional_state: cfg.emotional_state, recommended_action: cfg.recommended_action,
    avoid_claims: cfg.avoid_claims,
    numerology: numer,
    crystals,
    needs_misconception_section: cfg.needs_misconception_section,
    module_weights: cfg.module_weights,
    related_numbers: cfg.related_numbers,
    related_reason: cfg.related_reason,
    rank_math_title: title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: isHub ? 'angel numbers' : `${num} angel number`,
    excerpt: '{{AI_EXCERPT}}',
    diffHints: {
      unique_angle: cfg.unique_angle,
      emotional_state: cfg.emotional_state,
      recommended_action: cfg.recommended_action,
      avoid_claims: cfg.avoid_claims,
      module_weights: cfg.module_weights,
    },
    content,
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', cfg.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: cfg.slug, number: num, is_hub: isHub, title, theme: cfg.theme });
  made++;
}
fs.writeFileSync(path.join(DIR, 'articles-index.json'), JSON.stringify({ total: made, articles: index }, null, 2), 'utf8');
console.log(`✅ ${made} 篇天使号码骨架生成（12模块+Numerology参数化+水晶5角色+条件Misconceptions+diffHints）`);
console.log(`Misconceptions 启用: ${index.filter(a => config.numbers.find(n => n.slug === a.slug)?.needs_misconception_section).length} 篇`);
