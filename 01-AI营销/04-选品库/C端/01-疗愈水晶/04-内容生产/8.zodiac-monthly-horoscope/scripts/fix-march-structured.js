/**
 * 把 March 2026 的结构化 content（数组）转为 HTML 字符串
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');
const marchFiles = fs.readdirSync(dir).filter(f => f.includes('-march-2026') && f.endsWith('.json'));

let fixed = 0;

for (const file of marchFiles) {
  const fpath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));

  if (typeof a.content === 'string') continue; // already string

  if (!Array.isArray(a.content)) {
    console.log(`⚠️ ${file}: content is ${typeof a.content}, skipping`);
    continue;
  }

  let html = '';
  for (const section of a.content) {
    if (!section || typeof section !== 'object') continue;

    // H2 heading
    if (section.heading) {
      html += `<h2>${section.heading}</h2>\n`;
    }

    // Body text
    if (section.body) {
      html += `<p>${section.body.replace(/\n/g, '</p>\n<p>')}</p>\n`;
    }

    // Table
    if (section.table && Array.isArray(section.table)) {
      html += '<table>\n';
      for (const row of section.table) {
        if (Array.isArray(row)) {
          html += '<tr>' + row.map(cell => {
            const val = typeof cell === 'object' ? (cell.text || cell.value || JSON.stringify(cell)) : cell;
            return `<td>${val}</td>`;
          }).join('') + '</tr>\n';
        }
      }
      html += '</table>\n';
    }

    // FAQ
    if (section.faq && Array.isArray(section.faq)) {
      for (const item of section.faq) {
        if (Array.isArray(item)) {
          const q = item[0] || '';
          const ans = item[1] || '';
          html += `<h3>${q}</h3>\n<p>${ans}</p>\n`;
        } else if (item.q) {
          html += `<h3>${item.q}</h3>\n<p>${item.a || item.answer || ''}</p>\n`;
        }
      }
    }

    // Links
    if (section.links && Array.isArray(section.links)) {
      html += '<ul>\n';
      for (const link of section.links) {
        html += `<li><a href="${link}">${link}</a></li>\n`;
      }
      html += '</ul>\n';
    }
  }

  a.content = html;
  fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  fixed++;
}

console.log(`✅ March 结构化→HTML: ${fixed} 篇转换`);
