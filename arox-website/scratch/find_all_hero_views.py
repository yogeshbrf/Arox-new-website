with open('training.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.card-hero-view\s*\{', content)]
print(f"Occurrences of .card-hero-view: {len(matches)}")
for idx in matches:
    print(content[idx:idx+250])
    print('='*40)

