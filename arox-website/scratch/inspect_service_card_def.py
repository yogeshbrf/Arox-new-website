with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1600, 1630):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

