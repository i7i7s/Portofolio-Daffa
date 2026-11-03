---
target: apps/portfolio
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\Daffa Alwafi\\Music\\Portofolio-Kreatif-PRD-Aset-Master-Prompt\\paket-portofolio-kreatif\\apps\\portfolio"
timestamp: 2026-11-03T07-51-48Z
slug: apps-portfolio
---
Method: dual-agent (A: design review · B: detector + browser evidence). Target: apps/portfolio (portofolio /id/ /en/ + Arsip Cahaya /foto/).

## Design Health Score: 22/32 (69%, Acceptable). Heuristics 7 and 10 n/a (Experience surface).

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | portofolio→/foto/ is a full reload with no status; wipe was a flash (now replaced) |
| 2 | Match system / real world | 3 | Photo vocabulary right; interest tabs promise work, deliver one-liners; ↗ on internal links |
| 3 | User control and freedom | 3 | Esc and arrows work; no way back to the same language from /foto/ |
| 4 | Consistency and standards | 2 | dipilih/favorit/keep drift; wipe timing differed per link type; two close-button styles |
| 5 | Error prevention | 3 | A 20+ character real name would break the hero |
| 6 | Recognition vs recall | 3 | Orbit hints sat below the fold (moved up); arrow hint shown on touch |
| 7 | Flexibility and efficiency | n/a | Experience surface |
| 8 | Aesthetic and minimalist | 2 | Hero overloaded; repeated "contoh" disclaimers |
| 9 | Error recovery | 3 | Plain 404 copy; /foto/ has its own not-found |
| 10 | Help and documentation | n/a | Experience surface |

## Design specificity
Both sides are specific; the seam between them is not. /foto/ (film sheets, grease pencil, viewfinder HUD) could not be reused by another product. The portfolio's sticker kit (rotated pills, ribbons, rotating badges, marquees) is a familiar template idiom. Nothing carries across the two sides (no shared mark, wordmark or type).

Deterministic scan: `impeccable detect` on src returned 0 findings (reads markup only; not a clean bill). Browser overlay: /id/ 3 (undersized-ui-text, kicker-above-heading x2); /id/projects/ 2 (kicker, skipped-heading h1→h3); /id/projects/ruang/ 2 (hero-eyebrow-chip, straggler); /foto/ 22 (18 undersized-ui-text from one rule .frame-no, straggler, kicker, text-occlusion of orbit title (deliberate), repeating-stripes-gradient on body); frame page 0. Console clean, no overflow, contrast 0 failures, no tap targets under 24px, 1 h1 per page.

## Priority issues
- [P1] Two sides feel like two websites; /foto/ is Indonesian only (lang="id" fixed), back links always go to /id/, no language toggle, no shared mark. Fix: pass locale, shared signature, symmetric transition. Commands: shape, adapt, clarify.
- [P1] Wipe too fast AND broken: CSS translateY(100%) stacked with GSAP yPercent, so the overlay flashed and left before the route changed. STATUS: fixed 3 Nov 2026 (two-panel curtain, 0.75s in / 0.85s out, label, hero waits).
- [P1] Hero built for an 11-character placeholder name: .hero-pill and .hero-ribbon cover letters at 1440; a real 20+ character name wraps; SplitText mask clips the "g" in "kadang"; two cards use the same image; badge cropped. Commands: layout, polish.
- [P2] /foto/ first screen did not teach itself (hints below fold, spawn 1.6s, no jump link). STATUS: hints moved into the hero strip, "Lihat semua rol" link added. Spawn shortening and real aspect ratio still open.
- [P2] Copy and label drift: arrows on internal links, "Karya pilihan 3 dari 3", register mix, generic interest tabs. Command: clarify.

## Persona red flags
Jordan: no single obvious first action on home hero; "Fotografi" silently leaves the portfolio. Casey: hero about 2x viewport tall on 390px; mobile contact-sheet edge numbers no longer line up with 2-column frames; touch viewer shows keyboard hint and has no swipe. Sam: desktop nav landmark labelled "Buka menu"; language link name noisy; no pause control for auto animations (WCAG 2.2.2).

## Minor
Two mono strips stack under the header; "Sistem Informasi" appears three times in the hero; filter chip counts sum to 5 not 3; disclaimers repeat per card; frame viewer has no end-of-roll cue; text at 9-10px (small.mono, .frame-no); LCP warning for ruang.svg cover.

## Questions
What if the star and wordmark tied both sides together and /foto/ were entered through a deliberate "lights go down"? Does the home hero need a second sticker stage? What if the photography section were a live slice of the orbit?
