/**
 * How-to 骨架生成器（多模式：cleanse/charge/activate/program/meditate/use/bracelet）
 * 读 configs/{slug}.json → 7 模块骨架（参数化方法 + 水晶6角色 + 首饰穿插 + AI 占位）
 * 模式由 config.action + config.concept_table_mode 决定：
 *   - cleanse(H1) / charge(H2)：完整或局部四概念表 + 风险分层方法
 *   - activate(H3) / program(H4)：局部概念对比 + 前置链路 + 单一tier方法
 *   - meditate(H5)：无概念表 + 4种practice + chakra layout
 *   - use(H6)：完整四概念表第二处(首饰视角) + 10种用法 + hub内链
 *   - bracelet(H7)：无概念表 + 材质分类 + 3安全法 + avoid清单
 * 数据单源：cleansing-knowledge.json(净化法) + config.methods_data(charge/activate等专属) + mineral-safety-reference.json + crystal-attributes.json
 * 用法：node generate-articles.js --slug=how-to-charge-crystals  或  --slug=h2-charge
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..');
const CK = require('../../../07-互动工具/_shared/cleansing-knowledge.json');
const MS = require('../../../07-互动工具/_shared/mineral-safety-reference.json');
const ATTR = require('../../../07-互动工具/_shared/crystal-attributes.json').crystals;

const args = process.argv.slice(2);
const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1];
const configDir = path.join(DIR, 'configs');
// 跳过 h1-cleanse.json（H1已生成，不重复覆盖）
const cfgFiles = slugArg
  ? (fs.existsSync(path.join(configDir, slugArg + '.json'))
      ? [slugArg + '.json']
      : fs.existsSync(path.join(configDir, slugArg))
        ? [path.basename(slugArg)]
        : fs.readdirSync(configDir).filter(f => f.endsWith('.json') && JSON.parse(fs.readFileSync(path.join(configDir, f), 'utf8')).slug === slugArg))
  : fs.readdirSync(configDir).filter(f => f.endsWith('.json') && f !== 'h1-cleanse.json');

const MEANING_SLUG_OVERRIDES = { 'clear-quartz': 'quartz' };
const DISPLAY_NAME_OVERRIDES = { 'clear-quartz': 'Clear Quartz' };
function meaningSlug(slug) { return MEANING_SLUG_OVERRIDES[slug] || slug; }
function meaningUrl(slug) { return `/gemstone/${meaningSlug(slug)}-meaning/`; }
function stoneName(slug) {
  if (DISPLAY_NAME_OVERRIDES[slug]) return DISPLAY_NAME_OVERRIDES[slug];
  const a = ATTR[meaningSlug(slug) + '-meaning'];
  if (a && a.title) {
    const stripped = a.title.replace(/\s*Meaning: Healing Properties.*$/i, '').trim();
    if (stripped) return stripped;
  }
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}
function safetyPhrase(slug) { const s = MS.stones[slug]; return s ? s.notes : ''; }
function methodSafetyNote(methodKey) {
  const m = MS.method_safety_notes[methodKey] || MS.method_safety_notes[methodKey === 'selenite' ? 'selenite_plate' : methodKey];
  return m ? { risk: m.specific_risk, caveat: m.practical_caveat } : null;
}

// 方法数据源：优先 config.methods_data（charge/activate/program专属），回退 cleansing-knowledge（净化7法）
function getMethod(cfg, methodKey) {
  if (cfg.methods_data && cfg.methods_data[methodKey]) return cfg.methods_data[methodKey];
  return CK.methods[methodKey];
}

// 完整四概念对照表（H1源 / H6第二处权威）
function fourConceptTable(cfg) {
  const h1link = cfg.internal_links.h1_cleanse_link;
  const introNote = cfg.concept_table_mode === 'full_jewelry_view'
    ? `Here is the full four-concept comparison — the complete crystal care sequence. Think of caring for a crystal as a small sequence: clear it, refill it, wake it, give it a job. (For the text version, see <a href="${h1link.url}">${h1link.anchor}</a>.)`
    : `Here is the full four-concept comparison, shown once here so the rest of this guide can stay focused. Think of caring for a crystal as a small sequence: clear it, refill it, wake it, give it a job.`;
  return `<h3>The Four Care Concepts: Cleanse, Charge, Activate, Program</h3>
<p>${introNote}</p>
<table>
<thead><tr><th>Concept</th><th>One-line definition</th><th>What you do</th><th>Traditional purpose</th><th>Frequency</th></tr></thead>
<tbody>
<tr><td><strong>Cleanse</strong></td><td>Clearing away accumulated residue</td><td>Resetting a stone's symbolic energy state</td><td>Marking a new stone as your own; releasing the handling of many hands</td><td>New stone / monthly / full moon</td></tr>
<tr><td><strong>Charge</strong></td><td>Replenishing / restoring energy</td><td>Giving the stone a "refill"</td><td>Restoring a "full" state so the stone can continue in use</td><td>After cleansing / when it feels low</td></tr>
<tr><td><strong>Activate</strong></td><td>Waking a dormant stone</td><td>Letting the stone "start working"</td><td>First use of a new stone / re-enabling one long unused</td><td>First time / after long disuse</td></tr>
<tr><td><strong>Program</strong></td><td>Giving the stone a specific task</td><td>Setting a clear intention</td><td>Letting the stone "remember your goal" as a daily reminder</td><td>Each new intention / periodic reset</td></tr>
</tbody>
</table>`;
}

// 决策卡片（按 config.tool_cta.card_template）
function decisionCard(cfg, variant) {
  const tc = cfg.tool_cta;
  if (!tc.enabled) return '';
  const colors = { main: '#f0f7ff', mainBorder: '#2e7d32', reminder: '#fff4e5', reminderBorder: '#f9a825' };
  const c = variant === 'reminder' ? { bg: colors.reminder, border: colors.reminderBorder } : { bg: colors.main, border: colors.mainBorder };
  // 从 card_template 提取标题和正文（去掉 markdown > 和 **）
  const tpl = tc.card_template;
  const titleMatch = tpl.match(/\*\*(.+?)\*\*/);
  const title = titleMatch ? titleMatch[1] : 'Quick check';
  // 提取链接
  const linkMatch = tpl.match(/\[(.+?)\]\((.+?)\)/);
  const linkHtml = linkMatch ? `<a href="${linkMatch[2]}"><strong>${linkMatch[1]}</strong></a>` : `<a href="${tc.tool_url}"><strong>${tc.tool}</strong></a>`;
  // 提取箭头后的正文
  const afterArrow = tpl.split('→')[1] || tpl;
  const bodyText = afterArrow.replace(/\*\*\[.+?\]\(.+?\)\*\*/g, '').replace(/\*\*(.+?)\*\*/g, '').replace(/^[\s>]+/, '').trim();
  return `<div class="${tc.tool}-card" style="background:${c.bg};border-left:4px solid ${c.border};padding:16px 20px;margin:24px 0;border-radius:6px;">
<p>💡 <strong>${title}</strong></p>
<p>${linkHtml} → ${bodyText}</p>
</div>`;
}

