import os
import json

WORKSPACE = "/home/bingle/Downloads/skillmoment"
STATE_FILE = os.path.join(WORKSPACE, ".agents", "media-compressor-state.json")

def main():
    if not os.path.exists(STATE_FILE):
        print("No compression state found. Please run `/compress-media` first.")
        return
        
    with open(STATE_FILE, "r") as f:
        state_data = json.load(f)
        
    results = state_data.get("results", [])
    current_index = state_data.get("currentIndex", 0)
    
    next_page = results[current_index : current_index + 20]
    
    print("| File Path | Original Size | Compressed Size | Savings (%) |")
    print("| --- | --- | --- | --- |")
    for r in next_page:
        print(f"| {r['path']} | {r['originalSize']} | {r['newSize']} | {r['savings']}% |")
        
    state_data["currentIndex"] = current_index + len(next_page)
    
    with open(STATE_FILE, "w") as f:
        json.dump(state_data, f, indent=2)

if __name__ == "__main__":
    main()
