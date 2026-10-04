# Claude Design prompt

Brief for designing the Plastikaweb interface in Claude Design before any page is coded (TASKS.md T-02). Source: `docs/requirements.md`; if they disagree, the requirements win and this file gets updated.

How to use it:

1. Start a Claude Design project and attach `PRODUCT.md`, `src/styles/theme.css` and `docs/requirements.md`.
2. Paste **Prompt 1**. It asks for the home page in two layout directions.
3. Pick a direction (or a mix), then paste **Prompt 2** with the choice filled in.
4. Record the decisions that come out of it in `docs/requirements.md` (§4, §6, §12).

---

## Prompt 1 — home page, two directions

```text
You're designing the personal site of Carlos Matheu (brand: Plastikaweb), a senior freelance Angular/TypeScript developer based in Barcelona. The site wins freelance clients and positions him as a technical reference. Audience: CTOs, technical recruiters and high-end freelance clients; secondary, developers arriving through the blog. The site itself must prove front-end craft, so the design has to be buildable with semantic HTML and plain modern CSS, accessible (WCAG 2.2 AA) and fast (Lighthouse 100).

Attached: PRODUCT.md (the product brief), theme.css (the design tokens — use them, don't invent values) and requirements.md (the full spec).

## Brand system (fixed — don't change)

Colors (Palette 7):
- Primary red #FF0008 (red-600): accents, borders, icons and LARGE display text only. Never behind normal-size text.
- Brand surface red #D70007 (red-700), hover #B10308 (red-800): filled buttons and brand blocks, with white text.
- Links: red-700 #D70007 in light, red-400 #FF575C in dark.
- Secondary Broom yellow #FFF42D: highlights (e.g. the word "ANGULAR" in the hero), text selection. Text on it is near-black #06070F.
- Tertiary Electric Violet #6032F8 (light) / #7053FF (dark): focus rings, decorative accents, a red → violet text gradient used sparingly.
- Neutrals: Raven scale. Light theme background #F9FAFB, surfaces white; dark theme background #06070F, secondary #151823, surfaces #232933.
- One red only. No other reds, no extra hues.

Type:
- Space Grotesk (display): hero H1 and giant case-study numbers only.
- Bricolage Grotesque (variable): everything else — headings, body, navigation, buttons.
- Commit Mono: tags, dates, metadata, code, keyboard hints, form placeholders.
- Fluid type scale (--step--2 … --step-6, body 16→20 px).

Shape and surfaces:
- Sharp corners everywhere. No pills, no capsules, no rounded cards.
- Theme-aware glass surfaces are available (.glass, .glass--strong); use them where they add depth, not everywhere.
- Shadows and borders must stay visible in both themes.

Themes: design every screen in BOTH light and dark. Both are first-class.

## Constraints that shape layout

- Three languages: Catalan, Spanish, English. Catalan and Spanish run up to 30% longer than English. Design with Catalan copy (or English padded by 30%) in buttons, nav, cards and hero. No fixed widths on anything containing text.
- Mobile first: show 375 px and 1440 px for every screen.
- Navigation on every page: Work, Blog, Personal, About + language selector (CA · ES · EN) + theme toggle. On small screens it needs a pattern that doesn't truncate labels.
- Minimal JavaScript: no carousels, no scroll-jacking, no effects that need JS to be readable. Motion is subtle and must have a reduced-motion equivalent.
- Visible focus states on every interactive element (violet focus ring).

## Home page content, in this order

1. Intro: name, role, one-line positioning, availability, social links (GitHub, LinkedIn), contact CTA. Highlight "ANGULAR" in yellow.
2. Services: three — Front-End Development, Angular Architecture, Performance. No "see all".
3. Selected work: 2–3 case studies, then a "see all" link to Work.
4. Latest posts: the three most recent technical posts (date, tags, reading time, excerpt), then "see all" to Blog.
5. Personal: 3–4 topic cards (e.g. Books, Films, Music, Philosophy), each linking to its section on the Personal page.
6. Closing contact block on the brand red surface.
"See all" is always a link to another page, never an in-place expansion.

## Inspiration — take the structure, not the look

- ramx.in: home as a summary, each section with a few items and a "see all" link; personal topics as compact cards. Leave its monochrome look and narrow column.
- psudokit.in: a relaxed first-person voice, short "what I'm doing now" lines, a subtle line-texture background. Leave the all-lowercase copy, the keyboard shortcut hints and the GitHub activity graph (out of v1).
- brittanychiang.com: on desktop, a sticky identity column (name, role, one line, section nav with an active indicator, socials) next to a scrolling content column; list rows with hover states and tech chips. Leave its navy palette and cursor spotlight.
Do not reproduce any of these sites' visual identity. The result must look like Plastikaweb: bold display type, the red/yellow/violet accents, sharp geometry.

## What I want now

Design the home page in two directions, both in light and dark, at 375 and 1440 px:

- Direction A — "Summary": single main column, bold Space Grotesk hero, sections stacked with generous fluid spacing, each ending in a "see all" link.
- Direction B — "Sticky identity": from desktop width up, the intro and nav live in a sticky left column with an active-section indicator; services, work, posts and personal scroll in the right column. On mobile it collapses to a single column. Warning: a sticky identity column next to a scrolling list is exactly what makes brittanychiang.com and its many clones recognisable, and PRODUCT.md lists that template as an anti-reference. Take only the mechanism. The column must read as Plastikaweb: Space Grotesk at display size, the red and yellow accents, sharp geometry, generous negative space; no dark navy, no mint or teal accent, no thin small-caps section nav, no cursor spotlight. If the result could pass for that site with the colors changed, push it further or say so.

For the hero CTAs, show two options within each direction: (1) a single primary "Contact" CTA, (2) primary "Contact" + secondary "See work". Label which is which.

Use realistic placeholder content: Angular case studies (e.g. migrating a large AngularJS app to Angular with NgRx, a performance overhaul that cut LCP in half, a design-system component library), technical post titles about Angular, RxJS and web performance. Mark placeholder text clearly; don't invent real client names.

After the designs, list: the components you created, any token you needed that isn't in theme.css (and why), and any place where a requirement was hard to satisfy.
```

