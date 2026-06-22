# GCC — Static Micro-Site

Built with Vite 8, Handlebars, and Tailwind CSS 4.

## Setup

```bash
npm install
npm run dev       # development server
npm run build     # production build → ./dist
npm run preview   # preview production build
```

## Structure

```
src/
├── index.html                # Entry point
├── data.js                   # Template data (modular)
├── style.css                 # Tailwind + global styles
├── assets/images/            # Static assets
└── partials/
    ├── sections/             # Page sections
    └── components/           # Reusable components
```

- `index.html` composes sections via Handlebars partials
- `partials/sections/` isolates each page section
- `partials/components/` holds shared UI components
- `data.js` mirrors the section/component structure
