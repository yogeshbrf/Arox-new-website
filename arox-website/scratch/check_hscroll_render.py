with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<section[^>]*id="hscrollSection"[^>]*>(.*?)</section>', text, re.DOTALL)
if m:
    print("HSCROLL HTML (first 1000 chars):")
    print(m.group(0)[:1000])

# Also search for scripts rendering cards
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
for i, s in enumerate(scripts):
    if 'hscroll' in s.lower() or 'train' in s.lower() or 'render' in s.lower():
        # check how cards are generated
        for line in s.split('\n'):
            if any(k in line for k in ['innerHTML', 'createElement', 'card', 'track', 'rail']):
                if len(line.strip()) < 120:
                    print(f"Script line: {line.strip()}")
                else:
                    print(f"Script line: {line.strip()[:120]}...")

