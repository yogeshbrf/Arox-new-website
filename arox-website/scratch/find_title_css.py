with open('training.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.card-hero-title\s*\{', content)]
for idx in matches:
    print("--- .card-hero-title ---")
    print(content[idx:idx+300])

