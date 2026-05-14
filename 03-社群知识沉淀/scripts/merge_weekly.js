// 按周合并消息并输出 Markdown
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', '2026优联荟', 'raw_data');
const WEEKLY_DIR = path.join(__dirname, '..', '2026优联荟', '按周归档');

if (!fs.existsSync(WEEKLY_DIR)) {
  fs.mkdirSync(WEEKLY_DIR, { recursive: true });
}

// 读取所有日期文件
const files = fs.readdirSync(RAW_DIR).filter(f => f.startsWith('messages_') && f.endsWith('.json'));
const allMsgs = [];

files.forEach(f => {
  const msgs = JSON.parse(fs.readFileSync(path.join(RAW_DIR, f), 'utf8'));
  allMsgs.push(...msgs);
});

// 按时间排序（升序）
allMsgs.sort((a, b) => a.time.localeCompare(b.time));

// ISO week number
function getWeekNumber(dateStr) {
  const d = new Date(dateStr.replace(/-/g, '/'));
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + yearStart.getDay() + 1) / 7);
  return { year: d.getFullYear(), week: weekNo };
}

// 按周分组
const weeklyGroups = {};
allMsgs.forEach(msg => {
  const { year, week } = getWeekNumber(msg.time);
  const key = `${year}-W${String(week).padStart(2, '0')}`;
  if (!weeklyGroups[key]) weeklyGroups[key] = [];
  weeklyGroups[key].push(msg);
});

// 输出每周一个 md 文件（原始内容，待后续总结）
Object.entries(weeklyGroups).forEach(([weekKey, msgs]) => {
  const dates = msgs.map(m => m.time.split(' ')[0]);
  const uniqueDates = [...new Set(dates)].sort();
  const dateRange = `${uniqueDates[0].slice(5)}~${uniqueDates[uniqueDates.length - 1].slice(5)}`;

  let md = `# ${weekKey} (${dateRange})\n\n`;
  md += `> 共 ${msgs.length} 条消息\n\n---\n\n`;

  msgs.forEach(msg => {
    const time = msg.time.split(' ')[1] || msg.time;
    const date = msg.time.split(' ')[0];
    // 清理内容中的图片标记和特殊格式
    let content = msg.content
      .replace(/!\[图片\]\([^)]+\)/g, '[图片]')
      .replace(/!\[.*?\]\(@lQLP[^)]+\)/g, '[图片]')
      .replace(/\[.*?\]\(@lQLP[^)]+\)/g, '[图片]')
      .replace(/BIZ_TYPE_ONEFEED_POST[\s\S]*$/g, '[圈子帖子链接]')
      .trim();

    if (content.length > 0) {
      md += `**${date} ${time}**\n\n${content}\n\n---\n\n`;
    }
  });

  const filename = `${weekKey.replace('-', '')}-${dateRange.replace(/~/g, '~')}.md`;
  fs.writeFileSync(path.join(WEEKLY_DIR, filename), md, 'utf8');
  console.log(`${weekKey}: ${msgs.length} messages -> ${filename}`);
});

console.log(`\nTotal weeks: ${Object.keys(weeklyGroups).length}`);
