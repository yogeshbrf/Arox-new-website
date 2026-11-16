content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('trainTrack.innerHTML = \'\';')
print(content[idx:idx+2500])
