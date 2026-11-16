with open(r'd:\Downloads\Arox new website\arox-website\apply.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'URLSearchParams|location\.search', text)]
for idx in matches:
    print(text[max(0, idx-100):idx+300])
    print('='*50)

