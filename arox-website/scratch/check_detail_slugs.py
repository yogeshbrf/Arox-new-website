with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
slugs = re.findall(r'id:\s*["\']([^"\']+)["\']', text)
print("Course slugs in courses-detail-data.js:", len(slugs))
print(slugs)

