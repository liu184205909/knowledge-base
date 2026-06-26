/**
 * 一次性：给 amethyst-and-selenite.json 填模块 4/5/6（v2，按审稿修订）
 * v2 改动：M4 三视角 Practical/Energetic/Psychological；M5 扩到 60-80词/个，#6 弱化绝对；
 *         M6 去 anxiety/under-pillow/upper-chakra-opening，Selenite 不建议叠戴；覆盖 excerpt
 */
const fs = require('fs');
const path = require('path');
const f = path.resolve(__dirname, '../articles/amethyst-and-selenite.json');
const art = JSON.parse(fs.readFileSync(f, 'utf8'));

const M2 = `<h2>About Amethyst</h2>
<p>Amethyst is a purple variety of quartz, traditionally associated with calm, spiritual awareness, and protection. In crystal practice it's often linked with the Crown and Third Eye chakras, which makes it a natural fit for meditation, sleep rituals, and stress relief. Common forms include bracelets, pendants, earrings, and tumbled clusters.</p>
<p>Mineralogically, Amethyst is silicon dioxide (SiO₂) with a Mohs hardness of 7, durable enough for everyday bracelets, pendants, and rings. Its purple color comes from iron and natural irradiation. Amethyst tolerates only brief contact with water and should be kept away from salt water and prolonged direct sun.</p>
<p><a href="/gemstone/amethyst-meaning/">Amethyst Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>`;

const M3 = `<h2>About Selenite</h2>
<p>Selenite is a luminous white to pale form of gypsum, traditionally associated with clarity, cleansing, and calm spiritual focus. In crystal practice it's often linked with the Crown and Third Eye chakras, which makes it a natural match for meditation spaces, bedside rituals, and altar setups. Many people use Selenite as a wand, tower, plate, or palm stone rather than as heavy everyday jewelry.</p>
<p>Mineralogically, Selenite is calcium sulfate dihydrate (CaSO₄·2H₂O) with a Mohs hardness of 2, making it much softer than quartz-family stones like Amethyst. It should be kept dry, handled gently, and stored away from harder crystals that may scratch it.</p>
<p><a href="/gemstone/selenite-meaning/">Selenite Meaning →</a> · Genuine, ethically sourced — not dyed, not glass.</p>`;

const M4 = `<h2>Can You Wear Amethyst and Selenite Together?</h2>
<p><strong>Practically:</strong> Amethyst and Selenite can be used together, but they need different handling. Amethyst is a durable quartz at 7 on the Mohs scale, well suited to everyday bracelets and pendants, while Selenite is a much softer form of gypsum at 2 and should be kept away from water. That makes Amethyst the better everyday wearable, while Selenite is often better as a wand, plate, tower, or bedside stone. Their purple and luminous white tones also create a calm, visually cohesive pairing for meditation spaces and nightstands.</p>
<p><strong>Energetically:</strong> In crystal tradition, both stones are linked to the air element and to the crown and third-eye chakras, so together they're seen as a "high-attunement" pair — Amethyst is said to stabilize insight while Selenite is believed to clear and cleanse the energy field. Many practitioners keep Selenite near Amethyst to help it stay cleared between uses.</p>
<p><strong>Psychologically:</strong> Because the two share calm, protection, and spiritual intentions, the pairing works well as a single ritual anchor — one intention (rest, meditation, or space-clearing) carried by two reinforcing stones rather than two competing ones.</p>
<p><em>These properties are traditionally associated with crystal practice; many people find the pairing supportive, though the effects are not scientifically proven.</em></p>`;

const M5 = `<h2>Benefits of Amethyst + Selenite</h2>
<p>Together, Amethyst and Selenite cover six complementary strengths:</p>
<h3>1. Deep, Layered Calm</h3>
<p>Amethyst is traditionally used to quiet a busy mind, while Selenite is chosen for the sense of clarity and space it brings. Worn or placed together, the calm often arrives in two layers — first the mental noise settles, then a clearer, lighter feeling follows. Many people reach for this pairing in the evening when they want to step out of a racing day and into something quieter, without leaning on a single "stronger" stone.</p>
<h3>2. Amplified Spiritual Awareness</h3>
<p>Both stones are linked to the crown and third-eye chakras — the centers most associated with insight, meditation, and intuitive work. Combined, they're traditionally used to deepen contemplative practice, with Amethyst said to ground the insights that arise so they don't feel scattered, and Selenite believed to keep the mental channel clear. For people who sit in meditation regularly, this is one of the more common pairings for insight and contemplative work.</p>
<h3>3. Stronger Protection & Space Cleansing</h3>
<p>Amethyst is one of the more popular stones for everyday protection, and Selenite is best known for cleansing rooms, altars, and the stones placed near it. Together they cover two jobs at once — guarding the wearer and refreshing the space. It's a common setup for bedrooms, meditation corners, and treatment rooms, where people want the area to feel both kept and cleared rather than heavy or stagnant.</p>
<h3>4. Better Sleep & Bedtime Wind-Down</h3>
<p>This is a pairing our site already recommends, and it's an especially popular one around sleep. Amethyst is traditionally used for the thoughts that keep circling at bedtime, while Selenite is valued for the calm, cleared feeling it brings to a room. Kept on a nightstand — Amethyst on the wrist, Selenite as a tower or plate nearby — the two support a simpler, lower-stimulation wind-down routine.</p>
<h3>5. Deeper Meditation</h3>
<p>The shared spiritual intention makes Amethyst and Selenite a natural meditation pair. In crystal tradition, Amethyst is used to quiet mental noise, while Selenite is chosen for clarity and cleansing. Together they form a simple ritual structure: Amethyst helps you settle, and Selenite helps you focus on release. Hold Amethyst in your hand and place Selenite nearby on the floor, mat, or altar before you begin. Five to ten minutes is enough for a simple session, especially when you're new to working with these stones.</p>
<h3>6. A Low-Maintenance Cleansing Ritual</h3>
<p>Selenite is traditionally said to cleanse itself and the stones placed near it, which is why many people rest an Amethyst bracelet or cluster on a Selenite plate or slab. Think of this as a crystal-practice ritual rather than a literal cleaning method — a way to keep the pairing feeling intentional between uses. Physically, you'll still want to dust both stones gently and keep Selenite dry, since it can be damaged by water and rough handling.</p>`;

