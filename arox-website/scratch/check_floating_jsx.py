with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('id="services-floating-nav"')
if idx == -1:
    idx = html.find('services-floating-nav')
    # search in js
    idx = html.find('services-floating-nav', idx+1)

print(html[idx-100:idx+2500])

