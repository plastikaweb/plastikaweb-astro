# Claude Design prompt

Prompts used to design the Plastikaweb interface in Claude Design. Source: `docs/requirements.md`; if they disagree, the requirements win and this file gets updated.

Prompts 1 and 2 designed every page before any was coded (TASKS.md T-02, done). They are kept as history and describe the requirements of that moment (four menu items, a personal section and two CTA options on the home page), so don't run them again as written. How they were used:

1. Start a Claude Design project and attach `PRODUCT.md`, `src/styles/theme.css` and `docs/requirements.md`.
2. Paste **Prompt 1**. It asks for the home page in two layout directions.
3. Pick a direction (or a mix), then paste **Prompt 2** with the choice filled in.
4. Record the decisions that come out of it in `docs/requirements.md` (§4, §6, §12).

Later revisions get their own prompt, numbered from **Prompt 3**. Prompts 3 to 5 revised the home page in October 2026 (T-67, done): Prompt 3 is self-contained and carries its decisions in full, so it works even before they reach `main`; Prompts 4 and 5 are follow-ups that only make sense on top of Claude Design's previous result. Their decisions are now in `docs/requirements.md`, which wins where they differ.

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

---

## Prompt 3 — home page revision (October 2026 review)

Task T-67. Paste it into the existing project ("Plastikaweb home directions"), on top of `Home v3.dc.html`. It is self-contained on purpose: the decisions it carries are in `docs/requirements.md` (§5, §6, §6.2, §7, D-13, D-15), but Claude Design reads the repository from `main`, and they may not be there yet when it runs.