// 方法卡片（method-specific safety notes + 首饰穿插 + 步骤）
function methodCard(cfg, methodKey, jewelryTip, useBestForDefault) {
  const m = getMethod(cfg, methodKey);
  if (!m) return '';
  const msNote = methodSafetyNote(methodKey);
  const steps = m.steps.map(s => `<li>${s}</li>`).join('\n');
  const bestFor = useBestForDefault && m.best_for_default ? m.best_for_default : `{{AI_M3_${methodKey.toUpperCase().replace(/-/g, '_')}_BESTFOR}}`;
  const safetyLine = msNote ? `<p><strong>Method-specific safety notes:</strong> ${msNote.risk}</p>` : '';
  const jewelryLine = jewelryTip ? `<p><em>Jewelry tip:</em> ${jewelryTip}</p>` : '';
  return `<h3>${m.icon} ${m.name}</h3>
<p><strong>What it does (tradition):</strong> ${m.tradition}</p>
<p><strong>How it works (practical):</strong> ${m.practical}</p>
<p><strong>Best for:</strong> ${bestFor}</p>
${safetyLine}
${jewelryLine}
<p><strong>Steps:</strong></p>
<ol>
${steps}
</ol>
<p><strong>How long:</strong> ${m.duration_label}</p>`;
}

let made = 0; const index = [];

