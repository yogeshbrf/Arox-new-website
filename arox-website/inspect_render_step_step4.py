content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('Skip Sundays when calculating end date')
print(content[idx:idx+3500])

