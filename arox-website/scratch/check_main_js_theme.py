with open(r'd:\Downloads\Arox new website\arox-website\js\main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'theme', text, re.IGNORECASE)]
for idx in matches[:10]:
    print(text[max(0, idx-50):idx+250])
    print('='*50)

