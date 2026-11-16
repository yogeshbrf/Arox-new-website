with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('ScrollTrigger.create')
while idx != -1:
    print(html[idx-50:idx+400])
    print('='*30)
    idx = html.find('ScrollTrigger.create', idx+1)

