content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('if (modalStep === 3)')
print(content[idx:idx+3500])

