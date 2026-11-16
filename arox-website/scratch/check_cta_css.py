with open(r'd:\Downloads\Arox new website\arox-website\css\style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.cta-section|\.cta-card', text)]
for idx in matches[:10]:
    print(text[max(0, idx-50):idx+350])
    print('='*50)

