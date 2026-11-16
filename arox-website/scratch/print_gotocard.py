with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
sc = scripts[10]

lines = sc.split('\n')
for i, l in enumerate(lines):
    if 'const goToCard' in l:
        print(f"=== goToCard around line {i+1} ===")
        for j in range(max(0, i-5), min(len(lines), i+30)):
            print(f"{j+1}: {lines[j]}")
    if 'function MobileServicesView' in l:
        print(f"=== MobileServicesView around line {i+1} ===")
        for j in range(max(0, i), min(len(lines), i+45)):
            print(f"{j+1}: {lines[j]}")

