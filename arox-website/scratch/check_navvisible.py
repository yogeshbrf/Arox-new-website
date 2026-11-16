with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('setNavVisible')
while idx != -1:
    print(html[idx-100:idx+300])
    print('='*30)
    idx = html.find('setNavVisible', idx+1)

