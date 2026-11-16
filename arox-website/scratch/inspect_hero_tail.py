with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(3170, 3250):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

