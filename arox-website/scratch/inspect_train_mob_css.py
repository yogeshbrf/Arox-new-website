with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'(\.arox-mob-[^{]*\{[^{}]*\})', html)
for m in matches[:15]:
    print(m.strip())
    print("---")

