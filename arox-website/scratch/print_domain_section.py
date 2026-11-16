with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
matches = re.findall(r'.{0,60}domain-section-.{0,60}', s)
for m in matches:
    print(m)

