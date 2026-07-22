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
- Desktop density regression (1440 x 900): stage/catalog measured 54.9% / 44.9% including their shared border, matching the requested 55:45 split; the tray measured 360 x 360 px inside a 376 px canvas.
- Desktop hierarchy: Length / Weight / Pieces rendered in the top 3-column strip; `YOUR DESIGN`, fit copy, `MATERIAL LIBRARY` and `Choose a Variant` all had `display: none`.
- Desktop controls and cards: canvas-to-action gap measured -2 px (a deliberate 2 px visual tuck); the three-card grid used 6 px gaps; cards measured approximately 146.1 x 109.6 px with a 5 px image-to-name gap.
- Mobile regression after the desktop-only change: two 123.4 px columns, 116.6 px card height, 27 px top metrics strip, -5 px canvas-to-action tuck and no horizontal overflow.
- Environment limit: PHP CLI is not installed, so `php -l` could not run. The edited PHP return fields were covered by the repository's static back-end validator, but this is not a substitute for a future PHP-runtime check.

## Required fidelity surfaces

- Typography, colors, borders and control tokens remain from the existing T17 v3 interface.
- Two mobile product columns are intentional: they preserve readable names and reliable Variant controls, while the reference's single-size behavior is matched through the reserved blank control row.
- Existing fixture images and transparent tray PNG assets are retained. No production material image or price has been invented.
- Copy now distinguishes single-Variant and multi-Variant cards, and the fit status explains the recommended adjustment.
- Desktop retains the established left/right editor and material-library structure at a strict 55:45 split. Redundant section titles are removed and the same top measurement hierarchy used on mobile is now shared by desktop.

## Comparison history

1. Before: the preview appeared anchored toward the upper border. After: 6 mm, 8 mm and 12 mm all share one media center.
2. Before: all cards displayed `− / +`. After: only products with multiple Variants display them; single-Variant cards reserve the row without controls.
3. Before: assembly used equal angular intervals and mixed sizes looked irregular. After: occupied-length spacing produces a collision-free ring and directional accessories orient automatically.
4. Before: wrist setting only affected fit status. After: quote output includes a target count and delta while preserving the actual recipe.

## Latest desktop and assembled-state pass

- Source references: `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-5c63a2a9-32fe-4b6e-bbb1-a7b403af6ebd.png` and `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-e5ccf90e-e0a3-4269-82dc-9722c22c970a.png`.
- Desktop implementation: `visual-qa/desktop-55-45-assembled-1440x900.png`.
- Mobile implementation: `visual-qa/mobile-floating-checkout-assembled-390x844.png`.
- Mobile reference comparison: `visual-qa/mobile-assembled-reference-comparison.png`.
- P1 Dzi card media: the fixture is a rectangular article hero image, so `contain` produced a compressed horizontal strip. Bead previews now use a circular `cover` crop while non-bead accessories retain `contain`.
- P1 desktop footer position: `align-content: start` removes the unused grid stretch. Order & details remains below the left design area, and the total / Finish row follows it with a measured 4 px gap.
- P1 one-way assembly: the control is now a reversible `Assemble` / `Release` toggle on both desktop and mobile. Adding a material while assembled preserves the assembled state.
- P1 crowded assembly: the ring now derives angular footprint from each item's occupied length, applies direction-aware footprint caps, and binary-searches one uniform scale before distributing spare arc. A 29-piece 390 x 844 stress state used scale 0.887 and produced zero circular-bound overlaps.
- P1 desktop parity: the assembly control includes text on desktop; Length / Weight / Pieces / Suggested wrist share the same top hierarchy as mobile.
- P1 mobile checkout: Order & details, total and Finish are fixed to the viewport bottom. The measured checkout height was approximately 85.8 px, its bottom edge matched the viewport, and catalog bottom padding keeps product cards reachable.
- P2 wrist guidance: the initial 158 mm mock design displays a derived suggested wrist range of 14.2-14.8 cm.
- Desktop geometry: design/catalog remains 55:45; the enlarged desktop tray is 390 x 390 px inside a 400 px canvas.
- Interaction verification gap: pointer-drag reorder and drag-outside-to-delete are implemented in the event path, but the available in-app Browser API cannot synthesize a low-level pointer drag. This gesture still needs one manual local check; it is not claimed as browser-automated evidence.
- Data fidelity: the reference uses production-looking mixed accessories; this local build intentionally keeps approved mock/draft assets and does not invent production prices, images or orientation anchors.

