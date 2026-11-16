with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i in range(10300, 10335):
    if i < len(lines):
        print(f'{i+1}: {lines[i]}')

