import os
import sys
import shutil
import json
import subprocess

def check_tools():
    try:
        subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        ffmpeg_available = True
    except Exception:
        ffmpeg_available = False
    
    try:
        subprocess.run(["svgo", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        svgo_available = True
    except Exception:
        svgo_available = False
        
    return ffmpeg_available, svgo_available

def run_compression(root_dir):
    ffmpeg_available, svgo_available = check_tools()
    
    dummyimages_dir = os.path.join(root_dir, "dummyimages")
    backup_dir = os.path.join(root_dir, ".media-backup")
    agents_dir = os.path.join(root_dir, ".agents")
    
    os.makedirs(backup_dir, exist_ok=True)
    os.makedirs(agents_dir, exist_ok=True)
    
    files_to_compress = []
    if os.path.exists(dummyimages_dir):
        for f in os.listdir(dummyimages_dir):
            if f.startswith('.'):
                continue
            filepath = os.path.join(dummyimages_dir, f)
            if os.path.isfile(filepath):
                ext = os.path.splitext(f)[1].lower()
                if ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']:
                    files_to_compress.append(f)
                    
    results = []
    for f in files_to_compress:
        src_path = os.path.join(dummyimages_dir, f)
        backup_path = os.path.join(backup_dir, f)
        
        shutil.copy2(src_path, backup_path)
        original_size = os.path.getsize(backup_path)
        
        ext = os.path.splitext(f)[1].lower()
        
        if ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif'] and ffmpeg_available:
            temp_output = os.path.splitext(src_path)[0] + "_tmp" + ext
            if ext == '.png':
                cmd = ["ffmpeg", "-i", src_path, "-pred", "mixed", "-pix_fmt", "pal8", temp_output, "-y"]
            elif ext in ['.jpg', '.jpeg']:
                cmd = ["ffmpeg", "-i", src_path, "-q:v", "2", temp_output, "-y"]
            elif ext == '.webp':
                cmd = ["ffmpeg", "-i", src_path, "-q:v", "75", temp_output, "-y"]
            else:
                shutil.copy2(src_path, temp_output)
                
            try:
                subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                if os.path.exists(temp_output) and os.path.getsize(temp_output) > 0:
                    os.replace(temp_output, src_path)
                else:
                    if os.path.exists(temp_output):
                        os.remove(temp_output)
            except Exception as e:
                print(f"Error compressing {f}: {e}")
                if os.path.exists(temp_output):
                    os.remove(temp_output)
        elif ext == '.svg' and svgo_available:
            try:
                subprocess.run(["svgo", "-i", src_path, "-o", src_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            except Exception as e:
                print(f"Error compressing SVG {f}: {e}")
                
        new_size = os.path.getsize(src_path)
        savings = round((original_size - new_size) / original_size * 100, 2) if original_size > 0 else 0.0
        
        results.append({
            "path": f,
            "originalSize": original_size,
            "newSize": new_size,
            "savings": savings
        })
        
    results.sort(key=lambda x: x["originalSize"], reverse=True)
    
    state_file = os.path.join(agents_dir, "media-compressor-state.json")
    page_size = 20
    current_index = min(page_size, len(results))
    
    state_data = {
        "currentIndex": current_index,
        "results": results
    }
    
    with open(state_file, 'w') as sf:
        json.dump(state_data, sf, indent=2)
        
    print_markdown_table(results, 0, current_index)
    
    if len(results) > page_size:
        print(f"\n> **Note**: To see the next {page_size} files, reply with `/compress-media next`.")

def print_markdown_table(results, start_idx, end_idx):
    print("| File Path | Original Size | Compressed Size | Savings (%) |")
    print("| --- | --- | --- | --- |")
    for i in range(start_idx, min(end_idx, len(results))):
        r = results[i]
        print(f"| {r['path']} | {r['originalSize']} | {r['newSize']} | {r['savings']} |")

def run_next(root_dir):
    agents_dir = os.path.join(root_dir, ".agents")
    state_file = os.path.join(agents_dir, "media-compressor-state.json")
    
    if not os.path.exists(state_file):
        print("Error: No compression state found. Run /compress-media first.")
        return
        
    with open(state_file, 'r') as sf:
        state_data = json.load(sf)
        
    results = state_data.get("results", [])
    current_index = state_data.get("currentIndex", 0)
    page_size = 20
    
    next_index = current_index + page_size
    
    print_markdown_table(results, current_index, next_index)
    
    state_data["currentIndex"] = next_index
    with open(state_file, 'w') as sf:
        json.dump(state_data, sf, indent=2)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("cmd", nargs="+")
    parser.add_argument("--root", default=".")
    args = parser.parse_args()
    
    full_cmd = " ".join(args.cmd)
    if full_cmd == "/compress-media":
        run_compression(args.root)
    elif full_cmd == "/compress-media next":
        run_next(args.root)
    else:
        print(f"Unknown command: {full_cmd}")
        sys.exit(1)
