with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

m = re.search(r'const CATEGORIES = \[(.*?)\n        \];', sc, re.DOTALL)
if m:
    print(m.group(0)[:2500])

