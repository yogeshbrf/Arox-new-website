with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"slug:\s*['\"]([^'\"]+)['\"],\s*(?:id:\s*['\"][^'\"]+['\"],\s*)?title:\s*['\"]([^'\"]+)['\"]", text)
for m in matches:
    print(f"slug: '{m[0]}' -> title: '{m[1]}'")

