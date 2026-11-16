with open('detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'back', text, re.IGNORECASE)]
print(f"Matches for 'back' in detail.html: {len(matches)}")
for idx in matches[:10]:
    print(text[max(0, idx-40):min(len(text), idx+120)])
    print("=" * 30)

