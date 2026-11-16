content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('// 2. POPULATE INTERNSHIP TRACK')
if idx != -1:
    print(content[idx:idx+3000])
else:
    idx2 = content.find('internTrack')
    print("Found internTrack:", content[idx2:idx2+1000])

