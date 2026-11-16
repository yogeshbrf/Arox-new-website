content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('.modal-box {')
print(content[idx:idx+1500])

