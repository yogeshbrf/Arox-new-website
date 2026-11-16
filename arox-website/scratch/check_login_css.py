with open('login.html', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i in range(340, 390):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}')