## Mobile crystal-add sound research

- First-party competitor sources reviewed: `https://v.douyin.com/mn92kyYVc64/`, `https://v.douyin.com/3SyhekUkNqI/`, and the creator profile at `https://v.douyin.com/Y_1njxYDsMg/`.
- Video evidence: Vol.001, Vol.002 and Vol.003 all show the same interaction rhythm: repeated material-card selection places pieces onto the tray, followed by a distinct Assemble action. Contact sheets are stored as `visual-qa/douyin-stonelab-001-contact.png`, `visual-qa/douyin-stonelab-002-contact.png` and `visual-qa/douyin-stonelab-003-contact.png`.
- Audio limitation: the published videos mix interface capture with music, so their audio is research evidence rather than a reusable sound asset. No competitor audio was copied into the product.
- Creator inventory: the profile was scrolled to `暂时没有更多了`; 20 linked short videos, the supplied long desktop video and one non-video note were inventoried. Nineteen short videos were reviewed from downloaded playback media, and the MSE-only short video was reviewed from five browser-rendered timestamps.
- Original implementation: a successful mobile crystal-card add creates a 105 ms two-part glass/marble cue through the Web Audio API. The fundamental ranges from about 690 Hz at 6 mm to 456 Hz at 15 mm, so larger beads sound slightly lower without changing price or catalog data.
- Trigger boundary: the cue runs on both mobile and desktop, but only for bead materials. Size decrement/increment, filters and non-bead materials do not trigger it.
- Runtime routing test: a size-step click emitted 0 events; a desktop whole-card click emitted one material-flight event and one sound event for `fixture-clear-10`. A decor-card click emitted a `tangent` material-flight event and no sound event.

## Card-to-tray motion and direction pass

- The selected card image is cloned as the moving token; no new or approximate visual asset is generated.
- Desktop geometry test: the flight started at `(988, 313)` in the right catalog and ended at `(415, 352)` in the left design area.
- Mobile-layout geometry test: the flight started below the tray at Y `1006` and ended inside it at Y `484`.
- Standard motion is a 420 ms mobile / 460 ms desktop arc. The active browser reported reduced-motion preference, so its verified runtime used a 160 ms direct settle without overshoot.
- Direction routing: regular beads reported `fixed`; the fixture spacer reported `tangent`. Charm/pendant/tassel/dangle/drop/hanging categories route to `radial_out`; explicit `radial_in` remains data-controlled.
- Durable research record: `data/v3/research/stonelab-interaction-direction-audit-20260717.md`.

## Scatter physics correction

- Direct competitor check: the open `灵感石验室StoneLAB` mini-program was operated at 503 x 944. Consecutive card additions changed the piece count from 18 to 22. Existing tray items visibly moved after each addition, confirming that the reference uses shared motion/collision rather than a fixed circular offset.
- Previous local defect: free-placement coordinates were a circle index plus a small sine offset. This produced the visible overlaps in `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-3a275929-fd62-4d6e-97f4-254c9abf69f0.png`; it was not a physical scatter state.
- Replacement: free placement now owns deterministic per-item positions, velocity, spin and a collision footprint. The solver applies circular tray-boundary reflection, mass-weighted pair separation, elastic collision impulses, damping and a final overlap-relaxation pass. It does not call `Math.random` and does not change the recipe order, Variant, price or quote payload.
- Launch direction: mobile enters from the bottom and travels upward into the opposite rim; desktop enters from the right catalog and travels across the tray toward the left rim. Seeded spread prevents every item from sharing one impact point.
- Drag behavior: assembled drag still reorders the strand; released drag now moves an item to a free tray position and resolves neighboring overlaps. Dragging outside the tray still deletes the item and remains undoable.
- Reduced motion: the dynamic flight is skipped and the same collision-free final placement is applied immediately.
- Runtime desktop stress check: 12 consecutive material additions produced 1-5 tray-wall bounces per addition after the first and 2-12 bead collision resolutions. Every settled event reported `max_overlap_px = 0`, `overlap_pairs = 0`, and `outside_count = 0`.
- Accepted desktop screenshot: `visual-qa/scatter-physics-desktop-12.png`.
- Current verification gap: the same solver's mobile launch branch is implemented, but the local mobile viewport lost its browser-control connection before a same-state screenshot could be captured. The user can verify this branch from the reconnected local URL; it is not reported as visually accepted yet.

