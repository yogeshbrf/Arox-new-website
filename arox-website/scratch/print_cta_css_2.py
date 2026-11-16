with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

s = css.find('.cta-card:hover .cta-bg-img {')
print(css[s:s+2000])

