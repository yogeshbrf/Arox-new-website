with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

# Search for flip-card and internship-card styles
rules = ['flip-card-front', 'card-front-body', 'card-title', 'card-desc', 'card-logo-container', 'card-hero-logo', 'internship-card-slit', 'slit-hero-view', 'hero-card-img']

for r in rules:
    m = re.findall(rf'([^{{}}]*\.{re.escape(r)}[^{{}}]*)\{{([^}}]*)\}}', css)
    for sel, body in m[:2]:
        print(f"Selector: {sel.strip()[:60]}")
        for line in body.split(';'):
            if any(k in line for k in ['text-align', 'align-items', 'justify-content', 'position', 'bottom', 'right', 'width', 'height', 'padding']):
                print(f"  {line.strip()}")

