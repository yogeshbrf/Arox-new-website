with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

for line in sc.split('\n'):
    if 'location' in line or 'hash' in line or 'search' in line or 'URLSearchParams' in line or 'activeIdx' in line:
        print(line[:120])
