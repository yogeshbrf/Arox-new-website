with open('training.html', encoding='utf-8') as f:
    s = f.read()

import re
# check navigateToSection definition
m_nav = re.search(r'window\.navigateToSection = function\(type.*?\n  \};', s, re.DOTALL)
if m_nav:
    print("=== navigateToSection found ===")
    print(m_nav.group(0)[:1500])

