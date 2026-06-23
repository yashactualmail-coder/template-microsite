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
        
    results = state_data.get("res", [])
    current_index = state_data.get("idx", 0)
    
    next_page = results[current_index : current_index + 20]
    
    if not next_page:
        print("No more compressed files to display.")
        return
        
    print("| File Path | Original Size | Compressed Size | Savings (%) |")
    print("| --- | --- | --- | --- |")
    for r in next_page:
        savings = round(((r[1] - r[2]) / r[1]) * 100, 2)
        print(f"| {r[0]} | {r[1]} | {r[2]} | {savings}% |")
        
    state_data["idx"] = current_index + len(next_page)
    
    with open(STATE_FILE, "w") as f:
        json.dump(state_data, f)

if __name__ == "__main__":
    main()