---

## Prompt 2 — remaining pages

Fill in the chosen direction and hero option before pasting.

```text
Going with Direction [A/B], hero option [1/2]. [Any adjustments.]

Using the same brand system, constraints and components, design these pages in light and dark, at 375 and 1440 px:

1. Work listing: two-column grid of case studies, filterable by technology chips (Angular, TypeScript, RxJS, NgRx, Performance). Without JavaScript all cases show; the chips filter when JS is available. Expanded rows can show a larger image.
2. Case study: sections 01 Challenge, 02 Solution, 03 Stack, 04 Results, with giant Space Grotesk numbers. Visuals are diagrams (architecture, data flow, before/after metrics), never real screenshots.
3. Blog listing: all posts by date; each shows category (Engineering or Thoughts; in Catalan: Enginyeria, Pensaments), tags, date, reading time and excerpt. A prominent category filter plus tag links. Also show a tag page.
4. Blog post: 65ch measure, code blocks with syntax highlighting in Commit Mono, category, tags, reading time, share links (plain links, no third-party widgets). Show one Engineering post with code and one Thoughts post without.
5. Personal: ONE page, titled "Personal" in the menu (the page heading can have more voice), with entries grouped by topic (books, films, music, philosophy, psychology…, the list grows over time), in a manual topic order. Each topic has an anchor heading. An entry is a short note of about three lines: title, optional creator and year, optional external link, optional link to a related blog post. No cover images. Anything longer is a Thoughts blog post.
6. About + contact: bio, photo, CV download, GitHub and LinkedIn; the tech timeline (a Gantt chart from 2014 to today, three category rows, readable as a list for screen readers); the contact form — Name*, Company, Email*, Message*, GDPR consent checkbox* linking to the privacy policy — with inline validation errors and an inline success state (show all three states).
7. 404: branded, with navigation and links to the main sections.
8. Privacy policy: long-form legal text layout.

Reuse components across pages. At the end, list the full component inventory with their states (default, hover, focus, active, disabled, error where relevant).
```
