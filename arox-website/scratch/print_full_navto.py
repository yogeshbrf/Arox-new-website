with open('training.html', encoding='utf-8') as f:
    s = f.read()

import re
m_nav = re.search(r'window\.navigateToSection = function\(type.*?\n  \};', s, re.DOTALL)
if m_nav:
    print(m_nav.group(0))

