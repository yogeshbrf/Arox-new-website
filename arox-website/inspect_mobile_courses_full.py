content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('function initAroxMobileCourses()')
print(content[idx:idx+2500])
