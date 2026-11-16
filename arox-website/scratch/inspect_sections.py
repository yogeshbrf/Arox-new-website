import re

with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

print('Has internship-slit:', 'internship-card-slit' in html)
print('IDs:', re.findall(r'id="([^"]+)"', html)[:30])
matches = re.findall(r'<section[^>]*id="([^"]+)"[^>]*>', html)
print('Sections:', matches)

# Find where the toggle pill or internship section is
print("Search for 'INTERNSHIP' or 'slit':")
for line in html.splitlines():
    if any(k in line for k in ['hscrollSection', 'internshipCards', 'slit-rail', 'tab-btn', 'toggle-btn', 'arox-tab']):
        print(line[:120])

