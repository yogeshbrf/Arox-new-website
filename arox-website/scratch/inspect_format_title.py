with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'function formatHeroTitle[^{]*\{.*?\n    \}', html, re.DOTALL)
for m in matches:
    print(m)

