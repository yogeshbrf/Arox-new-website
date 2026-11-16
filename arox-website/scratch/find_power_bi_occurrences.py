with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'power-bi', html)]
print(f"Total 'power-bi' matches: {len(matches)}")
for idx in matches:
    print(html[idx-40:idx+160])
    print('-'*30)

