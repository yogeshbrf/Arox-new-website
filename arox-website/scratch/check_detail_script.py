with open(r'd:\Downloads\Arox new website\arox-website\detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script[^>]*>([\s\S]*?)<\/script>', text)
for i, s in enumerate(scripts):
    if 'param' in s.lower() or 'search' in s.lower() or 'course' in s.lower():
        print(f"Script {i} (len {len(s)}):")
        print(s[:1500])
        print('='*50)

