content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('.arox-mobile-card-back {')
print(content[idx:idx+2000])
