with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
# check where goToCard is
m = re.search(r'const goToCard = \(index\) => \{.*?^\s*\};', s, re.DOTALL | re.MULTILINE)
if m:
    print("=== goToCard found ===")
    print(m.group(0))

# check where MobileServicesView is
m_mob = re.search(r'function MobileServicesView.*?^\s*\}', s, re.DOTALL | re.MULTILINE)
if m_mob:
    print("=== MobileServicesView found ===")
    print(m_mob.group(0))

