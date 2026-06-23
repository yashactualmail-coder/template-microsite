---
name: microsite-validator
description: Audit and validate the project template for style violations, missing SEO metadata/OpenGraph tags, unoptimized images, and analytics tags. Use this skill whenever the user asks to check the site, validate structure, run audit/checks, or when invoking validation.
---

# Microsite Validator Skill

This skill automates project checks for styling constraints, metadata completeness, image optimization, and analytics presence, logging each run to `log.md` and flagging repeat issues.

## Workflow

### 1. Run validation
To execute the validator, run:
```bash
node microsite-validator/index.js
```
or via `npx` locally:
```bash
npx ./microsite-validator
```

### 2. Available Options
- `--summary`: Run the audit in summary mode, outputting a single status line. Recommended for token-efficient agent runs.
- `--fix`: Automatically resolve missing OpenGraph, description, and canonical tags inside `src/index.html`.

### 3. Handling Results
- **Style Violations**: If style attributes are found, remove them from the HTML files and move them to Tailwind classes or `@utility` definitions in `src/assets/css/style.css`.
- **Missing Metadata**: Run the tool with `--fix` to automatically inject missing `<meta>` and `<link>` tags in the `<head>` of `src/index.html`.
- **Unoptimized Images**: Run the `media-compressor` skill (`python3 media-compressor/compress.py`) to optimize and back up the flagged images.
- **Analytics**: Ensure a valid `gtmId` is provided in `src/data.js` and GTM scripts are active in `src/index.html`.
- **Review Log**: Read `log.md` to see previous runs and review repeated issues.
