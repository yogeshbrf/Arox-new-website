with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function formatHeroTitle' in line:
        for j in range(i, min(len(lines), i+25)):
            print(f"{j+1}: {lines[j]}", end='')
        break

