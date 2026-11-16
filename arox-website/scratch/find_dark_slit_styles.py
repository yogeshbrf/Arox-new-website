with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '.theme-dark' in l and any(k in l for k in ['internship', 'slit', 'domain-cards', 'hero-card-img']):
        print(f"Line {i+1}:")
        for j in range(max(0, i-1), min(len(lines), i+12)):
            print(f"  {j+1}: {lines[j].rstrip()}")
        print("=" * 50)