```text
Revise the home page, Home v3.dc.html, after my review. Only the home page and the site header change now. The header change (menu items and contact link) applies to every current page: update the header on About, Blog, Work, Personal, 404 and Privacy too, and nothing else on them; I'll revise them one at a time later. Exception: the Availability component also appears in About's facts list; update it there through the shared component (same states, icons and pulse rule). The header and that component are the only changes to other pages. Leave the older home files (Home v3, Home v2, Home A, Home B, Plastikaweb Home) untouched. The footer, the section headings and the button styles keep their current design; the header contact link only switches to the existing secondary style. Don't spend effort on the review canvas. Same brand system, tokens and components. Where this prompt and the attached requirements disagree, this prompt wins: it carries decisions that may not be on main yet.

Save the result as Home v4.dc.html (keep v3).

Copy rule for every string below: use the typographic apostrophe ’, never the straight one (d’abril, I’ve, Let’s).

A → after a link or button label below stands for the aria-hidden arrow icon that Button and TextLink already draw, never a typed character: the visible text and the accessible name are the label without it ("Parlem", "Escriu-me").

## Header (every page)

- Main menu: Feina · Blog · Sobre mi (es: Proyectos · Blog · Sobre mí; en: Work · Blog · About). "Personal" leaves the menu. Below the wide breakpoint the three links stay in the second header row, spread across the width.
- The header contact link stays an <a> styled as a button, going to the contact form (/[lang]/about#contacte for now), and stays wide-screen only, as in v3. Change its style to the secondary (outlined) button, so the hero CTA is the only filled primary on the home page. Labels: ca "Parlem →" · es "Hablemos →" · en "Let’s talk →".

## Hero

Remove:
- the first line of the meta block next to the portrait ("Carlos Matheu · Barcelona"): the H1 says it. Availability and the GitHub and LinkedIn links stay beside the portrait;
- the proof strip (13 / 100 / −52%);
- the secondary CTA "Veure la feina" and the `cta` tweak: there is one CTA now.

New H1 and lead. Space Grotesk H1, with "Angular" in a <mark> with the yellow highlight. Write "Angular" in normal case in the markup and show it in capitals with text-transform on the <mark>. From the wide breakpoint (56.25rem) up, the H1 sets in exactly three lines: name, role, city (break after "Matheu." and before "a Barcelona." / "en Barcelona." / "in Barcelona."). The role line is longer than in v3, and the English one, "Angular front-end developer", is the longest: check all three locales at 900 and 1440 px even though the mock is in Catalan, reduce the H1 size where needed and tell me the size you chose. If three lines can't fit beside the portrait at 900 px without going below the small-screen H1 size, say so and propose a layout; don't let it wrap silently. Below the wide breakpoint, let it wrap naturally.

ca  H1: Carlos Matheu. Front-end amb Angular, a Barcelona.
    Lead: Escric codi des de fa gairebé vint anys. Treballo com a freelance i faig aplicacions ràpides, accessibles i fàcils de mantenir.
es  H1: Carlos Matheu. Front-end con Angular, en Barcelona.
    Lead: Llevo casi veinte años escribiendo código. Trabajo como freelance y hago aplicaciones rápidas, accesibles y fáciles de mantener.
en  H1: Carlos Matheu. Angular front-end developer in Barcelona.
    Lead: I’ve been writing code for almost twenty years. I work freelance, building apps that are fast, accessible and easy to maintain.

Add no other hero copy. Keep senior/sènior/sénior, Spain/Espanya/España, TypeScript, consultant/consultor and "desarrollador" out of the hero: the page title and meta description carry them.

One CTA, filled on the brand surface, to the contact form: "Parlem del teu projecte →" (es "Hablemos de tu proyecto →", en "Let’s talk about your project →").

Keep the portrait.

### Availability: four states

Replace the single availability line with a component that has four states, and add a tweak to switch between them. Each state has its own icon SHAPE, not only its own color, so it reads without color (WCAG 1.4.1). The text carries the meaning; the icon is aria-hidden.

- Available now. Filled square, with the pulse. ca "Disponible ara" · es "Disponible ahora" · en "Available now"
- From a month. Outlined square. ca "Disponible a partir de gener de 2027" · es "Disponible a partir de enero de 2027" · en "Available from January 2027"
- Part-time. Half-filled square. ca "Disponible unes 10 hores a la setmana" · es "Disponible unas 10 horas a la semana" · en "Available for about 10 hours a week"
- Fully booked. Square crossed by a diagonal stroke, no pulse. ca "Agenda plena. Escriu-me de totes maneres" · es "Agenda completa. Escríbeme de todos modos" · en "Fully booked. Get in touch anyway"

Rules:
- The month and the hours are data from site settings, not fixed copy. A "from" month that has already started renders as "available now". In Catalan, "de" elides before a vowel: "a partir d’abril de 2027", "d’agost", "d’octubre"; the year always takes "de".
- Every icon reaches 3:1 against its background in both themes. --color-success (green-400) is about 1.6:1 on the light background, so in light use a darker step (for example the green of --color-success-text). "Fully booked" is never green. Make the icon large enough that the four shapes are told apart at a glance (v3's 0.55rem dot is too small for that). Say which tokens each state uses.
- The pulse is decorative, only for "available now", only inside prefers-reduced-motion: no-preference, and it stops on its own within 5 seconds (WCAG 2.2.2), for example two 1.8 s cycles.

### "Now" block (optional)

Replace the "now" line with an optional block: up to three lines, each a verb from a fixed list followed by free text, read as one phrase with no colon between them, and the month it was last updated. Show it at every width (v3 hid it under 900 px). When there are no lines the block isn't rendered at all, and the hero must still look complete without it. No embeds, players or live widgets. At 375 × 812 the hero CTA must stay above the fold in all four availability states (the longest is "Agenda plena. Escriu-me de totes maneres").

Markup: one copy only, after the CTA in source order; on wide screens place it with grid areas if it reads better elsewhere, never with a second copy. A <ul> named by its label through aria-labelledby; the label isn't a heading; the updated month is a <time datetime="2026-10">.

- Label: ca "Ara" · es "Ahora" · en "Now"
- Verbs: ca treballant en / llegint / estudiant / escoltant · es trabajando en / leyendo / estudiando / escuchando · en working on / reading / studying / listening to
- Updated: ca "Actualitzat: octubre de 2026" · es "Actualizado: octubre de 2026" · en "Updated: October 2026"
- Placeholder lines (mark them as placeholder): treballant en una biblioteca de components amb signals · llegint [títol d’un llibre] · escoltant [un disc]

Add a tweak for 0, 1 and 3 lines.

## 01 / serveis

Keep the three services and their copy, except Performance, which must not claim measured field data:
- ca "Auditories amb Lighthouse i Core Web Vitals, i correccions concretes: imatges, fonts i el JavaScript que sobra."
- es "Auditorías con Lighthouse y Core Web Vitals, y correcciones concretas: imágenes, fuentes y el JavaScript que sobra."
- en "Lighthouse and Core Web Vitals audits, then concrete fixes: images, fonts and the JavaScript you don’t need."

Below the three services (not in the section heading's "see all" slot: Services has none), one TextLink to About: "Més sobre com treballo →" (es "Más sobre cómo trabajo →", en "More about how I work →").

## 02 / feina

Two cards, not three, and sober: no giant metric and no diagram panel. Each card: title (the link), year, client type, role, technology chips and a one-sentence summary (it wraps freely; never clamp or truncate it). A client's name only appears with their permission, so placeholders use a client type; in the sober card the client type replaces the "client confidencial" label, don't show both. Make this a sober variant of CaseCard and keep the existing CaseCard and CaseDiagram (types bars, migration and pipeline) in the project, since the work and case-study pages use them; only take them off the home page.

Placeholders (mark them):
1. "D’AngularJS a Angular amb NgRx, mòdul a mòdul" · 2024 · Empresa de logística · Arquitecte front-end · Angular, NgRx, TypeScript · "Migració híbrida en 14 mesos: estat centralitzat amb NgRx, proves de regressió visual i cap congelació de funcionalitats."
2. "Una biblioteca de components per a sis equips de producte" · 2023 · Plataforma SaaS B2B · Desenvolupador front-end sènior · Angular, TypeScript · "Sistema de disseny en Angular amb tokens, documentació viva i proves d’accessibilitat automatitzades a cada pull request."

Lay out the metadata however reads best (a mono line or a <dl>), but each value must make sense on its own to a screen reader. Labels (as <dt> or visually hidden text): ca Any · Client · Rol · Tecnologies; es Año · Cliente · Rol · Tecnologías; en Year · Client · Role · Technologies. "Veure tota la feina →" stays.

## 03 / blog

Unchanged.

## Personal

Remove the "04 / personal" section and its topic cards from the home page. Keep the TopicCard component in the project for later.

## 04 / contacte (was 05)

Keep the brand-surface block, its H2 and the line under it, and one link to the contact form, an <a> styled as a button: ca "Escriu-me →" · es "Escríbeme →" · en "Get in touch →". Remove the email address, the mailto link and the copy button with its status message. Keep the white focus ring on the brand surface.

Keep the ProofStats and CopyButton components in the project: the case-study KPI strip (Work) and the blog code-block copy button use them. Only take them off the home page.

## What I want back

- Home v4.dc.html in light and dark, at 375 and 1440 px, with Catalan copy. Don't add a language switch to the mock. Put the es and en strings from this prompt in the READMEs, and mark the es and en H1 and lead as drafts pending my review.
- Tweaks: the four availability states, and 0 / 1 / 3 "now" lines.
- The header updated on every current page, plus the Availability component on About, and nothing else changed on the other pages.
- Design-system components updated to match, both code and usage docs (.prompt.md, .d.ts): SiteHeader (three links in the example), Hero (no stats, no secondary CTA, the "now" block at every width), Availability (four states), ContactBlock (default eyebrow "04 / contacte"; the example has only the "Escriu-me →" link, no mailto or CopyButton), plus the sober CaseCard variant.
- Both handoff READMEs updated. design_handoff/README.md: the shared shell (menu, header contact link), the Home sheet (no "ara →" line, no proof strip, no copy button, the new H1 and lead), the sample content and the hero CTA decision (one CTA). design_handoff_home/README.md still holds the hero and motion spec, so rewrite every part this prompt changes; don't only delete. Page structure: hero → 01 serveis → 02 feina → 03 blog → 04 contacte. Header: three-link menu; contact link as the outlined secondary button. Hero: no name line in the meta, the new H1 and lead, one CTA, the "now" block at every width; drop the secondary CTA, the proof strip and its motion row. Also the Performance copy, the sober work card and the contact block (04 / contacte, no mailto, no copy button, no copy-email state). In the open decisions, close D-13 (one CTA) and drop "confirm the proof numbers". Then document the availability component (four states: shapes, tokens, motion, the data rules above) and list any new or changed token.
- In both handoff READMEs and readme.md, name Home v4.dc.html as the current home design (headings, file lists, how to view it, tweak list) and Home v3 as the previous iteration, kept for comparison.
- At the end: anything in this prompt that was hard to satisfy, and anything you changed that I didn't ask for.
```

