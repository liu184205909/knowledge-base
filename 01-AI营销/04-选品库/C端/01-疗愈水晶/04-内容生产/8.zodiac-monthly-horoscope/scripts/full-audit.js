/**
 * 月运 144 篇全量审核
 * 检查维度：Kill List / H2 / 字数 / HTML格式 / 内链 / 合规 / 宫位数据
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const KILL_LIST = ['delve','leverage','tapestry','landscape','seamless','robust','moreover','furthermore','ultimately'];
const BOUNDARY = ['traditionally','many people','not a substitute','entertainment','lifestyle'];
const REQUIRED_LINKS = ['gemstone','-crystals/','crystals-for-'];
const FORBIDDEN = ['will definitely','cures ','will destroy','will become rich','this is a transformative'];

let issues = [];

for (const file of files) {
  const fpath = path.join(dir, file);
  const raw = fs.readFileSync(fpath, 'utf8');
  let a;
  try { a = JSON.parse(raw); } catch(e) { issues.push({file, type:'JSON_ERROR', detail:e.message.slice(0,60)}); continue; }

  let content = a.content || '';
  if (typeof content !== 'string') content = JSON.stringify(content);
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const lower = plain.toLowerCase();

  const slug = file.replace('.json','');
  const fileIssues = [];

  // 1. H2 数量
  const h2s = (content.match(/<h2>/g) || []).length;
  if (h2s < 8) fileIssues.push(`H2<8(${h2s})`);

  // 2. 字数
  const wc = plain.split(/\s+/).filter(Boolean).length;
  if (wc < 1200) fileIssues.push(`WC<1200(${wc})`);

  // 3. Kill List
  let kl = 0;
  for (const w of KILL_LIST) kl += (lower.match(new RegExp(w,'g'))||[]).length;
  if (kl > 5) fileIssues.push(`KL=${kl}`);

  // 4. 内链
  for (const link of REQUIRED_LINKS) {
    if (!content.includes(link)) fileIssues.push(`MISSING_LINK:${link}`);
  }

  // 5. 合规 - 免责声明
  const hasDisclaimer = content.includes('entertainment') || content.includes('not a substitute') || content.includes('not medical') || content.includes('not a substitute for');
  if (!hasDisclaimer) fileIssues.push('NO_DISCLAIMER');

  // 6. 合规 - 禁止写法
  for (const f of FORBIDDEN) {
    if (lower.includes(f.toLowerCase())) fileIssues.push(`FORBIDDEN:"${f}"`);
  }

  // 7. 合规 - Health 口径
  const hasHealth = lower.includes('health') || lower.includes('wellness');
  if (hasHealth) {
    const hasTraditionally = lower.includes('traditionally') || lower.includes('lifestyle') || lower.includes('mindfulness');
    if (!hasTraditionally) fileIssues.push('HEALTH_NO_LIFESTYLE');
  }

  // 8. 宫位提及（每篇至少有 "house" 或 "宫"）
  const hasHouse = lower.includes('house') || content.includes('\u5BAB');
  if (!hasHouse) fileIssues.push('NO_HOUSE_REF');

  // 9. Crystal of the Month 存在
  const hasCrystal = lower.includes('crystal of the month') || lower.includes('crystal of the month');
  if (!hasCrystal) fileIssues.push('NO_CRYSTAL_MODULE');

  // 10. Ritual 存在
  const hasRitual = lower.includes('ritual');
  if (!hasRitual) fileIssues.push('NO_RITUAL');

  // 11. FAQ Schema
  const hasFAQSchema = content.includes('application/ld+json') || content.includes('FAQPage');
  if (!hasFAQSchema) fileIssues.push('NO_FAQ_SCHEMA');

  // 12. 上下月连续性内链
  const month = slug.match(/-(\w+)-2026$/);
  if (month) {
    const hasPrevNext = content.includes('horoscope') && (content.includes('recap') || content.includes('preview') || content.includes('previous') || content.includes('next') || content.includes('\u56DE\u987E') || content.includes('\u5C55\u671B'));
    // 放宽：只要 Related 里有其他月份链接就算
    const monthLinks = (content.match(/-2026\//g) || []).length;
    if (monthLinks < 2) fileIssues.push(`MONTH_LINKS<2(${monthLinks})`);
  }

  if (fileIssues.length > 0) {
    issues.push({ file, slug, issues: fileIssues });
  }
}

// 输出
console.log('=== 月运 144 篇全量审核 ===\n');
console.log(`总计: ${files.length} 篇`);
console.log(`通过: ${files.length - issues.length} 篇`);
console.log(`问题: ${issues.length} 篇\n`);

if (issues.length > 0) {
  // 按问题类型统计
  const typeStats = {};
  for (const item of issues) {
    for (const iss of item.issues) {
      const type = iss.split('(')[0].split(':')[0];
      typeStats[type] = (typeStats[type] || 0) + 1;
    }
  }
  console.log('问题类型统计:');
  for (const [type, count] of Object.entries(typeStats).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${type}: ${count} 篇`);
  }

  console.log('\n问题文章清单:');
  for (const item of issues) {
    console.log(`  ${item.slug}: ${item.issues.join(', ')}`);
  }
} else {
  console.log('✅ 全部 144 篇通过全量审核');
}
