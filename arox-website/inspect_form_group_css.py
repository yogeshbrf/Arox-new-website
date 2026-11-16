content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('.form-group {')
print(content[idx:idx+1500])

