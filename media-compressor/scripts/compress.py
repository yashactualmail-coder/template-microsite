import os
import shutil
import subprocess
import json
import sys

WORKSPACE = "/home/bingle/Downloads/skillmoment"
TARGET_DIR = os.path.join(WORKSPACE, "dummyimages")
BACKUP_DIR = os.path.join(WORKSPACE, ".media-backup")
STATE_FILE = os.path.join(WORKSPACE, ".agents", "media-compressor-state.json")

def install_system_vips():
    if shutil.which("apt-get"):
        try:
            print("Installing libvips via apt-get...", file=sys.stderr)
            subprocess.run(["sudo", "apt-get", "update", "-y"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(["sudo", "apt-get", "install", "-y", "libvips-dev"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"apt-get installation failed: {e}", file=sys.stderr)
    elif shutil.which("brew"):
        try:
            print("Installing libvips via Homebrew...", file=sys.stderr)
            subprocess.run(["brew", "install", "vips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"Homebrew installation failed: {e}", file=sys.stderr)
    return False

def setup_vips_dependencies():
    try:
        import pyvips
        return True
    except ImportError:
        print("pyvips not found. Attempting to install...", file=sys.stderr)
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "pyvips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            import pyvips
            return True
        except Exception:
            print("Python pip installation of pyvips failed. Trying to install system libvips first...", file=sys.stderr)
            if install_system_vips():
                try:
                    subprocess.run([sys.executable, "-m", "pip", "install", "pyvips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    import pyvips
                    return True
                except Exception as e:
                    print(f"Failed to install pyvips after system dependency installation: {e}", file=sys.stderr)
            else:
                print("Could not install system libvips dependencies automatically.", file=sys.stderr)
    return False

def compress_file(filepath, backup_path, use_vips):
    orig_size = os.path.getsize(backup_path)
    
    if use_vips:
        try:
            import pyvips
            image = pyvips.Image.new_from_file(backup_path)
            if filepath.lower().endswith('.png'):
                image.write_to_file(filepath, compression=9, palette=True)
            elif filepath.lower().endswith(('.jpg', '.jpeg')):
                image.write_to_file(filepath, Q=75, optimize_coding=True)
            elif filepath.lower().endswith('.webp'):
                image.write_to_file(filepath, Q=75, lossless=False)
            return True
        except Exception as e:
            print(f"pyvips compression failed for {os.path.basename(filepath)}: {e}. Falling back to ffmpeg.", file=sys.stderr)
            
    # Fallback to ffmpeg
    temp_out = filepath + ".tmp.png"
    try:
        if filepath.lower().endswith('.png'):
            cmd = ["ffmpeg", "-i", backup_path, "-pred", "mixed", "-pix_fmt", "pal8", "-y", temp_out]
        else:
            cmd = ["ffmpeg", "-i", backup_path, "-y", temp_out]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if os.path.exists(temp_out) and os.path.getsize(temp_out) < orig_size:
            shutil.move(temp_out, filepath)
        else:
            if os.path.exists(temp_out):
                os.remove(temp_out)
            shutil.copy2(backup_path, filepath)
        return True
    except Exception as e:
        if os.path.exists(temp_out):
            os.remove(temp_out)
        shutil.copy2(backup_path, filepath)
        print(f"ffmpeg fallback failed for {os.path.basename(filepath)}: {e}", file=sys.stderr)
        return False

def main():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    state_dir = os.path.dirname(STATE_FILE)
    if not os.path.exists(state_dir):
        os.makedirs(state_dir)
        
    use_vips = setup_vips_dependencies()
    if use_vips:
        print("Using high-performance libvips engine for compression.", file=sys.stderr)
    else:
        print("Using ffmpeg engine for fallback compression.", file=sys.stderr)
        
    results = []
    files = [f for f in os.listdir(TARGET_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif'))]
    
    for filename in files:
        filepath = os.path.join(TARGET_DIR, filename)
        backup_path = os.path.join(BACKUP_DIR, filename)
        
        orig_size = os.path.getsize(filepath)
        shutil.copy2(filepath, backup_path)
        
        compress_file(filepath, backup_path, use_vips)
        
        new_size = os.path.getsize(filepath)
        
        results.append([
            os.path.relpath(filepath, WORKSPACE),
            orig_size,
            new_size
        ])
        
    # Sort results by original size descending
    results.sort(key=lambda x: x[1], reverse=True)
    
    # Save minified state data
    state_data = {
        "idx": min(20, len(results)),
        "res": results
    }
    with open(STATE_FILE, "w") as f:
        json.dump(state_data, f)
        
    # Directly output Markdown table to stdout
    print("| File Path | Original Size | Compressed Size | Savings (%) |")
    print("| --- | --- | --- | --- |")
    for r in results[:20]:
        savings = round(((r[1] - r[2]) / r[1]) * 100, 2)
        print(f"| {r[0]} | {r[1]} | {r[2]} | {savings}% |")
        
    if len(results) > 20:
        print(f"\n> **Note**: To see the next 20 files, reply with `/compress-media next`.")

if __name__ == "__main__":
    main()
