# Stonelab interaction and direction audit — 2026-07-17

## Scope and evidence boundary

- Purpose: record interaction patterns and direction-sensitive material classes for T17 v3 local implementation.
- Sources: the creator profile at `https://v.douyin.com/Y_1njxYDsMg/`, the three supplied short videos, and the supplied desktop video at `https://www.douyin.com/video/7649699791882973178`.
- The profile currently labels 22 works. Its rendered DOM exposes 20 video links plus one image note; the supplied long desktop video accounts for the remaining directly reviewed work surface. This is an interaction audit, not a production-material source.
- Published audio contains narration/music. No competitor sound file is copied. T17 uses an original short Web Audio cue.

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

| Surface | Start | End | Normal motion | Reduced-motion path |
| --- | --- | --- | --- | --- |
| Mobile | The tapped product-card image below the tray | The deterministic insertion point inside the tray | 420 ms upward arc | 160 ms direct settle, no arc/overshoot |
| Desktop | The tapped product-card image in the right library | The deterministic insertion point in the left design area | 460 ms leftward arc | 160 ms direct settle, no arc/overshoot |

- The moving token is a clone of the selected real material image/fallback already rendered in the card.
- A whole-card add is immediate and does not wait for the animation to finish. Assemble remains usable while the quote refreshes.
- Crystal beads play one original approximately 105 ms glass/marble cue on both mobile and desktop.
- Size `- / +`, filters, drag, reorder, Assemble and non-bead materials do not play the cue.
- All materials can use the visual flight; decor adopts its automatic strand direction when rendered/assembled.

## Production-data boundary

- This audit does not approve, price or import any candidate material.
- Production assets still require category, anchor, occupied length, compatibility and orientation review through the existing review/import gates.
- Research videos and extracted QA frames remain under `visual-qa/` and must never be copied into the production catalog.