for (const cfgFile of cfgFiles) {
  const cfgPath = path.join(configDir, cfgFile);
  if (!fs.existsSync(cfgPath)) { console.log('⚠️ config not found:', cfgFile); continue; }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const action = cfg.action;
  const ja = cfg.jewelry_angle.insertion_points || {};
  const tiers = cfg.methods_risk_tiers;

  // 水晶 6 角色
  const crystals = {};
  for (const [role, info] of Object.entries(cfg.crystals)) {
    crystals[role] = {
      slug: info.slug, name: stoneName(info.slug), role_label: info.role_label,
      reason: info.reason, compliance_phrase: info.compliance_phrase,
      safety_note: safetyPhrase(info.slug), meaning_url: meaningUrl(info.slug),
      shop_url: cfg.internal_links.shop_fallback
    };
  }

  // ==================== M1 Quick Answer（安全优先首屏）====================
  const m1 = `<h2>Quick Answer: How to ${cfg.action[0].toUpperCase() + cfg.action.slice(1)} Crystals</h2>
<p>{{AI_M1_INTRO_SAFETY_FIRST}}</p>
<ul>
<li>{{AI_M1_BULLET_SAFE_METHODS}}</li>
<li>{{AI_M1_BULLET_SAFETY_CHECK}}</li>
<li>{{AI_M1_BULLET_HOW_LONG}}</li>
</ul>
<p>{{AI_M1_SAFETY_CHECK_BRIDGE}}</p>`;

  // ==================== M2 What & Why ====================
  let m2ConceptTable = '';
  let m2ExtraAfter = '';

  if (cfg.concept_table_mode === 'full_comparison') {
    // H1 模式：完整表 + cleanse vs charge
    m2ConceptTable = fourConceptTable(cfg);
    m2ExtraAfter = `<p><em>This article focuses on <strong>cleansing</strong>. Cleansing resets; charging replenishes — the order matters (cleanse first, then charge). For the deep dive on charging, see <a href="${cfg.internal_links.h2_charge_link.url}">${cfg.internal_links.h2_charge_link.anchor}</a>.</em></p>`;
  } else if (cfg.concept_table_mode === 'full_jewelry_view') {
    // H6 模式：完整表第二处（首饰视角）+ hub 内链矩阵（H1-H5 全链）
    m2ConceptTable = fourConceptTable(cfg);
    const il = cfg.internal_links;
    const hubLinks = [
      il.h1_cleanse_link, il.h2_charge_link, il.h3_activate_link, il.h4_program_link, il.h5_meditate_link
    ].filter(Boolean).map(l => `<a href="${l.url}">${l.anchor}</a>`).join(' · ');
    m2ExtraAfter = `<p><em>This overview shows the full care sequence. Deep dives on each step: ${hubLinks}.</em></p>`;
  } else if (cfg.concept_table_mode === 'local_only') {
    // H2/H3/H4 模式：局部概念对比 + 内链 H1
    const lp = cfg.local_concept_pair;
    const hub = cfg.internal_links.hub_flagship;
    m2ConceptTable = `<h3>${lp.focus}</h3>
<p>{{AI_M2_LOCAL_CONCEPT_COMPARISON}}</p>
<ul>
<li>{{AI_M2_LOCAL_POINT_1}}</li>
<li>{{AI_M2_LOCAL_POINT_2}}</li>
<li>{{AI_M2_LOCAL_POINT_3}}</li>
</ul>
<p><em>${lp.link_to_h1 ? lp.link_to_h1 + ', see ' : 'For the full four-concept comparison, see '}<a href="${hub ? hub.url : cfg.internal_links.h1_cleanse_link.url}">${hub ? hub.anchor : cfg.internal_links.h1_cleanse_link.anchor}</a>.</em></p>`;
    // H4 前置链路
    if (cfg.prerequisite_chain) {
      const pc = cfg.prerequisite_chain;
      m2ExtraAfter = `<h3>The Prerequisite Chain: Cleanse → Charge → Activate → Program</h3>
<p>{{AI_M2_PREREQ_CHAIN_INTRO}}</p>
<ol>
<li><strong>Cleanse</strong> (reset) — <a href="${cfg.internal_links.h1_cleanse_link.url}">${cfg.internal_links.h1_cleanse_link.anchor}</a></li>
<li><strong>Charge</strong> (refill)${cfg.internal_links.h2_charge_link ? ` — <a href="${cfg.internal_links.h2_charge_link.url}">${cfg.internal_links.h2_charge_link.anchor}</a>` : ''}</li>
<li><strong>Activate</strong> (switch on)${cfg.internal_links.h3_activate_link ? ` — <a href="${cfg.internal_links.h3_activate_link.url}">${cfg.internal_links.h3_activate_link.anchor}</a>` : ''}</li>
<li><strong>Program</strong> (set the task) — this article</li>
</ol>
<p><em>Think of it like this: ${pc.metaphor}.</em></p>`;
    }
    // H3 new crystal first-use ritual 前置
    if (cfg.new_crystal_first_use_ritual) {
      const fr = cfg.new_crystal_first_use_ritual;
      m2ExtraAfter = `<h3>New Crystal First-Use Ritual</h3>
<p>{{AI_M2_FIRST_USE_INTRO}}</p>
<ol>
<li>{{AI_M2_FIRST_USE_STEP_1}}</li>
<li>{{AI_M2_FIRST_USE_STEP_2}}</li>
<li><strong>Cleanse first</strong> — <a href="${cfg.internal_links.h1_cleanse_link.url}">${cfg.internal_links.h1_cleanse_link.anchor}</a></li>
<li>Then activate with one of the safe methods below</li>
</ol>
<p><em>${fr.compliance}</em></p>`;
    }
  } else if (cfg.concept_table_mode === 'none') {
    // H5/H7 模式：无概念表，直接主题
    m2ConceptTable = '';
    // H5 chakra context / H7 材质分类
    if (action === 'meditate') {
      m2ConceptTable = `<p>{{AI_M2_EASTERN_TRADITION_CONTEXT}}</p>`;
    } else if (cfg.slug && cfg.slug.includes('bracelet')) {
      const bm = cfg.bracelet_materials;
      m2ConceptTable = `<h3>Know Your Bracelet Material First</h3>
<p>{{AI_M2_MATERIAL_INTRO}}</p>
<table>
<thead><tr><th>Material</th><th>Characteristics</th><th>Safe methods</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td><strong>${bm.elastic_cord.icon} ${bm.elastic_cord.name}</strong></td><td>${bm.elastic_cord.characteristics}</td><td>${bm.elastic_cord.safe_methods.join(', ')}</td><td>${bm.elastic_cord.avoid_methods.join(', ')}</td></tr>
<tr><td><strong>${bm.metal_chain.icon} ${bm.metal_chain.name}</strong></td><td>${bm.metal_chain.characteristics}</td><td>${bm.metal_chain.safe_methods.join(', ')}</td><td>${bm.metal_chain.avoid_methods.join(', ')}</td></tr>
<tr><td><strong>${bm.woven_thread.icon} ${bm.woven_thread.name}</strong></td><td>${bm.woven_thread.characteristics}</td><td>${bm.woven_thread.safe_methods.join(', ')}</td><td>${bm.woven_thread.avoid_methods.join(', ')}</td></tr>
</tbody>
</table>`;
    }
  }

  const m2Title = action === 'cleanse' && cfg.slug === 'how-to-cleanse-crystals' ? 'What Does "Cleansing" a Crystal Mean?'
    : action === 'charge' ? 'What Does "Charging" a Crystal Mean?'
    : action === 'activate' ? 'What Does "Activating" a Crystal Mean?'
    : action === 'program' ? 'What Does "Programming" a Crystal Mean?'
    : action === 'meditate' ? 'Why Meditate with Crystals?'
    : action === 'use' ? 'Why Use Crystals? (And the Care Sequence)'
    : cfg.slug && cfg.slug.includes('bracelet') ? 'Why Bracelets Need Special Care'
    : `What Does "${cfg.action[0].toUpperCase()+cfg.action.slice(1)}ing" a Crystal Mean?`;

  const m2 = `<h2>${m2Title}</h2>
<p>{{AI_M2_PARA1}}</p>
<p>{{AI_M2_PARA2}}</p>
<p>{{AI_M2_PARA3}}</p>
${m2ConceptTable}
${m2ExtraAfter}`;

  // ==================== M3 Step-by-Step Methods ====================
  let m3Body = '';

  if (action === 'use') {
    // H6：10 种用法（hub 模式，非方法分层）
    m3Body = `<h2>10 Ways to Use Crystals</h2>
<p>{{AI_M3_TEN_WAYS_INTRO}}</p>`;
    const tw = cfg.ten_ways;
    for (const w of tw) {
      // way 4 meditate 链 H5，way 10 care 链 H1
      let link = '';
      if (w.way === 4 && cfg.internal_links.h5_meditate_link) link = ` — see <a href="${cfg.internal_links.h5_meditate_link.url}">${cfg.internal_links.h5_meditate_link.anchor}</a>`;
      if (w.way === 10 && cfg.internal_links.h1_cleanse_link) link = ` — see <a href="${cfg.internal_links.h1_cleanse_link.url}">${cfg.internal_links.h1_cleanse_link.anchor}</a>`;
      m3Body += `<h3>${w.title}</h3>
<p>{{AI_M3_WAY_${w.way}}}</p>
<p><em>${w.desc}${link}</em></p>`;
    }
  } else if (action === 'meditate') {
    // H5：4 种 practice + chakra body layout
    m3Body = `<h2>How to Meditate with Crystals: 4 Practices</h2>
<p>{{AI_M3_PRACTICES_INTRO}}</p>
<h3 style="color:#2e7d32;">${tiers.tier1_safe.label}</h3>
<p><em>${tiers.tier1_safe.subtitle}</em></p>`;
    for (const mk of tiers.tier1_safe.methods) {
      const tip = mk === 'hold-in-hand' ? (ja['M3-hold-in-hand'] || '') : mk === 'place-on-body' ? (ja['M3-place-on-body'] || '') : '';
      m3Body += methodCard(cfg, mk, tip, true);
    }
    // chakra body layout（place-on-body 法后展开）
    const cb = cfg.chakra_body_layout;
    if (cb) {
      m3Body += `<h3>The 7-Center Chakra Body Layout</h3>
<p>{{AI_M3_CHAKRA_LAYOUT_INTRO}}</p>
<table>
<thead><tr><th>Center</th><th>Position</th><th>Example stones</th></tr></thead>
<tbody>
${cb.centers.map(c => `<tr><td><strong>${c.center}</strong></td><td>${c.position}</td><td><a href="${c.chakra_link}">${c.stone_example}</a></td></tr>`).join('\n')}
</tbody>
</table>
<p><em>${cb.chakra_test_cta.note} <a href="${cb.chakra_test_cta.url}">${cb.chakra_test_cta.anchor}</a>.</em></p>`;
    }
  } else if (cfg.slug && cfg.slug.includes('bracelet')) {
    // H7：3 安全法 + avoid 清单（首饰专属）
    m3Body = `<h2>How to Cleanse a Crystal Bracelet: 3 Safe Methods</h2>
<p>{{AI_M3_BRACELET_INTRO}}</p>
<h3 style="color:#2e7d32;">${tiers.tier1_safe.label}</h3>
<p><em>${tiers.tier1_safe.subtitle}</em></p>`;
    for (const mk of tiers.tier1_safe.methods) {
      m3Body += methodCard(cfg, mk, `Works for elastic cord, metal chain, and woven thread — all three materials tolerate this perfectly.`, true);
    }
    // avoid 清单
    if (tiers.tier3_caution && tiers.tier3_caution.methods.length) {
      m3Body += `<h3 style="color:#c62828;">${tiers.tier3_caution.label}</h3>
<p><em>${tiers.tier3_caution.subtitle}</em></p>
<p>{{AI_M3_AVOID_METHODS_BRACELET}}</p>
<ul>
<li>{{AI_M3_AVOID_WATER}}</li>
<li>{{AI_M3_AVOID_SALT}}</li>
<li>{{AI_M3_AVOID_SMOKE}}</li>
<li>{{AI_M3_AVOID_EARTH}}</li>
<li>{{AI_M3_AVOID_SUN}}</li>
</ul>`;
    }
  } else {
    // H2 charge / H3 activate / H4 program：风险分层方法
    m3Body = `<h2>How to ${cfg.action[0].toUpperCase()+cfg.action.slice(1)} Crystals: ${tiers.tier1_safe.methods.length + (tiers.tier2_conditional.methods.length)} Methods (Ranked by Safety)</h2>
<p>{{AI_M3_TIER_INTRO}}</p>
<h3 style="color:#2e7d32;">${tiers.tier1_safe.label}</h3>
<p><em>${tiers.tier1_safe.subtitle}</em></p>`;
    // Tier 1 方法（首饰 tip 按方法映射）
    const tier1Tips = {
      moonlight: ja['M3-moonlight'] || '', selenite: ja['M3-selenite'] || '',
      sound: 'Works for an entire jewelry collection at once — no need to handle each piece.',
      sunlight: ja['M3-sunlight'] || '', earth: ja['M3-earth'] || '', cluster: '',
      'meditation-focus': ja['M3-meditation-focus'] || ''
    };
    for (const mk of tiers.tier1_safe.methods) {
      m3Body += methodCard(cfg, mk, tier1Tips[mk] || '', true);
    }
    // Tier 2
    if (tiers.tier2_conditional && tiers.tier2_conditional.methods.length) {
      m3Body += `<h3 style="color:#f9a825;">${tiers.tier2_conditional.label}</h3>
<p><em>${tiers.tier2_conditional.subtitle}</em></p>`;
      const tier2Tips = { sunlight: ja['M3-sunlight'] || '', water: ja['M3-water'] || '', smoke: cfg.eastern_touch && cfg.eastern_touch.smoke ? cfg.eastern_touch.smoke + ' — ventilate well; keep smoke away from children, pets, and respiratory-sensitive people; use a fire-safe vessel and fully extinguish after use.' : '' };
      for (const mk of tiers.tier2_conditional.methods) {
        m3Body += methodCard(cfg, mk, tier2Tips[mk] || '', true);
      }
    }
    // Tier 3
    if (tiers.tier3_caution && tiers.tier3_caution.methods.length) {
      m3Body += `<h3 style="color:#c62828;">${tiers.tier3_caution.label}</h3>
<p><em>${tiers.tier3_caution.subtitle}</em></p>`;
      const tier3Tips = { earth: cfg.eastern_touch && cfg.eastern_touch.earth ? cfg.eastern_touch.earth + ' — only high-hardness stones (Mohs 7+), no metal settings; wrap in cloth first.' : '', salt: ja['M3-salt'] || '', cluster: '', sunlight: ja['M3-sunlight'] || '' };
      for (const mk of tiers.tier3_caution.methods) {
        m3Body += methodCard(cfg, mk, tier3Tips[mk] || '', true);
      }
    }
    // safety 总表（仅 H2 charge 加，因为涉及 sun 耐受；H3/H4 program 无物理法不加）
    if (action === 'charge') {
      const safetyTable = MS.safety_quick_reference_table;
      m3Body += `<h3>Crystal Safety Quick Reference (Sun &amp; Water Tolerance)</h3>
<p><em>Which stones tolerate sunlight charging. When unsure, default to moonlight, selenite, or sound.</em></p>
<table>
<thead><tr><th>Stone group (examples)</th><th>Water</th><th>Sun</th><th>Jewelry-safe</th><th>Quick note</th></tr></thead>
<tbody>
${safetyTable.map(r => `<tr><td><strong>${r.group}</strong><br/><em>${(r.examples || []).join(', ')}</em></td><td>${r.water || r.moonlight || '—'}</td><td>${r.sun || '—'}</td><td>${r.jewelry_safe || '—'}</td><td>${r.note}</td></tr>`).join('\n')}
</tbody>
</table>`;
    }
  }

  // 主决策卡片
  const m3 = m3Body + '\n' + decisionCard(cfg, 'main');

  // ==================== M4 水晶推荐（6 角色）====================
  let m4 = `<h2>{{AI_M4_TITLE}}</h2>
<p>{{AI_M4_TRANSITION}}</p>`;
  for (const [role, c] of Object.entries(crystals)) {
    m4 += `<h3>${c.name} — ${c.role_label}</h3>
<p>{{AI_M4_${c.slug.toUpperCase().replace(/-/g, '_')}}}</p>
<p><em>${c.name}</em> — ${c.compliance_phrase}. ${c.reason}. ${c.safety_note ? `<strong>Safety note:</strong> ${c.safety_note}` : ''}</p>
<p><a href="${c.meaning_url}">Read full ${c.name} meaning</a> · <a href="${c.shop_url}">Shop ${c.name}</a></p>`;
  }
  // intention 页互链（H4 program 按 intention 页）
  if (cfg.intention_page_links) {
    m4 += `<p>Set your intention: ${cfg.intention_page_links.mappings.map(im => `<a href="${im.url}">${im.anchor}</a>`).join(' · ')}</p>`;
  } else {
    m4 += `<p>Explore more: <a href="${cfg.internal_links.condition.url}">${cfg.internal_links.condition.anchor}</a> · <a href="${cfg.internal_links.intention.url}">${cfg.internal_links.intention.anchor}</a></p>`;
  }

  // ==================== M5 常见错误 ====================
  let m5 = `<h2>Common Mistakes to Avoid</h2>
<p>{{AI_M5_INTRO}}</p>
<ul>
<li>{{AI_M5_MISTAKE_1}}</li>
<li>{{AI_M5_MISTAKE_2}}</li>
<li>{{AI_M5_MISTAKE_3}}</li>
<li>{{AI_M5_MISTAKE_4}}</li>
<li>{{AI_M5_MISTAKE_5}}</li>
</ul>`;
  // H2/H7 加二次提醒卡
  if (action === 'charge' || (cfg.slug && cfg.slug.includes('bracelet')) || action === 'cleanse') {
    m5 += decisionCard(cfg, 'reminder');
  }

  // ==================== M6 首饰角度 ====================
  let m6Title, m6Body;
  if (action === 'use') {
    m6Title = 'Wearing Crystal Jewelry (Bracelets & Necklaces)';
    m6Body = `<p>{{AI_M6_JEWELRY_CENTRAL}}</p>
<p><strong>Quick jewelry tips:</strong></p>
<ul>
<li>{{AI_M6_TIP_WHICH_HAND}}</li>
<li>{{AI_M6_TIP_NECKLACE_POSITION}}</li>
<li>{{AI_M6_TIP_MONTHLY_CARE}}</li>
</ul>`;
  } else if (action === 'meditate') {
    m6Title = 'Using Jewelry in Meditation';
    m6Body = `<p>{{AI_M6_JEWELRY_MEDITATE}}</p>
<ul>
<li>{{AI_M6_TIP_WORRY_STONE}}</li>
<li>{{AI_M6_TIP_NECKLACE_HEART}}</li>
</ul>`;
  } else if (cfg.slug && cfg.slug.includes('bracelet')) {
    m6Title = 'Complete Bracelet Care Guide';
    m6Body = `<p>{{AI_M6_CARE_GUIDE}}</p>
<ul>
<li>{{AI_M6_DAILY_WEAR}}</li>
<li>{{AI_M6_MONTHLY_CARE}}</li>
<li>{{AI_M6_SEASONAL_CARE}}</li>
<li>{{AI_M6_REMOVE_WHEN}}</li>
</ul>`;
  } else {
    m6Title = `${cfg.action[0].toUpperCase()+cfg.action.slice(1)}ing Crystal Jewelry (Bracelets & Necklaces)`;
    m6Body = `<p>{{AI_M6_SUMMARY}}</p>
<p><strong>Quick jewelry tips:</strong></p>
<ul>
<li>{{AI_M6_TIP_WHICH_HAND}}</li>
<li>{{AI_M6_TIP_FULLMOON}}</li>
<li>{{AI_M6_TIP_FIRST_USE}}</li>
</ul>`;
  }
  // H7 引导（除 H7 自身）
  let m6Extra = '';
  if (cfg.internal_links.h7_bracelet_link && !(cfg.slug && cfg.slug.includes('bracelet'))) {
    m6Extra = `<p>For a deep dive on bracelet materials (elastic cord, metal chain, woven thread), see <a href="${cfg.internal_links.h7_bracelet_link.url}"><strong>${cfg.internal_links.h7_bracelet_link.anchor}</strong></a>.</p>`;
  }
  const m6 = `<h2>${m6Title}</h2>
${m6Body}
${m6Extra}`;

  // ==================== M7 FAQ + Gentle Note + 底部卡 ====================
  const faqData = [
    ...cfg.faq_picks.intent.map(q => ({ q, cat: 'intent' })),
    ...cfg.faq_picks.conversion.map(q => ({ q, cat: 'conversion' })),
    ...cfg.faq_picks.trust.map(q => ({ q, cat: 'trust' })),
    ...cfg.faq_picks.selective.map(q => ({ q, cat: 'selective' }))
  ];
  const faqHtml = faqData.map((f, i) => `<h3>${f.q}</h3>\n<p>{{AI_FAQ_${i}}}</p>`).join('\n');
  const gentleNote = `<p class="gentle-note"><em>${cfg.compliance.gentle_note}</em></p>`;
  const bottomCard = decisionCard(cfg, 'main');
  const m7Title = action === 'cleanse' ? `FAQ About Cleansing ${cfg.slug && cfg.slug.includes('bracelet') ? 'a Crystal Bracelet' : 'Crystals'}`
    : action === 'charge' ? 'Frequently Asked Questions About Charging Crystals'
    : action === 'activate' ? 'Frequently Asked Questions About Activating Crystals'
    : action === 'program' ? 'Frequently Asked Questions About Programming Crystals'
    : action === 'meditate' ? 'Frequently Asked Questions About Meditating with Crystals'
    : action === 'use' ? 'Frequently Asked Questions About Using Crystals'
    : 'Frequently Asked Questions';
  const m7 = `<h2>${m7Title}</h2>
${faqHtml}
${gentleNote}
${bottomCard}`;

  // ---- 组装 ----
  const intro = `<p>{{AI_INTRODUCTION}}</p>`;
  const content = [intro, m1, m2, m3, m4, m5, m6, m7].join('\n\n');

  const faqSchema = faqData.map((f, i) => ({ question: f.q, answer_placeholder: `{{AI_FAQ_${i}}}`, category: f.cat }));

  // 补全 HowTo 6 steps（config 可能只写了 2 步占位）
  const defaultHowToSteps = {
    charge: [
      { step: 1, name: 'Cleanse first (then charge)', text: 'charge前必须先cleanse——清空杯子再倒水' },
      { step: 2, name: 'Check sun tolerance', text: '查mineral-safety-reference，确认该石能否晒阳光' },
      { step: 3, name: 'Choose a safe charging method', text: '从6法中选(moonlight/selenite/sound最安全→sunlight有条件→earth/cluster谨慎)' },
      { step: 4, name: 'Prepare space & materials', text: '准备空间+材料(selenite plate/singing bowl/窗台)' },
      { step: 5, name: 'Charge for recommended time', text: '按该方法时长(moonlight 8+hrs/selenite 6+hrs/sound 5-10min)' },
      { step: 6, name: 'Wear or store mindfully', text: 'charge后佩戴或收纳——满月周期月度charge' }
    ]
  };
  const howtoSteps = (cfg.schema.howto_6_steps && cfg.schema.howto_6_steps.length >= 4)
    ? cfg.schema.howto_6_steps
    : (defaultHowToSteps[action] || cfg.schema.howto_6_steps);

  const howtoSchema = {
    name: cfg.schema.howto_name,
    totalTime: cfg.schema.howto_total_time,
    steps: howtoSteps,
    supplies: ['Selenite charging plate', 'Tibetan singing bowl', 'Full-moon windowsill'].slice(0, action === 'program' ? 1 : 3),
    tools: cfg.tool_cta.enabled ? [`${cfg.tool_cta.tool} (optional safety check)`] : []
  };

  // 图片字段（按 image_plan 生成 images 对象，供 generate-images.js + upload-how-to.js 用）
  const ip = cfg.image_plan;
  const imgBase = `assets/images/generated/10.how-to/${cfg.slug}`;
  const images = {
    hero: { file: `${imgBase}/${ip.hero.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'scene', alt: `{{AI_IMG_HERO_ALT}}` }
  };
  // 分步图（取第一张作为主分步图，命名按方法）
  if (ip.step_diagrams && ip.step_diagrams.length) {
    const sd = ip.step_diagrams[0];
    const key = cfg.slug.includes('bracelet') ? 'materials' : cfg.slug.includes('meditate') ? 'chakra' : cfg.slug.includes('program') ? 'intention' : cfg.slug.includes('use') ? 'care' : 'moonlight';
    images[key] = { file: `${imgBase}/${sd.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'scene', alt: `{{AI_IMG_${key.toUpperCase()}_ALT}}` };
  }
  if (ip.jewelry_scene) {
    images.jewelry = { file: `${imgBase}/${ip.jewelry_scene.filename.replace(/\.jpg$/, '.webp')}`, source_type: 'scene', alt: `{{AI_IMG_JEWELRY_ALT}}` };
  }

  const article = {
    title: cfg.title, slug: cfg.slug, url: cfg.url, action: cfg.action, h1: cfg.h1,
    primary_kw: cfg.primary_kw, secondary_kw: cfg.secondary_kw,
    word_target: cfg.word_target, quality_tier: cfg.quality_tier,
    concept_focus: cfg.concept_focus, methods_used: cfg.methods_used,
    crystals, data_snapshot: cfg.data_snapshot, tool_cta: cfg.tool_cta,
    jewelry_angle: cfg.jewelry_angle, eastern_touch: cfg.eastern_touch,
    faq_picks: cfg.faq_picks, internal_links: cfg.internal_links,
    schema: cfg.schema, compliance: cfg.compliance, three_perspectives: cfg.three_perspectives,
    image_plan: ip,
    rank_math_title: cfg.title,
    rank_math_description: '{{AI_META_DESC}}',
    rank_math_focus_keyword: cfg.primary_kw,
    excerpt: '{{AI_EXCERPT}}',
    faq_schema: faqSchema, howto_schema: howtoSchema,
    diffHints: {
      concept_focus: cfg.concept_focus,
      concept_table_mode: cfg.concept_table_mode,
      local_concept_pair: cfg.local_concept_pair || null,
      safety_first_narrative: cfg.safety_first_narrative,
      jewelry_mode: cfg.jewelry_angle.mode,
      eastern_touch: cfg.eastern_touch,
      three_perspectives: cfg.three_perspectives,
      compliance_phrase_library: cfg.compliance.phrase_library_version
    },
    content, images
  };

  fs.mkdirSync(path.join(DIR, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(DIR, 'articles', cfg.slug + '.json'), JSON.stringify(article, null, 2), 'utf8');
  index.push({ slug: cfg.slug, title: cfg.title, action: cfg.action, quality_tier: cfg.quality_tier });
  made++;
}

// 合并到 articles-index.json（保留 H1）
const idxPath = path.join(DIR, 'articles-index.json');
let existing = { total: 0, articles: [] };
if (fs.existsSync(idxPath)) {
  existing = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
}
const existingSlugs = new Set(existing.articles.map(a => a.slug));
for (const item of index) {
  if (existingSlugs.has(item.slug)) {
    existing.articles = existing.articles.map(a => a.slug === item.slug ? item : a);
  } else {
    existing.articles.push(item);
  }
}
existing.total = existing.articles.length;
fs.writeFileSync(idxPath, JSON.stringify(existing, null, 2), 'utf8');

console.log(`✅ ${made} 篇 How-to 骨架生成（多模式：${[...new Set(index.map(i=>i.action))].join('/')}）`);
console.log(`   articles-index 总计: ${existing.total} 篇`);
