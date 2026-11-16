with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('id: "services-folder-stack-trigger"')
print(html[idx-100:idx+2500])

