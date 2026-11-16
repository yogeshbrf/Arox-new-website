with open('css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ['.cta-content', '.cta-card', '.cta-heading', '.cta-text']):
        start = max(0, i - 1)
        end = min(len(lines), i + 6)
        print(f"Match at line {i+1}:")
        for j in range(start, end):
            print(f"  {j+1}: {lines[j].strip()}")
        print("-" * 40)
