with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# find CSS selectors matching card-hero or internship-card-slit
matches = re.findall(r'([^{}]*(?:card-hero|internship-card-slit|card-slit)[^{}]*\{[^{}]*\})', html)
for m in matches[:25]:
    print(m.strip())
    print("---")

