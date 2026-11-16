with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1450, 1505):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

