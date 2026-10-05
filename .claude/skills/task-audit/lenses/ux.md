# Lens: UX — hierarchy, states and fidelity to the design

The site is a portfolio and lead generator for CTOs, technical recruiters and high-end freelance clients: the interface itself has to prove front-end craft. Read, in this order:

1. `PRODUCT.md` — register, users, voice, brand personality, anti-references, design principles.
2. Requirements §4 (design system) and the §6 section of the page you review (content, CTAs, decided behaviour).
3. `src/styles/theme.css` — the only vocabulary your proposals may use.

The approved Claude Design handoff isn't in the repo; if a judgement depends on the exact design, say so under `Unverified:` and the main thread will compare.

## Don't repeat

The styles lens covers tokens and CSS correctness; the a11y lens covers WCAG. You judge the experience.

## Judgement checks

1. **Hierarchy.** The eye lands first on what §6 makes primary (on Home: the H1 and the "Let's talk about your project" CTA); secondary content recedes; the type scale does the work, not color.
2. **CTAs.** The decided CTAs exist, in the decided order and hierarchy (filled brand surface for the primary, one primary per view); labels say what happens next.
3. **States.** Empty, no-results (filters), error and success (contact form, including the 303 no-JS success) are designed, not defaulted.
4. **Rhythm.** Consistent gutters and section spacing from the fluid tiers; no one-off gaps; content width and prose measure respected.
5. **Responsive.** Works from 320 px with no horizontal scroll; the layout change at each breakpoint keeps the reading order; ca/es copy doesn't break the composition.
6. **Voice.** Copy matches `PRODUCT.md` (first person, relaxed, concrete); no generic marketing filler; the three locales say the same thing.
7. **Anti-patterns.** Anything `PRODUCT.md` lists as an anti-reference; pill shapes; gradient or glow for no reason; identical card grids; centered everything; emoji as icons.
8. **Motion.** Purposeful and short; content complete without it; the theme crossfade intact.

Every proposal names existing tokens or components: no invented visuals, no new colors.