Production accessory anchor/orientation data remains a later catalog-data task. The pointer-drag gesture and the final mobile bounce timing remain explicit manual verification items.

## 2026-07-18 continuous collision and safe-boundary acceptance

The previous final-position evidence was not sufficient to prove a physical rebound. It is superseded by the continuous event traces and frame captures below.

- **Source visuals:** `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-0c7fe9d0-c887-40fb-a7dd-e1f6581e763f.png`, `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-08e65193-cb20-446b-957d-ea234b64df0c.png`, and the mobile reference `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-17e858a3-1e71-47f7-80a5-d238f3e47ca2.png`.
- **Implementation frames:** `visual-qa/desktop-physics-entry-20260718.png`, `visual-qa/desktop-physics-impact-1-20260718.png`, `visual-qa/desktop-physics-rebound-1-20260718.png`, and `visual-qa/desktop-physics-impact-2-20260718.png`.
- **Desktop empty-tray trace:** right-side launch `(288.91, 220.54)` reached the left inner rim at `(80.49, 198.04)`. The measured velocity changed from `(-1.913, -0.207)` to `(1.504, -0.526)`. A second contact at the upper-right inner rim `(278.36, 128.89)` changed velocity from `(0.909, -0.318)` to `(-0.515, 0.613)`. Result: `first_impact=rim`, two launched-item rim bounces, `outside_count=0`, `overlap_pairs=0`.
- **Collision-normal rule:** the rebound is computed from the actual contact normal with `v' = v - (1 + e)(v dot n)n`. There is no fixed rebound direction and no fixed 75 px rebound distance; therefore different impact positions produce different rebound vectors.
- **Existing-material precedence:** a controlled third-bead run placed an existing bead in the launch path. The incoming item recorded `first_impact=material` at 659 ms, then one rim collision and a second material collision. It did not pass through the blocker and settled with `outside_count=0`, `overlap_pairs=0`.
- **Mobile empty-tray trace:** bottom-side launch `(154.68, 200.75)` recorded three rim contacts at `(139.31, 59.31)`, `(92.68, 194.42)`, and `(199.93, 102.88)` before settling at `(156.15, 105.77)`. Result: `first_impact=rim`, three bounces, `outside_count=0`, `overlap_pairs=0`.
- **Safe geometry:** released placement, dragging, and wall reflection share a 33% circular boundary. The assembled centerline is 28% of the interactive ring width. With 21 mixed items, mobile retained a 48.01 px occupied inset and desktop retained 68.03 px; both reported zero horizontal overflow.
- **Desktop density:** the 1440 x 900 design/library split remains 55:45. The status-to-canvas gap is 5.35 px, the tray is approximately 418 px, the action strip remains directly below it, and `Order & details` stays permanently open.
- **Wrist dialog:** the V2 hierarchy is preserved in a simplified local modal: height, weight, and Common sizes are removed; circumference, fit preference, and a 6/8/10/12 mm development comparison are retained. The 720 x 601 px desktop dialog has no internal horizontal or vertical overflow.

## Current local acceptance ledger

