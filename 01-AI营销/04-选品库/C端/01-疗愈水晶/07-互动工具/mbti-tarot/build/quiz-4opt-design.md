# MBTI 28-Q Test — ABCD 4-Option Likert Redesign

> **Scope:** design only. Output is `mbti-quiz-4opt.json` + this doc. `generate.js` is **not** modified here — another agent (`a46a276a`) is currently editing it (case-normalisation + hero). Integration patches land **after** that merge completes.
>
> **Date:** 2026-07-04. **Status:** ready for review and downstream merge.

---

## 1. Why change from 2 options to 4

The current binary A/B quiz forces a hard split on every scenario. Two pain points:

1. **"Neither feels right" fatigue.** Many users sit roughly in the middle on a given question. With only A/B, they are forced to pick a side they do not actually hold, which depresses test-completion trust.
2. **"This is just a vibe" feel.** A binary test reads as a casual poll, not a measurement instrument. A Likert-style 4-option format signals degree-awareness and lifts the perceived depth — which matters for an MBTI×Tarot tool whose entire brand promise is *depth*.

A 4-option format fixes both without inventing new dimensions: each question still maps to exactly one of the four EI / NS / TF / JP axes, but the user can now express **direction *and* strength** in a single tap.

---

## 2. The 4-option Likert contract

Every question obeys one fixed contract. Users learn it after question 2 and apply it for the remaining 26:

| Key | Meaning | Pole | Weight |
|-----|---------|------|--------|
| **A** | Strongly [pole X] | X (E / N / T / J depending on dimension) | **2** |
| **B** | Slightly [pole X] | X | **1** |
| **C** | Slightly [pole Y] | Y (I / S / F / P depending on dimension) | **1** |
| **D** | Strongly [pole Y] | Y | **2** |

The pole ordering (X is always the *first letter* of the dichotomy: E before I, N before S, T before F, J before P) is held constant across all 28 questions. This is a deliberate trade-off:

- **Pro:** zero cognitive load ("A is always the strong end of the first-named pole"). The user does not have to re-read which side each option belongs to.
- **Con:** a small order-effect / "left-side preferred" response bias.
- **Mitigation:** the *wording* of which pole is socially desirable is rotated across questions, so the bias does not systematically favour E over I, N over S, etc.

This is the standard Likert approach (no reverse-coded items, fixed pole order) used by most modern 4-option personality instruments.

---

## 3. Question design rules

Every question was self-authored from these rules — **not copied from 16personalities, Truity, Sakinorva, or any other published test**. The scenarios are tuned to this site's voice (crystal / meditation / tarot imagery) so the test feels native rather than generic.

### 3.1 Cognitive-function rooted, not stereotype-rooted
- EI questions test **energy direction**, not "loud vs quiet person" (q1 refuelling, q6 solitude saturation, q7 processing-mode).
- NS questions test **information intake**, not "dreamer vs doer" (q9 tarot-symbolism vs card-picture, q11 meditation associative vs sensory, q13 problem-framing vs problem-recycling).
- TF questions test **decision criteria**, not "smart vs nice" (q15 conflict read, q18 group decision, q21 value-vs-friend collision).
- JP questions test **outer-world stance**, not "organised vs messy" (q22 unstructured-weekend energy, q26 disruption response, q28 half-finished-projects feeling).

### 3.2 Concrete scenarios, not abstract trait claims
Bad: "Are you an organised person?"
Good (q24): "Your desk or kitchen, honestly, is —" with four options that paint four specific shapes of mess/tidiness.

### 3.3 Site-native imagery
- q2 holding a new crystal at a market stall
- q9 picking up a tarot deck
- q11 guided meditation
- q12 choosing a crystal for a friend
- q17 picking a stone for yourself

These five "anchor" questions carry the brand promise; the other 23 are deliberately ordinary-life so the test does not read as crystal-flavoured cosplay.

