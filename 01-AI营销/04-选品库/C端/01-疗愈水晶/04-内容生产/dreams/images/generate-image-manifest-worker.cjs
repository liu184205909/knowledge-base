const fs = require("node:fs");
const path = require("node:path");

const imagesDir = __dirname;
const dreamsDir = path.resolve(imagesDir, "..");
const sharedDir = path.join(dreamsDir, "_shared");

const candidatesPath = path.join(sharedDir, "dreams-candidates.json");
const knowledgePath = path.join(sharedDir, "dreams-knowledge.json");

const outputStamp = "20260709-image-manifest-worker";
const manifestPath = path.join(imagesDir, `dream-image-manifest-enhanced-${outputStamp}.jsonl`);
const queuePath = path.join(imagesDir, `dream-image-generation-queue-${outputStamp}.jsonl`);
const promptsPath = path.join(imagesDir, `dream-image-prompts-${outputStamp}.jsonl`);
const rulesPath = path.join(imagesDir, `dream-image-prompt-rules-${outputStamp}.md`);
const summaryPath = path.join(imagesDir, `dream-image-manifest-summary-${outputStamp}.json`);

const BLOCKING_FLAGS = new Set([
  "unsafe_skip",
  "non_english",
  "brand_query",
  "cross_vertical",
  "typo",
  "duplicate_slug",
  "generic_navigation",
]);

const RELIGIOUS_LENSES = new Set(["islamic", "biblical", "christian", "spiritual", "prophetic"]);

const ABSTRACT_REPLACEMENTS = [
  ["sexual violence", "protective circle of light"],
  ["rape", "protective circle of light"],
  ["blood", "red mist and rose petals drifting"],
  ["shooting", "sudden flash of light"],
  ["gunshot", "sudden flash of light"],
  ["gun", "sudden flash of light"],
  ["death", "transformation doorway"],
  ["dying", "threshold scene filled with soft light"],
  ["dead body", "empty cloak of light"],
  ["corpse", "luminous figure dissolving into fireflies"],
  ["dead", "transformation threshold"],
  ["murder", "shadow guided toward light"],
  ["killing", "silhouette dissolving into mist"],
  ["teeth falling", "scattered pearls and loose white seeds"],
  ["intruder", "shadow at the threshold"],
  ["attacker", "presence at the edge of light"],
  ["chased", "corridor of light with a softened pursuing shadow"],
  ["chasing", "corridor of light with a softened pursuing shadow"],
  ["kidnapping", "closed gate opening into dawn"],
  ["abducted", "protective circle of light"],
  ["fire", "warm amber glow and candlelight"],
  ["burning", "golden transformation flame without injury"],
  ["suffocating", "mist clearing into open sky"],
  ["choking", "breath-like white ribbons"],
  ["car crash", "light trails crossing then dissolving"],
  ["accident", "scattered light fragments re-forming into a path"],
  ["monster", "large shadow shape softened by moonlight"],
  ["demon", "shadow archetype dissolving into protective light"],
  ["falling down stairs", "floating above a staircase of soft light"],
  ["falling", "figure suspended in mid-air with clouds below"],
  ["drowning", "luminous blue water with light above"],
  ["tsunami", "immense wave of starlight"],
  ["tornado", "spiral of wind and petals"],
  ["earthquake", "ground cracks with light emerging from fissures"],
  ["war", "distant lights across a horizon"],
  ["explosion", "blossoming flowers of light"],
  ["being pregnant", "seed of new beginnings in a glowing oval of moonlight"],
  ["pregnant", "seed of new beginnings in a glowing oval of moonlight"],
  ["pregnancy", "seed of new beginnings in a glowing oval of moonlight"],
  ["babies", "new-beginning symbols wrapped in soft moonlight"],
  ["baby", "new-beginning symbol wrapped in soft moonlight"],
  ["raw meat", "red velvet folds and rose petals"],
];

