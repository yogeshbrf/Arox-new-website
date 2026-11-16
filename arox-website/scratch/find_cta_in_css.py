with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.cta-', css)]
print(f"Total .cta- in css/style.css: {len(matches)}")
for idx in matches[:10]:
    print(css[idx-20:idx+200])
    print('-'*30)

