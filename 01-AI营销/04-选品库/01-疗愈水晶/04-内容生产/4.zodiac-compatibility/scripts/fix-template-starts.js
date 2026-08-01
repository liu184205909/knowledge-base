/**
 * 句式模板化优化 — 替换 5 个模块的雷同开头句
 *
 * 策略：只替换前 2-4 个模式化词，保留后面内容不变
 * 按 hash(slug) 分配不同替换，确保分布均匀
 */
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../articles');

// 替换映射：原模式 → [替换选项数组]
const REPLACEMENTS = {
  // Challenges: "The core challenge" → 12 种
  'challenges': [
    [
      [/\bThe core challenge\b/i, 'The biggest tension'],
      [/\bThe core challenge\b/i, 'The friction'],
      [/\bThe core challenge\b/i, 'The hard truth'],
      [/\bThe core challenge\b/i, 'The recurring conflict'],
      [/\bThe core challenge\b/i, 'The sticking point'],
      [/\bThe core challenge\b/i, 'The real work'],
      [/\bThe core challenge\b/i, 'The central tension'],
      [/\bThe core challenge\b/i, 'The pressure point'],
      [/\bThe core challenge\b/i, 'What tests this bond'],
      [/\bThe core challenge\b/i, 'The fault line'],
      [/\bThe core challenge\b/i, 'The growth edge'],
      [/\bThe core challenge\b/i, 'The central hurdle'],
    ],
  ],
  // Sexual: "The sexual chemistry" → 12 种
  'sexual': [
    [
      [/\bThe sexual chemistry\b/i, 'The physical chemistry'],
      [/\bThe sexual chemistry\b/i, 'The physical connection'],
      [/\bThe sexual chemistry\b/i, 'The sexual dynamic'],
      [/\bThe sexual chemistry\b/i, 'The intimate chemistry'],
      [/\bThe sexual chemistry\b/i, 'The physical attraction'],
      [/\bThe sexual chemistry\b/i, 'The magnetic pull'],
      [/\bThe sexual chemistry\b/i, 'The bedroom dynamic'],
      [/\bThe sexual chemistry\b/i, 'The sensual connection'],
      [/\bThe sexual chemistry\b/i, 'The erotic tension'],
      [/\bThe sexual chemistry\b/i, 'The physical compatibility'],
      [/\bThe sexual chemistry\b/i, 'The intimate dynamic'],
      [/\bThe sexual chemistry\b/i, 'The passionate undercurrent'],
    ],
  ],
  // Communication: "The communication between" → 12 种
  'communication': [
    [
      [/\bThe communication between\b/i, 'The dialogue between'],
      [/\bThe communication between\b/i, 'The conversational style between'],
      [/\bThe communication between\b/i, 'The way these two talk —'],
      [/\bThe communication between\b/i, 'The communication dynamic between'],
      [/\bThe communication between\b/i, 'The exchange between'],
      [/\bThe communication between\b/i, 'The verbal dance between'],
      [/\bThe communication between\b/i, 'How messages land between'],
      [/\bThe communication between\b/i, 'The speaking dynamic between'],
      [/\bThe communication between\b/i, 'The language gap between'],
      [/\bThe communication between\b/i, 'The back-and-forth between'],
      [/\bThe communication between\b/i, 'The conversational rhythm between'],
      [/\bThe communication between\b/i, 'The wordplay between'],
    ],
  ],
  // Friendship: "As friends, this" → 12 种
  'friendship': [
    [
      [/\bAs friends, this\b/i, 'In friendship, this'],
      [/\bAs friends, this\b/i, 'Platonically, this'],
      [/\bAs companions, this\b/i, 'As a duo, this'],
      [/\bAs friends, this\b/i, 'Outside romance, this'],
      [/\bAs friends, this\b/i, 'The friendship dynamic: this'],
      [/\bAs friends, this\b/i, 'Socially, this'],
      [/\bAs friends, this\b/i, 'In each other\'s corner, this'],
      [/\bAs friends, this\b/i, 'The buddy dynamic: this'],
      [/\bAs friends, this\b/i, 'Without the romance, this'],
      [/\bAs friends, this\b/i, 'Friendship-wise, this'],
      [/\bAs friends, this\b/i, 'In everyday company, this'],
      [/\bAs friends, this\b/i, 'On the platonic side, this'],
    ],
  ],
  // Love: "The romance between" → 10 种
  'love': [
    [
      [/\bThe romance between\b/i, 'The romantic dynamic between'],
      [/\bThe romance between\b/i, 'The love story between'],
      [/\bThe romance between\b/i, 'The romantic connection between'],
      [/\bThe romance between\b/i, 'What happens romantically between'],
      [/\bThe romance between\b/i, 'The chemistry between'],
      [/\bThe romance between\b/i, 'The love connection between'],
      [/\bThe romance between\b/i, 'The romantic pull between'],
      [/\bThe romance between\b/i, 'The affection between'],
      [/\bThe romance between\b/i, 'The heart dynamic between'],
      [/\bThe romance between\b/i, 'The romantic spark between'],
      [/\bThe romance between\b/i, 'The tender side of the bond between'],
      [/\bThe romance between\b/i, 'The emotional thread between'],
    ],
  ],
};

// 模块名 → H2 匹配关键词
const MOD_KEYS = {
  'love': 'Love',
  'friendship': 'Friendship',
  'sexual': 'Sexual',
  'communication': 'Communication',
  'challenges': 'Challenges',
};

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
const stats = {};

for (const modKey of Object.keys(REPLACEMENTS)) {
  stats[modKey] = { replaced: 0, skipped: 0 };
}

for (const file of files) {
  const fpath = path.join(dir, file);
  const a = JSON.parse(fs.readFileSync(fpath, 'utf8'));
  const slug = file.replace('.json', '');
  let content = a.content;
  let modified = false;

  for (const [modKey, patterns] of Object.entries(REPLACEMENTS)) {
    const options = patterns[0]; // 替换选项数组
    const h2Key = MOD_KEYS[modKey];

    // 找到模块 H2 后的第一段
    const re = new RegExp('(<h2>[^<]*' + h2Key + '[^<]*</h2>\\s*<p>)([^<]{0,300})', 'i');
    const match = content.match(re);
    if (!match) continue;

    const before = match[1];
    const paraText = match[2];

    // 尝试每个替换选项
    const idx = hash(slug + modKey) % options.length;
    const [pattern, replacement] = options[idx];

    if (pattern.test(paraText)) {
      const newPara = paraText.replace(pattern, replacement);
      content = content.replace(match[0], before + newPara);
      stats[modKey].replaced++;
      modified = true;
    } else {
      stats[modKey].skipped++;
    }
  }

  if (modified) {
    a.content = content;
    fs.writeFileSync(fpath, JSON.stringify(a, null, 2), 'utf8');
  }
}

console.log('=== 句式模板化优化完成 ===\n');
for (const [mod, s] of Object.entries(stats)) {
  console.log(`${mod}: ${s.replaced} 篇替换, ${s.skipped} 篇跳过（非雷同开头）`);
}
