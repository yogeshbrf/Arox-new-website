with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

s = html.find('function formatHeroTitle')
e = html.find('function createSlitCard', s)
print(html[s:e])

