with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'card-hero-cta|Explore Track', text)]
for idx in matches:
    print(text[max(0, idx-50):idx+300])
    print('='*50)

