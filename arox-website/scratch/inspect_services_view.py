with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

# Look for goToCard, setActiveIdx, or how categories are selected/switched
for line in sc.split('\n'):
    if 'goToCard' in line or 'setActiveIdx' in line or 'MobileServicesView' in line:
        print(line[:140])

