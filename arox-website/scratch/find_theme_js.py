with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'data-theme', text)]
for idx in matches:
    if 'script' in text[max(0, idx-200):idx+200] or 'addEventListener' in text[max(0, idx-200):idx+200]:
        print(text[max(0, idx-100):idx+300])
        print('='*50)