---

## Prompt 4 — home page, second round (portrait, H1 at 320 px, "see all")

Task T-67. Pasted on top of `Home v4.dc.html` after the review of Prompt 3's result. It asked for two portrait layouts to choose between, the H1 fit at 320 px, the "see all" links at the end of their sections and the design-system docs that still described v3. Not self-contained: it only makes sense on top of that result.

```text
Revise Home v4.dc.html after my review of it. Update it in place (don't create Home v5). Only the home page, the components it uses and the design-system docs listed below change. Leave the older home files (Home v3, Home v2, Home A, Home B, Plastikaweb Home) and the other pages as they are. Don't spend effort on the review canvas. Same brand system, tokens and components. Where this prompt and the attached requirements disagree, this prompt wins.

Copy rule, as before: typographic apostrophe ’ only.

## Hero: a much smaller portrait

The portrait is too big. At 1440 px it is 320 × 427 px, taller than everything beside it (availability, links and H1 together are about 266 px), and it leaves an empty area above the availability line. Make it much smaller. I want to choose between two layouts by seeing them, so add a `portraitLayout` tweak with two options, default A. Below 56.25rem both options are the current narrow layout, unchanged.

A · Avatar. The narrow layout at every width: a small portrait (about 6.5–8rem wide) beside the availability and the GitHub and LinkedIn links, and the H1 below it at full width. The wide variant of the top grid goes away: one set of grid areas at every width ("pic meta" / "title title"). From 56.25rem the H1 still sets in exactly three lines.

B · Beside. The portrait stays left of the meta and the H1, but it is never taller than the text block beside it (availability, links and H1): its top aligns with the availability line and its bottom with the H1's last line. Start from v4's width at 900 px (104 px) and let it grow only while the three role lines fit; at 1440 px it should end up about 200 px wide. If the image needs a different crop to fill that height, use object-fit: cover; never distort it.

English H1, the same in both options (still a draft): "Carlos Matheu. Angular front-end developer in Barcelona." Lines on wide screens: "Carlos Matheu." / "Angular front-end developer" / "in Barcelona."

My measurements (Space Grotesk 700, −0.035em, <mark> padding included, at 48.8 px): ca "Front-end amb ANGULAR," 561 px, es "Front-end con ANGULAR," 548 px, en "ANGULAR front-end developer" 666 px. In A the title column at 900 px is about 810 px. In B it depends on the portrait width: with v4's 104 px it is 679 px, 13 px to spare for English, so at 900 px the portrait can't be much wider than about 116 px. If a portrait that narrow and that tall looks wrong, don't shrink the H1 silently: tell me what B needs at 900 px (a narrower crop, a smaller H1 or something else).

- Keep --step-hero (still proposed) unless a layout calls for a change. In A the H1 has room to grow on wide screens: if you think it should, propose the sizes and say why.
- For each option, put a fit table in design_handoff_home/README.md: ca, es and en at 320, 900, 1100, 1280 and 1440 px, with the portrait width and the spare space at each width. Add the hero height at 1440 × 900 and how far down the CTA sits.
- Say which element is the LCP candidate in each option. Preload the portrait only if it can still be the largest element.
- Remove the paragraph that explains the 104 px portrait. Describe both options as proposed until I choose one.

## Hero: the H1 at 320 px

Requirements §2: every viewport from 320 px, no horizontal scroll. Below 56.25rem the H1 stays at the 48.8 px floor and the column at 320 px is 280 px (gutter 20 px each side). The city line is held together with a no-break space, and in Spanish "en Barcelona." is 300 px wide: it overflows by 20 px. English "in Barcelona." overflows by 5 px. Catalan "a Barcelona." (272 px) fits.

Fix it so that no H1 unit overflows at 320 px in any locale. For example, below 56.25rem cap the size against the hero container (`min(var(--step-hero), 14cqi)` gives 44.8 px at 320 px), or drop the no-break space below 56.25rem. Choose one, say which and why, and add the 320 px widths to both fit tables. The fix is the same in both portrait options and changes nothing from 56.25rem up.

## "See all" links at the end of their sections

In 02 / feina and 03 / blog, move "Veure tota la feina →" and "Veure tots els articles →" from the section heading to the end of the section, after the cards or posts, the same way Services ends with "Més sobre com treballo →". Keep their labels and their TextLink style.

- One link per section, last in source order. Don't reorder it with CSS (order, grid placement): the reading and tab order must match what is seen.
- Remove the "see all" slot from SectionHeading. If any other page still uses it, keep it there and tell me which page; don't change that page now.
- Update the docs that describe the slot: SectionHeading .d.ts and .prompt.md, both handoff READMEs.

## Smaller fixes on the home page

- Placeholders: make the `ph` tweak default to on, so a screenshot alone shows which content is sample data.
- Part-time availability with 1 hour: add the singular, ca "Disponible una hora a la setmana" · es "Disponible una hora a la semana" · en "Available for one hour a week". In design_handoff_home/README.md the hours rule becomes "integer, 1 or more; 1 uses the singular" (drop "integer ≥ 2": no requirement says it).
- The mock must match its own component CSS: move the hero entrance animations from inline styles into rules inside @media (prefers-reduced-motion: no-preference), as sections.css already does, and drive the three-line layout from the 56.25rem container query instead of the JavaScript width check.
- Pulse: its length now depends on --duration-slowest, a shared token. Give it its own proposed token (for example --duration-pulse: 1.8s, two cycles) and state in the Availability docs that the total must stay under 5 seconds.

## Design-system docs that still describe v3

Update them; they are what a builder reads.

- D-15 is still open, with three options in the requirements: keep the Personal page at /[lang]/personal, reachable from About; merge it into About; or leave it out of v1. design_handoff/README.md (line 320) and DS 05 (line 122) narrow it to "cut or redirect". Restate it with the three options and keep the factual note that About and the 404 link to /ca/personal. Don't choose.
- DS 05 Decisions: the settled list still has a four-link menu with Personal, the personal section on the Home and the "ara →" line. Rewrite it for v4: three-link menu plus language, theme and, from 56.25rem, the outlined contact link; five home sections (hero, serveis, feina, blog, contacte); the "now" block instead of "ara →".
- DS 05 shows D-09 to D-12 and D-14 as open. They are decided: D-09 "Personal" at /[lang]/personal; D-10 Enginyeria / Pensaments; D-11 no fallback; D-12 note vs. Thoughts post; D-14 Playwright + axe, Renovate, Better Stack. Remove the "Close D-09 to D-12" and "Run Prompt 2" next steps, and the same line in design_handoff_home/README.md (line 320).
- "Where" labels: DS 04b puts ProofStats on the hero and TopicCard in "home personal"; DS 04 puts CopyButton in the contact block. Change them to: ProofStats, Work KPI strip (not on the Home since v4); CopyButton, blog code blocks; TopicCard, Personal page only (D-15 open). Make the same change in ProofStats.d.ts, ProofStats.prompt.md, CopyButton.d.ts and CopyButton.prompt.md; CopyButton's example becomes a code block, with no email or mailto.
- Add --step-hero (and the pulse token) to the token lists in DS 05 and readme.md; update the tokens/extensions.css header from v2 to v4.
- CaseCard: mark ctaLabel and tagsLabel as feature-only in the .d.ts, or move them into labels so both variants read one source.
- cards.card.html: use the v4 Performance copy (no field-data claim).
- navigation.card.html: add a wide instance (900 px or more) so the outlined contact link shows.
- DS 04c: the contact lead must match Home v4 ("…48 hores, en català, castellà o anglès.").
- ui_kits/website: mark it as deprecated (v2) in its card and in readme.md; don't rebuild it.
- readme.md: Astro 7, not Astro 6.
- Work card 2: make the slug match the title (biblioteca-components).

## What I want back

- Home v4.dc.html updated, light and dark, at 375 and 1440 px, Catalan copy, tweaks as before plus `portraitLayout` (A and B).
- The two fit tables (one per option) with ca, es and en at 320, 900, 1100, 1280 and 1440 px.
- Every file you changed, in one list.
- At the end: anything hard to satisfy, and anything you changed that I didn't ask for, marked as proposed.
```

