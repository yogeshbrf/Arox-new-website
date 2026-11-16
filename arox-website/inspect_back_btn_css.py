with open('detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'[^\n]*detail-back-btn[^\n]*\{[^}]*\}', text, re.DOTALL)
print("In detail.html:")
for m in matches:
    print(m)

matches_wrap = re.findall(r'[^\n]*detail-breadcrumb-wrap[^\n]*\{[^}]*\}', text, re.DOTALL)
for m in matches_wrap:
    print(m)

