with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
# Find sections and main divs in services.html
for m in re.finditer(r'<section[^>]*id=["\']([^"\']+)["\']', s):
    print("Section id:", m.group(1))

# Find buttons
btns = re.findall(r'<button[^>]*>(.*?)</button>', s, re.DOTALL)
print(f"Total buttons: {len(btns)}")
for b in btns[:20]:
    txt = re.sub(r'<.*?>', '', b).strip()
    if txt:
        print("  Button:", txt)

# Find any headings (h2, h3) in services.html
for m in re.finditer(r'<(h2|h3)[^>]*>(.*?)</\1>', s, re.DOTALL):
    txt = re.sub(r'<.*?>', '', m.group(2)).strip()
    print(f"  {m.group(1)}: {txt[:60]}")

