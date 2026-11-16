with open('css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '#hero.home-hero-pro' in l or '.home-hero-pro' in l:
        print(f"Line {i+1}: {l.strip()}")

