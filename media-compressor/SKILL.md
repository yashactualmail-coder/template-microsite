---
name: media-compressor
description: Compress and optimize project image and vector files to reduce their size. Use this skill whenever the user types /compress-media, asks to compress images/vectors, or mentions optimizing project assets/media.
---

# Media Compressor Skill

This skill automates the scanning, backup, and high-performance compression of raster images and vectors in the workspace, displaying paginated results.

## Workflow

### 1. Initial Compression (`/compress-media`)
To start the compression process, execute the main script:
```bash
python3 .agents/skills/media-compressor/scripts/compress.py
```
This script automatically checks and installs dependencies (`libvips` / `pyvips` / `ffmpeg`), backs up originals to `.media-backup/`, compresses target files in-place, saves the paginated state, and prints a formatted Markdown table of the first 20 optimized files. Display the stdout directly to the user.

### 2. Paginated Continuation (`/compress-media next`)
To display the next page of optimized files, execute the pagination script:
```bash
python3 .agents/skills/media-compressor/scripts/next.py
```
This script reads the saved state, displays the next 20 files, and updates the pagination state. Display the stdout directly to the user.
