with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, l in enumerate(lines):
    if 'function openModal' in l or 'window.openModal' in l or 'window.openInternshipModal' in l:
        print(f'{i+1}: {l.strip()[:100]}')