---

## Prompt 5 — home page, last round (portrait layout, LCP, motion)

Task T-67. Pasted on top of Prompt 4's result. It records the owner's choice of the portrait beside the meta and the H1 (layout B), corrects the LCP candidates (the lead, not the portrait) and stops the lead from fading in. Its export (17 October 2026) is the final home design; the decisions are in `docs/requirements.md` §4.4 and §6.2.

```text
Revise Home v4.dc.html after my review of your Prompt 4 changes. Update it in place (don't create Home v5). Change only the files named below. Leave the older home files, the other pages and the review canvas as they are. Don't fix anything this prompt doesn't list, even if you notice it: I've logged the remaining design-system leftovers for later. Where this prompt and the attached requirements disagree, this prompt wins.

Copy rule, as before: typographic apostrophe ’ only.

The copies under design_handoff_home/ (components/, the DS pages, Home v4.dc.html, styles.css, tokens/) are identical to the root files today. Keep them identical. Line numbers below refer to the files as they are now.

## Portrait: B · Beside is the layout

I choose B, from the 56.25rem breakpoint as you built it. At 900 px the portrait is the 104 × 218 strip and it fills out to about 3:4 at 1440: I accept that as the gesture. A is dropped.

- Remove A from the mock and the components: the `portraitLayout` tweak and the mock's `data-layout` hook, the Hero prop `portraitLayout` and the `.pw-hero--beside` modifier. B's rules become the hero's own wide layout inside the 56.25rem container query. Below 56.25rem nothing changes.
- In the docs, describe one layout and stop calling it proposed (the portrait widths stay component values, not tokens). Remove A and the text that only served the choice:
  - design_handoff_home/README.md: the tweak list (line 22), "Changes in v4" item 3 (36), Top grid (72), the layouts section (91–99: one layout; replace "What B needs at 900 px" with one sentence saying the strip at 900 px is accepted), A's fit table (107–115) and the "Option B · Beside" heading over the other one (117), "Both options…" (127), "H1 size in A" (133), Files (334), Open decisions (345: the layout is decided). Also drop the option wording at 82 ("Same in both portrait options"), 89 ("Unchanged by the portrait options") and 105 ("in B,").
  - design_handoff/README.md (lines 54 and 67), readme.md (12), DS 04c (46), DS 05 (168: keep the D-15 step), the sections.css header comment and A's rule, Hero.jsx, Hero.d.ts, Hero.prompt.md, and the --step-hero comment in tokens/extensions.css (line 27: the comment only; the token stays).
  - In the files named here, remove any other mention of two portrait layouts or options.
- Portrait.d.ts (line 1), the Portrait card in DS 04b (line 118) and the imagery line in readme.md (65) say the crop is always 3:4. Say instead: 3:4 everywhere except the Home hero from 56.25rem, where the crop follows the height of the text beside it (about 1:2 at 900 px, 3:4 at 1440), object-fit: cover, object-position 50% 30% (one clause is enough in readme.md). The About page keeps 3:4 at every width. In Portrait.d.ts also replace the outdated hero width: clamp(5.5rem, 2rem + 10cqi, 6.5rem) below 56.25rem, clamp(6.5rem, 17.78cqi - 3.5rem, 12.5rem) from it.
- Hero height at 1440 × 900 (README line 129): keep only B's figures, and add that they are with `ph` off (the sample banner sits above the header and pushes the hero down about 30 px).
- The tight cell stays: 13 px to spare for the English role line at 900 px. Keep the CI check in the build notes and add this fallback: if the English role line doesn't fit at 900 px with the production font, make the portrait narrower at the breakpoint with a steeper slope, clamp(6rem, 19.26cqi - 4.83rem, 12.5rem): 96 px at 900, about 135 at 1100, 200 at 1440. Lowering only the floor changes nothing at 900. That raises the spare to about 20 px, enough for a production font up to about 3% wider. Never a smaller H1 at the breakpoint and never a fourth line.

## LCP: the lead, not the portrait

Your LCP paragraph (README line 131) compares the portrait with the H1's role line only and leaves out the lead. I measured all three in the browser: Space Grotesk and Bricolage Grotesque from Google Fonts, the union of each text's client rects, in px². From 56.25rem each H1 line is display: block, so each line is its own candidate; below it the whole H1 is one.

| Width | H1 role line ca / es / en | Lead ca / es / en | Portrait |
| --- | --- | --- | --- |
| 375 | whole H1: 62k / 62k / 77k | about 35k | small |
| 900 | 35k / 34k / 41k | 55k / 59k / 58k | 23k |
| 1100 | 44k / 43k / 53k | 58k / 61k / 60k | 34k |
| 1280 | 55k / 53k / 65k | 63k / 59k / 63k | 45k |
| 1440 | 64k / 63k / 76k | 64k / 65k / 63k | 55k |

The portrait is never the largest element, so it gets no preload and no fetchpriority="high". The LCP element is the whole H1 below 56.25rem (measured at 375 px), the lead at 900–1100 px, and the lead or the role line from 1280 px. Use these numbers; don't re-measure.

- Rewrite README line 131 with this.
- Remove the portrait preload from the Portrait bullet (README line 73), Hero.d.ts (line 11) and Portrait.prompt.md (line 5). The portrait keeps explicit dimensions and AVIF/WebP with srcset.

## Motion: the lead renders from the first frame

The lead row (lead and CTA) fades up from opacity 0 after 650 ms, over 800 ms: sections.css line 47, the mock's [data-hero-row] rule, README line 271. On wide screens the lead is the LCP element, so this delays LCP by up to about 1.5 s.

- Don't animate the lead. Keep the same fade-up on the CTA alone and on the "now" block. The meta, the highlight and the red block stay as they are.
- The rule becomes: the H1 and the lead render from the first frame (LCP candidates); the portrait is static too. Say it that way in README line 45, the motion table (lines 271 and 275: "H1, lead and portrait | not animated"), readme.md line 71, design_handoff/README.md line 267, Hero.d.ts lines 10–11 and Hero.prompt.md line 13.
- Requirements §4.4 still says "the H1 and the portrait (LCP candidates)". I'll fix it in the repo; follow this prompt meanwhile.

## What I want back

- Home v4.dc.html updated in place, without the portraitLayout tweak.
- Every file you changed, in one list.
- At the end: anything hard to satisfy, and anything you changed that I didn't ask for, marked as proposed.
```
