with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

# Search for domains / categories data in sc
for line in sc.split('\n'):
    if 'CATEGORIES' in line or 'DOMAINS' in line or 'SERVICES' in line or 'const domains' in line or 'const categories' in line or 'id:' in line:
        print(line[:120])

