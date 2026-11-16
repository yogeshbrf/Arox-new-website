with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(10590, 10645):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

