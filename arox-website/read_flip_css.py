with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('.card-number {')
if idx != -1:
    print(text[idx-50:idx+2500])

