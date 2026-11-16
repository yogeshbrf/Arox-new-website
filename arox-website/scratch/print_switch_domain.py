with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(9250, 9350):
    print(f"{i+1}: {lines[i]}", end='')

