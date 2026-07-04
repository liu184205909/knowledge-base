/**
 * 构建 MBTI 16 hero 图清单（articles-images.json）
 * 每张 prompt：MBTI 4 字母 + 本命大牌视觉 + 代表水晶 + 东方藏式调性 + no text + flowing robes 避 naked
 * 文件路径：02-网站规划/generated/mbti-hero/{slug}.webp（与 generate-images.js PROJECT_ROOT 对齐）
 */
const fs = require('fs'), path = require('path');
const BASE = path.resolve(__dirname, '..');
const SHARED = path.resolve(__dirname, '../../../07-互动工具/_shared');
const mbti = JSON.parse(fs.readFileSync(path.join(SHARED, 'mbti-tarot-knowledge.json'), 'utf8'));
const tarot = JSON.parse(fs.readFileSync(path.join(SHARED, 'tarot-knowledge.json'), 'utf8'));
const cardBySlug = {};
for (const c of tarot.cards) cardBySlug[c.slug] = c;

const articles = {};
for (const [type, t] of Object.entries(mbti.types)) {
  const slug = 'mbti-' + type.toLowerCase() + '-tarot';
  const pCard = cardBySlug[t.birth_cards.primary.slug];
  const crystalName = t.crystals[0].name;
  const cardName = pCard ? pCard.name : t.birth_cards.primary.slug;
  const cardVisual = pCard && pCard.upright_keywords ? pCard.upright_keywords.slice(0, 4).join(', ') : 'sacred geometry';

  const prompt = `A symbolic editorial illustration for the article "${type} Tarot: Birth Cards, Crystals & Cognitive Functions". Central composition: the four large gilded letters "${type}" rendered as luminous golden sacred-geometry monograms floating above a single tarot major arcana card representing ${cardName} (visual motifs: ${cardVisual}). A single natural ${crystalName} crystal gemstone placed gracefully beside the card as a tactile anchor, its natural color and facets clearly visible. A serene figure in flowing white robes (fully draped, elegant, dignified) sits in contemplation beside the card, holding the crystal. The composition is rendered in warm elegant luminous golden line work with a soft glow, deep indigo background harmonized with the accent palette. Rich spiritual graphic design, subtle Eastern-inspired Tibetan gallery atmosphere, sacred geometry motifs, faint mandala line work in the deep indigo background, luminous golden particles floating, soft glow of contemplative practice, contemplative and inviting educational atmosphere, premium editorial quality, no text, no words, no letters beyond the four MBTI letters ${type}, no nudity, fully clothed in flowing robes.`;

  articles[slug] = {
    type: 'mbti-hero',
    mbti_type: type,
    primary_card: t.birth_cards.primary.slug,
    growth_card: t.birth_cards.growth.slug,
    primary_kw: type.toLowerCase() + ' tarot card',
    hero: {
      prompt,
      file: 'generated/mbti-hero/' + slug + '.webp',
      alt: type + ' tarot birth card ' + cardName + ' with ' + crystalName + ' crystal'
    },
    crystals: t.crystals.map(c => ({ slug: c.slug.replace(/-meaning$/, ''), name: c.name }))
  };
}

const out = {
  _meta: {
    purpose: 'MBTI 16 型 hub 文章 hero 图清单',
    total: 16,
    style: 'MBTI 4 字母 + 本命大牌视觉 + 代表水晶 + 东方藏式 + flowing robes 避 naked + no text(除 4 字母)',
    model: 'gpt-image-2',
    size: '1536x1024',
    source_type: 'mbti-hero'
  },
  articles
};

fs.writeFileSync(path.join(BASE, 'configs', 'articles-images.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('生成 ' + Object.keys(articles).length + ' 项 hero 图清单 → configs/articles-images.json');
