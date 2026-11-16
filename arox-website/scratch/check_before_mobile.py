with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

idx = css.find('padding: 4.5rem 1.5rem 3.5rem !important;')
print(css[idx-1000:idx+200])