const M6 = `<h2>How to Use Amethyst and Selenite Together</h2>
<h3>Wear them</h3>
<p>A common question is <em>can I wear Amethyst and Selenite on the same hand?</em> Yes — the shared air element means the two are traditionally considered comfortable together. An Amethyst bracelet is the better everyday wearable. If you also have Selenite jewelry, wear it gently and avoid stacking it tightly against harder stones, because Selenite is soft (Mohs 2) and can scratch, chip, or dull over time. For sleep, many prefer Amethyst on the wrist and a Selenite tower or palm stone kept on the nightstand.</p>
<h3>Meditate</h3>
<p>Hold Amethyst in one hand and place Selenite nearby — on the floor, mat, or altar — rather than directly on the body. Five to ten minutes is enough for a simple ritual, especially if you're new to working with these two stones. The aim is a calmer, more focused sit, not a particular physical sensation.</p>
<h3>Crystal grid</h3>
<p>Place Selenite at the center as the cleanser and Amethyst points around it to set the intent. It's a classic, simple grid for rest, protection, or spiritual focus — easy to set up on a nightstand or small table.</p>
<h3>Place in a room</h3>
<p>A Selenite tower on the nightstand keeps the bedroom feeling clear; an Amethyst cluster beside it brings a sense of calm. Together they turn a bedroom or meditation corner into a low-stimulation space — many people start here when they want a calmer evening ritual or a more peaceful wind-down routine.</p>`;

art.content = art.content
  .replace(/<!-- AGENT_M2:[\s\S]*?-->/, M2)
  .replace(/<!-- AGENT_M3:[\s\S]*?-->/, M3)
  .replace(/<!-- AGENT_M4:[\s\S]*?-->/, M4)
  .replace(/<!-- AGENT_M5:[\s\S]*?-->/, M5)
  .replace(/<!-- AGENT_M6:[\s\S]*?-->/, M6);

// 覆盖 excerpt + meta description（用户范例，去 grounding）
art.excerpt = 'Amethyst and Selenite together score 100/100 for compatibility. Learn their benefits for calm, sleep routines, meditation, spiritual clarity, and gentle energetic cleansing.';
art.rank_math_description = 'Amethyst and Selenite score 100/100 compatibility. Benefits for calm, sleep, meditation, spiritual clarity, and gentle cleansing.';

art.modules = {
  m2_agent: { filled: true, words: 112 },
  m3_agent: { filled: true, words: 116 },
  m4_agent: { filled: true, perspectives: ['practical', 'energetic', 'psychological'] },
  m5_agent: {
    filled: true,
    benefits: [
      { title: 'Deep, Layered Calm', source: 'sharedTags:calm' },
      { title: 'Amplified Spiritual Awareness', source: 'sharedChakras:crown+third-eye' },
      { title: 'Stronger Protection & Space Cleansing', source: 'sharedTags:protection' },
      { title: 'Better Sleep & Bedtime Wind-Down', source: 'pairHit+bestFor:sleep' },
      { title: 'Deeper Meditation', source: 'sharedTags:spiritual' },
      { title: 'A Low-Maintenance Cleansing Ritual', source: 'element:air+selenite-self-cleanse' },
    ],
  },
  m6_agent: { filled: true, uses: ['wear', 'meditate', 'grid', 'place'], longtail: ['same hand', 'bracelet', 'for sleep', 'wind-down'] },
};
art.images = {
  featured: { alt: 'Amethyst and Selenite crystals paired together for calm and spiritual practice' },
  pair: { alt: 'Amethyst and Selenite combination for sleep and meditation' },
  how_to_use: { alt: 'How to wear Amethyst and use Selenite as a bedside tower' },
};

fs.writeFileSync(f, JSON.stringify(art, null, 2), 'utf8');
console.log('✅ v2 填充完成 amethyst-and-selenite.json');
console.log('   content:', art.content.length, '字符 | 占位残留:', /AGENT_M[456]/.test(art.content));
console.log('   excerpt:', art.excerpt.length, '字符 | desc:', art.rank_math_description.length, '字符');
