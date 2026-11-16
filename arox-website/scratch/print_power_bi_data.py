with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('id: "power-bi"')
print(html[idx-50:idx+450])

