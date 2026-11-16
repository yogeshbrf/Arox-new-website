with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const flipCourses =')
if idx != -1:
    print(text[idx:idx+2500])
else:
    idx2 = text.find('flipCourses')
    print("Found flipCourses at", idx2)
    print(text[idx2-50:idx2+500])

