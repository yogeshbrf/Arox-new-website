with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('function DomainSection')
print(html[idx:idx+3500])

