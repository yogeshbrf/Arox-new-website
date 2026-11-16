with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

import re
m = re.search(r'/\*.*?[Ff]ooter.*?\*/.*?(?=\n/\*|\Z)', css, re.DOTALL)
# or find .footer-bottom block
pos = css.find('.footer-bottom {')
if pos != -1:
    print(css[pos:pos+1500])