| Area | Contract | Status |
| --- | --- | --- |
| Server material/quote contract | Variant price, status, compatibility and design snapshot remain server-authoritative. | Existing static validators passed; runtime WP check remains separate. |
| Card behavior | Whole card adds the selected Variant; `- / +` selects only size; single-Variant cards reserve a blank control row. | Local implementation and prior visual checks complete. |
| Responsive structure | Mobile two-card grid and stacked editor; desktop 55:45 design/library split; matching functional controls. | Local implementation complete; continue visual regression after physics correction. |
| Tray visuals | PNG tray backgrounds and center mark remain 2D assets. | Local only; production asset approval pending. |
| Scatter and assemble | Viewport-aware physical entrance, collision-normal rebound, item collision precedence, inset release and assembled boundaries. | Desktop and mobile continuous traces passed; 21-item assembled boundary measurements passed. |
| Zuma-like emitter | No literal dragon/cannon. A neutral material-inlet experiment is deferred until scatter acceptance. | Deliberately not implemented. |
| Publish/integration | No page creation, plugin upload, ZIP generation or production material import. | Not performed. |

## 2026-07-19 tray brand, tutorial and compact-status pass

- Source references: `C:\Users\Dylan\AppData\Local\Temp\codex-clipboard-6fe96c21-7055-46ed-a7b2-ff67e36a4f8a.png`, `codex-clipboard-ebe8cea5-ed7e-438a-8806-19111a02ad97.png`, `codex-clipboard-6c0377cd-d795-4992-b1fb-a115d44d03fc.png`, `codex-clipboard-fcaf5804-b8fb-4f30-a5c6-0d06e8c05c2f.png`, and `codex-clipboard-a06bcbb4-7ed4-4be3-9834-9b601d577bb6.png`.
- Mobile implementation screenshots: `visual-qa/mobile-tutorial-layout-390x844-20260719.png`, `visual-qa/mobile-tutorial-dialog-390x844-20260719.png`, and `visual-qa/mobile-details-open-390x844-20260719.png`.
- Desktop implementation screenshot: `visual-qa/desktop-logo-fit-details-1440x900-20260719.png`.
- P1 duplicate center mark: removed the independent EW medallion. With an empty logo setting the center renders one `Earthward` text fallback; when configured it renders one transparent image only.
- P1 vertical density: Suggested wrist moved from the fourth status cell to a tray-side chip. Both viewports now expose exactly three top status cells: Length, Weight and Pieces / target.
- P1 mobile checkout density: Details is closed by default and occupies a 68 px control column in the fixed bottom row. The tested disclosure expands upward to an 81 px sequence strip without permanently pushing the product cards.
- P1 tutorial completeness: all four pages load local Development screenshots, Previous/Next changes the active slide, Start designing closes the modal, and the progress indicator reports four steps.
- Back-end presentation configuration: the existing T17 settings form now persists Media Library logo ID, optional external URL and a clamped 24-160 px width. No new WordPress page or material-product record is created.
- Browser evidence at 390 x 844: the tutorial trigger computed as visible, Details was initially closed, top status count was 3, Suggested wrist read `14.2-14.8 cm`, and checkout position was fixed.
- Browser evidence at 1440 x 900: tutorial trigger computed as hidden, Order & details was open, top status count was 3, workspace columns measured 758.4 / 620.5 px (approximately 55:45), and the tray mark DOM contained only `<b>Earthward</b>`.
- Console: no browser error entries during the desktop acceptance run.
- Automated checks: JavaScript syntax, frontend bundle, backend material loop, directional decor (13/13), and v3 data contract all passed. PHP CLI is unavailable in this workstation, so PHP runtime lint remains an environment limitation rather than a claimed check.
- Production boundary: the approved transparent logo and final tutorial artwork are not available. The local text fallback and Development tutorial screenshots are intentionally non-production.

## 2026-07-19 current-browser left-rim correction

