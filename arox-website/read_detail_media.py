with open('css/detail.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'@media', text)]
print(f"@media matches in css/detail.css: {len(matches)}")
for idx in matches:
    print(text[idx:idx+400])
    print("="*30)

