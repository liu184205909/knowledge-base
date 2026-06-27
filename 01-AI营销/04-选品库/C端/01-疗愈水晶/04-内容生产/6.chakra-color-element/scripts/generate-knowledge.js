/**
 * 生成 3 维度知识单源 JSON（供文章M2 + 工具题目/结果共用，避免不一致）
 * chakra-knowledge.json(7脉轮) / color-knowledge.json(12色) / element-knowledge.json(4元素)
 * 知识=标准体系(竞品tinyrituals/rockparadise/moonrisecrystals验证), 水晶=spoke-data.json
 * 输出 → 07-互动工具/_shared/（工具与文章共用路径）
 */
const fs = require('fs'), path = require('path');
const spoke = require('../../../07-互动工具/_shared/crystal-attributes.json'); // placeholder, 实际用 spoke-data
const SPOKE = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'spoke-data.json'), 'utf8'));
const SHARED = path.resolve(__dirname, '../../../07-互动工具/_shared');

// 7 脉轮标准知识（竞品 tinyrituals/7chakracolors/energymuse 一致，非编造）
const CHAKRA_KNOWLEDGE = {
  root: { sanskrit: 'Muladhara', position: 'Base of the spine', color: 'Red', element: 'Earth', function: 'Grounding, survival, safety, stability', imbalanced: 'Anxiety, fear, feeling ungrounded, financial worry, disconnection', balanced: 'Security, stability, presence, confidence' },
  sacral: { sanskrit: 'Svadhisthana', position: 'Lower abdomen', color: 'Orange', element: 'Water', function: 'Creativity, emotions, pleasure, sexuality', imbalanced: 'Guilt, emotional numbness, creative blocks', balanced: 'Creative flow, emotional openness, healthy boundaries' },
  'solar-plexus': { sanskrit: 'Manipura', position: 'Upper abdomen', color: 'Yellow', element: 'Fire', function: 'Willpower, confidence, personal power', imbalanced: 'Low self-worth, need for control, digestive tension', balanced: 'Self-confidence, motivation, agency' },
  heart: { sanskrit: 'Anahata', position: 'Center of chest', color: 'Green/Pink', element: 'Air', function: 'Love, compassion, connection, forgiveness', imbalanced: 'Loneliness, jealousy, holding grudges', balanced: 'Compassion, healthy relationships, self-love' },
  throat: { sanskrit: 'Vishuddha', position: 'Throat', color: 'Blue', element: 'Ether/Air', function: 'Communication, truth, self-expression', imbalanced: 'Fear of speaking, dishonesty, being unheard', balanced: 'Clear expression, authentic voice' },
  'third-eye': { sanskrit: 'Ajna', position: 'Between the eyebrows', color: 'Indigo', element: 'Light', function: 'Intuition, insight, imagination', imbalanced: 'Confusion, lack of direction, dismissing gut feelings', balanced: 'Clarity, discernment, trust in intuition' },
  crown: { sanskrit: 'Sahasrara', position: 'Top of head', color: 'Violet/White', element: 'Thought/Consciousness', function: 'Spiritual connection, wisdom, higher purpose', imbalanced: 'Feeling isolated, lack of meaning, cynicism', balanced: 'Inner peace, sense of connection, open-mindedness' },
};
// 12 颜色象征（竞品 rockparadise/capecodcrystals/tinyrituals 一致）
const COLOR_KNOWLEDGE = {
  white: { symbolism: 'Purity, clarity, new beginnings', psychology: 'Cleansing, mental clarity, fresh start', chakra: 'Crown', element: 'All' },
  yellow: { symbolism: 'Joy, optimism, confidence', psychology: 'Mental stimulation, energy, cheer', chakra: 'Solar Plexus', element: 'Air/Fire' },
  green: { symbolism: 'Growth, harmony, renewal', psychology: 'Balance, calm, healing', chakra: 'Heart', element: 'Earth' },
  brown: { symbolism: 'Grounding, stability, earth', psychology: 'Rootedness, reliability, comfort', chakra: 'Root/Earth Star', element: 'Earth' },
  black: { symbolism: 'Protection, grounding, mystery', psychology: 'Absorbing negativity, boundary-setting', chakra: 'Root/Earth Star', element: 'Earth' },
  pink: { symbolism: 'Love, compassion, tenderness', psychology: 'Emotional warmth, self-care, nurturing', chakra: 'Heart', element: 'Water' },
  blue: { symbolism: 'Calm, truth, communication', psychology: 'Soothing, focus, honest expression', chakra: 'Throat/Third Eye', element: 'Water/Air' },
  red: { symbolism: 'Passion, vitality, courage', psychology: 'Energy, strength, action', chakra: 'Root', element: 'Fire' },
  orange: { symbolism: 'Creativity, joy, warmth', psychology: 'Enthusiasm, social warmth, creative spark', chakra: 'Sacral', element: 'Fire/Water' },
  grey: { symbolism: 'Neutrality, calm, introspection', psychology: 'Detachment, balance, quiet reflection', chakra: 'Neutral', element: 'Air/Metal' },
  'blue-green': { symbolism: 'Transformation, flow, truth', psychology: 'Calm communication, emotional release', chakra: 'Throat/Heart', element: 'Water/Air' },
  purple: { symbolism: 'Spirituality, wisdom, intuition', psychology: 'Deep contemplation, spiritual awareness', chakra: 'Third Eye/Crown', element: 'Air/Thought' },
};
// 4 元素特性（竞品 moonrisecrystals/crystalvaults 一致）
const ELEMENT_KNOWLEDGE = {
  earth: { traits: 'Grounding, stability, patience, abundance', balanced: 'Steady, reliable, nurturing, practical', imbalanced: 'Stagnation, stubbornness, feeling stuck', zodiac: 'Taurus, Virgo, Capricorn', fengshui: 'Northeast/Southwest, knowledge/relationships areas', chakra: 'Root' },
  fire: { traits: 'Passion, courage, creativity, transformation', balanced: 'Motivated, confident, inspiring', imbalanced: 'Burnout, anger, impulsiveness', zodiac: 'Aries, Leo, Sagittarius', fengshui: 'South, fame/recognition area', chakra: 'Solar Plexus' },
  air: { traits: 'Intellect, communication, freedom, clarity', balanced: 'Clear-thinking, articulate, open-minded', imbalanced: 'Scattered, detached, overthinking', zodiac: 'Gemini, Libra, Aquarius', fengshui: 'Southeast/East, wisdom area', chakra: 'Heart/Throat' },
  water: { traits: 'Emotion, intuition, healing, flow', balanced: 'Empathetic, intuitive, adaptable', imbalanced: 'Overwhelm, mood swings, clinging', zodiac: 'Cancer, Scorpio, Pisces', fengshui: 'North, career/life path area', chakra: 'Sacral' },
};

