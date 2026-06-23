---
name: media-compressor
description: Compress and optimize project image and vector files to reduce their size. Use this skill whenever the user types /compress-media, asks to compress images/vectors, or mentions optimizing project assets/media.
---

# Media Compressor Skill

This skill scans the project workspace to compress raster images and vector assets, backing up originals and showing paginated compression results.

## Workflow

### 1. Tool Check & Installation
Before compressing, check if the required compression tools are installed:
- Use `libvips` via `pyvips` for high-performance raster image compression. If not present, the script will attempt to install it via pip and the system package manager (`apt-get` or `brew`).
- If `libvips` is unavailable and cannot be installed, verify if `ffmpeg` is available to use as a fallback.
- Run `svgo --version` to check for SVG optimization tools.

### 2. File Scan
Scan the workspace (excluding `.git`, `node_modules`, and `.media-backup`) for the following file extensions:
- `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` (Raster Images)
- `.svg` (Vector Images)

### 3. Backup and Compression
For each target file:
1. Create a backup folder named `.media-backup/` in the workspace root, preserving the directory structure.
2. Copy the original file to `.media-backup/`.
3. Compress the file in-place (or replace it):
   - **For PNG/JPG/WebP/GIF**: Compress using `libvips` (falling back to `ffmpeg` if not installed):
     - libvips PNG: palette option enabled (8-bit palette conversion) with compression level 9.
     - libvips JPEG: Quality 75 with optimized Huffman coding.
     - libvips WebP: Quality 75 lossy compression.
   - **For SVG**: Use `svgo -i input.svg -o output.svg` if available.
4. Calculate original size, compressed size, and percentage savings.

### 4. Paginated Output
1. Store all results in `.agents/media-compressor-state.json` with the schema:
   ```json
   {
     "currentIndex": 20,
     "results": [
       { "path": "path/to/file.png", "originalSize": 102400, "newSize": 51200, "savings": 50.0 }
     ]
   }
   ```
2. Sort files by original size (descending).
3. Print a Markdown table showing the top 20 largest optimized files:
   | File Path | Original Size | Compressed Size | Savings (%) |
   | --- | --- | --- | --- |
4. If there are more than 20 files, display a message:
   > **Note**: To see the next 20 files, reply with `/compress-media next`.

### 5. Handling Pagination `/compress-media next`
When the user requests the next page:
1. Read `.agents/media-compressor-state.json`.
2. Display the next 20 files from the saved state.
3. Update `currentIndex` in the state file.
