with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const deviconMap =')
if idx != -1:
    print(text[idx:idx+2000])

