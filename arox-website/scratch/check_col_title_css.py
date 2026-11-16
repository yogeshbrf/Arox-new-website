with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'footer-col-title', css)]
for pos in matches:
    print("--- footer-col-title ---")
    print(css[pos-30:pos+250])

