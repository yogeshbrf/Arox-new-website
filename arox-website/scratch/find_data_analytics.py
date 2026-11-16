with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'data[-_ ]analytics', text, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 200)
    end = min(len(text), m.end() + 200)
    print(text[start:end])
    print("=" * 50)

