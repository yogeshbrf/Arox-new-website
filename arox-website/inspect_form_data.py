content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('let formData =')
print("formData declaration:")
print(content[idx:idx+800])