### 3.4 Strength lives in the option text, not a slider
A/D options commit visibly harder than B/C. Compare q22:
- A (strong J): "restless and oddly tired — the openness itself became work"
- B (slight J): "fine but faintly itchy — at least one anchor would have helped"
- C (slight P): "mostly replenished, with maybe one small wish that I had planned a thing or two"
- D (strong P): "deeply replenished — the openness was the whole point"

The hedging language (`faintly`, `maybe`, `small wish`) marks the mild options; the absolute language (`oddly tired`, `deeply`, `the whole point`) marks the strong ones. Users self-select intensity via tone, not a separate intensity control.

### 3.5 No value-laden language
No option reads as "the right answer". Each pole is written with its own dignity — neither J nor P is framed as more evolved; neither T nor F is framed as warmer or smarter.

### 3.6 Coverage matrix — each dimension 7 questions

| Dim | Cognitive facet covered | Question IDs |
|-----|-------------------------|--------------|
| EI  | refuel mode             | 1, 6         |
| EI  | stranger-context energy | 3            |
| EI  | idea-expression mode    | 4            |
| EI  | friendship shape        | 5            |
| EI  | processing mode (talk vs sit) | 2, 7    |
| NS  | info intake from a story | 8            |
| NS  | tarot/symbol system vs card picture | 9 |
| NS  | directions preference   | 10           |
| NS  | meditation attention    | 11           |
| NS  | choosing a crystal      | 12           |
| NS  | problem approach        | 13           |
| NS  | reading retention       | 14           |
| TF  | conflict read           | 15           |
| TF  | hard feedback           | 16           |
| TF  | choosing for self (reason vs felt) | 17 |
| TF  | group decision          | 18           |
| TF  | venting response        | 19           |
| TF  | reputation preference   | 20           |
| TF  | value vs relationship   | 21           |
| JP  | unstructured weekend    | 22           |
| JP  | trip booking            | 23           |
| JP  | physical environment    | 24           |
| JP  | deadline cadence        | 25           |
| JP  | disruption response     | 26           |
| JP  | spontaneous invite      | 27           |
| JP  | half-finished projects  | 28           |

No question is a near-duplicate of another within its dimension. Each of the 28 occupies its own cell.

---

## 4. Scoring logic

### 4.1 Per-dimension pole sums
For each dimension, sum the weights of the chosen poles across its 7 questions. Two pole counters per dimension (e.g. EI: `E_sum`, `I_sum`), each in range 0..14. Because every dimension has exactly 7 questions and every option contributes weight 1 or 2 to exactly one pole, if all 7 questions are answered then `E_sum + I_sum = 14` (and analogously for the other three dimensions).

### 4.2 Decide the dominant pole (with tiebreak)
```
function decide(poleX_sum, poleY_sum, poleX_letter, poleY_letter) {
  if (poleX_sum > poleY_sum) return poleX_letter;
  if (poleY_sum > poleX_sum) return poleY_letter;
  // tie (only reachable as 7-7; see 4.4)
  return poleX_letter;   // first-letter-wins, same rule as binary version
}
```

### 4.3 Strength band (per dimension, for diagnostics)
The per-dimension gap `g = |X_sum - Y_sum|` falls in 0..14 (only even values reachable, since each option contributes ±1 or ±2 and total is even):

| g range | Winner pole score | Band |
|---------|-------------------|------|
| 8..14 | 11..14 | **strong** (winner is clearly dominant) |
| 4..6 | 9..10 | **moderate** |
| 0..2 (tie = 0 only) | 7 | **mild / tied** |

### 4.4 Tiebreak
A perfect 7-7 tie is only reachable when the user's seven answers split symmetrically (e.g. one Strong-X + two Slight-X + two Slight-Y + one Strong-Y + one of either Slight leaves 7-7; there are several patterns). The rule is **first-letter-wins** (E over I, N over S, T over F, J over P). This is identical to the existing binary `scoreQuiz`'s `>=` tiebreak (`decide` returns `dimA` when `dimA >= dimB`), so users on the boundary get the **same** type letter they would have got under the old test — no silent personality flips for existing users.

