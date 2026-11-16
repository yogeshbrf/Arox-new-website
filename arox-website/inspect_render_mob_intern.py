content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('function renderMobileInternship')
print(content[idx:idx+3500])

