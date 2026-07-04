/**
 * Birthstone Finder（T8）— 选月份 → 生辰石 + 含义 + 水晶属性 + 选购
 * 复用旧脚本 BIRTHSTONES 数据（02-网站规划/pages/birthstone-finder.js）+ search-data img/link
 * 定位：主题词红海(GIA/AGS/Brilliant Earth权威+AIO)，差异化=交互工具+水晶属性深度+选购
 *
 * 输出：./birthstone-finder.html
 */
const fs = require('fs');
const path = require('path');

// ===== 12 月生辰石（复用旧脚本数据 + 标准石）=====
const BIRTHSTONES = [
  { month:'January', num:1, stone:'Garnet', subtitle:'The Stone of Commitment', color:'#8B0000', colorName:'Deep Red', chakra:'Root Chakra', properties:['Passion','Energy','Creativity','Protection'], description:'Garnet is a stone of deep, passionate energy. It revitalizes your spirit, boosts confidence, and inspires love and devotion. Known as a powerful protection stone, Garnet has been treasured since ancient Egyptian times for its ability to ward off negative energy and attract abundance.', affirmation:'I am filled with passionate energy and my creative fire burns bright.',
    healing:'In crystal tradition, Garnet is associated with revitalizing life-force energy and grounding the root chakra. Many believe it helps release old emotional patterns, encourages self-confidence, and supports a sense of safety and stability. Reflect on what passions you have set aside — Garnet is used as a focus for reconnecting with motivation, courage, and creative drive during meditation or self-inquiry.',
    howToUse:'Wear Garnet in a ring or pendant so the stone rests against the skin and stays close to the root chakra. During meditation, hold a Garnet in your palm or place it at the base of your spine and visualize a steady red light anchoring you. Cleanse it monthly under warm running water and recharge it in sunlight for a short time.',
    history:'Garnet takes its name from granatum, the Latin word for pomegranate, because its red seeds resemble the fruit. Ancient Egyptian pharaohs were buried with Garnet amulets, Roman signet rings used it to stamp wax seals, and medieval warriors carried it into battle believing it would stop bleeding. For centuries across Europe and Asia it was a traveler\'s talisman.',
    hardness:'Garnet measures 6.5–7.5 on the Mohs scale. It is a group of nesosilicate minerals; the deep red variety most people know is almandine, colored by iron. Good durability for everyday jewelry, but avoid sudden temperature changes and harsh ultrasonic cleaning.',
    pairing:[{name:'Black Tourmaline', why:'Grounds and amplifies Garnet\'s protective energy.'},{name:'Citrine', why:'Adds warmth and abundance alongside Garnet\'s passion.'},{name:'Clear Quartz', why:'Clarifies intention and amplifies Garnet\'s revitalizing vibration.'}] },
  { month:'February', num:2, stone:'Amethyst', subtitle:'The Stone of Peace', color:'#6A0DAD', colorName:'Violet Purple', chakra:'Crown & Third Eye Chakra', properties:['Calm','Intuition','Spiritual Growth','Clarity'], description:'Amethyst is the ultimate stone of peace and spiritual awareness. Its soothing violet energy calms the mind, enhances intuition, and connects you to higher states of consciousness. Ancient Greeks believed Amethyst could prevent intoxication, symbolizing clarity of thought and sobriety of spirit.', affirmation:'I am at peace, and my inner wisdom guides me clearly.',
    healing:'Amethyst is traditionally associated with calming the mind and quieting mental chatter. Many people use it to support restful sleep, release tension after a long day, and open the crown and third eye chakras during meditation. As a self-reflection focus, hold Amethyst and notice where in your body you still hold stress — its gentle violet energy is said to invite emotional release and clearer intuition.',
    howToUse:'Place a small Amethyst cluster on your nightstand to invite calmer sleep, or tuck a tumbled stone under your pillow. For meditation, rest an Amethyst on your forehead (third eye) and breathe slowly for five minutes. Cleanse it under moonlight or in dry salt once a month — direct sunlight can fade its color over time.',
    history:'The name Amethyst comes from the Greek amethystos, meaning "not intoxicated." Greek mythology tells of Amethyst, a mortal turned to crystal by Artemis to protect her from a drunken Dionysus, whose tears of wine stained the stone purple. It has been prized by Tibetan monks, Catholic bishops (whose rings still wear it), and European royalty for centuries.',
    hardness:'Amethyst is a violet variety of quartz (silicon dioxide), scoring 7 on the Mohs scale. Its purple color comes from natural irradiation of trace iron within the crystal lattice. Durable enough for daily wear, though prolonged sun exposure can fade the hue.',
    pairing:[{name:'Clear Quartz', why:'Amplifies Amethyst\'s calming and intuitive energy.'},{name:'Rose Quartz', why:'Softens the mind and adds heart-centered gentleness.'},{name:'Black Tourmaline', why:'Anchors Amethyst\'s high vibration with grounding protection.'}] },
  { month:'March', num:3, stone:'Aquamarine', subtitle:'The Stone of Courage', color:'#006994', colorName:'Ocean Blue', chakra:'Throat Chakra', properties:['Courage','Communication','Calm','Clarity'], description:'Aquamarine carries the calming energy of the ocean. It is a stone of courage and clear communication, helping you speak your truth with confidence. Sailors once carried Aquamarine as a talisman of protection and safe passage across treacherous waters.', affirmation:'I speak my truth with courage and my words flow like calm waters.',
    healing:'Aquamarine is traditionally tied to the throat chakra and clear self-expression. Many believe its cooling energy helps soften anger, ease fear of speaking, and bring emotional clarity during conflict. Use it as a reflection tool before a difficult conversation — hold the stone, breathe, and notice the words you most need to say with honesty and kindness.',
    howToUse:'Wear Aquamarine as a necklace so it sits near the throat chakra. For meditation, hold it while visualizing ocean waves washing over you. Cleanse it by rinsing in pure water (avoid salt water for long soaks) and recharge under gentle moonlight. Carry it in your pocket before presentations or tough conversations.',
    history:'Aquamarine\'s name means "seawater," given by Romans who believed the stone was sacred to Neptune and could calm storms. Medieval sailors thought a Aquamarine talisman guaranteed safe return from sea. In the Middle Ages it was also cut into crystal balls for scrying and divination, prized for revealing hidden truths.',
    hardness:'Aquamarine is a blue variety of beryl (beryllium aluminum silicate), rating 7.5–8 on the Mohs scale. Its blue-green color comes from trace iron (Fe²⁺). Strong and durable for rings, though heated stones are common in the trade to permanently intensify the blue.',
    pairing:[{name:'Lapis Lazuli', why:'Deepens honest communication and self-knowledge.'},{name:'Moonstone', why:'Adds emotional flow and intuitive balance.'},{name:'Clear Quartz', why:'Sharpens mental clarity and amplifies the stone\'s courage.'}] },
  { month:'April', num:4, stone:'Diamond', subtitle:'The Stone of Invincibility', color:'#E8E8E8', colorName:'Clear White', chakra:'Crown Chakra', properties:['Strength','Purity','Eternity','Clarity'], description:'Diamond is the hardest natural substance on Earth, symbolizing unbreakable strength and eternal love. It is traditionally said to amplify the energy of other crystals and bring clarity to the mind. As the April birthstone, Diamond represents purity of intention and infinite potential.', affirmation:'I am strong, pure, and radiant. My inner light shines brightly.',
    healing:'In crystal tradition, Diamond is considered an amplifier of all energy — both intention and the vibration of stones around it. Many believe it brings mental clarity, supports self-honesty, and helps clear inner contradictions. As a reflection focus, Diamond invites you to ask: what in my life am I amplifying? Its pure light is associated with unwavering commitment and aligned action.',
    howToUse:'Wear Diamond daily in an engagement ring, pendant, or band so it stays in your energy field. Pair it with intention — hold the stone briefly each morning and dedicate it to one clear focus for the day. Clean Diamond with warm water, mild soap, and a soft brush; avoid abrasive cleaners that can dull its setting.',
    history:'Diamonds were first discovered and treasured in India at least 2,500 years ago, where they were used as religious icons and talismans. The Romans believed Diamonds were shards of falling stars, and medieval Europeans thought they offered protection in battle. The modern engagement-ring tradition began in 1947 with De Beers\' "A Diamond is Forever" campaign.',
    hardness:'Diamond is pure crystallized carbon and ranks 10 on the Mohs scale — the hardest known natural material. It can only be scratched by another Diamond. Its fire and brilliance come from a high refractive index, and trace elements like boron or nitrogen create rare colored (fancy) Diamonds.',
    pairing:[{name:'Clear Quartz', why:'Mirrors Diamond\'s amplifying clarity at an everyday price.'},{name:'Sapphire', why:'A classic royal pairing of wisdom and strength.'},{name:'Amethyst', why:'Softens Diamond\'s intensity with calming violet peace.'}] },
  { month:'May', num:5, stone:'Emerald', subtitle:'The Stone of Successful Love', color:'#006400', colorName:'Rich Green', chakra:'Heart Chakra', properties:['Love','Abundance','Wisdom','Harmony'], description:'Emerald is the stone of unconditional love and abundance. Its lush green energy opens the heart to deep compassion and draws prosperity into your life. Cleopatra treasured Emeralds above all other gemstones, believing they held the power of eternal youth and fertility.', affirmation:'My heart is open to love, and abundance flows to me naturally.',
    healing:'Emerald is traditionally associated with the heart chakra, emotional balance, and unconditional love. Many believe it supports patience, loyalty, and harmony in relationships, and helps release old heartache. As a self-reflection focus, hold Emerald and ask: where have I closed my heart? Its green energy invites you to practice compassion — first toward yourself, then others.',
    howToUse:'Wear Emerald close to the heart as a pendant or in a ring on the left hand, the receiving side of the body. For meditation, place it over the heart center and breathe into the chest with each inhale. Cleanse gently with lukewarm water; emeralds are often oiled, so avoid steam, ultrasonic, and harsh chemicals.',
    history:'Emeralds were mined in Egypt as early as 1500 BCE, where Cleopatra claimed the famous "Cleopatra Mines" as her own. The Roman scholar Pliny declared that "no color is more delightful in appearance" than the green of Emerald. Mughal emperors inscribed sacred texts onto Emerald talismans, and Inca rulers adorned their temples with them long before Spanish conquest.',
    hardness:'Emerald is a green variety of beryl, rating 7.5–8 on the Mohs scale. Its rich green comes from trace chromium and sometimes vanadium. Most natural Emeralds contain inclusions (called jardin) and are treated with natural oils to enhance clarity — re-oil them occasionally through a trusted jeweler.',
    pairing:[{name:'Rose Quartz', why:'Softens the heart and deepens Emerald\'s loving energy.'},{name:'Moonstone', why:'Balances emotional intensity with gentle feminine flow.'},{name:'Clear Quartz', why:'Clarifies Emerald\'s intention and amplifies abundance.'}] },
  { month:'June', num:6, stone:'Pearl', subtitle:'The Stone of Purity', color:'#FFF5E1', colorName:'Luminous White', chakra:'Solar Plexus Chakra', properties:['Purity','Wisdom','Integrity','Calming'], description:'Pearl is the only gemstone created by a living creature, making it a symbol of natural purity and wisdom born from experience. Like the oyster that transforms an irritant into something beautiful, Pearl teaches you to turn challenges into strengths and find inner calm amidst chaos.', affirmation:'I transform challenges into wisdom and shine with inner purity.',
    healing:'Pearl is traditionally associated with emotional balance, inner calm, and integrity. Many believe its lunar, cooling energy soothes anxiety, eases mood swings, and encourages honesty with oneself. As a reflection focus, Pearl mirrors back whatever you carry — hold one and notice: what irritant in your life are you being asked to transform into wisdom, the way an oyster coats a grain of sand?',
    howToUse:'Wear Pearls against the skin as a necklace or bracelet so they stay in contact with the body\'s warmth. For meditation, hold a Pearl in your receiving hand during slow breathing under moonlight. Cleanse gently with a soft damp cloth — Pearls are organic and porous, so keep them away from perfume, hairspray, chlorine, and long water soaks.',
    history:'Pearls are the world\'s oldest known gem. Ancient Chinese legends claimed they fell from the moon into open oyster shells, while Romans ranked them as the most precious material on Earth. Cleopatra famously dissolved a Pearl in vinegar to win a wager against Marc Antony, and throughout the 20th century a strand of Pearls became the signature of elegance.',
    hardness:'Pearl rates only 2.5–4.5 on the Mohs scale — quite soft — because it is organic, formed of layered nacre (calcium carbonate and conchiolin) secreted by mollusks. Wear it often (skin oils protect the nacre) but store it separately to avoid scratches and restring necklaces every few years.',
    pairing:[{name:'Moonstone', why:'Shares lunar, calming energy and intuitive flow.'},{name:'Rose Quartz', why:'Softens and gentles Pearl\'s purity with heart warmth.'},{name:'Aquamarine', why:'Adds cooling courage and clear communication.'}] },
  { month:'July', num:7, stone:'Ruby', subtitle:'The Stone of Vitality', color:'#E0115F', colorName:'Fiery Red', chakra:'Root & Heart Chakra', properties:['Vitality','Passion','Protection','Leadership'], description:'Ruby is the king of gemstones, radiating fierce vitality and life-force energy. It activates your root chakra for grounding and your heart chakra for passionate love. Ancient warriors wore Ruby into battle, believing it granted invincibility and protected against physical harm.', affirmation:'I am filled with vibrant life energy and I lead with passion.',
    healing:'Ruby is traditionally associated with vitality, life-force, and the courage to follow your heart\'s desires. Many believe it stirs motivation, fuels passion for what matters, and supports grounded leadership. As a reflection focus, Ruby asks you to name one thing you would pursue with your full heart if you knew you could not fail — then notice what is in the way.',
    howToUse:'Wear Ruby in a ring or pendant so it stays near the body\'s core. For meditation, hold it over the root chakra (base of the spine) or the heart while breathing slowly and visualizing a steady red glow. Cleanse under running water and recharge briefly in sunlight — Ruby\'s color is stable and won\'t fade.',
    history:'The word Ruby comes from ruber, Latin for red. Ancient Hindus called it the "king of precious stones" (ratnaraj) and believed offering a fine Ruby to the god Krishna would grant rebirth as an emperor. Medieval European warriors embedded Rubies under their skin for invincibility in battle, and Burmese kings treasured the stone as a symbol of divine protection.',
    hardness:'Ruby and Sapphire are both corundum (aluminum oxide), scoring 9 on the Mohs scale — second only to Diamond. Ruby\'s red comes from trace chromium. It is extremely durable for daily wear, and only Diamond or another corundum can scratch it.',
    pairing:[{name:'Garnet', why:'Builds a layered foundation of grounding vitality and passion.'},{name:'Clear Quartz', why:'Amplifies Ruby\'s intensity and clarifies direction.'},{name:'Black Tourmaline', why:'Anchors Ruby\'s fire with strong protective grounding.'}] },
  { month:'August', num:8, stone:'Peridot', subtitle:'The Stone of Compassion', color:'#9ACD32', colorName:'Lime Green', chakra:'Heart & Solar Plexus Chakra', properties:['Compassion','Abundance','Joy','Wellbeing'], description:'Peridot is a stone of warm, joyful energy, traditionally associated with releasing emotional tension and inviting abundance. Known as the evening emerald, Peridot was Cleopatra’s favorite gemstone. It carries the energy of sunshine and new growth, helping you let go of jealousy and embrace gratitude.', affirmation:'I release what no longer serves me and embrace joy and abundance.',
    healing:'Peridot is traditionally associated with the heart and solar plexus chakras, and is said to support the release of resentment, jealousy, and old emotional weight. Many believe its warm green light encourages forgiveness — of others and of yourself. As a reflection focus, hold Peridot and ask: what am I ready to set down so more light can come in?',
    howToUse:'Wear Peridot as a pendant resting near the heart, or carry a tumbled stone in your pocket. For meditation, place it over the sternum and breathe slowly while visualizing green light expanding from your chest. Cleanse under cool running water and recharge in soft sunlight or moonlight — Peridot\'s color is natural and stable.',
    history:'Peridot has been mined for over 3,500 years on the Egyptian island of Topazios (now Zabargad) in the Red Sea. Ancient Egyptians called it the "gem of the sun," and Cleopatra\'s famous "Emerald" collection is now believed by many historians to have been Peridot. Crusaders brought Peridot to Europe, where it was set into cathedral relics and royal crowns.',
    hardness:'Peridot is the gem variety of olivine (magnesium iron silicate), rating 6.5–7 on the Mohs scale. Its yellow-green color comes from iron, and the richest specimens come from volcanic deposits or even meteorites (pallasitic Peridot is among the rarest). Reasonably durable but sensitive to rapid temperature shifts and acid.',
    pairing:[{name:'Citrine', why:'Adds warm abundance and joy to Peridot\'s compassion.'},{name:'Clear Quartz', why:'Brightens Peridot\'s light and amplifies intention.'},{name:'Rose Quartz', why:'Softens the heart and deepens self-forgiveness.'}] },
  { month:'September', num:9, stone:'Sapphire', subtitle:'The Stone of Wisdom', color:'#0F52BA', colorName:'Royal Blue', chakra:'Third Eye & Throat Chakra', properties:['Wisdom','Focus','Truth','Spiritual Insight'], description:'Sapphire is the stone of mental clarity and spiritual wisdom. Its deep blue energy activates the third eye, enhancing intuition and focus. Ancient kings wore Sapphire as protection from envy and harm, believing it attracted divine favor and aligned them with their highest purpose.', affirmation:'I see clearly, speak truthfully, and trust my inner knowing.',
    healing:'Sapphire is traditionally associated with the third eye and throat chakras, mental focus, and inner wisdom. Many believe it helps calm a scattered mind, supports discernment, and encourages truthful communication. As a reflection focus, hold Sapphire and ask: what truth am I ready to see clearly — and to speak? Its blue light invites honest self-examination without judgment.',
    howToUse:'Wear Sapphire as a ring or pendant, especially on the hand you write with to channel focus into your work. For meditation, place it between the eyebrows (third eye) while breathing slowly. Cleanse under running water and recharge in moonlight or brief sunlight — Sapphire is durable and color-stable.',
    history:'Sapphire\'s name comes from sapphirus, Latin for blue. Ancient Persians believed the Earth rested on a giant Sapphire whose reflection colored the sky. Medieval kings wore Sapphire rings believing they protected against envy and harm, and Christian bishops still wear Sapphire episcopal rings as a symbol of wisdom. The British Crown Jewels hold several famous Sapphires.',
    hardness:'Sapphire is corundum (aluminum oxide), rating 9 on the Mohs scale — among the toughest of all gems. While blue (from trace iron and titanium) is most famous, "fancy" Sapphires come in nearly every color except red (which is Ruby). Excellent durability for rings worn every day.',
    pairing:[{name:'Clear Quartz', why:'Sharpens Sapphire\'s mental clarity and insight.'},{name:'Amethyst', why:'Deepens spiritual wisdom and intuition.'},{name:'Lapis Lazuli', why:'Strengthens truthful communication and royal focus.'}] },
  { month:'October', num:10, stone:'Opal', subtitle:'The Stone of Inspiration', color:'#FF7F50', colorName:'Iridescent Multi', chakra:'All Chakras', properties:['Creativity','Inspiration','Originality','Emotional Balance'], description:'Opal is a kaleidoscope of color, representing the full spectrum of human emotion and experience. It amplifies your unique gifts and stimulates originality and creativity. Opal helps you release inhibitions and express your true self with confidence and joy.', affirmation:'I embrace my unique gifts and express my creativity freely.',
    healing:'Opal is traditionally associated with creativity, emotional freedom, and authentic self-expression. Many believe its shifting colors mirror the full range of human feeling, helping you accept emotions you may have hidden. As a reflection focus, hold Opal and ask: what part of myself have I held back from expressing? Its prismatic energy invites you to celebrate your originality.',
    howToUse:'Wear Opal as a pendant close to the heart, or carry a small piece when you need creative inspiration. For meditation, place it over any chakra that feels blocked and visualize white light refracting into rainbow colors. Opal contains water — never clean it with harsh chemicals, and keep it away from prolonged dry heat to prevent crazing (fine cracks).',
    history:'Ancient Romans treasured Opal above all gems; Pliny wrote that it held "the fire of the ruby, the purple of the amethyst, and the sea-green of the emerald." Bedouins once believed Opals fell from the sky in lightning storms. In the 19th century a novel spread a brief superstition that Opals were unlucky — yet modern Australia (which produces most of the world\'s Opals) honors it as a national gem.',
    hardness:'Opal rates 5.5–6.5 on the Mohs scale and is a hydrated amorphous silica containing up to 20% water. Its famous play-of-color comes from microscopic silica spheres diffracting light. Softer and more delicate than most gems — store it carefully and avoid impact, dryness, and chemicals.',
    pairing:[{name:'Moonstone', why:'Softens Opal\'s emotional intensity with lunar calm.'},{name:'Clear Quartz', why:'Clarifies Opal\'s multi-color expression.'},{name:'Rose Quartz', why:'Adds gentle self-love to Opal\'s creativity.'}] },
  { month:'November', num:11, stone:'Citrine', subtitle:'The Stone of Abundance', color:'#FFB300', colorName:'Golden Yellow', chakra:'Solar Plexus Chakra', properties:['Abundance','Confidence','Joy','Manifestation'], description:'Citrine is the merchant’s stone, long associated with attracting wealth, success, and positive energy. Its warm golden vibration is linked to the solar plexus, empowering confidence and willpower. In crystal tradition, Citrine is one of the few stones said to rarely need cleansing, associated with transmuting negativity.', affirmation:'I am a magnet for abundance and my confidence radiates like sunlight.',
    healing:'Citrine is traditionally associated with the solar plexus chakra, personal willpower, and a sunny outlook. Many believe it supports confidence, motivation, and the courage to pursue abundance — not only financial but creative and emotional. As a reflection focus, hold Citrine and ask: what would I create or build if I trusted my own power? Its warm energy invites optimism without denial.',
    howToUse:'Wear Citrine as a pendant near the solar plexus, or keep a "merchant\'s stone" in your cash box, wallet, or workspace to invite abundance. For meditation, place it over the upper abdomen and visualize golden light filling your core. Citrine rarely needs energetic cleansing — sunlight keeps it bright, but be aware most commercial Citrine is heat-treated Amethyst.',
    history:'Citrine\'s name comes from the French citron, "lemon," for its golden hue. In ancient Scotland it was carved into dagger handles and worn as a talisman against plague, and during the Hellenistic period Greek and Roman artisans used it in intaglios and cabochon jewelry. Citrine enjoyed a surge of popularity in the Art Deco era, when it starred in Hollywood-style brooches.',
    hardness:'Citrine is a yellow variety of quartz (silicon dioxide), rating 7 on the Mohs scale. Natural Citrine is rare — its color comes from trace iron, and most commercial Citrine is heat-treated Amethyst or smoky quartz, which turns a stable golden brown. Durable for everyday wear and a popular choice for rings.',
    pairing:[{name:'Clear Quartz', why:'Amplifies Citrine\'s manifestation and abundance focus.'},{name:'Pyrite', why:'Doubles the wealth-attracting, confident energy.'},{name:'Black Tourmaline', why:'Grounds Citrine\'s sunny willpower with protection.'}] },
  { month:'December', num:12, stone:'Turquoise', subtitle:'The Stone of Protection', color:'#40E0D0', colorName:'Sky Blue-Green', chakra:'Throat Chakra', properties:['Protection','Communication','Healing','Friendship'], description:'Turquoise is one of the oldest protection stones, revered by Native American cultures for thousands of years. It guards against negative energy, promotes honest communication, and strengthens friendships. Turquoise changes color to warn its wearer of danger, making it a living talisman of protection.', affirmation:'I am protected, I speak honestly, and I attract true friendship.',
    healing:'Turquoise is traditionally associated with protection, the throat chakra, and honest communication. Many believe it strengthens friendship, balances mood, and serves as an early-warning stone that shifts color when its wearer\'s energy is off. As a reflection focus, hold Turquoise and ask: where in my life am I not speaking my truth? Its sky-blue energy invites sincerity and trust.',
    howToUse:'Wear Turquoise as a pendant near the throat or a bracelet on the receiving (left) wrist. For meditation, hold it while visualizing a clear blue sky widening across your chest and throat. Turquoise is porous — keep it away from cosmetics, perfumes, chlorine, and prolonged water; cleanse gently by wiping with a soft dry cloth.',
    history:'Turquoise is one of humanity\'s oldest gemstones — the Egyptians mined it in the Sinai over 5,000 years ago, and Tutankhamun\'s funeral mask is inlaid with it. Persian Turquoise (the original source of the stone\'s name, from "Turkish") was traded along the Silk Road. Native American tribes of the Southwest have carved and set Turquoise in silver for centuries as a sacred stone of sky, water, and protection.',
    hardness:'Turquoise rates 5–6 on the Mohs scale. It is a hydrated copper aluminum phosphate, and its blue-to-green color comes from copper (blue) and iron impurities (green). Porous and somewhat delicate — avoid chemicals, heat, and cosmetics, which can discolor or damage natural Turquoise over time.',
    pairing:[{name:'Clear Quartz', why:'Brightens Turquoise\'s protective clarity.'},{name:'Coral', why:'A traditional Southwestern pairing for protection and balance.'},{name:'Lapis Lazuli', why:'Deepens honest, soul-level communication.'}] }
];

