This project is a static micro-site template built using the following technologies:

* **Build System:** Vite 8
* **Template Engine:** Handlebars (via `vite-plugin-handlebars`)
* **CSS Framework:** Tailwind CSS v4

---

# Folder Structure

```
.
├── src/                          # Source code root
│   ├── index.html                # Main entry point (composes section partials)
│   ├── data.js                   # Centralized template data (content, styling, SEO)
│   ├── style.css                 # Main entry stylesheet (imports asset css)
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css         # Tailwind v4 theme, fonts, custom utility classes
│   │   ├── fonts/                # Custom font files
│   │   └── images/               # Image assets (PNG, SVG, JPG, WebP)
│   └── partials/
│       ├── sections/             # Modular page sections (e.g. header, hero, footer)
│       └── components/           # Reusable HTML UI components
├── dist/                         # Compiled production-ready assets (output)
├── vite.config.js                # Vite build and server settings
└── AGENTS.md                     # This instructions file
```

---

# AI Agent Design-to-Code Workflow (Under 1 Hour)

Follow this streamlined pipeline to go from a Figma design URL or image assets to a live site:

### Phase 1: Context & Metadata Setup
1. **Analyze Design:** Read user Figma nodes or screenshot images. Identify typography, spacing, colors, and layout sections.
2. **Update SEO & Branding:** In [src/data.js](file:///home/bingle/Downloads/template/template/src/data.js), customize the `seo` block (title, description, optional GTM ID).
3. **Configure Styles & Fonts:** Open [src/assets/css/style.css](file:///home/bingle/Downloads/template/template/src/assets/css/style.css) and configure the `@theme` block. Update CSS variable colors (`--color-*`), font mappings (`--font-*`), and add any specific design keyframes or animations.

### Phase 2: HTML Component Coding
1. **Prepare Section List:** Determine the sequence of sections. Standard layout:
   * `{{> sections/header }}`
   * `{{> sections/hero }}`
   * `{{> sections/features }}` (or `about.html`, etc.)
   * `{{> sections/cta }}`
   * `{{> sections/footer }}`
2. **Create/Update HTML Partials:** Put layout blocks in `src/partials/sections/`. Keep them clean:
   * **Tailwind CSS 4:** Use utility classes and variables. Use `@utility` in `style.css` if complex custom styles are repeated.
   * **Handlebars expressions:** Reference data fields (e.g. `{{hero.title}}`, `{{#each features.items}}`) to keep copy dynamic.
   * **Relative Asset Paths:** Put all downloaded graphics in `src/assets/images/` and reference them relatively as `./assets/images/filename.ext`.
3. **Update Entry Point:** Modify [src/index.html](file:///home/bingle/Downloads/template/template/src/index.html) to render the partial sections in the correct order.

### Phase 3: Centralize Content in `data.js`
1. **Populate `src/data.js`:** Map every string, CTA URL, image source, and configuration item to matching structures in `data.js`.
2. **Dynamic UI Styling classes:** You can store styling classes in the `styles` object inside `data.js` to allow swapping layouts easily.

### Phase 4: Validation & Quality Control
1. **Run Dev Server:** Start the server using `npm run dev` to preview the microsite.
2. **Test Responsive Design:** Ensure sections flow beautifully on mobile, tablet, and desktop viewports. Add hidden/visible utilities or responsive flex/grid wrappers where needed.
3. **Run Production Build:** Run `npm run build` to verify the code compiles without handlebars syntax or assets compiling errors. Ensure outputs are generated in the `dist` folder.

---

# General Guidelines
- **Zero Hardcoding in HTML:** If it's a heading, description, button label, link, or image URL, it must live in `src/data.js`.
- **Vanilla Tailwind 4:** Avoid injecting `<style>` tags directly into template sections; instead, add customizations to the `@theme` block in [style.css](file:///home/bingle/Downloads/template/template/src/assets/css/style.css) or write new `@utility` classes.
- **Micro-Animations:** Enhance UX using hover triggers, scale transitions (`transition-transform hover:scale-105`), and custom float/spin keyframes defined in the Tailwind configuration.
- **SEO Best Practices:** Keep a single `<h1>` on the page, use semantic elements (`<header>`, `<main>`, `<section>`, `<footer>`), and assign unique `id` attributes to interactive elements.

---

# Project Rules

- **Rule 1:** You are an autonomous coding agent.
- **Rule 2:** You must NEVER execute commands or modify files outside of the current directory you're in. You can go deeper, but not above.
- **Rule 3:** Always ask for confirmation before writing to disk.
- **Rule 4:** Don't be as verbose. Saying "change implemented" with a quick explanation is enough. We don't need extra paragraphs. 
- **Rule 5:** For frontend applications involving javascript, always make sure that js cache refreshing takes place.
- **Rule 6:** When working with CSS, never use height when working with elements. Never use styles directly on an HTML element. 
- **Rule 7:** If working with data.js projects with high modularity, abstraction is of high importance.
