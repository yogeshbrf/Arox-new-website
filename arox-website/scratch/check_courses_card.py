with open('courses.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
print("courses.html has card-hero-content:", "card-hero-content" in html)
matches = re.findall(r'(\.card-hero-content[^{]*\{[^{}]*\})', html)
for m in matches:
    print(m.strip())

