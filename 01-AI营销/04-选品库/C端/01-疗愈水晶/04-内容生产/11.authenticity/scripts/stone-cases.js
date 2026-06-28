/**
 * 真伪鉴别石种案例库（A2/A3/A4 共用）
 * 每石：mineral 矿物学数据(从 crystal-attributes.json + mineral-safety-reference.json 读) + fake_types 冒充类型 + key_tests 独有鉴别点 + price_range
 * 数据源：crystal-attributes.json (390颗mineral全字段) + mindat.org + GIA Gem Reference Guide + USGS
 * 配套框架 §4 矿物学数据表 + §5 石种案例
 */
module.exports = {
  _meta: {
    version: 'v1.0',
    created: '2026-06-28',
    framework_ref: '模板-水晶真伪鉴别文章框架.md §4 + §5',
    data_sources: ['crystal-attributes.json (390 stones)', 'mindat.org', 'GIA Gem Reference Guide', 'USGS Mineral Database'],
    calibration: '矿物数据从 crystal-attributes.json mineral 字段读，权威源标注；价格区间为市场参考非绝对'
  },
  stones: {
    amethyst: {
      name: 'Amethyst',
      meaning_slug: 'amethyst',
      meaning_url: '/gemstone/amethyst-meaning/',
      mineral: {
        formula: 'SiO₂ (silicon dioxide)',
        mohs: '7',
        specific_gravity: '2.65',
        refractive_index: '1.544',
        color_cause: 'Iron + natural irradiation',
        origins: 'Brazil, Uruguay, Zambia, Mexico'
      },
      shop_category: '/product-category/amethyst-crystals/',
      fake_types: ['Synthetic (lab-grown) purple quartz', 'Glass dyed purple', 'Heat-treated low-grade amethyst sold as "citrine"'],
      price_range: 'Tumbled stones $2-8; beads $0.50-3 each; small geodes $15-60; large cathedral geodes $100-2000+ depending on size and quality',
      key_tests: [
        'Color zoning is the headline test — natural amethyst shows subtle lighter/darker purple gradients, especially concentrated at crystal tips. Synthetic amethyst looks uniformly saturated and "too perfect."',
        'Inclusions under 10x loupe: natural amethyst has needle-like rutile, two-phase gas-liquid inclusions, or "fingerprints." Synthetic amethyst often shows "breadcrumb" inclusions from lab seed-crystal growth.',
        'UV fluorescence: synthetic amethyst frequently shows a blue fluorescence under shortwave UV; natural amethyst is usually inert or shows weak reddish-brown.',
        'Pricing sanity check: a large "natural amethyst" geode at the price of a tumbled stone is almost certainly dyed or reconstituted.'
      ],
      source_citation: 'GIA Gem Reference Guide — quartz; mindat.org — amethyst (Fe³⁺ + irradiation color cause)'
    },
    clear_quartz: {
      name: 'Clear Quartz',
      meaning_slug: 'quartz',
      meaning_url: '/gemstone/quartz-meaning/',
      mineral: {
        formula: 'SiO₂ (silicon dioxide)',
        mohs: '7',
        specific_gravity: '2.65',
        refractive_index: '1.544',
        color_cause: 'Colorless (no impurities)',
        origins: 'Brazil, Madagascar, Arkansas (USA), Himalayas'
      },
      shop_category: '/product-category/clear-quartz-crystals/',
      fake_types: ['Ordinary glass (most common)', 'Reconstituted quartz (quartz powder melted with glass)', 'Synthetic lab-grown quartz', 'Lead crystal glass ("crystal" naming trap)'],
      price_range: 'Small tumbled $1-4; small points $3-10; clusters $10-50; large cathedral points $30-300; museum-grade clusters $200-2000+',
      key_tests: [
        'Bubbles under 10x loupe are the #1 signal — glass has round air bubbles; genuine clear quartz has irregular inclusions (needles, veils, mineral flecks) or is inclusion-free.',
        'Hardness test: genuine clear quartz (Mohs 7) scratches glass; glass imitations cannot.',
        'The "crystal quartz" naming trap — the glass industry calls leaded glass "crystal" (lead crystal, crystal glass). "Crystal quartz" sold cheaply is often glass. Natural quartz is properly called "quartz."',
        'Three quality tiers to distinguish: natural clear quartz (has minor inclusions), clarified/reconstituted (too perfect, may show faint flow lines), and pure glass (bubbles, no quartz characteristics).',
        'Double refraction: genuine quartz shows slight doubling when you look through it at a sharp angle (text appears doubled); glass does not — but this needs magnification to see.'
      ],
      source_citation: 'mindat.org — quartz; GIA Gem Reference Guide — quartz RI 1.544, birefringence 0.009'
    },
    citrine: {
      name: 'Citrine',
      meaning_slug: 'citrine',
      meaning_url: '/gemstone/citrine-meaning/',
      mineral: {
        formula: 'SiO₂ (silicon dioxide)',
        mohs: '7',
        specific_gravity: '2.65',
        refractive_index: '1.544',
        color_cause: 'Iron (Fe³⁺) + heat',
        origins: 'Brazil, Madagascar, Russia, Spain'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Heat-treated amethyst sold as citrine (very common, often undisclosed)', 'Glass dyed yellow/orange', 'Synthetic quartz'],
      price_range: 'Tumbled $2-6; beads $0.50-3; small points $5-15; natural untreated citrine commands a premium',
      key_tests: [
        'Color tells the story: natural citrine is pale yellow to soft amber. The vivid "burnt orange" citrine ubiquitous in shops is almost always heat-treated amethyst — disclosure is the issue, not the treatment itself.',
        'Heat-treated amethyst often retains a subtle reddish-brown undertone and may show faint color zoning remnants from the original purple.',
        'Reputable sellers disclose heat treatment; the FTC requires it. "Natural citrine" priced the same as amethyst is a flag.',
        'Glass dyed yellow shows dye concentrations in cracks under a loupe.'
      ],
      source_citation: 'GIA Gem Reference Guide — citrine color cause (Fe³⁺ + heat)'
    },
    turquoise: {
      name: 'Turquoise',
      meaning_slug: 'turquoise',
      meaning_url: '/gemstone/turquoise-meaning/',
      mineral: {
        formula: 'CuAl₆(PO₄)₄(OH)₈·4H₂O (hydrated copper aluminum phosphate)',
        mohs: '5–6',
        specific_gravity: '2.6–2.9',
        refractive_index: '~1.62',
        color_cause: 'Copper (blue), iron (green)',
        origins: 'Iran, USA (Southwest), China, Mexico, Egypt'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Howlite dyed blue (the most common fake)', 'Plastic / resin (block turquoise, "reconstituted")', 'Magnesite dyed', 'Glass'],
      price_range: 'Genuine tumbled $5-20; beads $1-5; untreated Sleeping Beauty grade $20-100+; fakes often $1-3',
      key_tests: [
        'Matrix inspection: genuine turquoise has a natural matrix (host rock veins — brown, black, or golden). Dyed howlite has dark veining that looks "spiderweb" but the base color is wrong (too uniform blue, matrix too regular).',
        'The "too perfect" test: genuine turquoise varies in color across a piece; dyed howlite and plastic are uniform.',
        'Specific gravity: plastic block turquoise feels suspiciously light; genuine turquoise has a heftier feel.',
        'Price flag: large "natural turquoise" beads at $1-2 each are almost certainly howlite or plastic.',
        'Stabilization disclosure: most genuine turquoise on the market is "stabilized" (resin-impregnated for durability) — reputable sellers disclose this; it is legitimate, but should not be sold as "untreated."'
      ],
      source_citation: 'GIA Gem Reference Guide — turquoise; mindat.org — turquoise formula and origins'
    },
    lapis_lazuli: {
      name: 'Lapis Lazuli',
      meaning_slug: 'lapis',
      meaning_url: '/gemstone/lapis-meaning/',
      mineral: {
        formula: 'Lazurite + calcite + pyrite (a rock, not a single mineral)',
        mohs: '5–5.5',
        specific_gravity: '2.7–2.9',
        refractive_index: '~1.50',
        color_cause: 'Lazurite sulfur-bearing radicals (blue), pyrite (gold flecks)',
        origins: 'Afghanistan (primary, finest), Chile, Russia, Pakistan'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Dyed jasper or howlite', 'Synthetic lapis (Gilson)', 'Sodalite sold as lapis', 'Dyed marble'],
      price_range: 'Tumbled $3-12; beads $0.50-4; high-grade Afghan with pyrite $10-50 per piece',
      key_tests: [
        'Pyrite flecks: genuine lapis has real gold-colored pyrite flecks scattered irregularly — they look metallic and catch light. Fakes either have no pyrite, or pyrite painted/printed in too-uniform dots.',
        'Calcite white veining: genuine lapis often shows white calcite streaks. Perfectly uniform deep-blue lapis with no calcite or pyrite is suspicious.',
        'The "too blue" test: dyed howlite and jasper achieve an unnaturally uniform royal blue; genuine lapis has natural variation.',
        'Sodalite substitution: sodalite is a related blue mineral but lacks pyrite and has a different (often more violet) tone — sold cheaply as "lapis."'
      ],
      source_citation: 'GIA Gem Reference Guide — lapis lazuli; mindat.org — lazurite'
    },
    moldavite: {
      name: 'Moldavite',
      meaning_slug: 'moldavite',
      meaning_url: '/gemstone/moldavite-meaning/',
      mineral: {
        formula: 'SiO₂-rich natural glass (tektite — formed by meteorite impact)',
        mohs: '5–5.5',
        specific_gravity: '2.3–2.4',
        refractive_index: '~1.49–1.51',
        color_cause: 'Iron and other impurities in natural impact glass',
        origins: 'Czech Republic only (Bohemia & Moravia) — the Moldau River valley'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Green bottle glass (most common fake)', 'Synthetic green glass with etched texture', 'Other green tektites sold as moldavite', 'Lab-created imitations'],
      price_range: 'Genuine small pieces $20-80/gram (prices have risen sharply); medium $100-500; fakes $5-20 for a "large piece"',
      key_tests: [
        'Origin is everything: genuine moldavite comes only from the Czech Republic (the Moldau valley). A seller cannot name the source, or offers a huge piece cheaply, is a red flag.',
        'Lechatelierite bubbles and flow texture: genuine moldavite has distinctive sculpted, wrinkled "schuss" texture from its formation, and often contains small bubbles.',
        'Price flag is extreme: genuine moldavite has become expensive (mined-out supply); large "moldavite" at bargain prices is almost certainly bottle glass.',
        'UV test: some genuine moldavite shows no fluorescence (varies), but green bottle glass often fluoresces differently under UV.',
        'Color: genuine moldavite is a distinctive forest-green to olive; bottle-glass fakes are often too bright or too uniform.'
      ],
      source_citation: 'mindat.org — moldavite tektite; GIA Gem Reference Guide — tektites'
    },
    malachite: {
      name: 'Malachite',
      meaning_slug: 'malachite',
      meaning_url: '/gemstone/malachite-meaning/',
      mineral: {
        formula: 'Cu₂CO₃(OH)₂ (copper carbonate hydroxide)',
        mohs: '3.5–4',
        specific_gravity: '3.6–4.0',
        refractive_index: '~1.86',
        color_cause: 'Copper',
        origins: 'DRC (Congo), Russia, Zambia, Namibia, Australia'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Plastic / resin', 'Dyed howlite or magnesite', 'Printed vinyl on stone (cheap beads)', 'Synthetic'],
      price_range: 'Tumbled $3-10; beads $0.50-4; banded quality $5-30 per piece',
      key_tests: [
        'Banding is the signature: genuine malachite has natural, irregular green banding (light and dark green waves) — never perfectly repeating patterns. Plastic and printed fakes have too-regular bands.',
        'Specific gravity is a giveaway: genuine malachite is dense (SG 3.6-4.0) — it feels heavy for its size. Plastic feels light.',
        'Hardness: malachite is genuinely soft (Mohs 3.5-4) — a copper coin or fingernail can scratch it gently. (Conduct gently to avoid damage.)',
        'Safety note: malachite is copper-bearing — keep it dry and away from acids, and do not make "malachite water" for drinking (copper compounds are water-soluble and toxic).',
        'Color: genuine malachite greens are deep and varied; fakes are often a single flat green with painted bands.'
      ],
      source_citation: 'GIA / USGS — copper-bearing mineralogy; mindat.org — malachite'
    },
    jadeite: {
      name: 'Jadeite',
      meaning_slug: 'jadeite',
      meaning_url: '/gemstone/jadeite-meaning/',
      mineral: {
        formula: 'NaAlSi₂O₆ (sodium aluminum silicate — a pyroxene)',
        mohs: '6.5–7',
        specific_gravity: '~3.3 (distinctly heavier than substitutes)',
        refractive_index: '~1.66',
        color_cause: 'Chromium (emerald green "imperial jade"), iron (other greens, lavender)',
        origins: 'Myanmar (primary source for gem jadeite), Guatemala, Russia, Japan'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Dyed quartz (most common fake for green jade)', 'Serpentine (a softer, cheaper green stone)', 'Nephrite (a different, legitimate jade mineral — disclosure issue)', 'Glass and plastic', "Dyed 'jade' of unknown stone"],
      price_range: 'Vast range: ordinary carved "jade" $5-30; genuine jadeite bangles $50-500; imperial jadeite $1000-100,000+; fakes often under $20',
      key_tests: [
        'Specific gravity is the strongest home test: genuine jadeite (SG 3.3) feels distinctly heavy — heavier than quartz (2.65) of the same size. Most substitutes (serpentine, dyed quartz) feel lighter.',
        'The "coin tap" sound: genuine jadeite produces a clear, resonant chime when tapped with a coin (its dense structure); serpentine and glass sound dull.',
        'Cold to touch: jadeite has high thermal conductivity and feels cool.',
        'Color: dyed green "jade" often shows dye concentrations in cracks and looks unnaturally uniform. Genuine jadeite color comes from chromium and varies naturally.',
        'For high-value jadeite (bangles, carvings claiming imperial grade), a gemological lab certificate is essential — home tests cannot distinguish treated dyed jadeite from natural.'
      ],
      source_citation: 'GIA Gem Reference Guide — jadeite vs. nephrite; mindat.org — jadeite'
    },
    obsidian: {
      name: 'Obsidian',
      meaning_slug: 'obsidian',
      meaning_url: '/gemstone/obsidian-meaning/',
      mineral: {
        formula: 'Natural volcanic glass (~70-75% SiO₂, amorphous)',
        mohs: '5–5.5',
        specific_gravity: '~2.4',
        refractive_index: '~1.50',
        color_cause: 'Tiny mineral inclusions (black), cristobalite (snowflake patterns), thin-film interference (rainbow)',
        origins: 'Mexico, USA, Iceland, Italy, Ethiopia, Japan'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Industrial glass (the hardest to distinguish — same material family)', 'Molded black glass beads', "Fake 'snowflake' obsidian (painted white spots on black glass)"],
      price_range: 'Tumbled $2-6; beads $0.30-2; mirror-polished spheres $8-30; fakes similar prices but uniform perfection',
      key_tests: [
        'Obsidian is itself a natural glass — so distinguishing it from manufactured glass is genuinely difficult. This is the honest caveat.',
        'Inclusions are the key: genuine obsidian often has natural mineral inclusions, microcrystals (cristobalite in snowflake obsidian), or chatoyant bands. Industrial glass tends to be too uniform or have manufacturing bubbles.',
        'Snowflake obsidian: the "snowflakes" are natural cristobalite crystals — irregular, fern-like. Painted-on white spots on fake snowflake obsidian look too regular and sit on the surface.',
        'Rainbow obsidian: genuine rainbow obsidian shows concentric color bands (from thin-film interference) visible when lit from the right angle — difficult to fake.',
        'Price: obsidian is genuinely affordable, so fakes are less common than for amethyst or turquoise — but "too perfect" mirror-polished uniform black glass can still be manufactured.'
      ],
      source_citation: 'USGS — volcanic glass; mindat.org — obsidian'
    },
    rose_quartz: {
      name: 'Rose Quartz',
      meaning_slug: 'rose-quartz',
      meaning_url: '/gemstone/rose-quartz-meaning/',
      mineral: {
        formula: 'SiO₂ (silicon dioxide)',
        mohs: '7',
        specific_gravity: '2.65',
        refractive_index: '1.544–1.553',
        color_cause: 'Titanium, manganese + irradiation',
        origins: 'Brazil, Madagascar, South Africa, India, USA'
      },
      shop_category: '/product-category/healing-crystals-jewelry/',
      fake_types: ['Glass dyed pink', 'Plastic beads (cheap bracelets)', 'Synthetic quartz', 'Reconstituted (pink quartz powder + glass)'],
      price_range: 'Tumbled $2-6; beads $0.30-2; raw chunks $5-15; fakes similar prices',
      key_tests: [
        'Color variation: genuine rose quartz shows subtle pink variation and often a slightly cloudy appearance. Glass and plastic look uniform and clear.',
        'Hardness test: genuine rose quartz (Mohs 7) scratches glass; plastic and glass do not.',
        'Temperature: genuine rose quartz feels cool and stays cool; plastic warms immediately.',
        'The "too cheap bracelet" test: a 10mm bead rose quartz bracelet for $2-3 on a marketplace is very likely plastic or glass — genuine rose quartz beads cost more to cut and string.',
        'Asterism (star effect): some genuine rose quartz shows a six-rayed star when cut en cabochon and lit — a strong authenticity signal.'
      ],
      source_citation: 'mindat.org — rose quartz (Ti/Mn + irradiation color cause)'
    }
  }
};