// 读 search-data，按 stone 名匹配 img/link
const SD = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../crystal-meaning-search/data/search-data.json'), 'utf8'));
function findStone(name){
  var lc = name.toLowerCase();
  return SD.crystals.find(c => c.name.toLowerCase() === lc)
    || SD.crystals.find(c => c.name.toLowerCase().includes(lc))
    || SD.crystals.find(c => lc.includes(c.name.toLowerCase()));
}
// by-stone 产品类目映射（基于线上验证 2026-06-27：5颗有独立category，其余用总类目）
const SHOP_CAT = {
  'Amethyst':'/product-category/amethyst-crystals/',
  'Ruby':'/product-category/ruby-crystals/',
  'Opal':'/product-category/opal-crystals/',
  'Citrine':'/product-category/citrine-crystals/',
  'Turquoise':'/product-category/turquoise-crystals/'
};
BIRTHSTONES.forEach(b => {
  var c = findStone(b.stone);
  var slug = b.stone.toLowerCase().replace(/\s+/g, '-');
  var overview = 'https://goearthward.com/wp-content/uploads/2026/06/' + slug + '-overview.webp';
  // amethyst overview 2026-07 补生（WP 当月归档落 07 目录），单独覆盖
  if (slug === 'amethyst') overview = 'https://goearthward.com/wp-content/uploads/2026/07/amethyst-overview.webp';
  b.img = overview;                          // overview = 原石/裸石 specimen（更贴生辰石本体，12/12 齐）
  b.imgFallback = c ? (c.img || '') : '';     // form-bracelet 兜底（amethyst overview 暂缺，待生图补）
  b.link = c ? (c.link || '') : '';
  b.shop = SHOP_CAT[b.stone] || ('/shop/?s=' + b.stone.toLowerCase());
});

