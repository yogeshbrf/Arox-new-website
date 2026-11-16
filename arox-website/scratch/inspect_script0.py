with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('storedTheme')
print(text[idx-50:idx+1500])

