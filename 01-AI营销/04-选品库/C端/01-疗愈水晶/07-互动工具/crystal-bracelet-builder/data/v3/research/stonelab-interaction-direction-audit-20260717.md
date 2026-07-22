# StoneLAB product-card, interaction and direction audit — 2026-07-17 to 2026-07-19

## Scope and evidence boundary

- Purpose: record interaction patterns and direction-sensitive material classes for T17 v3 local implementation.
- Sources: the creator profile at `https://v.douyin.com/Y_1njxYDsMg/`, the three supplied short videos, and the supplied desktop video at `https://www.douyin.com/video/7649699791882973178`.
- The profile currently labels 22 works. Its rendered DOM exposes 20 video links plus one image note; the supplied long desktop video accounts for the remaining directly reviewed work surface. This is an interaction audit, not a production-material source.
- Published audio contains narration/music. No competitor sound file is copied. T17 uses an original short Web Audio cue.
- This file is the single durable StoneLAB reference for T17. Later implementation notes should update this file instead of creating a second competitor-observation document.

## Observed reference versus adopted T17 decisions

| Surface | StoneLAB observation | T17 decision |
| --- | --- | --- |
| Responsive layout | The mini-program is vertically stacked. The supplied desktop recording also shows a stacked working surface. | Mobile stays stacked. Desktop keeps the already accepted 55:45 design/library split because it uses the available width more efficiently and is part of the T17 v3 baseline. |
| Material navigation | Crystal, natural-stone, decor and shaped-material groups are exposed as browseable groups with a persistent category rail. | Crystal and natural-stone beads share the T17 bead library and use subcategories/filters. Accessories and directional decor remain separate material classes because their compatibility and orientation contracts differ. |
| Product cards | Compact image, name, one current size/price line, and size stepping when alternatives exist. A whole-card tap adds the currently selected item. | Mobile uses two cards per row and desktop three. `- / +` changes the selected Variant only; it never changes quantity. Single-Variant cards keep the same reserved footer height but show no `- / +`. |
| Released tray | Added items move into the tray, collide, rebound and displace existing items before settling. | Use bounded two-dimensional collision feedback with no overlap or rim overflow. This is visual placement only; recipe order and server quote data remain deterministic. |
| Assemble/release | A separate action gathers scattered materials into a bracelet and can release them again. | Assemble is repeatable, not a one-shot completion action. It arranges by occupied width and applies automatic direction; release returns to safe free placement. |
| Fit feedback | The reference shows suggested wrist range and too-tight/too-loose prompts without silently changing the design. | T17 reports Length, Weight, Pieces/target and Suggested wrist. It may recommend an approximate add/remove count but never mutates the recipe automatically. |

## Product-card and catalogue contract learned from the reference

- A catalogue row represents one material style; its size choices are independent Variants with their own price, image, display scale, weight, occupied length and availability.
- The card shows exactly one active `size + price` line. Stepping size changes the preview and active Variant. It does not render all available sizes at once.
- The media slot scales around a fixed centre and uses a visual minimum/maximum. A 6 mm bead remains readable and a possible 15 mm bead cannot overflow the card; this display compression does not alter the tray's relative Variant scale.
- The count badge is recipe feedback. Quantity changes only when the whole card is tapped or an item is removed from the tray.
- Shaped beads and single-size accessories may have no alternative size. Their cards retain alignment space while omitting misleading size controls.
- Names, categories, sizes and public prices may be retained as attributed research evidence. They are not Earthward product facts until an Earthward material, supplier, cost, asset-rights and production review has approved them.

## Creator-work inventory reviewed

The current profile inventory was exhausted to its `暂时没有更多了` state. The audit covered 20 linked short videos, the supplied long desktop video, and the one image note exposed by the profile. Nineteen short videos yielded downloadable playback media; the MSE-only `7649694074416450867` was reviewed through five browser-rendered frames. The image note `7649685253963896954` was recorded as non-video evidence.

