with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
m = re.search(r'function initCategoryPills\(.*?\n    \}', t, re.DOTALL)
if m:
    print(m.group(0))