### 4.5 Overall strength summary (single label)
Average the four per-dimension gaps → one strength label for the result card:
```
avg_gap = (g_EI + g_NS + g_TF + g_JP) / 4
avg_gap >= 6      -> "strong"
3 <= avg_gap < 6  -> "moderate"
avg_gap < 3       -> "mild"
```
This produces a single honest label (`INTJ — strong`, `ENFP — moderate`, `ISFP — mild`) rather than four separate per-axis labels that would clutter the result card.

---

## 5. Worked scoring examples

### 5.1 All-Strong-X → ENTJ, strong
User answers **A on every one of the 28 questions**.
- EI: E_sum = 7×2 = 14, I_sum = 0 → E, gap 14
- NS: N_sum = 14, S_sum = 0 → N, gap 14
- TF: T_sum = 14, F_sum = 0 → T, gap 14
- JP: J_sum = 14, P_sum = 0 → J, gap 14
- Type: **ENTJ**, avg gap = 14 → **strong**

### 5.2 Mixed moderate → ENFP, moderate
User picks roughly 2 Strong-X + 5 mixed per dimension. Example:
- EI: 2×A (E+4) + 2×B (E+2) + 1×C (I+1) + 2×D (I+4) → E=6, I=5 → **E**, gap 1
- NS: 3×A + 2×B + 1×C + 1×D → N=8, S=2 → **N**, gap 6
- TF: 1×A + 2×B + 2×C + 2×D → T=4, F=6 → **F**, gap 2
- JP: 1×A + 1×B + 2×C + 3×D → J=3, P=8 → **P**, gap 5
- Type: **ENFP**, avg gap = (1+6+2+5)/4 = 3.5 → **moderate**

### 5.3 A 7-7 tie → tiebreak applies
EI dimension, user answers: 2×A (E+4) + 1×B (E+1) + 2×C (I+2) + 2×D (I+4) → E=5, I=6 → actually **I**, gap 1. To force a true 7-7 you need exactly E_sum = I_sum = 7, e.g. 2×A + 1×B + 1×C + 1×C + ... — multiple weightings work. When `E_sum == I_sum == 7`, `decide` returns **E** (first-letter-wins). Type ends up e.g. `ENFP` not `INFP`.

### 5.4 All-Slight (user refuses to commit) → still resolvable
User picks B or C on every question (no Strong answers):
- Each dimension: e.g. EI has B+C count = 7, so E_sum ∈ {0..7}, I_sum ∈ {0..7}, E_sum + I_sum = 7.
- This compresses the dynamic range to 0..7 per pole, so gaps max out at 7 — **moderate** at most, never **strong**. The strength band honestly reflects that the user stayed in the middle. Reasonable outcome.

---

## 6. UI integration plan

> Target file: `07-互动工具/mbti-tarot/build/generate.js` — **do not edit yet**, wait for `a46a276a` to land.

### 6.1 Replace the `QUIZ` constant
- **Old shape** (binary): `{ id, dim, a, b, q, optA, optB }`
- **New shape** (4-opt): `{ id, dimension, poles:[X,Y], scenario, options:[{key,label,score:{pole:weight}} x 4] }`
- Source: import `mbti-quiz-4opt.json` and assign its `questions` array to the `QUIZ` constant. Keep `_meta` for runtime reference (scoring config, tiebreak doc).

