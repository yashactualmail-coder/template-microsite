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
    # Detect package manager and try to install libvips system package
    if shutil.which("apt-get"):
        try:
            print("Installing libvips via apt-get...")
            subprocess.run(["sudo", "apt-get", "update", "-y"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(["sudo", "apt-get", "install", "-y", "libvips-dev"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"apt-get installation failed: {e}")
    elif shutil.which("brew"):
        try:
            print("Installing libvips via Homebrew...")
            subprocess.run(["brew", "install", "vips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return True
        except Exception as e:
            print(f"Homebrew installation failed: {e}")
    return False

def setup_vips_dependencies():
    try:
        import pyvips
        return True
    except ImportError:
        print("pyvips not found. Attempting to install...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "pyvips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            import pyvips
            return True
        except Exception:
            print("Python pip installation of pyvips failed. Trying to install system libvips first...")
            if install_system_vips():
                try:
                    subprocess.run([sys.executable, "-m", "pip", "install", "pyvips"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    import pyvips
                    return True
                except Exception as e:
                    print(f"Failed to install pyvips after system dependency installation: {e}")
            else:
                print("Could not install system libvips dependencies automatically.")
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
            print(f"pyvips compression failed for {os.path.basename(filepath)}: {e}. Falling back to ffmpeg.")
            
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
            # Revert to original if no savings
            shutil.copy2(backup_path, filepath)
        return True
    except Exception as e:
        if os.path.exists(temp_out):
            os.remove(temp_out)
        shutil.copy2(backup_path, filepath)
        print(f"ffmpeg fallback failed for {os.path.basename(filepath)}: {e}")
        return False

def main():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    state_dir = os.path.dirname(STATE_FILE)
    if not os.path.exists(state_dir):
        os.makedirs(state_dir)
        
    use_vips = setup_vips_dependencies()
    if use_vips:
        print("Using high-performance libvips engine for compression.")
    else:
        print("Using ffmpeg engine for fallback compression.")
        
    results = []
    files = [f for f in os.listdir(TARGET_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif'))]
    
    for filename in files:
        filepath = os.path.join(TARGET_DIR, filename)
        backup_path = os.path.join(BACKUP_DIR, filename)
        
        orig_size = os.path.getsize(filepath)
        shutil.copy2(filepath, backup_path)
        
        compress_file(filepath, backup_path, use_vips)
        
        new_size = os.path.getsize(filepath)
        savings = ((orig_size - new_size) / orig_size) * 100
        
        results.append({
            "path": os.path.relpath(filepath, WORKSPACE),
            "originalSize": orig_size,
            "newSize": new_size,
            "savings": round(savings, 2)
        })
        
    results.sort(key=lambda x: x["originalSize"], reverse=True)
    
    state_data = {
        "currentIndex": len(results),
        "results": results
    }
    with open(STATE_FILE, "w") as f:
        json.dump(state_data, f, indent=2)
        
    print("| File Path | Original Size | Compressed Size | Savings (%) |")
    print("| --- | --- | --- | --- |")
    for r in results[:20]:
        print(f"| {r['path']} | {r['originalSize']} | {r['newSize']} | {r['savings']}% |")

if __name__ == "__main__":
    main()
