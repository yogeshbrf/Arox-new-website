with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

idx = css.find('mobile_cta_dark.png')
print(css[idx-600:idx+600])

