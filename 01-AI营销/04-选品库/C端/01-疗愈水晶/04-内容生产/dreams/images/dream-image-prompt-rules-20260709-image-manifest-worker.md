# Dream Image Prompt Rules (20260709-image-manifest-worker)

Scope: all P0/P1/P2/P3 candidates from dreams-candidates.json. Parked candidates are excluded.

No real images were generated in this pass. Files are manifest and prompt queues only.

## Queue Rule

- route=draftable: has an image request and can be sent to image generation.
- route=blocked / route=needs_revision: route only; no actual image request, no hero prompt.

## Safety Rule

- No dark horror, gore, corpses, injury, weapons, medical scenes, sexual content, or realistic distress.
- Violence, death, chase, drowning, disaster, pregnancy, and similar themes must stay symbolic and abstract.
- Islamic prompts must be non-figurative: no people, no faces, no sacred text, no Quranic text, no calligraphy.
- Religious prompts are reflective visuals only, not doctrine and not binding faith rulings.
- Crystal slots reuse the existing 390 crystal library images; they are not new crystal-only image requests.

## Generation Defaults

- size: 1536x864
- format: webp
- primary model hint: moleapi gpt-image-2
- fallback model hint: agnes-image-2.1-flash
