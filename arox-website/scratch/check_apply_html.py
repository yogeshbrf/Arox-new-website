with open(r'd:\Downloads\Arox new website\arox-website\apply.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("apply.html length:", len(text))
import re
print("Form / course references in apply.html:")
for m in re.finditer(r'course|program|domain', text, re.IGNORECASE):
    idx = m.start()
    print(text[max(0, idx-40):idx+120])
    print('---')
    if idx > 3000: break

