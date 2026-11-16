with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'services-nav-hidden', html)]
for idx in matches:
    print(html[idx-100:idx+300])
    print('='*30)

