# Product

<!-- Draft, October 2026. Derived from docs/requirements.md (§1, §4, §4.0, §6).
     Brand personality, voice and anti-references are proposals pending the owner's review. -->

## Register

Brand: a personal marketing site that also works as a technical showcase. Not product UI.

## Users

- **CTOs and tech leads** at companies that need a senior Angular/TypeScript expert. They decide in under a minute whether to keep reading: they look for evidence of judgement (architecture, performance, results) more than for a list of technologies.
- **Technical recruiters.** They scan for stack, seniority, availability and a CV, often on a phone, often in a hurry.
- **High-end freelance clients.** They need to trust a person they haven't met: clear services, real outcomes, an easy way to get in touch.
- **Developers** (secondary), arriving through a technical post. They stay for the writing and may come back.

Every audience reads the site in Catalan, Spanish or English, in light or dark mode.

## Product purpose

Win well-paid freelance work for Carlos Matheu (Plastikaweb), a senior freelance Angular/TypeScript developer based in Barcelona, and position him as a technical reference through case studies and the blog.

Success: a qualified message through the contact form; a visitor who reads a case study to the end; a developer who subscribes to the technical feed.

The site is its own first case study. If it is slow, inaccessible or generic, no claim on it is believed.

## Brand personality

Precise, bold, human.

- **Precise:** an engineer's site. Structure is visible, nothing is ornamental by accident, details are finished in both themes and at every width.
- **Bold:** strong display type (Space Grotesk), one loud red, a yellow highlight, sharp corners. Confident, not loud everywhere: the boldness is spent on a few moments per page.
- **Human:** a real person in first person, with opinions, interests and a personal section, not an agency pretending to be a team.

## Voice

- First person, direct, relaxed but exact. Short sentences.
- Numbers and outcomes over adjectives ("LCP from 4.1 s to 1.8 s", not "blazing fast").
- No buzzwords ("passionate", "rockstar", "cutting-edge", "synergy"), no false modesty, no exclamation marks.
- Each locale is written natively, not translated word by word. Catalan and Spanish run longer; layouts must take it.

## Anti-references

- **The generic developer portfolio template:** dark navy, mint accent, thin small-caps nav, the look of a well-known portfolio and its clones. Recognisable at a glance to the audience we want to impress. A sticky identity column is allowed as a layout mechanism only if nothing else about it echoes that template.
- **Agency gloss:** stock photos, 3D blobs, gradients on everything, logo walls, vanity hero metrics.
- **Terminal cosplay:** fake shell prompts and typing animations standing in for content.
- **Showreel motion:** scroll-jacking, parallax, animations that delay reading or ignore reduced motion.
- **Friendly-startup softness:** pills, capsules, rounded cards, pastel everything.
- **The AI-generated look:** purple gradients by default, emoji bullet points, interchangeable sections that could belong to anyone.

## Design principles

1. **Proof over claims.** Every claim points to a case study, a result or a post. The site's own performance and accessibility are part of the proof.
2. **Tokens always.** Every visual value comes from `src/styles/theme.css`; one red, three typefaces, sharp corners.
3. **Content first.** HTML and CSS carry the experience; JavaScript only where interaction needs it. Nothing important depends on a script or an animation.
4. **Spend the boldness.** Giant type, the red and the yellow highlight are reserved for a few moments per page so they keep their force.
5. **Designed for the longest language.** Layouts are tested with Catalan copy; no fixed widths on anything that holds text.
6. **Two first-class themes.** Light and dark are designed together; neither is a filter over the other.
7. **The person stays off the conversion path.** The personal section and Thoughts posts show who Carlos is without diluting the path from landing to contact.

## Accessibility and inclusion

WCAG 2.2 AA as the floor (4.5:1 text, 3:1 large text and UI boundaries), visible focus everywhere, full keyboard support, `prefers-reduced-motion` respected, every control labelled, every accessible name translated into the three languages.
