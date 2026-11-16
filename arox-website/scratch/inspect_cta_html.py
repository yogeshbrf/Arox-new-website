import re

with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<section[^>]*class=["\'][^"\']*cta-section[^"\']*["\'].*?</section>', text, re.DOTALL)
if m:
    print(m.group(0)[:1000])

