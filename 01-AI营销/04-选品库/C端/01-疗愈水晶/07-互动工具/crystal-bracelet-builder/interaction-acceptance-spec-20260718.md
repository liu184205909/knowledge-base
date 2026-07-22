# T17 v3 local interaction acceptance specification (2026-07-18)

## Scope and stage

This is a local-development acceptance specification for `frontend/preview.html`. It preserves the v3 boundaries: 2D only; no Three.js or GLB; mock/draft materials only; no new WordPress page, plugin upload, ZIP generation, or public launch.

## Confirmed responsive structure

- Desktop: a 55:45 left design / right material-library layout.
- Mobile: a compact stacked design-first layout and exactly two material cards per row.
- The same feature changes apply deliberately to both viewports. Mobile-only or desktop-only regressions are not acceptable.
- Quote summary fields are `Length`, `Weight`, `Pieces / target`, and `Suggested wrist`. Desktop and mobile use only the first three in one compact top row. `Suggested wrist` lives in a tray-side status chip so it does not add a second row or push the catalog down.
- The mobile checkout area keeps a compact `Details` disclosure, total, and Finish Design in one fixed bottom row. Details is closed by default and expands upward on demand. Desktop Order & details remains visibly open.
- Desktop `Order & details` is permanently expanded. Its sequence strip remains horizontally scrollable, but the section is not collapsed behind a disclosure control.
- The desktop tray element is 418 px inside a 420 px canvas at the 1440 x 900 acceptance viewport. The status row sits directly above the canvas; PNG transparency is not treated as layout spacing.

## Material-card contract

- Each whole card click adds one selected Variant to the recipe.
- Card `- / +` chooses only the displayed size Variant. It never changes recipe quantity.
- A badge may show how many of that Variant are currently in the recipe.
- Multi-size cards show size controls. Single-Variant materials reserve the same bottom row but show no controls.
- Card media scales around a fixed visual center with a bounded preview range: the 6 mm preview remains readable and a future 15 mm preview cannot overflow. This visual preview scaling does not change Variant size, occupied length, price, display scale, or weight.
- Cards render two columns on mobile and three on desktop. Their compact media/name/size-price/control hierarchy must remain aligned.

## Tray and editing contract

- Retain 2D PNG tray choices and one centered Earthward mark. No 3D substitute is allowed. The mark is a transparent image configured in the existing T17 back-end settings with a 24-160 px display-width control; when no approved image is configured, the local editor renders only the `Earthward` text fallback and never a second `EW` emblem.
- The recipe may freely mix independent Variant sizes. Each item keeps its own price, image, scale, weight, and two-dimensional occupancy.
- Direction comes from the material record and layout category: round beads are fixed; shaped items follow tangent layout; charms and pendants are radial-out unless data overrides it. There is no manual direction button.
- In assembled mode, angular allocation uses actual visual/occupancy footprint, not equal item counts. The centerline expands continuously as the recipe grows (including 12 → 15 → 20 → 30 pieces), reaches the tray-safe inner edge before any global display-scale reduction, and uses a one-pixel seam between normal pieces. Directional accessories reserve their anchor footprint on the ring while their body follows its direction rule.
- In released mode, dragging repositions a material and resolves neighbors. Dragging outside the tray deletes it; Undo restores the previous state. Assembled dragging reorders the recipe.
- Released placement, drag placement, and physics share one circular boundary with a 33% radius of the interactive ring width. The launch point is calculated on that circle rather than clamped from an outside rectangular coordinate.

## Entry, physics, and feedback contract

- Desktop card entry continues from the right side toward the inner-left edge. Mobile card entry continues from the lower catalog side toward the upper inner edge, matching the source-to-tray spatial relationship observed in the reference mini program.
- The physical sequence is observable: card entry, inbound travel, first real collision (with an existing item when it is in the path, otherwise with the inner boundary), normal-vector rebound, further material/rim collisions, then rest. Impact height and rebound direction derive from the actual collision normal; no fixed 75 px direction is encoded and no item may bypass another item.
- First contact is recorded as `material` or `rim`. Diagnostics also record every launched-item rim bounce and pre/post velocity in `data-scatter-trace`. Low inbound damping is retained until first contact; post-contact damping is low enough to preserve multiple visible rebounds while still settling within the bounded local-test window.
- Released, dragged, and assembled states all use an inset safe boundary. No bead, decor item, or directional accessory may touch the visible rim, leave the tray image, or overlap another item after settling.
- The entry motion is intentionally moderate, not a fast projectile. Boundary and material collisions are core editing feedback and continue under the browser's reduced-motion preference; that preference shortens decorative card-flight motion. A deliberate `physicsMotion: none` integration setting is the only path that may use static collision-free placement.
- A bead-card add plays a short original glass/marble cue only. Do not copy competitor sound, music, narration, images, or game assets.

## Wrist and fit contract

- Length and weight are calculated from individual recipe items.
- `Pieces / target` shows actual count and a quote-derived recommended count; it does not automatically add, remove, resize, or reorder materials.
- `Suggested wrist` presents the derived range. The fit prompt may say too tight / add about N pieces or too loose / remove about N pieces, while preserving the user recipe.
- The local fixture has a 300 mm maximum strand-length guard. Above that value it preserves the design, marks it over-limit, and shows `Strand length exceeds limit — current X cm, maximum 30.0 cm`; it never silently drops items. The server quote contract must enforce the same configured limit before Woo integration.
- Wrist Setting retains the V2 modal hierarchy but removes height, weight, and Common sizes. The accepted local version uses a direct wrist-circumference number and synchronized range input, Snug / Regular / Loose preference, and an illustrative 6 / 8 / 10 / 12 mm bead-size comparison. This comparison is a development visual, not formal production material.

