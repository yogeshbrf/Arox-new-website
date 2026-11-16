with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'@media[^{]*max-width[^{]*\{.*?\.cta-', css, re.DOTALL)]
print(f"Media query matches with cta: {len(matches)}")

for idx in [m.start() for m in re.finditer(r'mobile_cta_dark', css)]:
    print(css[idx-200:idx+300])
    print('='*40)

