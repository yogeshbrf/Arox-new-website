with open('contact.html', 'r', encoding='utf-8') as f:
    text = f.read()

print("contact.html has service param handling:", 'service' in text)
import re
print("Matches:", re.findall(r'service', text, re.I)[:10])
for line in text.splitlines():
    if 'URLSearchParams' in line or 'getParameter' in line or 'service' in line.lower() and 'select' in line.lower():
        print("Line:", line.strip()[:100])

