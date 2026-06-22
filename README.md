# Figma-to-Microsite Template

A lightweight, modular static microsite builder optimized for rapid design-to-code conversion. Built with **Vite 8**, **Handlebars**, and **Tailwind CSS v4**.

Designed to go from a Figma design specification to a working responsive site in under an hour when paired with AI coding agents.

## Features
- **Modular Partials:** Break the page layouts into clean HTML section files under `src/partials/sections/`.
- **Tailwind CSS v4:** Pre-configured theme variables, dynamic font mapping, and utility styling out-of-the-box.
- **Centralized Data:** Keep HTML files clean; control all copy, links, and SEO tags from a single registry (`src/data.js`).
- **AI-Agent Ready:** Includes pre-configured Cursor rules (`.cursor/rules/figma-mcp.mdc`) and developers' guides (`AGENTS.md`) for fast design compilation.

## Setup

```bash
npm install
npm run dev       # Start development server
npm run build     # Compile production build → ./dist
npm run preview   # Preview the production build locally
```

## Structure

```
src/
├── index.html                # Main HTML entry point
├── data.js                   # Centralized template data (content, styling, SEO)
├── style.css                 # Tailwind entry stylesheet
├── assets/
│   ├── css/
│   │   └── style.css         # Theme config, custom utilities, and animations
│   ├── fonts/                # Custom font files (.gitkeep placeholder)
│   └── images/               # Image assets (.gitkeep placeholder)
└── partials/
    ├── sections/             # Modular page sections (header, hero, cta, etc.)
    └── components/           # Reusable layout components
```

For detailed coding workflows, styling guidelines, and rules, refer to [AGENTS.md](AGENTS.md).
