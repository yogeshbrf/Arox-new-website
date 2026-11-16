with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(7090, 7120):
    print(f"{i+1}: {lines[i]}", end='')

