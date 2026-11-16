with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(7450, 7520):
    print(f"{i+1}: {lines[i]}", end='')

