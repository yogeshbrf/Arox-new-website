with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('goToCard')
while idx != -1:
    print(html[idx-50:idx+300])
    print('='*30)
    idx = html.find('goToCard', idx+1)