### 6.2 Rewrite `scoreQuiz(answers)`
```js
function scoreQuiz(answers) {
  var poles = { E:0, I:0, N:0, S:0, T:0, F:0, J:0, P:0 };
  for (var i = 0; i < QUIZ.length; i++) {
    var q = QUIZ[i];
    var pick = answers[q.id];          // 'A' | 'B' | 'C' | 'D'
    if (!pick) continue;
    var opt = q.options.find(function(o){ return o.key === pick; });
    if (!opt) continue;
    var pole = Object.keys(opt.score)[0];
    poles[pole] += opt.score[pole];
  }
  function decide(xLetter, yLetter) {
    return poles[xLetter] >= poles[yLetter] ? xLetter : yLetter;
  }
  // per-dimension gaps for strength band
  var gapEI = Math.abs(poles.E - poles.I);
  var gapNS = Math.abs(poles.N - poles.S);
  var gapTF = Math.abs(poles.T - poles.F);
  var gapJP = Math.abs(poles.J - poles.P);
  var avgGap = (gapEI + gapNS + gapTF + gapJP) / 4;
  var strength = avgGap >= 6 ? 'strong' : (avgGap >= 3 ? 'moderate' : 'mild');
  return {
    type: decide('E','I') + decide('N','S') + decide('T','F') + decide('J','P'),
    counts: poles,
    gaps: { EI: gapEI, NS: gapNS, TF: gapTF, JP: gapJP },
    strength: strength
  };
}
```
Note `decide` keeps the same `>=` tiebreak semantics as the binary version — boundary users see the same letter.

### 6.3 Rewrite `renderTestQuestion(idx, answers)`
Render four buttons instead of two. Two layouts are workable; **Layout B (2×2 grid)** is recommended.

#### Layout A — vertical 1×4 stack
```
[ A  Strongly X  ]
[ B  Slightly X  ]
[ C  Slightly Y  ]
[ D  Strongly Y  ]
```
- Pro: easiest mobile tap target (full-width buttons).
- Con: visually long; the strong/slight pairing is not obvious.

#### Layout B — 2×2 grid with column pairing (RECOMMENDED)
```
┌─────────────┬─────────────┐
│  A  STRONG  │  C  SLIGHT  │   ← top row
│  [X label]  │  [Y label]  │
├─────────────┼─────────────┤
│  B  SLIGHT  │  D  STRONG  │   ← bottom row
│  [X label]  │  [Y label]  │
└─────────────┴─────────────┘
```
Column = pole (left = X, right = Y); row = strength (top = strong, bottom = slight). The diagonal pairs (A↔D strong, B↔C slight) become visually obvious, so the user sees the strength axis at a glance.

Markup sketch (4 buttons, the active one gets `.emt-q-opt-active`):
```html
<div class="emt-q-opts emt-q-opts-grid">
  <button class="emt-q-opt emt-q-opt-strong" data-qid="1" data-pick="A">
    <span class="emt-q-opt-mark">A</span>
    <span class="emt-q-opt-tag">Strongly</span>
    <span class="emt-q-opt-text">...label...</span>
  </button>
  <button class="emt-q-opt emt-q-opt-slight" data-qid="1" data-pick="C"> ... </button>
  <button class="emt-q-opt emt-q-opt-slight" data-qid="1" data-pick="B"> ... </button>
  <button class="emt-q-opt emt-q-opt-strong" data-qid="1" data-pick="D"> ... </button>
</div>
```
CSS:
```css
.emt-q-opts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
/* explicit source order so the grid reads A,C / B,D */
.emt-q-opts-grid > :nth-child(1) { grid-area: 1 / 1; }
.emt-q-opts-grid > :nth-child(2) { grid-area: 1 / 2; }
.emt-q-opts-grid > :nth-child(3) { grid-area: 2 / 1; }
.emt-q-opts-grid > :nth-child(4) { grid-area: 2 / 2; }

@media (max-width: 540px) {
  /* narrow screens: collapse to single column, order A B C D */
  .emt-q-opts-grid { grid-template-columns: 1fr; }
  .emt-q-opts-grid > :nth-child(n) { grid-area: auto; }
}

.emt-q-opt-strong { border-left: 3px solid var(--emt-accent, #6d4aa1); }
.emt-q-opt-slight { border-left: 3px solid var(--emt-muted, #b8a8d4); }
.emt-q-opt-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.7; }
.emt-q-opt:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.emt-q-opt-active { outline: 2px solid var(--emt-accent, #6d4aa1); outline-offset: 1px; }
```

