content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('function renderModal()')
print(content[idx:idx+3500])