| Work ID | Profile description | Interaction use |
| --- | --- | --- |
| `7655586628207662201` | Vol.002 / 盛世天下 | Desktop add, scatter, assemble and result flow |
| `7657085225570714866` | Vol.003 / 玉露 | Mobile repeated add and assemble flow |
| `7654961207531565434` | Vol.001 / 月光谣 | Mobile add, release/reassemble and background switching |
| `7663151295875846513` | 实拍对比 / 简简单单 | Preview-to-real comparison |
| `7662433188720232586` | 闺蜜手串 | Finished-design presentation |
| `7661972275662590457` | Vol.006 / 秋照 | Mixed material add/assemble sequence |
| `7661252925713093114` | 实拍对比 / 紫气东来 | Result fidelity comparison |
| `7660459394932966641` | 一定要加我拿实拍图 | Product/humour presentation; low interaction value |
| `7659614597087940082` | 实拍对比 / 幻梦 | Result fidelity comparison |
| `7658569424618532526` | 明星客户 / 海绵宝宝 | Themed design presentation |
| `7657464932573935473` | Vol.004 / 沧澜 | Mobile scatter/assemble flow and decor use |
| `7654605956357328571` | 实拍对比 / 水晶小熊 | Result fidelity comparison |
| `7653874919302756985` | 实拍对比 / 多彩猫猫 | Result fidelity comparison |
| `7653431916059079674` | 实拍对比 / 月亮 | Result fidelity comparison |
| `7653006604359981937` | 实拍对比 / 时雨 | Result fidelity comparison |
| `7652331309491351461` | 实拍对比 / 好运连连 | Result fidelity comparison |
| `7651934139017368762` | 实拍对比 / 方案 11 | Result fidelity comparison |
| `7651560391328580538` | 把珠子可劲往盘子里弹 | Direct evidence for card-to-tray throw feedback |
| `7650050057890869221` | 水晶 DIY 应用进化 | Mobile interaction-density and assembly overview |
| `7649694074416450867` | 小程序进化 | Desktop/mobile parity, preview and presentation flow |
| `7649699791882973178` | 3 分 31 秒桌面讲解 | Desktop interaction, free movement, assemble and material realism |
| `7649685253963896954` | 图文作品 | Non-video cover/note only; not used for motion timing |

Visual evidence is stored in `visual-qa/stonelab-profile-audit/`: a 19-video downloadable-media contact master, an MSE-rendered contact strip, and the long-desktop contact sheets. These files are research QA only.

## Direction classification used by the editor

| Material class | Layout direction | What the editor does | Production review requirement |
| --- | --- | --- | --- |
| Round or visually symmetric bead | `fixed` | Preserves the source image without automatic rotation | Usually `orientation_mode=none` |
| Spacer, rondelle, barrel, tube, disc, bead cap | `tangent` | Aligns the part to the strand tangent after Assemble | Confirm occupied length and adjacent bead-size compatibility |
| Charm, pendant, tassel, dangle, drop, hanging ornament | `radial_out` | Rotates the hanging end away from the bracelet centre | Confirm attachment anchor, outward end and rotation offset |
| Explicit inward-facing focal piece | `radial_in` | Rotates the marked face toward the bracelet centre | Must be explicitly approved; never inferred from price/name alone |
| Physical left/right component | variant-defined | Uses separate left/right Variant IDs; CSS mirroring is not inventory | Reciprocal `fixed_left` / `fixed_right` review is mandatory |
| User-rotatable or mirrorable decor | variant-defined | Stores one of the approved orientation values in the sequence snapshot | `allowed_orientations` must be approved before production import |

Automatic layout uses `layout_orientation` when supplied. Without it, the local editor derives `radial_out` from charm/pendant/tassel/dangle/drop/hanging category or shape terms, derives `tangent` for other decor and elongated spacer shapes, and leaves normal beads `fixed`.

## Add-material motion and sound contract

