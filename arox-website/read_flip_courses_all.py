with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('devops-engineering')
print(text[idx:idx+1500])
