with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for term in ['flip-card-front', 'card-front-body', 'card-title', 'card-desc', 'card-logo-container', 'card-hero-logo', 'card-action-btn']:
    matches = re.finditer(rf'([^{{}}]*\.{re.escape(term)}[^{{}}]*)\{{([^}}]*)\}}', text)
    for m in matches:
        print(f"=== {term} ===")
        print(m.group(1).strip())
        print(m.group(2).strip())

