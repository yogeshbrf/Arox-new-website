with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

lines = sc.split('\n')
for i in range(580, 680):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}")

