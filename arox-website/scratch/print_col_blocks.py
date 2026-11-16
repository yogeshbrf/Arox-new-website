with open('index.html', encoding='utf-8') as f:
    content = f.read()

import re
m_svc = re.search(r'(<h3 class="footer-col-title">Services</h3>.*?</ul>)', content, re.DOTALL)
if m_svc:
    print("=== CURRENT SERVICES BLOCK ===")
    print(m_svc.group(1))

m_int = re.search(r'(<h3 class="footer-col-title">Internship</h3>.*?</ul>)', content, re.DOTALL)
if m_int:
    print("=== CURRENT INTERNSHIP BLOCK ===")
    print(m_int.group(1))

