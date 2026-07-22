# T17 physics findings gate

## 2026-07-19 desktop empty-tray first bead

| Status | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| resolved | P0 | System reduced-motion preference bypassed the entire scatter solver, leaving the launched bead at the right-side launch boundary. | Before fix: `reduced=true`, `phase=settled`, `firstImpact=pending`, `bounce=0`; trace contained only `launch-right` at `(288.91, 220.54)`. |
| resolved | P0 | The current browser must prove first contact at the left inner rim and a subsequent positive X velocity. | Current browser with `reduced=true`: first rim contact `(80.48, 198.00)` at 2367 ms; velocity changed from `(-1.416, -0.153)` to `(1.113, -0.388)`. |
| resolved | P1 | The launched bead and existing beads must remain inside the shared inset boundary with no overlap after settling. | First-bead run settled after two rim contacts with `outside_count=0`, `overlap_pairs=0`. A second empty-tray Variant also settled after two contacts with both values zero. |

## 2026-07-19 user-visible tab audit

| Status | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| resolved | P0 | The user-visible tab was not the tab used for the previous acceptance claim. The visible `qa=20260719b` page still loads the `20260719b` mock config and UI script. | The actual Tabbit window was found on the still older `qa=20260718h` URL, then explicitly navigated to `qa=20260719f` after restarting port 8765. |
| resolved | P0 | The visible page still does not execute the required right-entry to left-rim collision and rebound sequence. | `scatterBoundary()` now follows the visible tray inner rim at `0.44 * width`; assembled layout remains independently inset at `0.28 * width`. |
| resolved | P0 | Acceptance must be performed on the same user-visible tab and script version, and must include sampled on-screen positions over time rather than only internal event counters. | In the real Tabbit `qa=20260719f` window, first bead visibly touched the left inner rim at about 3000 ms and moved right by 4000 ms. A second Variant touched the left rim at about 2900 ms and moved right by 4000 ms; the two settled without overlap or overflow. |

Findings gate: the left-rim entrance defect is closed only for the local `qa=20260719f` real-window run above. This does not claim the wider T17 product is complete or deployed.

## 2026-07-19 competitor first-four and template timing correction

| Status | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| resolved | P0 | The prior unified upper-right entrance was inferred from a later crowded-tray sample and was wrong for the responsive source direction. | A new 60 fps empty-tray recording covers four consecutive StoneLAB card additions: `.fable/competitor-stonelab-empty-1-4-live.mp4`. Mobile pieces enter from below, travel toward the upper inner rim, then rebound on the collision normal. |
| resolved | P0 | A fixed 2.25/2.4 px-per-frame speed made first contact depend on tray size and feel slow. | Local `qa=20260719h` derives speed from a 620 ms mobile / 700 ms desktop inbound target. First empty-tray rim contact measured 631 ms mobile and 716 ms desktop after physics launch. |
| resolved | P0 | Later pieces must not pass through existing material to reach the opposite rim. | Desktop additions 2-4 recorded first material contact at 71 ms, 514 ms and 6 ms where blocked. Mobile additions 2-3 recorded first material contact at 89 ms and 306 ms; the fourth reached the rim first and then hit material at 1241 ms. |
| resolved | P1 | An imported official design should open assembled and remain assembled when another Variant is added. | Mock official design 9001 loaded with 3 pieces, `is-assembled=true`, label `Release`; after one card add it had 4 pieces with the same assembled state and no scatter phase/trace. |
| resolved | P1 | Dynamic correction must not trade speed for overflow or overlap. | All eight local first-four runs (desktop and 390 x 844 mobile) ended with `outside_count=0` and `overlap_pairs=0`. |

Competitor frame strips: `.fable/competitor-stonelab-empty-first-detail.png`, `competitor-stonelab-empty-second-detail.png`, `competitor-stonelab-empty-third-detail.png`, and `competitor-stonelab-empty-fourth-late-detail.png`. The template-state recording is `.fable/competitor-stonelab-template-add.mp4`. This finding supersedes the earlier `qa=20260719f` claim that desktop and mobile should share one upper-right launch channel.
