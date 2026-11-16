with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.cta-section\s*\{', css)]
for i, idx in enumerate(matches):
    print(f"Occurrence {i+1} at index {idx}:")
    print(css[idx:idx+250])
    print('='*30)

