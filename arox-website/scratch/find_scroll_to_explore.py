with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'Scroll to explore', text, re.IGNORECASE)]
for idx in matches:
    print(text[max(0, idx-100):idx+200])
    print('='*50)

print("\nSearching for class scroll-hint or scroll-indicator:")
hint_matches = [m.start() for m in re.finditer(r'\.scroll-hint|\.scroll-indicator|scrollHint', text)]
for idx in hint_matches:
    print(text[max(0, idx-100):idx+200])
    print('='*50)

