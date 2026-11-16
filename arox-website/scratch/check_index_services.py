import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'id=["\']services-section["\'][^>]*>(.*?)</section>', text, re.DOTALL)
if m:
    print('Found services-section in index.html (first 600 chars):')
    print(m.group(0)[:600])
else:
    print('Not found')

