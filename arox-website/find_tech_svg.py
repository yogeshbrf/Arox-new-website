with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function techSVG(')
if idx != -1:
    print(text[idx:idx+2000])
else:
    print("techSVG not found by exact string, searching regex...")
    import re
    m = re.search(r'const techSVG|function techSVG', text)
    if m:
        print(text[m.start():m.start()+2000])

