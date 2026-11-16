with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

import re
matches = [m.start() for m in re.finditer(r'\.footer-bottom', css)]
for pos in matches[1:]:
    print("--- Match at", pos, "---")
    print(css[pos:pos+400])

