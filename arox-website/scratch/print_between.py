with open('training.html', 'r', encoding='utf-8') as f:
    content = f.read()

s = content.find('.card-hero-title {')
e = content.find('.theme-dark .card-hero-title-underline {')
print(content[s:e+100])

