with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'ScrollTrigger', html)]
print(f"Total ScrollTrigger occurrences: {len(matches)}")
for idx in matches[:5]:
    print(html[idx-50:idx+300])
    print('='*30)

