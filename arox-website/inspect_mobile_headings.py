content = open('training.html', 'r', encoding='utf-8').read()
import re
print("Searching for mobile training & internship section titles:")
for m in re.finditer(r'(?:aroxMobTrainingSection|aroxMobInternSection|Skill-Based Training for a Better Career|Industry Experience to Kickstart Your Career)', content):
    pos = m.start()
    print(pos, content[pos-40:pos+150])

