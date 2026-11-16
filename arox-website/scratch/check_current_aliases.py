with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('courseSlugAliases = {')
idx_end = text.find('};', idx)
print(text[idx:idx_end+2])

