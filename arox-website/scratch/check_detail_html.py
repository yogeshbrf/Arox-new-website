with open(r'd:\Downloads\Arox new website\arox-website\detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("detail.html length:", len(text))
import re
print("URLSearchParams or query in detail.html:")
for m in re.finditer(r'URLSearchParams|location\.search|course|id', text):
    start = m.start()
    print(text[max(0, start-50):start+150])
    print('---')
    if start > 2000: break

