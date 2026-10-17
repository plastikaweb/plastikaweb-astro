# Claude Design prompt

Prompts used to design the Plastikaweb interface in Claude Design. Source: `docs/requirements.md`; if they disagree, the requirements win and this file gets updated.

Prompts 1 and 2 designed every page before any was coded (TASKS.md T-02, done). They are kept as history and describe the requirements of that moment (four menu items, a personal section and two CTA options on the home page), so don't run them again as written. How they were used:

1. Start a Claude Design project and attach `PRODUCT.md`, `src/styles/theme.css` and `docs/requirements.md`.
2. Paste **Prompt 1**. It asks for the home page in two layout directions.
3. Pick a direction (or a mix), then paste **Prompt 2** with the choice filled in.
4. Record the decisions that come out of it in `docs/requirements.md` (§4, §6, §12).

Later revisions get their own self-contained prompt, numbered from **Prompt 3** (home page, October 2026 review, T-67). Each one carries its decisions in full, so it works even before they reach `main`.

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
Revise the home page, Home v3.dc.html, after my review. Only the home page and the site header change now. The header change (menu items and contact link) applies to every page: update the header on the other pages too, and nothing else on them; I'll revise them one at a time later. The footer, buttons and section headings keep their current design. Don't spend effort on the review canvas. Same brand system, tokens and components. Where this prompt and the attached requirements disagree, this prompt wins: it carries decisions that may not be on main yet.

Save the result as Home v4.dc.html (keep v3).

Copy rule for every string below: use the typographic apostrophe ’, never the straight one (d’abril, I’ve, Let’s).

## Header (every page)

- Main menu: Feina · Blog · Sobre mi (es: Proyectos · Blog · Sobre mí; en: Work · Blog · About). "Personal" leaves the menu. Below the wide breakpoint the three links stay in the second header row, spread across the width.
- The header contact link stays an <a> styled as a button, going to the contact form (/[lang]/about#contacte for now), and stays wide-screen only, as in v3. Change its style to the secondary (outlined) button, so the hero CTA is the only filled primary on the home page. Labels: ca "Parlem →" · es "Hablemos →" · en "Let’s talk →".

## Hero

Remove:
- the first line of the meta block next to the portrait ("Carlos Matheu · Barcelona"): the H1 says it. Availability and the GitHub and LinkedIn links stay beside the portrait;
- the proof strip (13 / 100 / −52%);
- the secondary CTA "Veure la feina" and the `cta` tweak: there is one CTA now.

New H1 and lead. Space Grotesk H1 as now, with "Angular" in a <mark> with the yellow highlight. Write "Angular" in normal case in the markup and show it in capitals with text-transform on the <mark>. On wide screens the H1 sets in three lines: name, role, city (break after "Matheu." and before "a Barcelona." / "en Barcelona." / "in Barcelona."); on small screens let it wrap naturally.

ca  H1: Carlos Matheu. Front-end amb Angular, a Barcelona.
    Lead: Escric codi des de fa gairebé vint anys. Treballo com a freelance i faig aplicacions ràpides, accessibles i fàcils de mantenir.
es  H1: Carlos Matheu. Front-end con Angular, en Barcelona.
    Lead: Llevo casi veinte años escribiendo código. Trabajo como freelance y hago aplicaciones rápidas, accesibles y fáciles de mantener.
en  H1: Carlos Matheu. Angular front-end developer in Barcelona.
    Lead: I’ve been writing code for almost twenty years. I work freelance, building apps that are fast, accessible and easy to maintain.

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

Replace the "now" line with an optional block: up to three lines, each a verb from a fixed list followed by free text, read as one phrase with no colon between them, and the month it was last updated. Show it at every width (v3 hid it under 900 px). When there are no lines the block isn't rendered at all, and the hero must still look complete without it. No embeds, players or live widgets.

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

After the three services, one link to About, in the "see all" link style: "Més sobre com treballo →" (es "Más sobre cómo trabajo →", en "More about how I work →").

## 02 / feina

Two cards, not three, and sober: no giant metric and no diagram panel. Each card: title (the link), year, client type, role, technology chips and a one-line summary. A client's name only appears with their permission, so placeholders use a client type. Make this a sober variant of CaseCard and keep the existing CaseCard and the three diagram components in the project, since the work and case-study pages use them; only take them off the home page.

Placeholders (mark them):
1. "D’AngularJS a Angular amb NgRx, mòdul a mòdul" · 2024 · Empresa de logística · Arquitecte front-end · Angular, NgRx, TypeScript · one line.
2. "Una biblioteca de components per a sis equips de producte" · 2023 · Plataforma SaaS B2B · Desenvolupador front-end sènior · Angular, TypeScript · one line.

Lay out the metadata however reads best (a mono line or a <dl>), but each value must make sense on its own to a screen reader. "Veure tota la feina →" stays.

## 03 / blog

Unchanged.

## Personal

Remove the "04 / personal" section and its topic cards from the home page. Keep the TopicCard component in the project for later.

## 04 / contacte (was 05)

Keep the brand-surface block, its H2 and the line under it, and one link to the contact form, an <a> styled as a button: ca "Escriu-me →" · es "Escríbeme →" · en "Get in touch →". Remove the email address, the mailto link and the copy button with its status message. Keep the white focus ring on the brand surface.

## What I want back

- Home v4.dc.html in light and dark, at 375 and 1440 px, with Catalan copy.
- Tweaks: the four availability states, and 0 / 1 / 3 "now" lines.
- The header updated on every page, and nothing else changed on the other pages.
- Design-system components updated to match: SiteHeader, Hero, Availability and ContactBlock, plus the sober CaseCard variant.
- Both handoff READMEs updated. design_handoff/README.md: the shared shell (menu, header contact link), the Home sheet (no "ara →" line, no proof strip, no copy button, the new H1 and lead), the sample content and the hero CTA decision (one CTA). design_handoff_home/README.md: remove what's gone; document the availability component (four states: shapes, tokens, motion, the data rules above), the "now" block, the sober work card and the renumbered section headings; list any new or changed token.
- At the end: anything in this prompt that was hard to satisfy, and anything you changed that I didn't ask for.
```