- User evidence: `C:\Users\Dylan\.codex\attachments\43fa8963-e87f-4b59-949b-dca6d84cf592\image-1.png` showed two materials stopped at the desktop tray's right side, contradicting the claimed left-rim entrance.
- Root cause reproduced in the same browser: `prefers-reduced-motion=true` activated a static early return. Before the fix, the trace contained only `launch-right (288.91, 220.54)`, then reported `phase=settled`, `firstImpact=pending`, and `bounce=0`.
- Corrected current-browser trace: first bead contacted the left safe inner rim at `(80.48, 198.00)` after 2367 ms. Its X velocity changed from `-1.416` to `+1.113`, proving a visible rightward rebound. It then contacted the opposite upper-right rim before settling.
- Non-fixed rebound check: a second empty-tray Variant contacted at a different height `(80.07, 191.25)` and produced a different post-impact vector `(1.165, -0.029)`.
- Safety check: both empty-tray runs ended with `outside_count=0` and `overlap_pairs=0`.
- Mobile regression: with the same reduced-motion setting, the first bead launched from the bottom, contacted the upper inner rim at `(139.32, 59.32)`, reversed Y velocity from `-1.357` to `+1.068`, bounced twice and settled with zero overflow or overlaps.

## 2026-07-19 real Tabbit window acceptance correction

- The prior acceptance was invalid because it used a separate Codex in-app-browser tab while the user-visible Tabbit window remained on `qa=20260718h`. The local HTTP listener on port 8765 was also not running when the discrepancy was rechecked.
- The local server was restarted from the `01-疗愈水晶` directory and the actual Tabbit window was navigated to `qa=20260719f`.
- Visual root cause: the free-placement solver used `0.33 * tray width` as its virtual rim, so beads reversed well before reaching the visible tray edge even though internal collision counters passed. Free-placement scatter now uses `0.44 * tray width`; assembled strand layout remains intentionally separate and inset at `0.28 * tray width`.
- Same-window sampled frames: the first Clear Quartz bead entered from the right, visibly contacted the left inner rim at about 3000 ms, and had moved right again by 4000 ms. A second Amethyst bead contacted the left inner rim at about 2900 ms and moved right again by 4000 ms. The two visible beads remained separate and inside the tray.
- Acceptance rule: a physics finding cannot be closed from `data-scatter-trace` alone. The same browser window and cache-busted script version must show at least one pre-impact frame, one visible rim-contact frame, one post-impact rebound frame, and a final non-overlap/non-overflow frame.
- Visual evidence: `visual-qa/desktop-first-bead-left-impact-1440x900-20260719.png` and `visual-qa/desktop-first-bead-rebound-1440x900-20260719.png`.
- Regression guard: `frontend/validate-frontend-bundle.ps1` now rejects a direct `if(reduceMotion)` physics bypass and requires the essential-motion policy.

final result: passed

## 2026-07-19 responsive entrance and timing re-acceptance

The earlier `qa=20260719f` motion conclusion is superseded by a controlled 60 fps StoneLAB empty-tray recording. Four consecutive additions were captured instead of inferring the rule from one crowded-tray frame.

- **Reference mobile source direction:** the material rises from the library below the tray, reaches the upper inner rim, and rebounds according to the actual collision normal. The second and later pieces can collide with and move existing pieces before reaching the rim.
- **Local desktop mapping:** because the desktop library is to the right of the tray, the equivalent entrance is right-to-left. The first empty-tray contact occurred at 716 ms; later blockers produced material-first contacts at 71 ms, 514 ms and 6 ms.
- **Local mobile mapping:** bottom-to-top launch produced first empty-tray contact at 631 ms. With existing pieces, first contacts were material at 89 ms and 306 ms, then rim-first at 641 ms for the fourth addition.
- **Safety:** every desktop and mobile run settled with zero items outside the shared inset boundary and zero overlap pairs.
- **Template state:** mock official design 9001 imported as an assembled three-piece strand. Adding a fourth Variant preserved the assembled state and did not start scatter physics, matching the reference template behavior.
- **Evidence:** `.fable/competitor-stonelab-empty-1-4-live.mp4`, the four `competitor-stonelab-empty-*-detail.png` frame strips, `.fable/competitor-stonelab-template-add.mp4`, `visual-qa/responsive-entry-desktop-20260719h.png`, and `visual-qa/responsive-entry-mobile-20260719h.png`.
- **Local URL:** `qa=20260719h`. This remains a local Development fixture; it is not a published WordPress page or production-data acceptance.

final result: passed for this motion sub-gate only
