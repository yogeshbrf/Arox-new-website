with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('formatHeroTitle')
if idx != -1:
    print(html[idx-50:idx+600])
else:
    print("formatHeroTitle not found")

