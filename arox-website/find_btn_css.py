import os, re

for root, dirs, files in os.walk('css'):
    for f in files:
        if f.endswith('.css'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as file:
                c = file.read()
                if 'detail-back-btn' in c:
                    print(f"Found in {p}")
                    matches = re.findall(r'[^\n]*detail-back-btn[^\n]*\{[^}]*\}', c, re.DOTALL)
                    for m in matches:
                        print(m)

