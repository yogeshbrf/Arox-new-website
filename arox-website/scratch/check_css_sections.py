with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

# Find any section background definitions
matches = re.finditer(r'((\.theme-dark|\.dark|\[data-theme="dark"\])[^{}]*section[^{}]*)\{([^}]+)\}', css, re.IGNORECASE)
for m in matches:
    print("MATCH:")
    print(m.group(1).strip())
    for l in m.group(3).split(';'):
        if 'background' in l:
            print("  ", l.strip())

