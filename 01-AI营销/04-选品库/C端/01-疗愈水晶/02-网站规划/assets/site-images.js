/**
 * Earthward site image registry.
 *
 * Page scripts should reference semantic image keys here instead of scattered
 * placeholder, stock, or one-off upload URLs.
 *
 * Status values:
 * - source_generated_wp_upload: generated asset copied to project and uploaded to WordPress media
 * - source_existing_wp_upload: existing Earthward WordPress media URL
 * - needs_generation: prompt is ready, URL should be replaced after generation
 */

const WP = 'https://goearthward.com/wp-content/uploads';
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
    heroBracelet: asset(GEN + '/shared-hero-bracelet-v1.png', 'Earthward healing crystal bracelet hero image', 'Full-width hero scene with crystal bracelets, soft fabric, cleansing tools, and warm natural light', '1920x900', generated),
    studioWorkbench: asset(GEN + '/sourcing-studio-workbench-v1.png', 'Earthward studio workbench with selected crystal materials', 'Trustworthy crystal bracelet studio workbench with sorted raw crystals, polished beads, inspection tools, and packaging', '1920x900', generated),
    packaging: asset(GEN + '/contact-studio-support-v1.png', 'Crystal bracelet gift packaging with care card', 'Premium crystal bracelet packaging with velvet pouch, guide card, natural stones, and customer care desk', '1200x800', generated),
    moonRitual: asset(GEN + '/moon-calendar-ritual-v1.png', 'Moonlit crystal ritual scene', 'Moon phase ritual scene with selenite, moonstone, clear quartz, candlelight, and a dark celestial background', '1920x900', generated),
    mysteryBox: asset(GEN + '/mystery-box-opened-v1.png', 'Mystery crystal box with surprise crystal bracelets', 'Mystery crystal subscription box opened to reveal bracelets, raw stones, velvet pouch, and ritual cards', '1920x900', generated),
    crystalGrid: asset(GEN + '/crystal-guide-collection-v1.png', 'Crystal guide collection with many healing stones', 'Crystal guide reference collection with amethyst, rose quartz, citrine, black tourmaline, clear quartz, and moonstone', '1920x900', generated),
    cta: asset(GEN + '/interactive-oracle-celestial-v1.png', 'Crystal guidance tools and bracelets for personal intention setting', 'Warm mystical crystal guidance scene with oracle cards, zodiac accents, bracelets, and intention-setting tools', '1920x900', generated)
  },

  home: {
    hero: asset(GEN + '/home-hero-intentional-living-v2.png',
      'Natural crystal bracelets for intentional living',
      'Premium wide homepage hero for Earthward: several natural crystal bracelets arranged on soft cream linen with raw mineral pieces, a blank intention card, and warm morning light. Grounded, honest, premium, calm, suitable for dark overlay text. No people, no faces, no hands, no smoke, no sage, no text overlay, no mystical effects. Photorealistic, 1920x900 landscape.',
      '1920x900', needs_generation),
    intentionCalm: asset(GEN + '/home-intention-calm-v2.png',
      'Amethyst bracelet for calm daily intention',
      'Square product image: amethyst bracelet on lavender linen beside a small amethyst cluster and a closed journal. Calm evening ritual mood, soft natural light, clean premium styling, no people, no hands, no text overlay. Photorealistic, suitable for card crop, 800x800 square.',
      '800x800', needs_generation),
    intentionLove: asset(GEN + '/home-intention-love-v2.png',
      'Rose quartz bracelet for self-compassion intention',
      'Square product image: rose quartz bracelet with a small rose quartz heart stone, pale linen, and a blank note card. Gentle self-compassion mood, blush and cream palette, no people, no hands, no readable text. Photorealistic, suitable for card crop, 800x800 square.',
      '800x800', needs_generation),
    intentionAbundance: asset(GEN + '/home-intention-abundance-v2.png',
      'Citrine bracelet for abundance intention',
      'Square product image: citrine bracelet on a clean white desk with a raw citrine point, small succulent, and blank planning card. Optimistic growth and creative planning mood, warm golden light, no people, no hands, no readable text. Photorealistic, suitable for card crop, 800x800 square.',
      '800x800', needs_generation),
    intentionGrounding: asset(GEN + '/home-intention-grounding-v2.png',
      'Black tourmaline bracelet for grounding intention',
      'Square product image: black tourmaline bracelet on a dark wood desk beside a smooth grounding stone and folded cotton cloth. Grounded, quiet, protective visual mood without dramatic effects, no people, no hands, no text overlay. Photorealistic, 800x800 square.',
      '800x800', needs_generation),
    intentionSleep: asset(GEN + '/home-intention-sleep-v2.png',
      'Moonstone bracelet for evening ritual',
      'Square product image: moonstone bracelet on soft white bedding beside a small moonstone, herbal tea, and warm bedside light. Gentle evening ritual mood, restful and natural, no people, no hands, no text overlay. Photorealistic, 800x800 square.',
      '800x800', needs_generation),
    intentionFocus: asset(GEN + '/home-intention-focus-v2.png',
      'Fluorite bracelet for focus intention',
      'Square product image: fluorite bracelet on a neat study desk beside a blank notebook, clear quartz point, and soft daylight. Clean focus and clarity mood, no people, no hands, no readable text. Photorealistic, 800x800 square.',
      '800x800', needs_generation),
    quiz: asset(GEN + '/home-crystal-guide-entry-v2.png',
      'Crystal guide cards and bracelets for choosing by intention',
      'Homepage guide entry image: natural crystal bracelets, blank guide cards, and small raw stones arranged on warm linen. Clear educational browsing feeling, modern wellness brand, no readable text, no people, no hands, no mystical effects. Photorealistic, 1200x900 landscape.',
      '1200x900', needs_generation),
    brandStory: asset(GEN + '/home-brand-story-workbench-v2.png',
      'Earthward crystal bracelet workbench with origin notes',
      'Brand story image for Earthward homepage: a trustworthy studio workbench with sorted crystal beads, raw mineral specimens, a jeweler loupe, cotton pouch, blank origin note card, and finished bracelets. Clean natural light, transparent sourcing and careful inspection mood, no people, no hands, no readable text. Photorealistic, 1200x900 landscape.',
      '1200x900', needs_generation),
    useCalm: asset(GEN + '/home-usecase-calm-evening-v2.png',
      'Amethyst bracelet as an evening wind-down cue',
      'Square use-case image: amethyst bracelet beside herbal tea and a closed journal on lavender linen. Quiet evening wind-down mood, no people, no hands, no readable text, no testimonial styling. Photorealistic, 400x400 square.',
      '400x400', needs_generation),
    useWorkday: asset(GEN + '/home-usecase-workday-grounding-v2.png',
      'Black tourmaline bracelet as a workday grounding cue',
      'Square use-case image: black tourmaline bracelet on a tidy work desk with a closed planner, pen, and grounding stone. Professional calm reset mood, no people, no hands, no readable text, no testimonial styling. Photorealistic, 400x400 square.',
      '400x400', needs_generation),
    useCompassion: asset(GEN + '/home-usecase-self-compassion-v2.png',
      'Rose quartz bracelet as a self-compassion reminder',
      'Square use-case image: rose quartz bracelet beside a blank journal, soft pink stone, and warm linen. Gentle self-compassion ritual mood, no people, no hands, no readable text, no testimonial styling. Photorealistic, 400x400 square.',
      '400x400', needs_generation),
    newsletter: asset(GEN + '/home-launch-cta-crystal-bracelets-v2.png',
      'Natural crystal bracelets and guide cards for choosing an Earthward piece',
      'Wide launch CTA background for Earthward: natural crystal bracelets, blank guide cards, raw stones, linen, and soft dusk light. Grounded shopping and guide feeling, suitable for dark overlay text. No people, no faces, no hands, no smoke, no sage, no readable text, no mystical effects. Photorealistic, 1920x900 landscape.',
      '1920x900', needs_generation)
  },

  faq: {
    hero: asset(GEN + '/faq-hero-crystal-care-v1.png', 'Crystal care cards and healing bracelets', 'FAQ hero image with crystal bracelets, care cards, cleansing tools, and calm neutral styling', '1920x900', generated),
    cta: asset(GEN + '/contact-studio-support-v1.png', 'Earthward support studio', 'Customer support crystal studio scene with bracelet packaging and care cards', '1920x900', generated)
  },

  contact: {
    hero: asset(GEN + '/contact-studio-support-v1.png', 'Earthward studio and support desk', 'Contact page hero with warm crystal studio desk, finished bracelets, packaging, and customer care notes', '1920x900', generated),
    form: asset(GEN + '/contact-studio-support-v1.png', 'Crystal order packaging ready for customer support', 'Contact form side image with crystal order packaging, guide card, and branded support desk', '800x900', generated)
  },

  about: {
    hero: asset(GEN + '/about-hero-brand-story-v2.png',
      'Earthward brand story with natural crystal bracelets and traceable materials',
      'Premium wide hero image for Earthward About page: natural crystal bracelets arranged on warm wood beside raw mineral specimens, a simple origin note card, linen fabric, and a closed journal. Calm natural light, grounded earthy palette, honest and editorial, suitable for dark overlay text. No people, no faces, no hands, no smoke, no text overlay, no mystical effects. Photorealistic, 1920x900 landscape.',
      '1920x900', needs_generation),
    founder: asset(GEN + '/about-intention-setting-workspace-v2.png',
      'Crystal bracelet workspace with beads, selenite plate, and intention cards',
      'Square product photo of a clean crystal bracelet workspace: sorted polished amethyst, rose quartz, and citrine beads in small ceramic bowls, a finished bracelet resting on a selenite plate, blank intention cards, a cotton cloth, and simple inspection tools. Warm diffused daylight, calm trustworthy studio feeling. No sage, no smoke, no people, no faces, no hands, no readable text. Photorealistic, 800x800 square crop.',
      '800x800', needs_generation),
    natural: asset(GEN + '/about-icon-natural-crystals-v2.png',
      'Raw and polished natural crystal showing authentic texture',
      'Square icon image for a genuine natural crystals quality badge: one raw amethyst geode piece beside one polished amethyst bracelet bead on warm beige linen. Centered flat lay, soft studio light, authentic texture, simple and premium. No text, no labels, no hands. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    cleansing: asset(GEN + '/about-icon-prepared-with-care-v2.png',
      'Crystal bracelet prepared with selenite and care card',
      'Square icon image for "Prepared With Care": a crystal bracelet resting on a white selenite charging plate beside a folded cotton cloth, small blank intention card, and a soft candle glow in the background. Clean, calm, grounded, no smoke, no sage, no mystical effects, no people, no hands, no readable text. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    packaging: asset(GEN + '/about-icon-velvet-pouch-guide-v2.png',
      'Velvet pouch and intention guide card gift packaging',
      'Square icon image of Earthward-style crystal bracelet packaging: a soft dark velvet pouch partly open with a crystal bracelet inside, a cream blank intention guide card, and natural paper packaging on warm linen. Premium unboxing feel, no hands, no text overlay, no readable text. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    returns: asset(GEN + '/about-icon-returns-care-v2.png',
      'Crystal bracelet package with simple care card',
      'Square icon image for a calm returns and care promise: neatly closed kraft gift box, ribbon, small blank care card, and a crystal bracelet beside the box on a clean warm background. Trustworthy, simple, premium service feeling. No hands, no text overlay, no readable text. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    communityRose: asset(GEN + '/about-usecase-rose-quartz-transition-v2.png',
      'Rose quartz bracelet with journaling scene for self-compassion',
      'Square use-case image: rose quartz bracelet on an open blank journal beside a rose quartz heart stone and soft linen. Gentle self-compassion mood, warm blush and cream palette, quiet everyday ritual, no people, no faces, no hands, no readable text, no testimonial styling. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    communityProtection: asset(GEN + '/about-usecase-black-tourmaline-workday-v2.png',
      'Black tourmaline bracelet on a calm work desk',
      'Square use-case image: black tourmaline bracelet on a tidy dark wood desk beside a closed planner, pen, and small grounding stone. Calm workday reset mood, professional and grounded, no people, no faces, no hands, no readable text, no testimonial styling. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    communityAmethyst: asset(GEN + '/about-usecase-amethyst-evening-v2.png',
      'Amethyst bracelet beside evening tea and a journal',
      'Square use-case image: amethyst bracelet resting on soft lavender linen beside a cup of herbal tea, a closed journal, and a small amethyst cluster. Quiet evening wind-down mood, soft purple and cream tones, no people, no faces, no hands, no readable text. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    communityCitrine: asset(GEN + '/about-usecase-citrine-creative-courage-v2.png',
      'Citrine bracelet with creative planning workspace',
      'Square use-case image: citrine bracelet on a clean white desk beside a blank planning card, small succulent, raw citrine point, and warm morning light. Optimistic creative-start mood, yellow and white palette, no people, no faces, no hands, no readable text. Photorealistic, suitable for circular crop, 400x400 square.',
      '400x400', needs_generation),
    cta: asset(GEN + '/about-cta-find-your-crystal-v2.png',
      'Crystal bracelets and intention cards for finding your crystal',
      'Premium wide CTA image: five natural crystal bracelets arranged on cream linen with blank intention cards, raw mineral pieces, dried lavender, and warm sunset light. Inviting, calm, grounded, suitable for dark overlay text. No sage, no smoke, no people, no faces, no hands, no readable text, no mystical effects. Photorealistic, 1920x900 landscape.',
      '1920x900', needs_generation)
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
