/**
 * LuckyCrystals site image registry.
 *
 * Page scripts should reference semantic image keys here instead of scattered
 * placeholder, stock, or one-off upload URLs.
 *
 * Status values:
 * - source_generated_wp_upload: generated asset copied to project and uploaded to WordPress media
 * - source_existing_wp_upload: existing LuckyCrystals WordPress media URL
 * - needs_generation: prompt is ready, URL should be replaced after generation
 */

const WP = 'https://luckycrystals.org/wp-content/uploads';
const GEN = WP + '/2026/05';

function asset(url, alt, prompt, size, status) {
  return { url, alt, prompt, size, status };
}

const generated = 'source_generated_wp_upload';
const existing = 'source_existing_wp_upload';
const needs_generation = 'needs_generation';

const IMAGES = {
  shared: {
    card: asset(GEN + '/crystal-guide-collection-v1.png', 'Assorted healing crystals and bracelet reference tray', 'Curated reference collection of healing crystals, bracelet beads, and blank guide cards in warm natural light', '800x600', generated),
    wide: asset(GEN + '/shared-hero-bracelet-v1.png', 'Healing crystal bracelets styled in warm natural light', 'Wide hero image of healing crystal bracelets arranged with soft linen, sage, and warm window light for a premium crystal wellness brand', '1920x900', generated),
    heroBracelet: asset(GEN + '/shared-hero-bracelet-v1.png', 'LuckyCrystals healing crystal bracelet hero image', 'Full-width hero scene with crystal bracelets, soft fabric, cleansing tools, and warm natural light', '1920x900', generated),
    studioWorkbench: asset(GEN + '/sourcing-studio-workbench-v1.png', 'LuckyCrystals studio workbench with selected crystal materials', 'Trustworthy crystal bracelet studio workbench with sorted raw crystals, polished beads, inspection tools, and packaging', '1920x900', generated),
    packaging: asset(GEN + '/contact-studio-support-v1.png', 'Crystal bracelet gift packaging with care card', 'Premium crystal bracelet packaging with velvet pouch, guide card, natural stones, and customer care desk', '1200x800', generated),
    moonRitual: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moonlit crystal ritual scene', 'Moon phase ritual scene with selenite, moonstone, clear quartz, candlelight, and a dark celestial background', '1920x900', generated),
    mysteryBox: asset(GEN + '/mystery-box-opened-v1.png', 'Mystery crystal box with surprise crystal bracelets', 'Mystery crystal subscription box opened to reveal bracelets, raw stones, velvet pouch, and ritual cards', '1920x900', generated),
    crystalGrid: asset(GEN + '/crystal-guide-collection-v1.png', 'Crystal guide collection with many healing stones', 'Crystal guide reference collection with amethyst, rose quartz, citrine, black tourmaline, clear quartz, and moonstone', '1920x900', generated),
    cta: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Crystal guidance tools and bracelets for personal intention setting', 'Warm mystical crystal guidance scene with oracle cards, zodiac accents, bracelets, and intention-setting tools', '1920x900', generated)
  },

  faq: {
    hero: asset(GEN + '/faq-hero-crystal-care-v1.png', 'Crystal care cards and healing bracelets', 'FAQ hero image with crystal bracelets, care cards, cleansing tools, and calm neutral styling', '1920x900', generated),
    cta: asset(GEN + '/contact-studio-support-v1.png', 'LuckyCrystals support studio', 'Customer support crystal studio scene with bracelet packaging and care cards', '1920x900', generated)
  },

  contact: {
    hero: asset(GEN + '/contact-studio-support-v1.png', 'LuckyCrystals studio and support desk', 'Contact page hero with warm crystal studio desk, finished bracelets, packaging, and customer care notes', '1920x900', generated),
    form: asset(GEN + '/contact-studio-support-v1.png', 'Crystal order packaging ready for customer support', 'Contact form side image with crystal order packaging, guide card, and branded support desk', '800x900', generated)
  },

  about: {
    // Section 1 Hero: "Our Story — Ancient wisdom meets modern intention" with dark overlay 0.65
    hero: asset(GEN + '/about-hero-brand-story-v1.png',
      'LuckyCrystals brand story hero with crystal bracelets and ancient wisdom artifacts',
      'Premium wide hero banner for a crystal wellness brand About page: multiple healing crystal bracelets arranged on a warm wooden surface beside a small jade pendant, an open leather journal with handwritten affirmations, dried lavender sprigs, and a single burning candle. Warm golden hour light from the left. Deep moody atmosphere suitable for dark overlay text. No people, no faces, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.',
      '1920x900', generated),

    // Section 3 Intention-Setting: craftsmanship and intention-setting workspace (no portrait, branded studio shot)
    founder: asset(GEN + '/about-intention-setting-workspace-v1.png',
      'Crystal bracelet intention-setting workspace with cleansing tools',
      'Square product photo for a crystal bracelet intention-setting section: a clean white studio workbench viewed from above, showing sorted polished rose quartz amethyst and citrine beads in small ceramic bowls, a bundle of dried white sage, a brass singing bowl, scattered affirmation cards with handwritten intentions, and one finished crystal bracelet resting on a selenite charging plate. Soft diffused natural light, warm and mindful atmosphere. No people, no faces, no hands, no text. Photorealistic, clean and trustworthy brand aesthetic, 800x800 square crop.',
      '800x800', generated),

    // Section 6 Quality Promise icon 1: "100% Natural Crystals" — displayed as 70px circle
    natural: asset(GEN + '/about-icon-natural-crystals-v1.png',
      'Natural raw and polished crystal pair showing authentic texture',
      'Square icon image for "100% Natural Crystals" quality badge: a single raw amethyst geode half placed beside a polished amethyst bead on a clean warm beige linen surface. Top-down flat lay, centered composition, soft diffused studio light. The contrast between raw and polished forms shows authenticity and natural origin. No text, no labels, no hands. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 6 Quality Promise icon 2: "Energetically Cleansed & Charged" — displayed as 70px circle
    cleansing: asset(GEN + '/about-icon-cleansing-charged-v1.png',
      'Crystal bracelet being cleansed with sage smoke and moonlight',
      'Square icon image for "Energetically Cleansed and Charged" quality badge: a single crystal bracelet resting on a raw selenite charging plate, with a thin wisp of dried sage smoke gently curling around it. Dark slate background for contrast, warm amber candlelight from the side. Mystical but clean and premium feel. No people, no faces, no hands, no text. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 6 Quality Promise icon 3: "Velvet Pouch + Guide Card Included" — displayed as 70px circle
    packaging: asset(GEN + '/about-icon-velvet-pouch-guide-v1.png',
      'Velvet pouch and crystal energy guide card gift packaging',
      'Square icon image for "Velvet Pouch and Guide Card Included" quality badge: a soft dark purple velvet pouch partially open revealing a crystal bracelet inside, placed beside a cream-colored guide card with subtle crystal illustrations visible on its surface. Warm neutral linen background, top-down flat lay, soft natural window light. Premium unboxing feel. No people, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 6 Quality Promise icon 4: "30-Day Worry-Free Returns" — displayed as 70px circle
    returns: asset(GEN + '/about-icon-returns-guarantee-v1.png',
      'Crystal bracelet order package with care return card',
      'Square icon image for "30-Day Worry-Free Returns" quality badge: a neatly closed kraft gift box with a subtle branded wax seal, a small handwritten thank-you card tucked under the ribbon, and a single crystal bracelet visible beside the box on a clean warm background. Conveys trust, care, and premium service. Top-down flat lay, soft diffused light. No people, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 7 User Story 1: Amanda K. — Rose Quartz bracelet buyer — displayed as 60px circle
    communityRose: asset(GEN + '/about-community-rose-quartz-v1.png',
      'Rose quartz crystal bracelet with self-love journaling scene',
      'Square image for a rose quartz bracelet customer testimonial: a delicate rose quartz beaded bracelet resting on an open journal page with pink-toned handwritten gratitude notes, a pink rose petal, and a small rose quartz heart stone. Warm romantic soft light, cream and blush color palette. Conveys self-love, healing, and personal story. No people, no faces, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 7 User Story 2: David R. — Black Tourmaline bracelet buyer — displayed as 60px circle
    communityProtection: asset(GEN + '/about-community-black-tourmaline-v1.png',
      'Black tourmaline crystal bracelet with grounding desk scene',
      'Square image for a black tourmaline bracelet customer testimonial: a sleek black tourmaline beaded bracelet placed on a dark walnut desk beside a minimal leather planner, a fountain pen, and a small obsidian worry stone. Masculine and grounded aesthetic, cool-toned professional lighting from a desk lamp. Conveys strength, focus, and workplace energy. No people, no faces, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 7 User Story 3: Sophie L. — Amethyst bracelet buyer — displayed as 60px circle
    communityAmethyst: asset(GEN + '/about-community-amethyst-v1.png',
      'Amethyst crystal bracelet with calming study scene',
      'Square image for an amethyst bracelet customer testimonial: a purple amethyst beaded bracelet resting on a soft lavender linen cloth beside a stack of textbooks, a small amethyst cluster, and a cup of chamomile tea with gentle steam. Calm and comforting atmosphere, soft purple and cream tones, diffused afternoon light from a window. Conveys calm, focus, and student wellness. No people, no faces, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 7 User Story 4: Mia T. — Citrine bracelet buyer — displayed as 60px circle
    communityCitrine: asset(GEN + '/about-community-citrine-v1.png',
      'Citrine crystal bracelet with abundance entrepreneurship scene',
      'Square image for a citrine bracelet customer testimonial: a warm golden citrine beaded bracelet placed on a clean white desk beside a small succulent plant in a terracotta pot, a laptop keyboard corner, and a raw citrine point. Bright optimistic morning light, yellow and white color palette, entrepreneurial and abundance energy. No people, no faces, no hands, no text overlay. Photorealistic, suitable for circular crop. 400x400 square.',
      '400x400', generated),

    // Section 8 CTA: "Ready to Find Your Crystal?" with dark overlay 0.7
    cta: asset(GEN + '/about-cta-find-your-crystal-v1.png',
      'Discover your perfect crystal bracelet with intention-setting tools',
      'Premium wide hero banner for About page call-to-action: a serene crystal intention-setting scene viewed from slightly above, showing an arrangement of five different crystal bracelets fanned out on soft cream linen, scattered dried flowers, a white sage bundle, a small brass singing bowl, and one oracle card face-down. Warm sunset golden light, dreamy and inviting atmosphere suitable for dark overlay with white text. No people, no faces, no hands, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.',
      '1920x900', generated)
  },

  sourcing: {
    // Section 1 Hero: "Ethically Sourced, From Earth to You" with dark overlay 0.65
    hero: asset(GEN + '/sourcing-hero-earth-to-wrist-v1.png',
      'Ethically sourced crystal bracelets journey from mine to wrist',
      'Premium wide hero banner for an ethical crystal sourcing page: raw unpolished crystals in natural earth tones emerging from rich dark soil at the left side, transitioning smoothly to polished crystal bracelet beads arranged on a clean linen surface at the right. A single shaft of warm sunlight illuminates the polished stones. Earthy browns and warm golds color palette, deep moody atmosphere suitable for dark overlay text. No people, no faces, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.',
      '1920x900', generated),
    // Section 3 Step 1: Traceable Origins
    mining: asset(GEN + '/sourcing-step-mining-origins-v1.png',
      'Raw crystal specimens in natural mine environment showing traceable origins',
      'Educational product photo for ethical mining step: a collection of raw unpolished amethyst and rose quartz crystal specimens resting on natural dark earth and stone surface, with a small label card and a magnifying glass beside them. Warm natural outdoor light filtering through. Shows the natural origin and raw beauty of ethically mined crystals. No people, no faces, no hands, no text overlay. Photorealistic, warm earth tones, 800x600 landscape.',
      '800x600', generated),
    // Section 3 Step 2: Hand-Selected Quality
    selection: asset(GEN + '/sourcing-step-hand-selection-v1.png',
      'Hand-selected polished crystal beads sorted by color and quality grade',
      'Educational product photo for crystal selection step: sorted polished crystal beads in small wooden bowls arranged by color — amethyst purple, rose quartz pink, citrine gold, clear quartz white, black tourmaline — on a clean light wood workbench. A brass loupe and a small notepad visible at the edge. Top-down flat lay, warm studio light, clean and organized aesthetic. Shows quality control and careful hand selection. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.',
      '800x600', generated),
    // Section 3 Step 3: Energetic Cleansing
    cleansing: asset(GEN + '/sourcing-step-energy-cleansing-v1.png',
      'Crystal bracelet being energetically cleansed with sage smoke and selenite',
      'Educational product photo for crystal cleansing step: a single crystal bracelet resting on a large flat selenite charging plate, with a thin stream of dried white sage smoke gently rising around it. A single beeswax candle providing warm amber light from the left. Dark charcoal background for contrast. Mystical yet clean and professional atmosphere. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.',
      '800x600', generated),
    // Section 3 Step 4: Quality Inspection
    inspection: asset(GEN + '/sourcing-step-quality-inspection-v1.png',
      'Crystal bracelet quality inspection under natural light with measurement tools',
      'Educational product photo for quality inspection step: a finished crystal bracelet lying on a white inspection mat under bright natural daylight, with a brass jeweler\'s loupe and a small digital caliper placed beside it. A quality checklist card with handwritten notes visible at the corner. Clean professional studio setting, bright and trustworthy. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.',
      '800x600', generated),
    // Section 3 Step 5: Eco-Friendly Packaging
    packaging: asset(GEN + '/sourcing-step-eco-packaging-v1.png',
      'Crystal bracelet in eco-friendly kraft box with velvet pouch and guide card',
      'Educational product photo for eco-friendly packaging step: an open recyclable kraft gift box containing a dark purple velvet pouch with a crystal bracelet visible inside, placed beside a cream-colored energy guide card and a small dried flower sprig. All materials look natural and sustainable. Warm neutral linen background, top-down flat lay, soft natural light. Premium yet earth-conscious brand aesthetic. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.',
      '800x600', generated),
    // Section 3 Step 6: Delivered to You
    delivery: asset(GEN + '/sourcing-step-delivery-reveal-v1.png',
      'Crystal bracelet order delivered in eco-friendly packaging',
      'Educational product photo for delivery step: a sealed kraft shipping box with a branded wax seal on top, placed on a warm wooden doorstep or entryway surface. The box is accompanied by a small handwritten thank-you note and a single dried lavender sprig. Warm welcoming morning light, conveying the unboxing experience and care in delivery. No people, no faces, no hands, no text overlay. Photorealistic, 800x600 landscape.',
      '800x600', generated),
    // Section 5 CTA: "Shop Ethically Sourced Crystals" with dark overlay 0.7
    cta: asset(GEN + '/sourcing-cta-shop-ethical-v1.png',
      'Shop ethically sourced crystal bracelets with full supply chain transparency',
      'Premium wide hero banner for ethical crystal sourcing call-to-action: a beautiful arrangement of five different finished crystal bracelets displayed on a raw natural stone slab, surrounded by small potted succulents, dried botanicals, and scattered raw crystal chips. Warm sunset golden light, organic and earthy color palette. Inviting atmosphere suitable for dark overlay with white text. No people, no faces, no hands, no text overlay. Photorealistic, editorial quality, 1920x900 landscape.',
      '1920x900', generated)
  },

  blog: {
    hero: asset(GEN + '/blog-crystal-journal-v1.png', 'Crystal wisdom blog hero with guide cards and crystals', 'Blog hero image with crystal guide cards, stones, journal, and warm editorial styling', '1920x900', generated),
    beginnerGuide: asset(GEN + '/blog-crystal-journal-v1.png', 'Beginner crystal healing guide cover', 'Article cover for beginner crystal healing guide with assorted crystal bracelets', '1200x600', generated),
    fullMoon: asset(GEN + '/moon-calendar-ritual-v1.png', 'Full moon crystal cleansing guide cover', 'Article cover for full moon crystal cleansing with selenite and moonstone', '1200x600', generated),
    angelNumbers: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Angel numbers and crystal energy guide cover', 'Article cover for angel numbers and crystal energy with celestial styling', '1200x600', generated),
    amethyst: asset(WP + '/2025/05/home-4.jpeg', 'Amethyst meaning guide cover', 'Article cover for amethyst meaning guide and calming energy', '800x600', existing),
    roseQuartz: asset(WP + '/2025/05/home-2.jpeg', 'Rose quartz relationships guide cover', 'Article cover for rose quartz and love relationships', '800x600', existing),
    sleep: asset(GEN + '/moon-calendar-ritual-v1.png', 'Crystals for sleep guide cover', 'Article cover for calming crystals for sleep and rest', '800x600', generated),
    citrine: asset(WP + '/2025/05/home-3.jpeg', 'Citrine abundance guide cover', 'Article cover for citrine abundance and prosperity', '800x600', existing),
    grid: asset(GEN + '/crystal-guide-collection-v1.png', 'Crystal grid manifestation guide cover', 'Article cover for crystal grid manifestation practice', '800x600', generated),
    protection: asset(WP + '/2025/05/home-5.jpeg', 'Black tourmaline protection guide cover', 'Article cover for black tourmaline protection stone', '800x600', existing),
    chakra: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Chakra healing with crystals guide cover', 'Article cover for chakra healing with crystal bracelets', '800x600', generated),
    moonPhases: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moon phases and crystals guide cover', 'Article cover for moon phases and crystal rituals', '800x600', generated),
    clearQuartz: asset(GEN + '/shared-hero-bracelet-v1.png', 'Clear quartz master healer guide cover', 'Article cover for clear quartz and master healer properties', '800x600', generated)
  },

  crystals: {
    amethyst: asset(WP + '/2025/05/home-4.jpeg', 'Amethyst crystal bracelet thumbnail', 'Circular thumbnail of amethyst crystal bracelet', '800x800', existing),
    roseQuartz: asset(WP + '/2025/05/home-2.jpeg', 'Rose quartz crystal bracelet thumbnail', 'Circular thumbnail of rose quartz crystal bracelet', '800x800', existing),
    citrine: asset(WP + '/2025/05/home-3.jpeg', 'Citrine crystal bracelet thumbnail', 'Circular thumbnail of citrine crystal bracelet', '800x800', existing),
    blackTourmaline: asset(WP + '/2025/05/home-5.jpeg', 'Black tourmaline crystal bracelet thumbnail', 'Circular thumbnail of black tourmaline crystal bracelet', '800x800', existing),
    clearQuartz: asset(GEN + '/shared-hero-bracelet-v1.png', 'Clear quartz crystal bracelet thumbnail', 'Circular thumbnail of clear quartz crystal bracelet', '800x800', generated),
    tigerEye: asset(GEN + '/crystal-guide-collection-v1.png', 'Tiger eye crystal bracelet thumbnail', 'Circular thumbnail of tiger eye crystal bracelet', '800x800', generated),
    moonstone: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moonstone crystal bracelet thumbnail', 'Circular thumbnail of moonstone crystal bracelet', '800x800', generated),
    obsidian: asset(WP + '/2025/05/home-5.jpeg', 'Obsidian crystal bracelet thumbnail', 'Circular thumbnail of obsidian crystal bracelet', '800x800', existing),
    lepidolite: asset(WP + '/2025/05/home-4.jpeg', 'Lepidolite crystal bracelet thumbnail', 'Circular thumbnail of lepidolite crystal bracelet', '800x800', existing),
    selenite: asset(GEN + '/moon-calendar-ritual-v1.png', 'Selenite crystal bracelet thumbnail', 'Circular thumbnail of selenite crystal bracelet', '800x800', generated),
    greenAventurine: asset(WP + '/2025/05/home-3.jpeg', 'Green aventurine crystal bracelet thumbnail', 'Circular thumbnail of green aventurine crystal bracelet', '800x800', existing),
    fluorite: asset(GEN + '/crystal-guide-collection-v1.png', 'Fluorite crystal bracelet thumbnail', 'Circular thumbnail of fluorite crystal bracelet', '800x800', generated),
    howlite: asset(GEN + '/shared-hero-bracelet-v1.png', 'Howlite crystal bracelet thumbnail', 'Circular thumbnail of howlite crystal bracelet', '800x800', generated),
    rhodonite: asset(WP + '/2025/05/home-2.jpeg', 'Rhodonite crystal bracelet thumbnail', 'Circular thumbnail of rhodonite crystal bracelet', '800x800', existing),
    malachite: asset(GEN + '/sourcing-studio-workbench-v1.png', 'Malachite crystal bracelet thumbnail', 'Circular thumbnail of malachite crystal bracelet', '800x800', generated),
    hematite: asset(WP + '/2025/05/home-5.jpeg', 'Hematite crystal bracelet thumbnail', 'Circular thumbnail of hematite crystal bracelet', '800x800', existing)
  },

  moonCalendar: {
    hero: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moon calendar crystal ritual hero', 'Moon calendar hero with lunar cycle, moonstone, selenite, and clear quartz', '1920x900', generated),
    currentPhase: asset(GEN + '/moon-calendar-ritual-v1.png', 'Current moon phase crystal ritual', 'Current moon phase visualization with moonstone and selenite on dark celestial background', '800x800', generated)
  },

  mysteryBox: {
    hero: asset(GEN + '/mystery-box-opened-v1.png', 'Mystery crystal box hero image', 'Mystery crystal box hero with opened package, surprise bracelets, raw stones, and ritual guide cards', '1920x900', generated),
    monthlyTheme: asset(GEN + '/mystery-box-opened-v1.png', 'This month mystery crystal box theme', 'Monthly mystery crystal box theme preview with celestial crystal selection', '800x600', generated),
    april: asset(GEN + '/crystal-guide-collection-v1.png', 'April mystery box renewal and growth crystals', 'Past mystery box image for renewal and growth theme', '800x600', generated),
    march: asset(GEN + '/interactive-oracle-celestial-v1.png', 'March mystery box intuition crystals', 'Past mystery box image for intuition theme', '800x600', generated),
    february: asset(WP + '/2025/05/home-2.jpeg', 'February mystery box love and compassion crystals', 'Past mystery box image for love and compassion theme', '800x600', existing),
    january: asset(GEN + '/shared-hero-bracelet-v1.png', 'January mystery box new year energy crystals', 'Past mystery box image for new year energy theme', '800x600', generated)
  },

  angelNumbers: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Angel number crystal guidance hero', 'Celestial crystal guidance scene for angel number meanings with bracelets, oracle cards, and golden motifs', '1920x900', generated),
    product: asset(GEN + '/shared-hero-bracelet-v1.png', 'Angel number crystal bracelet recommendation', 'Crystal bracelet recommendation image for angel number pages', '800x600', generated),
    meditation: asset(GEN + '/moon-calendar-ritual-v1.png', 'Angel number meditation crystals', 'Meditation crystal setup for angel number practice', '800x600', generated)
  },

  birthstone: {
    hero: asset(GEN + '/crystal-guide-collection-v1.png', 'Birthstone finder crystal collection hero', 'Birthstone finder hero with many colorful stones arranged as a premium reference collection', '1920x900', generated),
    result: asset(GEN + '/shared-hero-bracelet-v1.png', 'Birthstone crystal bracelet result', 'Birthstone result image with a premium crystal bracelet and selected stone', '800x600', generated)
  },

  chakraTest: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Chakra crystal test hero image', 'Chakra test hero with aligned crystals, bracelets, and intuitive spiritual tools', '1920x900', generated),
    result: asset(GEN + '/crystal-guide-collection-v1.png', 'Chakra crystal result image', 'Chakra crystal recommendation image with assorted healing stones', '800x600', generated)
  },

  crystalQuiz: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Crystal quiz hero image', 'Interactive crystal quiz hero with guidance cards, crystals, and bracelets', '1920x900', generated),
    amethyst: asset(WP + '/2025/05/home-4.jpeg', 'Amethyst crystal quiz result', 'Amethyst bracelet result image for crystal quiz', '800x600', existing),
    roseQuartz: asset(WP + '/2025/05/home-2.jpeg', 'Rose quartz crystal quiz result', 'Rose quartz bracelet result image for crystal quiz', '800x600', existing),
    citrine: asset(WP + '/2025/05/home-3.jpeg', 'Citrine crystal quiz result', 'Citrine bracelet result image for crystal quiz', '800x600', existing)
  },

  crystalOracle: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Crystal oracle hero image', 'Crystal oracle hero with oracle cards, celestial accents, and crystal bracelets', '1920x900', generated),
    card: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Crystal oracle card and bracelet image', 'Oracle card draw image with crystals and bracelets', '800x600', generated)
  },

  freeResources: {
    hero: asset(GEN + '/free-resources-card-preview-v1.png', 'Printable crystal resources hero image', 'Printable crystal resources preview with cards, crystals, and stationery', '1920x900', generated),
    crystalCards: asset(GEN + '/free-resources-card-preview-v1.png', 'Crystal cards printable preview', 'Preview of printable crystal cards with crystals and stationery', '800x600', generated),
    chakraCards: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Chakra cards printable preview', 'Preview of printable chakra cards with aligned crystals', '800x600', generated),
    zodiacCards: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Zodiac cards printable preview', 'Preview of printable zodiac crystal cards with celestial accents', '800x600', generated),
    moonPhaseCards: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moon phase cards printable preview', 'Preview of printable moon phase cards with moon ritual crystals', '800x600', generated)
  },

  mbti: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'MBTI and crystals hero image', 'Personality and crystal matching hero with oracle cards, bracelets, and celestial accents', '1920x900', generated),
    typeCard: asset(GEN + '/crystal-guide-collection-v1.png', 'MBTI crystal personality card image', 'Crystal personality match card with assorted stones and bracelets', '800x600', generated)
  },

  subscription: {
    hero: asset(GEN + '/mystery-box-opened-v1.png', 'Monthly crystal subscription box hero image', 'Subscription box hero with opened package, bracelets, raw crystals, pouch, and ritual guide cards', '1920x900', generated),
    tier: asset(GEN + '/contact-studio-support-v1.png', 'Crystal subscription tier packaging image', 'Subscription tier image with crystal bracelet packaging and care materials', '800x600', generated)
  },

  zodiac: {
    hero: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Zodiac compatibility crystal hero image', 'Zodiac compatibility hero with crystal guidance cards, zodiac wheel accents, and bracelets', '1920x900', generated),
    crystal: asset(GEN + '/shared-hero-bracelet-v1.png', 'Zodiac compatibility crystal bracelet recommendation', 'Crystal bracelet recommendation image for zodiac compatibility pages', '800x600', generated)
  },

  products: {
    bracelet: asset(GEN + '/shared-hero-bracelet-v1.png', 'Healing crystal bracelet product image', 'Product image of a healing crystal bracelet on a premium neutral background', '800x800', generated)
  }
};

module.exports = IMAGES;
