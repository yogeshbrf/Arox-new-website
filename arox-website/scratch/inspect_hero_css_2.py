with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_css = html.find('/* Expanded Card Hero View')
print(html[start_css:start_css+3000])

