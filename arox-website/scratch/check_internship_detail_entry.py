with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("slug: 'ui-ux-design-internship'")
if idx != -1:
    print(text[idx:idx+800])
else:
    print("ui-ux-design-internship not found")

