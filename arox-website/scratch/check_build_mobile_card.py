with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function buildMobileCard')
if idx != -1:
    print(text[idx:idx+1500])