### 6.4 Hover / active / focus states
- `:hover` — lift 1px, soft shadow, cursor pointer. Already on `.emt-q-opt` in current CSS.
- `.emt-q-opt-active` — outline + tag-colour fill so the picked option is unmissable when the user scrolls back via `Back`.
- `:focus-visible` — same outline as active, for keyboard users. **Required** for accessibility (current binary version does not have this — fix it on the way through).

### 6.5 Mobile (`@media (max-width: 540px)`)
- Collapse to single column (Layout A) — buttons become full-width, A B C D stacked top-to-bottom.
- Bump button vertical padding from current 12px to 16px for thumb-tap comfort.
- `.emt-q-opt-tag` ("Strongly" / "Slightly") stays visible — it is the only signal of intensity, must not be hidden on small screens.

### 6.6 Progress bar
No change. Current `.emt-q-progress-bar` / `.emt-q-progress-fill` (one segment per question, `width: idx/total * 100%`) works unchanged for 4-option questions.

### 6.7 Result-card additions
Surface the new `strength` label next to the type code:
- `INTJ — strong`, `ENFP — moderate`, `ISFP — mild`
- Optional: a 4-bar mini-chart of per-dimension gaps (EI / NS / TF / JP) so users can see *which* axes are decisive and which are close. This is the real payoff of moving to Likert — show the gaps.

---

## 7. Compatibility notes

- **Deep links** (`?type=INTJ` etc.) keep working — the result `type` string format is unchanged (4 uppercase letters).
- **Existing draft post** (`mbti-tarot.html`) regenerates from `generate.js` via `create-draft.js` / `update-draft.js` — no schema migration needed; just re-run the build after `generate.js` is patched.
- **Data block (`emt-data`)** — currently `asciiJSON`'d; the new quiz shape is pure ASCII (English labels, `\uXXXX` for any non-ASCII) so the existing `wp_kses`-safe encoding pipeline works unchanged.
- **No backward compatibility for in-flight tests.** If a user is mid-test when the deploy lands, their `testState` resets. Acceptable (single-page tool, no persistence).

---

## 8. Merge checklist (after `a46a276a` lands)

1. Pull latest `generate.js` (case-normalisation + hero patches).
2. Replace the `QUIZ` constant array (lines ~152-188 in current file) with an import / inline of `mbti-quiz-4opt.json`'s `questions`.
3. Rewrite `scoreQuiz` (lines ~281-304) per §6.2.
4. Rewrite `renderTestQuestion` (lines ~317-350) per §6.3 — 4 buttons, new CSS classes.
5. Add the §6.3 CSS rules to the in-document stylesheet block.
6. Add strength label to the result card render (search for `displayType(` usage in result section).
7. Run `node generate.js` to regenerate `mbti-tarot.html`.
8. Run `update-draft.js` to push to the WP draft.
9. Smoke-test on staging: complete the test with all-A answers (expect ENTJ strong), all-D answers (expect ISFP strong), and a deliberately mixed pattern (expect some moderate/mild type).
10. Publish.

---

## 9. Files

| Path | Purpose |
|------|---------|
| `07-互动工具/mbti-tarot/build/mbti-quiz-4opt.json` | **NEW.** 28 questions × 4 options + scoring meta. Source of truth. |
| `07-互动工具/mbti-tarot/build/quiz-4opt-design.md` | **NEW.** This doc. |
| `07-互动工具/mbti-tarot/build/generate.js` | **UNCHANGED here.** To be patched in §8 step 1-9 after `a46a276a` merges. |