## Deferred Zuma-like launcher concept

No literal dragon, cannon, or borrowed Zuma visual is included in this release. If a later local experiment is approved, it must be a subtle neutral tray material inlet, not a game character. It must support different gentle entry behavior for round beads and directional accessories, avoid obscuring the logo, preserve the current server-side recipe/price contract, and be evaluated only after the baseline scatter checks above pass.

## Acceptance checks before any integration

1. Desktop: one add follows a right-to-left path. Mobile: one add follows a bottom-to-top path. It reaches and rebounds from the relevant inner boundary only when no existing item blocks that path; otherwise its first visible contact is the blocking item.
2. Desktop and mobile: 20+ mixed items settle with no overlap and no rim/PNG overflow.
3. Desktop and mobile: 20+ assembled mixed items stay inside the inset tray boundary and follow a coherent circular sequence.
4. Whole-card add, size stepping, save/reset, Assemble/Release, drag/reorder, drag-outside delete/Undo, wrist selection, and Finish Design all receive manual checks.
5. Static code checks, backend contract checks, and a local HTTP preview pass. Production data, official presets, Woo lifecycle, and WordPress page integration remain separate later gates.

## Tutorial and compact-status contract (2026-07-19)

- Mobile exposes a separate Tutorial control beside the tray. It does not replace the wrist, reset, save, assemble or back/navigation controls.
- Tutorial is a four-step modal covering material add, Variant size selection, assembled reorder and drag-outside removal. It provides close, previous/next, progress dots and Start designing controls.
- Current tutorial images are explicitly local Development screenshots. Competitor screenshots, logos and UI assets are not bundled or treated as production materials.
- Desktop hides the mobile tutorial trigger but uses the same tray-side Suggested wrist presentation and the same three-field top measurement row.
- The existing T17 settings page owns tray-logo image ID, optional URL and display width. This configuration is presentation data and remains separate from bead/accessory catalog records.

## Desktop reduced-motion collision correction (2026-07-19)

- Root cause: the current acceptance browser reports `prefers-reduced-motion: true`. The former early return stopped the scatter solver immediately after `launch-right`, leaving `firstImpact=pending`, `bounce=0` and the first bead at the right launch boundary.
- Corrected boundary: reduced motion no longer bypasses the core collision solver. Desktop speed is 1.55 px per normalized frame and mobile speed is 1.45; decorative material-flight timing remains reduced.
- Current-browser first-bead trace: launch `(288.91, 220.54)`; first left-inner-rim contact `(80.48, 198.00)` at 2367 ms; velocity changed from `(-1.416, -0.153)` to `(1.113, -0.388)`. A second rim contact occurred at `(278.45, 129.02)` before settling.
- A second empty-tray Variant used a different impact height `(80.07, 191.25)` and changed velocity from `(-1.421, 0.049)` to `(1.165, -0.029)`, demonstrating that rebound derives from the collision normal rather than a fixed direction.
- Both runs ended with `outside_count=0` and `overlap_pairs=0`.
- Mobile regression in the same reduced-motion browser: bottom launch `(154.68, 200.75)` contacted the upper inner rim `(139.32, 59.32)`, reversed vertical velocity from `-1.357` to `+1.068`, contacted a second rim and settled with zero outside items and zero overlaps.

## Latest browser evidence (2026-07-18)

- Desktop empty tray, 376 px interactive ring: launch `(288.91, 220.54)` with velocity `(-2.038, -0.220)`; first left-inner-rim contact `(80.49, 198.04)` changed velocity from `(-1.913, -0.207)` to `(1.504, -0.526)`; second upper-right-inner-rim contact `(278.36, 128.89)` changed velocity from `(0.909, -0.318)` to `(-0.515, 0.613)`. `first_impact=rim`, launched bounce count 2, outside count 0, overlap pairs 0.
- Desktop controlled three-bead path: the third bead recorded `first_impact=material` at 659 ms, then a rim collision and a second material collision. It settled with outside count 0 and overlap pairs 0, confirming that it did not pass through the blocking bead.
- Mobile empty tray, 265.2 px interactive ring: launch `(154.68, 200.75)` with velocity `(-0.204, -1.889)`; the item then recorded three distinct rim contacts at `(139.31, 59.31)`, `(92.68, 194.42)`, and `(199.93, 102.88)`. Each contact changed direction from its measured collision normal; it settled at `(156.15, 105.77)` with outside count 0 and overlap pairs 0.
- The earlier one-bounce desktop/mobile coordinate evidence is superseded by these continuous multi-collision traces. The implementation contains no fixed rebound direction and no fixed 75 px rebound distance.
- Current assembled-boundary measurements with 21 mixed items: mobile ring 265.2 px, maximum occupied radius 84.59 px and 48.01 px inset; desktop ring 376.0 px, maximum occupied radius 119.97 px and 68.03 px inset. Both states reported zero horizontal overflow.
- Desktop Wrist Setting: 720 x 601 px, four comparison images loaded, no internal vertical scroll. Mobile: 367 x 546 px, no document horizontal overflow.
