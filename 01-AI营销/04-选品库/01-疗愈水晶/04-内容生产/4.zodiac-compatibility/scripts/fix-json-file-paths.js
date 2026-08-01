/**
 * zodiac-compatibility 78篇 json images.file 字段批量修正（P2 数据卫生）
 * 现状：file 指向错误路径（articles/{slug}/ 或 generated/{slug}/）
 * 修正为真实路径：assets/images/generated/4.zodiac-compatibility/{slug}/{slug}-{kind}.webp
 *   kind 映射: featured->featured, crystal_pair->crystal-pair, how_to_use->how-to-use
 * 安全检查：只改 file 字段；保留其他字段；不改 content
 * 幂等：已是正确路径则跳过
 * 改前已备份到 _backups_json_file_fix/
 */
const fs = require('fs'), path = require('path');
const DIR = path.resolve(__dirname, '..', 'articles');
const KIND = { featured: 'featured', crystal_pair: 'crystal-pair', how_to_use: 'how-to-use' };
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
let changed = 0, skipped = 0, fieldsFixed = 0;
const log = [];
for (const f of files) {
  const p = path.join(DIR, f);
  const a = JSON.parse(fs.readFileSync(p, 'utf8'));
  const slug = a.slug || f.replace('.json', '');
  let touched = false;
  if (a.images) {
    for (const [k, v] of Object.entries(a.images)) {
      const kind = KIND[k] || k.replace('_', '-');
      const expected = `assets/images/generated/4.zodiac-compatibility/${slug}/${slug}-${kind}.webp`;
      if (v.file !== expected) {
        const old = v.file;
        v.file = expected;
        fieldsFixed++;
        touched = true;
        log.push(`${slug}/${k}: ${old} -> ${expected}`);
      }
    }
  }
  if (touched) {
    // 保持 2 空格缩进（与原 json 一致），写回
    fs.writeFileSync(p, JSON.stringify(a, null, 2) + '\n', 'utf8');
    changed++;
  } else {
    skipped++;
  }
}
console.log(`总文件 ${files.length}, 修改 ${changed}, 跳过 ${skipped}, 字段修正 ${fieldsFixed}`);
fs.writeFileSync(path.join(__dirname, '_json-file-fix-log.json'), JSON.stringify(log, null, 2), 'utf8');
console.log('明细见 _json-file-fix-log.json');