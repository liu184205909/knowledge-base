/**
 * 补充剩余 36 篇的 FAQ Schema（宽松匹配）
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let fixed = 0;

for (const file of files) {
  const fpath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  let content = a.content || '';
  if (typeof content !== 'string') content = JSON.stringify(content);

  // 已有 schema 跳过
  if (content.includes('application/ld+json') || content.includes('FAQPage')) continue;

  // 宽松提取 FAQ：匹配各种格式的问题
  const faqItems = [];

  // Pattern 1: <h3>question?</h3> followed by text
  const p1 = content.matchAll(/<h3[^>]*>([^<]{10,200}\?)<\/h3>[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>|<div[^>]*>([\s\S]*?)<\/div>)/g);
  for (const m of p1) {
    const q = m[1].trim();
    const ans = (m[2] || m[3] || '').replace(/<[^>]+>/g, '').trim().slice(0, 300);
    if (q && ans) faqItems.push({ q, ans });
  }

  // Pattern 2: <strong>question?</strong> followed by text
  if (faqItems.length === 0) {
    const p2 = content.matchAll(/<strong[^>]*>([^<]{10,200}\?)<\/strong>[\s\S]*?(?:<br|<p|<\/p>|\n\n)([\s\S]{20,500}?)(?:<\/p>|<br|\n\n|<strong)/g);
    for (const m of p2) {
      const q = m[1].trim();
      const ans = (m[2] || '').replace(/<[^>]+>/g, '').trim().slice(0, 300);
      if (q && ans) faqItems.push({ q, ans });
    }
  }

  // Pattern 3: ### question? (Markdown 转换后的)
  if (faqItems.length === 0) {
    const p3 = content.matchAll(/(?:^|\n)([^<\n]{10,200}\?)\n([\s\S]{20,500}?)(?:\n\n|\n<[hH]|$)/g);
    for (const m of p3) {
      const q = m[1].trim();
      const ans = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 300);
      if (q && ans) faqItems.push({ q, ans });
    }
  }

  // Pattern 4: 找 FAQ 模块下的所有 H3（即使不带问号）
  if (faqItems.length === 0) {
    const faqStart = content.toLowerCase().indexOf('faq');
    if (faqStart > -1) {
      const faqSection = content.slice(faqStart);
      const p4 = faqSection.matchAll(/<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g);
      for (const m of p4) {
        const q = m[1].trim();
        const ans = m[2].replace(/<[^>]+>/g, '').trim().slice(0, 300);
        if (q && ans) faqItems.push({ q, ans });
      }
    }
  }

  if (faqItems.length > 0) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.ans }
      }))
    };
    const schemaHtml = '\n<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>\n';

    if (content.includes('</ul>')) {
      const lastUl = content.lastIndexOf('</ul>');
      content = content.slice(0, lastUl + 5) + schemaHtml + content.slice(lastUl + 5);
    } else {
      content += schemaHtml;
    }

    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
    fixed++;
  } else {
    console.log(`  ⚠️ ${file}: 无法提取 FAQ`);
  }
}

console.log(`\n补充 FAQ Schema: ${fixed} 篇`);
