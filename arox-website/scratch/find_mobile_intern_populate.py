with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('mobileInternshipTopTrack')
while idx != -1:
    print(text[idx-100:idx+400])
    print("=" * 40)
    idx = text.find('mobileInternshipTopTrack', idx + 1)

