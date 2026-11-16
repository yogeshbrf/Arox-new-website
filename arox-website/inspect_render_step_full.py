content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('function renderStep()')
print(content[idx:idx+4500])

