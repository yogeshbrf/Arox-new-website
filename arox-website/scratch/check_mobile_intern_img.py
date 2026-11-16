with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.findall(r'mobile-internship[^\n]*', text)
for line in m[:15]:
    print(line)

idx = text.find('buildMobileInternshipCards')
if idx != -1:
    print(text[idx:idx+1500])

