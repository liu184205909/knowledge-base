/**
 * 真伪鉴别 10 法库（单源，A1-A4 共用）
 * 每法三件套：science（科学原理，含数值）+ comparison_table（真假对比表）+ limitations（诚实局限性）
 * 数据源：mindat.org / GIA Gem Reference Guide / USGS Mineral Database
 * 配套 _shared/mineral-safety-reference.json（mohs/mineral）+ crystal-attributes.json（mineral 全字段）
 */
module.exports = {
  _meta: {
    version: 'v1.0',
    created: '2026-06-28',
    framework_ref: '模板-水晶真伪鉴别文章框架.md §3',
    data_sources: ['mindat.org', 'GIA Gem Reference Guide', 'USGS Mineral Database'],
    principle: '每法标科学原理+真假对比表+诚实局限性（不伪装100%准确，强化E-E-A-T Trust）'
  },
  methods: {
    temperature: {
      num: 1,
      name: 'Temperature Test',
      icon: '🌡️',
      science: 'Minerals transfer heat faster than glass or plastic because their ordered crystalline lattice conducts thermal energy more efficiently than the disordered amorphous structure of glass. A natural crystal at room temperature (around 20°C) therefore feels noticeably cool when first touched and stays cool longer, while glass and plastic — which conduct heat poorly — quickly warm to skin temperature.',
      comparison_table: [
        { signal: 'Initial touch', genuine: 'Noticeably cool', fake: 'Closer to room temperature' },
        { signal: 'After 10 seconds in hand', genuine: 'Still cool', fake: 'Warmed up' },
        { signal: 'Thermal conductivity', genuine: 'High (crystal lattice)', fake: 'Low (amorphous glass / polymer)' }
      ],
      how_to: [
        'Hold the stone in your palm or against your inner wrist (more temperature-sensitive than fingertips) for about 10 seconds.',
        'Compare the feel against a known glass object of similar size (a glass bead or marble) at the same room temperature.',
        'A genuine quartz, amethyst, or citrine keeps a cool edge; glass warms quickly.'
      ],
      limitations: 'Room temperature, body heat, and ambient humidity all affect the result — test in a neutral 20°C room, not after the stone sat in sunlight or a hot car. Small beads (under 8mm) are harder to judge by touch because they warm up faster regardless of material. This is a useful first signal, never a standalone verdict.',
      best_for: 'Quartz family (clear quartz, amethyst, citrine, rose quartz, smoky quartz), topaz. Less reliable for opaque stones (jasper, howlite) where surface texture masks the temperature cue.',
      source_citation: 'mindat.org — mineral thermal conductivity; GIA Gem Reference Guide — quartz identification'
    },
    hardness: {
      num: 2,
      name: 'Hardness / Scratch Test',
      icon: '🔨',
      science: 'The Mohs scale ranks minerals by scratch resistance from 1 (talc) to 10 (diamond). Genuine quartz sits at Mohs 7, meaning it can scratch ordinary window glass (about Mohs 5.5) and steel (around Mohs 6). Glass imitations, being softer or equally soft, cannot reliably scratch true glass. The test exploits this hardness gap.',
      comparison_table: [
        { signal: 'Scratching glass', genuine: 'Quartz (Mohs 7) scratches glass easily', fake: 'Glass (Mohs 5.5) cannot scratch glass' },
        { signal: 'Being scratched by steel', genuine: 'Steel (Mohs 6) cannot scratch quartz', fake: 'Steel can scratch glass imitation' },
        { signal: 'Edge after scratch', genuine: 'Leaves a clear groove', fake: 'No mark, or only crumbles' }
      ],
      how_to: [
        'Take a piece of ordinary window glass (a glass jar you do not mind damaging, never good glassware).',
        'Press a sharp edge or point of the stone firmly and drag it across the glass.',
        'A genuine quartz leaves a visible scratch groove; a glass imitation leaves no mark or only a faint streak that rubs off.'
      ],
      limitations: 'This is a destructive test — it damages both the stone (edge) and the glass. Never use it on finished jewelry, polished pieces, or stones you want to keep pristine. It does not work for genuine soft stones (malachite Mohs 3.5-4, calcite Mohs 3, turquoise Mohs 5-6) which legitimately cannot scratch glass. Use only as a confirmation on quartz-family rough or tumbled stones.',
      best_for: 'Quartz family (Mohs 7), topaz (Mohs 8), jadeite (Mohs 6.5-7). Not suitable for soft stones, jewelry, or polished specimens.',
      source_citation: 'mindat.org — Mohs hardness scale; USGS Mineral Database — quartz hardness'
    },
    specific_gravity: {
      num: 3,
      name: 'Specific Gravity (Heft) Test',
      icon: '⚖️',
      science: 'Specific gravity (SG) measures density relative to water. Natural quartz has an SG of 2.65 — meaning a given volume of quartz weighs 2.65 times the same volume of water. Most common glass falls around 2.4-2.6, plastic around 1.0-1.5. Holding two stones of the same size, the denser genuine crystal feels noticeably heavier in the hand ("good heft"), while plastic feels suspiciously light.',
      comparison_table: [
        { signal: 'Weight in hand for same size', genuine: 'Substantial — "good heft" (SG 2.65 quartz)', fake: 'Lighter (glass ~2.5, plastic ~1.2)' },
        { signal: 'Ratio to water displacement', genuine: '2.65 (quartz), 3.3 (jadeite)', fake: '2.4-2.6 (glass), 1.0-1.5 (plastic)' },
        { signal: 'Tapping two same-size beads', genuine: 'Denser, deeper tap', fake: 'Hollower tap' }
      ],
      how_to: [
        'Compare the suspected stone against a known genuine stone of similar size (or against a glass marble of the same diameter).',
        'Weigh them in your palm alternately — a genuine quartz bead feels about 10% heavier than an equal-size glass bead.',
        'For precision: weigh the stone dry, then suspended in water, and divide — but for most home checks, hand heft is enough.'
      ],
      limitations: 'The difference between quartz (2.65) and glass (2.4-2.6) is small enough that hand heft alone is unreliable without a reference object of the same size. Plastic (1.0-1.5) is obvious, but high-quality glass imitations can feel similar. A precision jewelry scale with water displacement is needed for an accurate SG reading.',
      best_for: 'All stones where there is a meaningful density gap — especially distinguishing plastic imitations of any stone, and jadeite (SG 3.3, distinctly heavier than the quartz or serpentine often substituted).',
      source_citation: 'mindat.org — mineral specific gravity data; GIA Gem Reference Guide'
    },
    bubbles: {
      num: 4,
      name: 'Bubble Inspection (10x Loupe)',
      icon: '🔍',
      science: 'Manufactured glass traps small spherical or teardrop-shaped air bubbles as it cools — a tell-tale sign of industrial origin. Natural minerals form over geological time and instead contain natural inclusions: needle-like rutile, two-phase gas-liquid inclusions, mineral crystals, or "fingerprints" of healed fractures. A 10x jeweler\'s loupe reveals the difference: round bubbles mean glass; irregular inclusions mean natural.',
      comparison_table: [
        { signal: 'Under 10x loupe', genuine: 'Needle/plate inclusions, growth lines, mineral flecks', fake: 'Perfectly round bubbles, swirls, no irregular inclusions' },
        { signal: 'Bubble shape', genuine: 'None (natural minerals rarely trap air)', fake: 'Spherical or teardrop bubbles' },
        { signal: 'Internal texture', genuine: 'Chaotic, asymmetric, "natural"', fake: 'Too clean, or with flow lines from manufacturing' }
      ],
      how_to: [
        'Use a 10x jeweler\'s loupe (an inexpensive tool — about $10-15 online).',
        'Hold the stone against a light source (window or lamp) and look through it with the loupe.',
        'Scan for perfectly round, spherical bubbles — these are characteristic of glass. Natural stones show irregular inclusions instead.'
      ],
      limitations: 'High-quality optical glass and fused quartz can be manufactured bubble-free, so the absence of bubbles does not guarantee natural origin — but the presence of round bubbles almost always indicates glass. Some natural stones (like enhydro quartz) do contain moving water bubbles, but these are elongated or angular, not perfectly round. Requires a loupe; the naked eye usually cannot resolve the smallest bubbles.',
      best_for: 'Transparent stones sold as clear quartz, citrine, topaz, or diamond simulants. Less useful for opaque stones where you cannot see inside.',
      source_citation: 'GIA Gem Reference Guide — inclusions in natural vs. synthetic; mindat.org'
    },
    color_banding: {
      num: 5,
      name: 'Color Banding & Zoning',
      icon: '🌈',
      science: 'Natural color in minerals forms unevenly because crystal growth happens over geological time under changing conditions. Genuine amethyst shows subtle color zoning — deeper purple at the tips, lighter near the base, with natural gradation. Synthetic quartz grown in a lab colors uniformly and looks "flat" or overly saturated. Dyed stones concentrate pigment in surface cracks and fissures rather than throughout.',
      comparison_table: [
        { signal: 'Color distribution', genuine: 'Uneven zoning, natural gradation', fake: 'Uniform, flat, "too perfect"' },
        { signal: 'Where color sits', genuine: 'Throughout the crystal, following growth structure', fake: 'Dyed: concentrated in cracks/fissures; synthetic: perfectly even' },
        { signal: 'Saturation', genuine: 'Subtle variation, lighter and darker zones', fake: 'Single flat tone, often over-saturated' }
      ],
      how_to: [
        'Look at the stone under daylight (not yellow indoor light, which distorts color).',
        'Examine whether the color is uniform or shows natural lighter/darker zones — genuine amethyst, citrine, and fluorite almost always show some variation.',
        'For suspected dye: check cracks and chips — dye pools in surface fissures and looks more intense there.'
      ],
      limitations: 'Some high-quality natural stones are genuinely uniform in color, and some synthetic stones are deliberately made with simulated zoning. So uniform color is a flag, not a verdict — combine with other tests. Dye tests can fade over time; a cotton swab dampened with acetone (for non-quartz stones) can lift surface dye, but this is mildly destructive.',
      best_for: 'Amethyst (most classic case), citrine, fluorite, agate, rose quartz, lapis lazuli. Not useful for naturally uniform stones or opaque dyed stones without cracks to inspect.',
      source_citation: 'GIA Gem Reference Guide — quartz color zoning; mindat.org — amethyst color cause (iron + irradiation)'
    },
    uv_light: {
      num: 6,
      name: 'UV Light (Fluorescence) Test',
      icon: '🟣',
      science: 'Some minerals fluoresce — emit visible light — under ultraviolet (UV) radiation, due to trace impurities called activators. Natural fluorite often fluoresces blue or purple; genuine scapolite glows yellow-orange; some natural quartz shows weak fluorescence. The fluorescence pattern of a natural stone differs from glass (usually inert) and from some synthetics (which may fluoresce differently). A 365nm UV flashlight reveals this.',
      comparison_table: [
        { signal: 'Under 365nm UV light', genuine: 'Specific fluorescence (e.g., fluorite → blue/purple)', fake: 'Glass usually inert; some synthetics fluoresce abnormally' },
        { signal: 'Fluorescence pattern', genuine: 'Patchy, follows natural growth zones', fake: 'Uniform or absent (glass), or too uniform (some synthetics)' },
        { signal: 'Color of glow', genuine: 'Species-specific (scapolite yellow, fluorite blue)', fake: 'None, or wrong color for the claimed species' }
      ],
      how_to: [
        'Use a 365nm UV flashlight (about $10-15 online; the shorter 395nm "blacklight" is less precise).',
        'Darken the room as much as possible.',
        'Shine the UV on the stone and observe any glow — note the color and whether it is patchy or uniform.'
      ],
      limitations: 'Not all minerals fluoresce — many genuine stones (including most clear quartz) show no reaction, so a negative result does not mean fake. Fluorescence also varies even within a single mineral species depending on impurities. This test is most useful as confirmation for known fluorescent species (fluorite, scapolite, some calcite, some amber). Requires a UV light source and a dark room.',
      best_for: 'Fluorite (reliable blue/purple), scapolite, amber (fluoresces blue-green), some calcite. Not useful as a general test for non-fluorescent species like clear quartz.',
      source_citation: 'mindat.org — mineral fluorescence data; GIA Gem Reference Guide'
    },
    refractive_index: {
      num: 7,
      name: 'Refractive Index (RI) Test',
      icon: '💎',
      science: 'When light enters a transparent material, it bends at a characteristic angle — the refractive index (RI). Quartz has an RI of 1.544, common glass around 1.50-1.52, diamond 2.417. A gemological refractometer measures this precisely. The gap between quartz (1.544) and glass (1.50) is small but measurable; diamond and its simulants differ dramatically.',
      comparison_table: [
        { signal: 'Refractive index reading', genuine: 'Quartz: 1.544 (precise)', fake: 'Glass: 1.50-1.52 (lower)' },
        { signal: 'Birefringence (double refraction)', genuine: 'Quartz shows slight doubling (0.009)', fake: 'Glass is singly refractive (no doubling)' },
        { signal: 'Reading stability', genuine: 'Sharp, single species-specific reading', fake: 'Variable or off-spec for the claimed stone' }
      ],
      how_to: [
        'This requires a gemological refractometer (a professional instrument, $100-300 for a basic model) and contact fluid (refractive index liquid).',
        'Place a polished flat face of the stone on the refractometer prism with a drop of contact fluid.',
        'Look through the eyepiece and read the boundary line — compare against known values for the claimed species.'
      ],
      limitations: 'Refractometers are expensive and require practice to read. The RI difference between quartz (1.544) and glass (1.50-1.52) is small enough that home use is difficult without experience. Many natural stones share overlapping RI ranges, so RI alone rarely gives a unique identification — it confirms or rules out rather than definitively names.',
      best_for: 'Distinguishing diamond (RI 2.417) from simulants, separating quartz from glass in valuable specimens, identifying ruby/sapphire vs. glass. Not a practical home test for inexpensive stones.',
      source_citation: 'GIA Gem Reference Guide — refractive index tables; mindat.org'
    },
    sound: {
      num: 8,
      name: 'Sound / Tap Test',
      icon: '🔔',
      science: 'A genuine crystal has an ordered internal structure that resonates when struck — producing a clear, sustained ring or chime. Glass, with its disordered amorphous structure, produces a shorter, duller "clink." This is the same principle that distinguishes crystal wine glasses (lead crystal, structured) from ordinary glass.',
      comparison_table: [
        { signal: 'Sound when tapped', genuine: 'Clear, sustained ring / chime', fake: 'Short, dull clink' },
        { signal: 'Resonance duration', genuine: 'Lingers', fake: 'Dies quickly' },
        { signal: 'Pitch', genuine: 'Higher, musical', fake: 'Lower, flat' }
      ],
      how_to: [
        'Suspend the stone on a string, or hold it lightly by the edge (not gripped, which dampens sound).',
        'Tap it gently with another hard object — a metal spoon, a glass rod, or another crystal.',
        'Listen: a genuine quartz crystal point produces a clear ring; glass produces a dull clink.'
      ],
      limitations: 'Highly subjective — requires a reference for comparison and some ear training. Small tumbled stones and beads produce little resonance regardless of material, making this test unreliable for jewelry. Background noise interferes. Most useful on larger crystal points and clusters, less so on small pieces.',
      best_for: 'Larger clear quartz points and clusters, singing bowls, large crystals. Not useful for small beads, tumbled stones, or jewelry.',
      source_citation: 'mineralogy reference — acoustic resonance of crystalline vs. amorphous solids'
    },
    price: {
      num: 9,
      name: 'Price Red Flag',
      icon: '💰',
      science: 'Genuine natural crystals carry real costs: mining, sorting, cutting, polishing, transport, and the reality that high-quality specimens are finite. A price far below the established market range signals that something is off — either synthetic, glass, dyed, or reconstituted material being sold as natural. While promotions exist, a consistent dramatic discount across a seller\'s entire catalog is a structural red flag, not a sale.',
      comparison_table: [
        { signal: 'Price vs. market range', genuine: 'Within reasonable market range for the species and quality', fake: 'Far below market (often 50-80% cheaper)' },
        { signal: 'Consistency of discount', genuine: 'Occasional promotions on specific pieces', fake: 'Entire catalog suspiciously cheap' },
        { signal: 'Quality claims vs. price', genuine: 'Price matches claimed grade', fake: '"Museum quality" at bargain prices' }
      ],
      how_to: [
        'Compare the seller\'s prices against established reference points (gemological market guides, reputable dealers).',
        'Be wary of "too good to be true" pricing — a large natural amethyst geode for the price of a tumbled stone is not a deal, it is a different material.',
        'Use price as one signal among many — a fair price does not guarantee authenticity, but a wildly low price is a strong warning.'
      ],
      limitations: 'Price alone never confirms authenticity — a seller can charge full price for glass. And genuine inexpensive stones exist (clear quartz, common agate, rose quartz rough are legitimately affordable). Use price as an auxiliary signal: a red flag warrants deeper testing, but a reasonable price does not exempt a stone from the other tests.',
      best_for: 'All stones, as an auxiliary signal — especially high-value species (jadeite, moldavite, large amethyst geodes, tanzanite) where prices are well-established and dramatic discounts are implausible.',
      source_citation: 'market reference — gemological pricing guides'
    },
    naming: {
      num: 10,
      name: 'Naming & Source Transparency',
      icon: '🏷️',
      science: 'Reputable sellers identify stones by their proper mineral name and origin, because mineral species and locality affect value and care. Vague or misleading names are a marketing red flag: the glass industry calls leaded glass "crystal" (lead crystal, crystal glass), so "crystal quartz" can mean glass rather than natural quartz. Sellers who hide behind "mystery stone," "energy crystal," or omit locality are harder to hold accountable.',
      comparison_table: [
        { signal: 'Stone name on listing', genuine: 'Proper mineral name (Natural Amethyst, SiO₂)', fake: 'Vague ("purple crystal," "energy stone") or industry code ("crystal quartz" = glass)' },
        { signal: 'Treatment disclosure', genuine: 'Disclosed (heat-treated citrine, lab-created)', fake: 'Hidden or denied' },
        { signal: 'Locality', genuine: 'Specific origin (Brazil, Uruguay, Zambia)', fake: 'Generic ("imported," none listed)' }
      ],
      how_to: [
        'Read the listing carefully — does it name the actual mineral species, or use vague marketing terms?',
        'Check for treatment disclosure: reputable sellers note heat treatment, irradiation, dyeing, or lab creation.',
        'Look for locality information — specific origins (Brazil for amethyst, Madagascar for labradorite) signal a seller who knows their stock.'
      ],
      limitations: 'A seller who names stones correctly can still sell glass; and a small honest seller may omit locality without ill intent. Naming transparency is a positive signal but not proof. Conversely, vague naming is a warning, not a verdict. Use it to decide which sellers warrant deeper trust, combined with the other tests.',
      best_for: 'All stones, especially when buying online sight-unseen. The single most useful pre-purchase signal.',
      source_citation: 'GIA / FTC guidelines on gemstone disclosure'
    }
  }
};
