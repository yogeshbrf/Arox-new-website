with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('.cta-')
while idx != -1:
    print(html[idx-50:idx+200])
    print('='*30)
    idx = html.find('.cta-', idx+1)

