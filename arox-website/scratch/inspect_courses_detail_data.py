with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))
idx = text.find('coursesData =')
print(text[idx:idx+1200])

