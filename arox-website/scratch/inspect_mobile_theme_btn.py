with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('mobile-theme-btn')
while idx != -1:
    print(text[max(0, idx-100):idx+300])
    print('='*50)
    idx = text.find('mobile-theme-btn', idx+1)

