with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'card-hero-graphic', html)]
for idx in matches:
    start = max(0, idx - 100)
    end = min(len(html), idx + 300)
    print("--- HERO GRAPHIC ---")
    print(html[start:end])

