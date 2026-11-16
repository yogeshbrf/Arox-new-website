with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script[^>]*>([\s\S]*?)<\/script>', text)
for i, s in enumerate(scripts):
    if 'theme' in s.lower() or 'dark' in s.lower():
        print(f"Script {i}: length {len(s)}")
        for line in s.split('\n'):
            if any(k in line.lower() for k in ['theme', 'dark', 'light', 'localstorage']):
                print("  ", line.strip()[:120])

