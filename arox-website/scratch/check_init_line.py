with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'initCategoryPills' in l:
        print(f"=== Line {i+1} ===")
        for j in range(max(0, i-2), min(len(lines), i+8)):
            print(f"{j+1}: {repr(lines[j])}")

