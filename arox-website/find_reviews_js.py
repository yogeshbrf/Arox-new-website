with open('js/detail.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('reviews-container')
if idx != -1:
    print(text[idx-50:idx+1500])
else:
    print("reviews-container not found in js/detail.js")