function build() {
  const byType = { chakra: [], color: [], element: [] };
  for (const s of SPOKE.spokes) byType[s.type].push(s);

  // chakra
  const chakra = {};
  for (const s of byType.chakra) {
    const k = CHAKRA_KNOWLEDGE[s.slug];
    chakra[s.slug] = { ...k, name: s.name, crystals: s.crystals, article: s.url };
  }
  // color
  const color = {};
  for (const s of byType.color) {
    const k = COLOR_KNOWLEDGE[s.slug];
    color[s.slug] = { ...k, name: s.name, crystals: s.crystals, article: s.url };
  }
  // element
  const element = {};
  for (const s of byType.element) {
    const k = ELEMENT_KNOWLEDGE[s.slug];
    element[s.slug] = { ...k, name: s.name, crystals: s.crystals, article: s.url };
  }

  fs.writeFileSync(path.join(SHARED, 'chakra-knowledge.json'), JSON.stringify({ _meta: { source: 'standard chakra system + tinyrituals/7chakracolors', for: 'Chakra文章M2 + Chakra Test工具' }, chakras: chakra }, null, 2));
  fs.writeFileSync(path.join(SHARED, 'color-knowledge.json'), JSON.stringify({ _meta: { source: 'color symbolism standard + rockparadise/capecodcrystals', for: 'Color文章M2 + Crystal Quiz工具' }, colors: color }, null, 2));
  fs.writeFileSync(path.join(SHARED, 'element-knowledge.json'), JSON.stringify({ _meta: { source: '4-element system + moonrisecrystals/crystalvaults', for: 'Element文章M2/M6/M7 + Element Test工具' }, elements: element }, null, 2));

  console.log('✅ 3 维度知识单源生成 → 07-互动工具/_shared/');
  console.log('  chakra-knowledge.json: ' + Object.keys(chakra).length + ' 脉轮');
  console.log('  color-knowledge.json: ' + Object.keys(color).length + ' 颜色');
  console.log('  element-knowledge.json: ' + Object.keys(element).length + ' 元素');
}
build();
