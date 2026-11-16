with open('index.html', encoding='utf-8') as f:
    html = f.read()

import re
pos_f = html.find('<footer')
pos_fe = html.find('</footer>') + 9
print(html[pos_f:pos_fe])

