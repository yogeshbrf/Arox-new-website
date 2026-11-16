with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'/\*.*?[cC][tT][aA].*?\*/', css)]
print(f"CTA comment blocks: {len(matches)}")
for idx in matches:
    print(css[idx:idx+350])
    print('='*40)

