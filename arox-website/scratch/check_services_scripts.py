with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find script blocks or component definitions in services.html
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f"Found {len(scripts)} scripts in services.html")
for i, s in enumerate(scripts):
    print(f"Script {i}: length {len(s)}")
    # Find any references to click, navigate, card, nav
    for kw in ['navigate', 'navigation', 'card', 'click', 'spot']:
        matches = len(re.findall(kw, s, re.IGNORECASE))
        if matches > 0:
            print(f"   has '{kw}': {matches} times")

