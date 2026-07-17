# T17 v3 local frontend design QA

- Source visual truth: `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-4944ed22-bcf4-44da-a7d7-3653872c606c.png`
- Implementation screenshot: `visual-qa/mobile-single-variant-placeholder-390x844.png`
- Full comparison: `visual-qa/mobile-single-variant-comparison.png`
- Focused card comparison: `visual-qa/mobile-single-variant-card-focus.png`
- Mobile viewport: 390 x 844 CSS pixels.
- State: local mock/draft catalog, assembled 20-piece mixed-size design, Accessories tab showing a single-Variant card.

## Findings and fixes

1. P1: card media scaled from the top edge, so 6 mm previews sat too high and left an oversized gap above the name. Fix: every preview now scales around a fixed center inside a 48 px media slot. The visible diameter is compressed to a 34–44 px range so 6 mm remains legible and future 15 mm media cannot overflow.
2. P1: cards with one Variant showed misleading size decrement/increment controls. Fix: single-Variant cards render zero size buttons but retain a 22 px bottom slot, keeping their height and row alignment identical to multi-Variant cards.
3. P1: the assembled mixed-size strand used visually uneven equal-angle placement. Fix: assembled positions now allocate angular space from each item's occupied diameter, enforce collision-safe neighbor gaps, and apply a small radial correction to align the outer silhouette.
4. P1: directional accessories relied on a manual direction control that the product no longer uses. Fix: direction is automatic. Explicit catalog rules are honored; decor/non-round pieces use tangent alignment and charms use radial-out alignment by default.
5. P1: wrist circumference did not produce an actionable target quantity. Fix: server-side quote data now returns average occupied length, recommended piece count and piece delta. The UI displays actual/target pieces and a concise add/remove recommendation without mutating the user's mixed recipe.
6. P2: catalog help text always described size switching. Fix: the note switches between multi-Variant stepping guidance and single-Variant tap guidance.

## Verification evidence

- Mobile grid: two product cards per row; first three measured cards were approximately 123.4 x 116.6 px.
- Centered preview: media slot 48 px; measured 6 mm preview 34 px and 12 mm preview 44 px. Both states had `dx = 0`, `dy = 0` relative to the media center.
- 12 mm containment: preview stayed inside the card, with a 2 px image-to-name gap and no horizontal or vertical overflow.
- Single Variant: Accessories card retained the same 116.6 px card height and a 22 px placeholder row; button count was 0.
- Mixed assembled ring: 20 items rendered with zero overlaps and no horizontal page overflow. Center radii ranged 76.6–82.3 px because the layout aligns mixed outer edges rather than forcing unequal beads onto one centerline.
- Direction: one directional item in the fixture was automatically classified and oriented; no manual direction button is present.
- Wrist target: 16 cm produced `20 / 22`; changing the actual wrist dialog to 18 cm produced `20 / 24` plus `Add about 4 pieces for 18 cm`.
- Size step: Clear Quartz changed from 8 mm to 6 mm and its centered preview changed from 37 px to 34 px; changing to 12 mm produced the capped 44 px preview.
- JavaScript syntax: `node --check frontend/t17-builder-ui.js` passed.
- Frontend boundary: `frontend/validate-frontend-bundle.ps1` passed.
- Back-end material loop: `scripts/validate-backend-material-loop.ps1` passed.
- Directional contract: `scripts/validate-directional-decor.ps1 -FailOnMissing` passed with 13 checks and 0 missing.
- Data contract: `data/v3/validate-v3-data-contract.ps1` passed.
- Local preview: HTTP 200 from the localhost preview URL.
- Environment limit: PHP CLI is not installed, so `php -l` could not run. The edited PHP return fields were covered by the repository's static back-end validator, but this is not a substitute for a future PHP-runtime check.

## Required fidelity surfaces

- Typography, colors, borders and control tokens remain from the existing T17 v3 interface.
- Two mobile product columns are intentional: they preserve readable names and reliable Variant controls, while the reference's single-size behavior is matched through the reserved blank control row.
- Existing fixture images and transparent tray PNG assets are retained. No production material image or price has been invented.
- Copy now distinguishes single-Variant and multi-Variant cards, and the fit status explains the recommended adjustment.
- Desktop retains the established left/right editor and material-library structure; this pass did not change it to a stacked desktop layout.

## Comparison history

1. Before: the preview appeared anchored toward the upper border. After: 6 mm, 8 mm and 12 mm all share one media center.
2. Before: all cards displayed `− / +`. After: only products with multiple Variants display them; single-Variant cards reserve the row without controls.
3. Before: assembly used equal angular intervals and mixed sizes looked irregular. After: occupied-length spacing produces a collision-free ring and directional accessories orient automatically.
4. Before: wrist setting only affected fit status. After: quote output includes a target count and delta while preserving the actual recipe.

No actionable P0, P1 or P2 finding remains for this requested centered-card, single-Variant, wrist-count and assembled-ring pass. Production accessory anchor/orientation data remains a later catalog-data task, not a blocker for the local interaction contract.

final result: passed
