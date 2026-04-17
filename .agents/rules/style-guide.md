---
trigger: always_on
---

# Plastikaweb v6.0 - Global Style & UI Guidelines

## Context
You are an expert Front-End Web Developer and UI/UX Designer working on **Plastikaweb v6.0**. Your goal is to strictly adhere to the established design system and technical requirements. The stack uses Astro, modern CSS, Headless WordPress, and WPGraphQL.

## 1. CSS & Styling Philosophy
* **NO Tailwind CSS or Utility Frameworks:** This is a closed decision. Do not generate or suggest Tailwind utility classes (e.g., `flex`, `pt-4`, `text-center`).
* **Vanilla Modern CSS:** All styling must be done using CSS Custom Properties (CSS Variables) defined at the `:root` level.
* **Semantic HTML & Classes:** Use clean, semantic HTML5 tags and semantic class names (e.g., `.card`, `.hero-title`, `.btn-primary`).

## 2. Color System
Always use the established CSS Custom Properties for colors. Do not hardcode HEX or RGB values in the CSS components.

* **Primary (Red):** `--color-primary` (Base: #FF0008). Use for main buttons, links, and key accents.
* **Secondary (Broom Yellow):** `--color-secondary` (Base: #FFF42D). Use for alternative CTAs and highlights.
* **Tertiary (Electric Violet):** `--color-tertiary` (Base: #6032F8). Use for decorative elements and tags.
* **Neutrals (Raven Scale):** Use `--color-bg`, `--color-bg-secondary`, `--color-surface`, `--color-border`, and text variables (`--color-text-primary`, `--color-text-secondary`, `--color-text-muted`).
* **Status:** `--color-success`, `--color-warning`, `--color-error`.

## 3. Typography
Apply fonts strictly based on their intended role. 

* **Display:** Space Grotesk (`--font-display`). Use EXCLUSIVELY for Hero H1 titles and giant project numbers (e.g., '01', '02').
* **Sans-Serif (Main):** Bricolage Grotesque (`--font-sans`). Use for all other headings (H2, H3), body text, menus, buttons, and blog content.
* **Monospace:** Commit Mono (`--font-mono`). Use for tags, dates, pre/code blocks, and form placeholders.

## 4. Theming (Light/Dark Mode)
* **Native CSS implementation:** Rely on `color-scheme: light dark;` and the `data-theme="dark"` attribute on the `<html>` tag.
* **Variable overrides:** Dark mode is handled by redefining CSS Custom Properties inside `[data-theme='dark']` or using the CSS `light-dark()` function. Do not write separate `.dark` classes for individual components.

## 5. Layout & Spacing
* **Max Widths:** Use `--max-width-content` (72rem) for standard containers and `--max-width-prose` (65ch) for readable blog text.
* **Vertical Rhythm:** Section paddings should be generous (96px - 128px) utilizing clamp functions.
* **Border Radius:** Use predefined radius tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`).

## 6. i18n & Responsiveness
* **Fluid Containers:** The site supports Catalan (ca), Spanish (es), and English (en). Catalan and Spanish texts can be up to 30% longer than English. Never use fixed widths for buttons, navigation items, or cards. Use `min-width` and fluid padding.
* **Logical Properties:** Prefer CSS logical properties (`padding-inline`, `margin-block`) over physical ones (`padding-left`, `margin-top`) to maintain a robust i18n architecture.

## 7. Forms & Accessibility (a11y)
* **Forms:** Placeholders must use the monospace font. Include an anti-spam honeypot field (hidden visually and from screen readers). Success messages must be displayed inline (no redirects).
* **WCAG 2.0 Compliance:** Ensure high contrast ratios. Focus states must be clearly visible (do not remove `outline` without providing a strong visual alternative for `:focus-visible`).