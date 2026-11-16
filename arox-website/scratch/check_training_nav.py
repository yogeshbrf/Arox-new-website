with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
print("Occurrences of 'internshipDomainWrap' in training.html:")
for m in re.finditer(r'.{0,50}internshipDomainWrap.{0,50}', t):
    print(m.group(0).strip())

print("\nOccurrences of 'URLSearchParams' or 'location.search' in training.html:")
for m in re.finditer(r'.{0,60}(?:URLSearchParams|location\.search|location\.hash).{0,60}', t):
    print(m.group(0).strip())

