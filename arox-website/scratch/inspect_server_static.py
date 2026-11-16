with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.splitlines()[:50]:
    if 'static' in line or 'express' in line or 'public' in line or 'use(' in line:
        print(line)

