with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'arox-theme', text)]
for idx in matches:
    print(text[max(0, idx-50):idx+250])
    print('='*50)

