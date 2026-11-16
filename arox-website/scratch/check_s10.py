with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s10 = scripts[10]

for kw in ['navigate', 'navigation', 'card', 'click']:
    print(f"=== Keyword: {kw} ===")
    matches = [m.start() for m in re.finditer(kw, s10, re.IGNORECASE)]
    for idx in matches[:5]:
        print(s10[max(0, idx-100):min(len(s10), idx+200)])
        print('-'*30)

