content = open('training.html', 'r', encoding='utf-8').read()
import re
for m in re.finditer(r'aroxMobileInternTrack', content):
    pos = m.start()
    print(pos, content[pos-40:pos+150])

