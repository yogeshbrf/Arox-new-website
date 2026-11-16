with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
print("Matches for 'domain' in search params:")
for m in re.finditer(r'.{0,40}domain.{0,40}', t):
    if 'urlParams' in m.group(0) or 'get(' in m.group(0) or 'location' in m.group(0):
        print(m.group(0).strip())

