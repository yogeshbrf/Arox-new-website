with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'(\.(?:domain-cards-track|internship-cards-rail|internship-slider)[^{}]*\{[^{}]*\})', html)
for m in matches:
    print(m.strip())
    print("---")

