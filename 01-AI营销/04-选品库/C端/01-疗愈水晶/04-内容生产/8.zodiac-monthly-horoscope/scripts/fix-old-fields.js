/**
 * 修复旧格式月运文章的字段结构
 *
 * 旧格式（april/february/march/may）：seo_title, h1, at_a_glance, energy_theme 等
 * 标准格式：title, excerpt, rank_math_title, rank_math_description, rank_math_focus_keyword
 *
 * 用法：node fix-old-fields.js
 */
const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));

let fixed = 0, skipped = 0;

for (const file of files) {
  const fpath = path.join(ARTICLES_DIR, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));

  // 已有标准字段 → 跳过
  if (a.title && a.excerpt) {
    skipped++;
    continue;
  }

  const slug = a.slug || file.replace('.json', '');
  const parts = slug.split('-');
  const sign = a.sign || parts[0];
  const month = a.month || parts[1];
  const monthLower = (month || '').toLowerCase();

  // title: 用 seo_title 或 h1 或构造
  if (!a.title) {
    a.title = a.seo_title || a.h1 || `${sign} ${month} 2026 Horoscope and Crystal of the Month`;
  }

  // excerpt: 从 energy_theme 或 at_a_glance 构造
  if (!a.excerpt) {
    const energy = a.energy_theme || '';
    const crystal = a.crystal_of_month || '';
    const glance = a.at_a_glance?.['Energy Theme'] || '';
    const theme = energy || glance;
    a.excerpt = `${sign} ${month} 2026 horoscope: ${theme}. Crystal of the Month: ${crystal}. Key dates, love, career, and ritual guidance inside.`.slice(0, 160);
  }

  // rank_math_title
  if (!a.rank_math_title) {
    a.rank_math_title = a.seo_title || a.title;
  }

  // rank_math_description
  if (!a.rank_math_description) {
    a.rank_math_description = a.excerpt;
  }

  // rank_math_focus_keyword
  if (!a.rank_math_focus_keyword) {
    a.rank_math_focus_keyword = `${sign.toLowerCase()} ${monthLower} 2026 horoscope`;
  }

  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  fixed++;
}

console.log(`修复完成: ${fixed} 篇, 跳过(已是标准格式): ${skipped} 篇`);
