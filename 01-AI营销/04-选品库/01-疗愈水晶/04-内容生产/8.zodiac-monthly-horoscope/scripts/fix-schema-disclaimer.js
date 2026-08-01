/**
 * 修复 144 篇月运：补 FAQPage Schema + 12 篇补免责声明
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const DISCLAIMER = '<p><em>Astrology and crystal meanings are offered for entertainment, reflection, and spiritual inspiration. Crystals are traditionally associated with certain symbolic qualities, but they are not a substitute for medical, financial, or professional advice. All stones are genuine, ethically sourced, and real — not dyed, not glass.</em></p>';

let schemaFixed = 0, disclaimerFixed = 0;

for (const file of files) {
  const fpath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  let content = a.content || '';
  if (typeof content !== 'string') content = JSON.stringify(content);
  let changed = false;

  // 1. 补 FAQ Schema（如果缺失）
  if (!content.includes('application/ld+json') && !content.includes('FAQPage')) {
    // 提取 FAQ H3 + P 对
    const faqMatches = [];
    const h3Regex = /<h3>([^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
    let match;
    while ((match = h3Regex.exec(content)) !== null) {
      const q = match[1].trim();
      const ans = match[2].replace(/<[^>]+>/g, '').trim();
      if (q.endsWith('?') || q.includes('?')) {
        faqMatches.push({ q, ans: ans.slice(0, 300) });
      }
    }

    if (faqMatches.length > 0) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqMatches.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.ans }
        }))
      };
      const schemaHtml = '\n<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>\n';

      // 在 </p> 最后一个 Related 或文章末尾插入
      if (content.includes('</ul>')) {
        const lastUl = content.lastIndexOf('</ul>');
        content = content.slice(0, lastUl + 5) + schemaHtml + content.slice(lastUl + 5);
      } else {
        content += schemaHtml;
      }
      changed = true;
      schemaFixed++;
    }
  }

  // 2. 补免责声明（如果缺失）
  if (!content.includes('entertainment') && !content.includes('not a substitute')) {
    content += '\n' + DISCLAIMER;
    changed = true;
    disclaimerFixed++;
  }

  if (changed) {
    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  }
}

console.log(`=== 修复完成 ===`);
console.log(`FAQ Schema 补充: ${schemaFixed} 篇`);
console.log(`免责声明补充: ${disclaimerFixed} 篇`);
