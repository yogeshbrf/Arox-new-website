with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_css = html.find('.card-hero-title-underline {')
print(html[start_css:start_css+2500])