| Surface | Launch relationship | First contact | After contact |
| --- | --- | --- | --- |
| Mobile | The tapped card is below the tray, so the token enters upward from the lower side. | It contacts an existing item when one blocks the path; otherwise it reaches the upper inset rim. | Rebound follows the measured collision normal, may produce further material/rim contacts, and settles without overlap. |
| Desktop | The tapped card is in the right library, so the token enters from the right and travels left across the tray. | It contacts an existing item when one blocks the path; otherwise it reaches the left inset rim. | Rebound follows the measured collision normal, may produce further material/rim contacts, and settles without overlap. |

- The moving token is a clone of the selected real material image/fallback already rendered in the card.
- A whole-card add is immediate and does not wait for the animation to finish. Assemble remains usable while the quote refreshes.
- The incoming item must not tunnel through existing items to force a rim collision. With a populated tray, a material collision can correctly be the first contact.
- Entry, rim reflection, pair separation and final settling are one continuous motion. Browser `prefers-reduced-motion` may shorten decorative card-flight effects but must not bypass the collision solver.
- Verified current T17 empty-tray behaviour records more than one normal-vector rim rebound on both desktop and mobile; controlled multi-item tests record `first_impact=material` when another bead is in the path.
- Crystal beads play one original approximately 105 ms glass/marble cue on both mobile and desktop.
- Size `- / +`, filters, drag, reorder, Assemble and non-bead materials do not play the cue.
- All materials can use the visual flight; decor adopts its automatic strand direction when rendered/assembled.

## Template and editing observations

- Importing a complete design should create an assembled, editable sequence rather than a flattened preview image.
- Adding another material to an imported assembled design keeps the design editable and reflows the assembled ring; it does not discard the imported Variant identities.
- Dragging in assembled mode changes sequence order. Dragging in released mode changes free placement. Dragging outside the safe tray boundary removes the item, and Undo restores the previous local edit.
- Direction is material data plus layout behaviour, not a global direction button. Round beads stay fixed; spacers align to the tangent; charms, pendants and hanging pieces point outward unless an approved Variant explicitly says otherwise.

## Research catalogue and price-use policy

Competitor catalogue records may be kept in `data/v3/research/` only when every row retains source identity and review state. The minimum research fields are source name, source URL or work ID, captured date, source category/name, observed size, displayed price, currency, unit basis, image-evidence path and `research-only` status.

- Publicly displayed prices are benchmarking evidence, not Earthward final prices. They may be normalized for comparison but must not be written into the live catalogue without Earthward cost/margin review and a new price version.
- Competitor images, screenshots, videos, logos, card compositions and audio are research evidence only. Visibility on a public page does not grant Earthward a commercial image licence.
- For the current local UI stage, the 235 explicitly named Linganshi images may be referenced as `temporary-draft-enabled` fixtures so product-card structure and Variant behaviour can be tested. Their source identity must remain visible in the research mapping workbook; this temporary use is not a statement that they are final Earthward assets.
- Temporary competitor imagery must not be bundled into a public production catalogue, public Woo product, final preview export or candidate ZIP. Formal replacement remains a later asset gate and does not block local interaction work.
- T17 may adopt interaction patterns, information hierarchy, taxonomy ideas and factual size/price observations. It must not present a copied competitor card or image as an Earthward product.

## Production-data boundary

- This audit does not approve, price or import any candidate material.
- Production assets still require category, anchor, occupied length, compatibility and orientation review through the existing review/import gates.
- Research videos and extracted QA frames remain under `visual-qa/` and must never be copied into the production catalog.
- Key implementation evidence is retained in `interaction-acceptance-spec-20260718.md`, `design-qa.md`, `.fable/competitor-stonelab-empty-1-4-live.mp4`, `.fable/competitor-stonelab-template-add.mp4`, and the matching `visual-qa/responsive-entry-*.png` screenshots. Intermediate debug frames are not product documentation.
