with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1500, 1750):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

