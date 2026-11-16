with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'footer-watermark', css)]
for pos in matches:
    print("--- footer-watermark match ---")
    print(css[pos-50:pos+300])

