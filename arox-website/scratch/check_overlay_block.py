with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('Hero Sections & CTA Card Overlay Rules')
end = html.find('</style>', idx)
print(html[idx-10:end])

