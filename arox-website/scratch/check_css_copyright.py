with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

import re
for m in re.finditer(r'.{0,50}(?:footer-copy-br|footer-copyright-bottom|footer-bottom).{0,50}', css):
    print(m.group(0).strip())

