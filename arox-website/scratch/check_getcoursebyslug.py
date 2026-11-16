with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function getCourseBySlug')
if idx != -1:
    print(text[idx:idx+800])
else:
    print('Not found')