const BASE_NEGATIVE_PROMPT = [
  "text",
  "words",
  "letters",
  "logo",
  "watermark",
  "medical scene",
  "blood",
  "gore",
  "corpse",
  "dead body",
  "weapon",
  "gun",
  "knife",
  "injury",
  "graphic violence",
  "dark horror",
  "horror",
  "jump scare",
  "disturbing realism",
  "sexual content",
  "nudity",
  "pregnant body close-up",
  "religious scripture text",
  "religious ruling claim",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function prioritySortKey(priority) {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[priority] ?? 99;
}

function detectLens(row, knowledge) {
  const raw = `${row.keyword || ""} ${row.slug || ""} ${knowledge?.dream_symbol?.lens || ""}`.toLowerCase();
  if (raw.includes("islam")) return "islamic";
  if (raw.includes("christian")) return "christian";
  if (raw.includes("biblical") || raw.includes("bible")) return "biblical";
  if (raw.includes("prophetic")) return "prophetic";
  if (raw.includes("spiritual")) return "spiritual";
  return knowledge?.dream_symbol?.lens || "general";
}

function routeFor(row) {
  const flags = new Set(row.noise_flag || []);
  if (row.priority === "Parked" || [...flags].some((flag) => BLOCKING_FLAGS.has(flag))) return "blocked";
  if (flags.has("low_confidence") || row.production_ready !== true) return "needs_revision";
  return "draftable";
}

function routeReason(row) {
  const flags = row.noise_flag || [];
  const blocking = flags.filter((flag) => BLOCKING_FLAGS.has(flag));
  if (blocking.length) return blocking;
  if (flags.includes("low_confidence")) return ["low_confidence"];
  if (row.production_ready !== true) return ["production_ready_false"];
  return [];
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function safeSymbol(row, knowledge) {
  let symbol = knowledge?.dream_symbol?.primary_symbol || row.keyword || row.slug || "dream symbol";
  symbol = String(symbol).toLowerCase();
  const removable = [
    "what is the spiritual meaning of",
    "spiritual meaning of dreams about",
    "spiritual meaning of dreaming of",
    "spiritual meaning of",
    "biblical meaning of dreams about",
    "biblical meaning of",
    "christian meaning of",
    "dream interpretation",
    "dream dictionary",
    "dreamed about",
    "dreamed of",
    "dreaming of",
    "dream about",
    "dream of",
    "dreams about",
    "dream meaning",
    "meaning of",
    "what does it mean when you",
    "what does a",
    "what does",
    "in a dream",
    "in dreams",
  ];
  for (const token of removable) {
    symbol = symbol.replaceAll(token, " ");
  }
  return symbol.replace(/\s+/g, " ").trim() || row.keyword || row.slug;
}

function abstractText(text) {
  let output = String(text || "");
  const matched = [];
  const replacements = {};
  for (const [needle, replacement] of ABSTRACT_REPLACEMENTS) {
    const re = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    if (re.test(output)) {
      matched.push(needle);
      replacements[needle] = replacement;
      output = output.replace(re, replacement);
    }
  }
  output = output.replace(/\s+/g, " ").trim();
  return { text: output, matched: uniq(matched), replacements };
}

function crystalFromString(value) {
  const text = String(value || "");
  const name = /name=([^;]+)/.exec(text)?.[1]?.trim();
  const profileSlug = /profile_slug=([^;]+)/.exec(text)?.[1]?.trim();
  const shopUrl = /shop_url=([^;]+)/.exec(text)?.[1]?.trim();
  const useCase = /use_case=([^;]+)/.exec(text)?.[1]?.trim();
  if (!name && !profileSlug) return null;
  return {
    slug: profileSlug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-meaning`,
    name: titleCase(name || profileSlug.replace(/-meaning$/, "")),
    reuse_source: "dreams-knowledge candidate_pairing",
    profile_path: profileSlug ? `/${profileSlug}/` : null,
    shop_url: shopUrl || null,
    use_case: useCase || null,
    image_request: "reuse_existing_390_library",
  };
}

function normalizeCrystalItem(item) {
  if (!item) return null;
  if (typeof item === "string") return crystalFromString(item);
  const slug = item.slug || item.profile_slug || (item.name ? `${String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-meaning` : null);
  if (!slug && !item.name) return null;
  return {
    slug,
    name: item.name || titleCase(String(slug).replace(/-meaning$/, "")),
    reuse_source: "dreams-knowledge candidate_pairing",
    profile_path: item.profile_path || (slug ? `/${slug}/` : null),
    shop_url: item.shop_url || null,
    use_case: item.use_case || item.reason || null,
    image_request: "reuse_existing_390_library",
  };
}

function defaultCrystals(lens, riskTerms) {
  if (lens === "islamic") {
    return [
      ["moonstone-meaning", "Moonstone", "reflection after Islamic-lens dream themes"],
      ["agate-meaning", "Agate", "grounded reflection, not a religious prescription"],
      ["chalcedony-meaning", "Chalcedony", "calm journaling and gentle symbolism"],
    ];
  }
  if (lens === "biblical" || lens === "christian") {
    return [
      ["amethyst-meaning", "Amethyst", "reflective spiritual symbolism"],
      ["sapphire-meaning", "Sapphire", "contemplative light and wisdom symbolism"],
      ["quartz-meaning", "Quartz", "clarity-focused intention setting"],
    ];
  }
  if (lens === "prophetic") {
    return [
      ["amethyst-meaning", "Amethyst", "calm reflection and sleep-journal ritual"],
      ["celestite-meaning", "Celestite", "soft dream recall symbolism"],
      ["quartz-meaning", "Quartz", "clarity-focused intention setting"],
    ];
  }
  if (riskTerms.some((term) => ["death", "dying", "dead", "dead body", "corpse", "monster", "demon", "chased", "chasing", "intruder"].includes(term))) {
    return [
      ["black-tourmaline-meaning", "Black Tourmaline", "grounding after intense dream themes"],
      ["smoky-quartz-meaning", "Smoky Quartz", "soft fear-to-grounding symbolism"],
      ["amethyst-meaning", "Amethyst", "calm sleep-journal ritual"],
    ];
  }
  return [
    ["amethyst-meaning", "Amethyst", "calm reflection and sleep-journal ritual"],
    ["quartz-meaning", "Quartz", "clarity-focused intention setting"],
    ["labradorite-meaning", "Labradorite", "symbolic intuition and transition journaling"],
  ];
}

function crystalSlots(row, knowledge, lens, riskTerms) {
  const items = knowledge?.crystal_recommendations?.items || [];
  const fromKnowledge = items.map(normalizeCrystalItem).filter(Boolean);
  const fallback = defaultCrystals(lens, riskTerms).map(([slug, name, useCase]) => ({
    slug,
    name,
    reuse_source: "default dream image strategy mapping",
    profile_path: `/${slug}/`,
    shop_url: `/product-category/${slug.replace(/-meaning$/, "").replaceAll("-", "-")}-crystals/`,
    use_case: useCase,
    image_request: "reuse_existing_390_library",
  }));
  const merged = [...fromKnowledge, ...fallback];
  const seen = new Set();
  return merged.filter((item) => {
    const key = item.slug || item.name;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

function religiousConstraints(lens) {
  if (lens === "islamic") {
    return [
      "non-figurative composition only",
      "no human figures",
      "no faces",
      "no prophets or holy figures",
      "no sacred text",
      "no Quranic text",
      "no calligraphy",
      "no religious ruling claim",
    ];
  }
  if (lens === "biblical" || lens === "christian") {
    return [
      "no scripture text",
      "no deity depiction",
      "no prophets or holy figures",
      "no religious ruling claim",
    ];
  }
  if (lens === "spiritual" || lens === "prophetic") {
    return [
      "no prophecy claim",
      "no religious ruling claim",
      "no sacred text",
    ];
  }
  return [];
}

function styleFamily(lens, pageType) {
  if (lens === "islamic") return "non_figurative_islamic_geometric_dream_crystal";
  if (lens === "biblical" || lens === "christian") return "stained_glass_inspired_dream_crystal";
  if (pageType === "Emotion") return "soft_editorial_emotion_dream_crystal";
  if (pageType === "Subject") return "surreal_symbol_dream_crystal";
  return "soft_editorial_dream_crystal";
}

function buildPrompt(row, knowledge, symbol, symbolAbstract, lens, crystals) {
  const crystalName = crystals[0]?.name || "Amethyst";
  const lowerPrompt = `${row.keyword || ""} ${row.slug || ""}`.toLowerCase();
  if (lens === "islamic") {
    return `Surreal non-figurative hero illustration: ${symbolAbstract} with ${crystalName} crystal, Islamic geometric and arabesque-inspired patterns, deep emerald and gold palette, soft dreamlike atmosphere, no calligraphy, no sacred text, no human figures, no faces, no text, 1536x864`;
  }
  if (lens === "biblical" || lens === "christian") {
    return `Surreal hero illustration inspired by stained glass light and illuminated manuscript textures: ${symbolAbstract} with ${crystalName} crystal, gold leaf glow, purple and blue palette, ethereal light, no scripture text, no holy figures, no text, 1536x864`;
  }
  if (lowerPrompt.includes("crystals-for-dream") || row.page_type === "Hub") {
    const names = crystals.map((c) => c.name).join(", ");
    return `Surreal hero illustration: a dream bedroom altar with ${names} arranged on silk cloth under a crescent moon, soft candlelight, restful reflective atmosphere, no text, 1536x864`;
  }
  return `Dreamy surreal hero illustration: ${symbolAbstract} emerging from a misty dreamscape with a glowing ${crystalName} crystal cluster, soft moonlit background, ethereal mist, transformation and reflection symbolism, atmospheric depth, calm not frightening, no text, no words, 1536x864`;
}

function safetyFlags(lens, abstraction, route) {
  const flags = ["no_real_image_generated", "no_text", "no_logo", "no_gore", "no_dark_horror", "no_medical_claims"];
  if (route === "draftable") flags.push("image_request_ready");
  if (abstraction.matched.length) flags.push("abstract_sensitive_theme");
  if (abstraction.matched.some((term) => ["pregnant", "pregnancy", "baby"].includes(term))) flags.push("pregnancy_abstracted");
  if (RELIGIOUS_LENSES.has(lens)) flags.push("religious_sensitivity", "not_a_religious_ruling");
  if (lens === "islamic") flags.push("islamic_non_figurative");
  return flags;
}

function buildManifestRow(row, knowledge) {
  const route = routeFor(row);
  const lens = detectLens(row, knowledge);
  const symbol = safeSymbol(row, knowledge);
  const symbolAbstraction = abstractText(symbol);
  const keywordAbstraction = abstractText(row.keyword || "");
  const matchedTerms = uniq([...symbolAbstraction.matched, ...keywordAbstraction.matched]);
  const replacements = { ...keywordAbstraction.replacements, ...symbolAbstraction.replacements };
  const crystals = crystalSlots(row, knowledge, lens, matchedTerms);
  const constraints = religiousConstraints(lens);
  const negative = uniq([...BASE_NEGATIVE_PROMPT, ...constraints]);

  const base = {
    source_row: row.source_row,
    keyword: row.keyword,
    slug: row.slug,
    canonical_slug: row.canonical_slug || row.slug,
    priority: row.priority,
    page_type: row.page_type,
    production_ready: row.production_ready === true,
    route,
    route_reason: routeReason(row),
    actual_image_generated: false,
    actual_image_request: route === "draftable",
  };

  if (route !== "draftable") {
    return {
      ...base,
      hero_prompt: null,
      negative_prompt: [],
      alt_text: null,
      filename: null,
      style_family: null,
      safety_flags: safetyFlags(lens, { matched: matchedTerms }, route),
      religious_constraints: constraints,
      violence_abstraction: {
        required: matchedTerms.length > 0,
        matched_terms: matchedTerms,
        replacements,
      },
      crystal_reuse_slots: [],
    };
  }

  const prompt = buildPrompt(row, knowledge, symbol, symbolAbstraction.text, lens, crystals);
  const promptAbstraction = abstractText(prompt);
  const finalMatched = uniq([...matchedTerms, ...promptAbstraction.matched]);
  const finalReplacements = { ...replacements, ...promptAbstraction.replacements };

  return {
    ...base,
    filename: `${row.slug}-hero.webp`,
    hero_prompt: promptAbstraction.text,
    negative_prompt: negative,
    alt_text: `Abstract dream-symbol hero image for ${row.keyword}, paired with calming crystals`,
    style_family: styleFamily(lens, row.page_type),
    safety_flags: safetyFlags(lens, { matched: finalMatched }, route),
    religious_constraints: constraints,
    violence_abstraction: {
      required: finalMatched.length > 0,
      matched_terms: finalMatched,
      replacements: finalReplacements,
      instruction: "Use symbolic replacements only; do not depict graphic violence, death, injury, pursuit threats, pregnancy bodies, or horror scenes.",
    },
    crystal_reuse_slots: crystals,
    image_request: {
      type: "hero",
      size: "1536x864",
      format: "webp",
      model_hint: "moleapi gpt-image-2",
      fallback_model_hint: "agnes-image-2.1-flash",
    },
    knowledge_enriched: Boolean(knowledge),
  };
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] ?? "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function countFlags(rows, key) {
  return rows.reduce((acc, row) => {
    for (const flag of row[key] || []) acc[flag] = (acc[flag] || 0) + 1;
    return acc;
  }, {});
}

const candidates = readJson(candidatesPath);
const knowledge = readJson(knowledgePath);
const knowledgeBySlug = new Map(knowledge.map((item) => [item.slug, item]));

const scopedCandidates = candidates
  .filter((row) => ["P0", "P1", "P2", "P3"].includes(row.priority))
  .sort((a, b) => prioritySortKey(a.priority) - prioritySortKey(b.priority) || (a.source_row || 0) - (b.source_row || 0));

const manifestRows = scopedCandidates.map((row) => buildManifestRow(row, knowledgeBySlug.get(row.slug)));
const queueRows = manifestRows.filter((row) => row.actual_image_request === true);
const promptRows = queueRows.map((row) => ({
  slug: row.slug,
  priority: row.priority,
  filename: row.filename,
  prompt: row.hero_prompt,
  negative_prompt: row.negative_prompt,
  alt_text: row.alt_text,
  style_family: row.style_family,
  safety_flags: row.safety_flags,
  religious_constraints: row.religious_constraints,
  violence_abstraction: row.violence_abstraction,
  crystal_reuse_slots: row.crystal_reuse_slots,
}));

writeJsonl(manifestPath, manifestRows);
writeJsonl(queuePath, queueRows);
writeJsonl(promptsPath, promptRows);

const summary = {
  scope: "all P0/P1/P2/P3 candidates, no P phasing",
  generated_at_local: "2026-07-09",
  input_candidates: candidates.length,
  included_candidates: scopedCandidates.length,
  excluded_parked: candidates.length - scopedCandidates.length,
  knowledge_records: knowledge.length,
  knowledge_enriched_rows: manifestRows.filter((row) => row.knowledge_enriched).length,
  route_counts: countBy(manifestRows, "route"),
  priority_counts: countBy(manifestRows, "priority"),
  queued_for_image_generation: queueRows.length,
  prompt_rows: promptRows.length,
  actual_images_generated: false,
  actual_image_files_claimed: false,
  safety_counts: countFlags(manifestRows, "safety_flags"),
  religious_constraint_rows: manifestRows.filter((row) => row.religious_constraints.length > 0).length,
  abstracted_rows: manifestRows.filter((row) => row.violence_abstraction.required).length,
  high_level_risks: [
    "Islamic prompts are non-figurative and exclude humans, faces, sacred text, and calligraphy.",
    "Violence, death, chase, drowning, disaster, pregnancy, and similar sensitive themes are converted to symbolic visual language.",
    "Blocked and needs_revision rows have no actual image request and no hero prompt.",
    "Crystal imagery is marked for reuse from the existing 390 crystal library instead of new crystal-only generation.",
  ],
  outputs: {
    manifest: manifestPath,
    generation_queue: queuePath,
    prompts: promptsPath,
    prompt_rules: rulesPath,
    summary: summaryPath,
  },
};

const rules = `# Dream Image Prompt Rules (${outputStamp})

Scope: all P0/P1/P2/P3 candidates from dreams-candidates.json. Parked candidates are excluded.

No real images were generated in this pass. Files are manifest and prompt queues only.

## Queue Rule

- route=draftable: has an image request and can be sent to image generation.
- route=blocked / route=needs_revision: route only; no actual image request, no hero prompt.

## Safety Rule

- No dark horror, gore, corpses, injury, weapons, medical scenes, sexual content, or realistic distress.
- Violence, death, chase, drowning, disaster, pregnancy, and similar themes must stay symbolic and abstract.
- Islamic prompts must be non-figurative: no people, no faces, no sacred text, no Quranic text, no calligraphy.
- Religious prompts are reflective visuals only, not doctrine and not religious rulings.
- Crystal slots reuse the existing 390 crystal library images; they are not new crystal-only image requests.

## Generation Defaults

- size: 1536x864
- format: webp
- primary model hint: moleapi gpt-image-2
- fallback model hint: agnes-image-2.1-flash
`;

fs.writeFileSync(rulesPath, rules, "utf8");
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n", "utf8");

console.log(JSON.stringify(summary, null, 2));