function safeJSON(v){ return JSON.stringify(v).replace(/<\//g, '<\\/'); }
const BS_JSON = safeJSON(BIRTHSTONES);

let html = `<!-- ===== Earthward Birthstone Finder ===== -->
<div id="ebf-bf">
  <h1 class="ebf-h1">Birthstone Finder: What Is My Birthstone?</h1>
  <p class="ebf-intro">Select your birth month below to discover your birthstone — its meaning, color, chakra, and the energy traditionally associated with it. Every month is linked to a unique gemstone carried for protection, luck, and personal power for thousands of years.</p>

  <div class="ebf-months" id="ebf-months"></div>
  <div class="ebf-result" id="ebf-result" style="display:none"></div>
</div>
<style>
.ebf-h1{font-size:34px;color:#1A1A2E;margin:0 0 12px;font-weight:700;line-height:1.2}
.ebf-intro{color:#444;font-size:17px;line-height:1.65;margin:0 0 28px}
.ebf-months{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px}
@media(max-width:900px){.ebf-months{grid-template-columns:repeat(4,1fr)}}
@media(max-width:600px){.ebf-months{grid-template-columns:repeat(3,1fr)}}
@media(max-width:400px){.ebf-months{grid-template-columns:repeat(2,1fr)}}
.ebf-month{background:#fff;border:2px solid #E5E5E5;border-radius:14px;padding:18px 12px;cursor:pointer;text-align:center;transition:.15s;box-shadow:0 2px 5px rgba(0,0,0,.05)}
.ebf-month:hover{border-color:#2D6A4F;transform:translateY(-3px);box-shadow:0 6px 16px rgba(45,106,79,.18)}
.ebf-month.active{border-color:#2D6A4F;background:#F0F7F4}
.ebf-m-dot{width:48px;height:48px;border-radius:50%;margin:0 auto 8px;box-shadow:0 2px 6px rgba(0,0,0,.15);object-fit:cover;display:block}
.ebf-m-name{font-size:15px;font-weight:700;color:#1A1A2E}
.ebf-m-stone{font-size:13px;color:#2D6A4F;margin-top:2px}
.ebf-result{background:#F7F3EA;border:1px solid #EEE;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:20px;align-items:center}
.ebf-r-img{flex:0 0 auto;text-align:center;width:100%}
.ebf-r-photo{width:160px;height:160px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block;background:#F0F7F4}
.ebf-r-colorname{font-size:13px;color:#888}
.ebf-r-info{flex:1;min-width:0;width:100%}
.ebf-r-stone{font-size:26px;font-weight:700;color:#1A1A2E;margin:0 0 2px}
.ebf-r-subtitle{font-size:15px;color:#2D6A4F;font-style:italic;margin:0 0 12px}
.ebf-r-props{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.ebf-r-prop{padding:4px 12px;background:#fff;border:1px solid #DDD;border-radius:15px;font-size:13px;color:#444}
.ebf-r-chakra{font-size:14px;color:#666;margin-bottom:10px}
.ebf-r-desc{font-size:15px;color:#444;line-height:1.65;margin-bottom:14px}
.ebf-r-aff{padding:12px 16px;background:#fff;border-left:3px solid #2D6A4F;border-radius:0 8px 8px 0;margin-bottom:16px}
.ebf-r-aff-l{font-size:11px;font-weight:700;color:#2D6A4F;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px}
.ebf-r-aff-t{font-size:14px;color:#555;font-style:italic;line-height:1.5}
.ebf-r-cta{display:flex;gap:10px;flex-wrap:wrap}
.ebf-btn{display:inline-block;padding:11px 22px;background:#2D6A4F;color:#fff !important;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600}
.ebf-btn:hover{background:#1B4332}
.ebf-btn.sec{background:#fff;color:#2D6A4F !important;border:1px solid #2D6A4F}
.ebf-disclaim{color:#999;font-size:12px;margin-top:18px;line-height:1.5}
.ebf-r-section{margin-top:28px;padding-top:24px;border-top:1px solid #E5E0D2}
.ebf-r-section:first-of-type{border-top:none;padding-top:0;margin-top:8px}
.ebf-r-h3{font-size:20px;font-weight:700;color:#1A1A2E;margin:0 0 10px;line-height:1.3}
.ebf-r-h3 .ebf-r-h3-accent{color:#CFAA3E}
.ebf-r-p{font-size:15px;color:#444;line-height:1.7;margin:0 0 12px}
.ebf-r-ul{margin:8px 0 12px;padding-left:22px;font-size:15px;color:#444;line-height:1.7}
.ebf-r-ul li{margin-bottom:6px}
.ebf-r-hardness{background:#F0F7F4;border-left:3px solid #2D6A4F;padding:14px 16px;border-radius:0 8px 8px 0;font-size:14px;color:#444;line-height:1.65}
.ebf-r-hardness strong{color:#2D6A4F}
.ebf-r-pairs{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:10px}
.ebf-r-pair{background:#fff;border:1px solid #E0E0E0;border-radius:12px;padding:14px 16px;transition:.15s}
.ebf-r-pair:hover{border-color:#CFAA3E;box-shadow:0 4px 12px rgba(207,170,62,.15)}
.ebf-r-pair-n{font-size:15px;font-weight:700;color:#2D6A4F;margin-bottom:4px}
.ebf-r-pair-w{font-size:13px;color:#666;line-height:1.55;font-style:italic}
.ebf-r-faq{margin-top:28px;padding-top:24px;border-top:1px solid #E5E0D2}
.ebf-r-faq-h{font-size:20px;font-weight:700;color:#1A1A2E;margin:0 0 14px}
.ebf-r-faq-item{border-bottom:1px solid #EEE;padding:12px 0}
.ebf-r-faq-q{font-size:15px;font-weight:600;color:#1A1A2E;margin-bottom:6px;cursor:default;display:flex;gap:8px;align-items:flex-start}
.ebf-r-faq-q::before{content:"Q";flex:0 0 22px;height:22px;background:#CFAA3E;color:#fff;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}
.ebf-r-faq-a{font-size:14px;color:#555;line-height:1.65;padding-left:30px}
@media(max-width:640px){.ebf-h1{font-size:24px}.ebf-result{flex-direction:column}.ebf-r-img{flex:0 0 auto}.ebf-r-photo{width:130px;height:130px}.ebf-r-h3{font-size:18px}}
</style>
<script>
var EWBirth=(function(){
  var BS=${BS_JSON};
  function init(){
    var el=document.getElementById('ebf-months');
    el.innerHTML=BS.map(function(b,i){
      return '<div class="ebf-month" onclick="EWBirth.show('+i+')">'
        +'<img class="ebf-m-dot" src="'+b.img+'" alt="'+b.stone+'">'
        +'<div class="ebf-m-name">'+b.month+'</div>'
        +'<div class="ebf-m-stone">'+b.stone+'</div>'
        +'</div>';
    }).join('');
  }
  function show(i){
    var b=BS[i];
    document.querySelectorAll('.ebf-month').forEach(function(c,idx){c.classList.toggle('active',idx===i);});
    var r=document.getElementById('ebf-result');
    r.style.display='flex';
    var propsHtml=b.properties.map(function(p){return '<span class="ebf-r-prop">'+p+'</span>';}).join('');
    var imgTag=b.img?'<img class="ebf-r-photo" src="'+b.img+'" alt="'+b.stone+'">':'<div class="ebf-r-photo" style="background:'+b.color+'"></div>';
    r.innerHTML='<div class="ebf-r-img">'+imgTag+'<div class="ebf-r-colorname">'+b.colorName+'</div></div>'
      +'<div class="ebf-r-info">'
      +'<h2 class="ebf-r-stone">'+b.month+' Birthstone: '+b.stone+'</h2>'
      +'<div class="ebf-r-subtitle">'+b.subtitle+'</div>'
      +'<div class="ebf-r-props">'+propsHtml+'</div>'
      +'<div class="ebf-r-chakra"><strong>Chakra:</strong> '+b.chakra+'</div>'
      +'<p class="ebf-r-desc">'+b.description+'</p>'
      +'<div class="ebf-r-aff"><div class="ebf-r-aff-l">Daily Affirmation</div><div class="ebf-r-aff-t">“'+b.affirmation+'”</div></div>'
      +'<div class="ebf-r-cta">'
      +(b.link?'<a class="ebf-btn" href="'+b.link+'">Read '+b.stone+' meaning →</a>':'')
      +'<a class="ebf-btn sec" href="'+b.shop+'">Shop '+b.stone+' crystals →</a>'
      +'<a class="ebf-btn sec" href="/gemstones/">Explore all crystals →</a>'
      +'</div>'
      // === Healing Properties ===
      +'<section class="ebf-r-section">'
      +'<h3 class="ebf-r-h3">'+b.stone+' <span class="ebf-r-h3-accent">Healing Properties</span></h3>'
      +'<p class="ebf-r-p">'+b.healing+'</p>'
      +'</section>'
      // === How to Use ===
      +'<section class="ebf-r-section">'
      +'<h3 class="ebf-r-h3">How to Use Your '+b.stone+'</h3>'
      +'<p class="ebf-r-p">'+b.howToUse+'</p>'
      +'</section>'
      // === History & Lore ===
      +'<section class="ebf-r-section">'
      +'<h3 class="ebf-r-h3">History &amp; Lore of '+b.stone+'</h3>'
      +'<p class="ebf-r-p">'+b.history+'</p>'
      +'</section>'
      // === Color & Hardness ===
      +'<section class="ebf-r-section">'
      +'<h3 class="ebf-r-h3">Color &amp; Hardness</h3>'
      +'<div class="ebf-r-hardness"><strong>Gemology:</strong> '+b.hardness+'</div>'
      +'</section>'
      // === Complementary Stones ===
      +'<section class="ebf-r-section">'
      +'<h3 class="ebf-r-h3">Complementary Stones</h3>'
      +'<p class="ebf-r-p">These crystals pair naturally with '+b.stone+' — each one supports or balances its energy:</p>'
      +'<div class="ebf-r-pairs">'+b.pairing.map(function(p){return '<div class="ebf-r-pair"><div class="ebf-r-pair-n">'+p.name+'</div><div class="ebf-r-pair-w">'+p.why+'</div></div>';}).join('')+'</div>'
      +'<div class="ebf-r-cta" style="margin-top:14px">'
      +'<a class="ebf-btn sec" href="/shop/?s='+b.pairing[0].name.toLowerCase().replace(/\\s+/g,'+')+'">Shop '+b.pairing[0].name+' →</a>'
      +'<a class="ebf-btn sec" href="/gemstones/">Explore all crystals →</a>'
      +'</div>'
      +'</section>'
      // === FAQ ===
      +'<section class="ebf-r-faq">'
      +'<h3 class="ebf-r-faq-h">'+b.stone+' Birthstone: Frequently Asked Questions</h3>'
      +'<div class="ebf-r-faq-item"><div class="ebf-r-faq-q">What does '+b.stone+' symbolize?</div><div class="ebf-r-faq-a">'+b.stone+' is known as "'+b.subtitle+'" and is traditionally associated with '+b.properties.map(function(p){return p.toLowerCase();}).join(', ')+'. People have treasured it as a personal symbol of these qualities for centuries.</div></div>'
      +'<div class="ebf-r-faq-item"><div class="ebf-r-faq-q">How do I cleanse '+b.stone+'?</div><div class="ebf-r-faq-a">Rinse '+b.stone+' briefly under cool running water, or rest it on a Clear Quartz cluster or in dry sea salt overnight. Avoid prolonged soaking, harsh chemicals, and sudden temperature changes. Recharge it in gentle moonlight or brief morning sunlight, and trust your intuition about when it feels ready to wear again.</div></div>'
      +'<div class="ebf-r-faq-item"><div class="ebf-r-faq-q">Can I wear '+b.stone+' every day?</div><div class="ebf-r-faq-a">'+b.stone+' measures '+b.hardness.split(',')[0].replace(/.*rating /i,'').replace(/.*Measures /i,'').replace(/.*scoring /i,'')+' on the Mohs scale. '+(b.stone==='Diamond'||b.stone==='Ruby'||b.stone==='Sapphire'?'This makes it extremely durable for everyday rings and bracelets.':(b.stone==='Pearl'||b.stone==='Opal'||b.stone==='Turquoise'?'It is somewhat softer and more delicate — wear it with care to avoid scratches, chemicals, and impact.':b.stone+' is reasonably durable for daily wear with reasonable care.'))+'</div></div>'
      +'<div class="ebf-r-faq-item"><div class="ebf-r-faq-q">Which chakra is '+b.stone+' linked to?</div><div class="ebf-r-faq-a">In crystal tradition, '+b.stone+' is associated with the '+b.chakra.replace(/ Chakra/g,'').toLowerCase()+'. Crystal practitioners use it to support the qualities linked to that energy center.</div></div>'
      +'<div class="ebf-r-faq-item"><div class="ebf-r-faq-q">What stones pair well with '+b.stone+'?</div><div class="ebf-r-faq-a">'+b.pairing.map(function(p){return p.name+' ('+p.why+')';}).join('; ')+'. Pairing complementary crystals is a personal practice — choose what resonates with your intention.</div></div>'
      +'</section>'
      +'<p class="ebf-disclaim">Birthstone meanings reflect cultural and spiritual tradition, not medical claims. There is no scientific evidence that birthstones treat illness, but many treasure them as personal symbols and meditation focuses.</p>'
      +'</div>';
    r.scrollIntoView({behavior:'smooth',block:'start'});
  }
  return{init:init,show:show};
})();
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',EWBirth.init);}else{EWBirth.init();}
</script>
<!-- ===== Birthstone Finder Schema (FAQPage) ===== -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What are the 12 birthstones by month?","acceptedAnswer":{"@type":"Answer","text":"January Garnet, February Amethyst, March Aquamarine, April Diamond, May Emerald, June Pearl (also Alexandrite and Moonstone), July Ruby, August Peridot, September Sapphire, October Opal (also Tourmaline), November Citrine (also Topaz), and December Turquoise (also Tanzanite and Zircon)."}},{"@type":"Question","name":"How do I find my birthstone?","acceptedAnswer":{"@type":"Answer","text":"Your birthstone is determined by your birth month. Select your month above to see your stone, its color, chakra, meaning, and the energy traditionally associated with it. Some months have more than one accepted birthstone."}},{"@type":"Question","name":"Can I wear a birthstone that isn't my month?","acceptedAnswer":{"@type":"Answer","text":"Yes. Birthstones are traditionally tied to your birth month, but you can wear any stone whose energy or meaning resonates with you. Many people wear their own birthstone alongside stones chosen for a specific intention."}},{"@type":"Question","name":"Do birthstones have real meanings?","acceptedAnswer":{"@type":"Answer","text":"Birthstone meanings come from centuries of cultural and spiritual tradition. There is no scientific evidence that a birthstone's energy treats illness, but many people use them as meaningful symbols, meditation focuses, and personal reminders."}}]}
]}
</script>
<!-- ===== End Birthstone Finder ===== -->`;

// SEO 折叠长文
let SEO_CONTENT = '';
try { SEO_CONTENT = fs.readFileSync(path.resolve(__dirname, 'seo-content.html'), 'utf8'); } catch (e) {}
if (SEO_CONTENT.trim()) {
  html += `
<!-- ===== Birthstone Finder SEO Accordion ===== -->
<section style="margin:32px auto 0">
  <details style="border:1px solid #D8D8D8;border-radius:12px;background:#FAFAFA;overflow:hidden">
    <summary style="list-style:none;cursor:pointer;background:#E8E8E8;color:#1A1A2E;font-size:18px;font-weight:700;padding:18px 22px">Learn More About Birthstones</summary>
    <div style="padding:24px 28px;color:#444;font-size:17px;line-height:1.75">
${SEO_CONTENT}
    </div>
  </details>
</section>
<!-- ===== End Birthstone Finder SEO Accordion ===== -->`;
}

const OUT = path.resolve(__dirname, 'birthstone-finder.html');
fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ Birthstone Finder 生成完成 → ${OUT}`);
const withImg = BIRTHSTONES.filter(b => b.img).length;
console.log(`   ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB | 12 月生辰石 | ${withImg}/12 有图(search-data匹配)`);
