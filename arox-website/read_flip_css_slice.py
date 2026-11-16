with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(4690, 4865):
    print(f"{i+1}: {lines[i]}", end="")

