with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(9364, 9410):
    print(lines[i].rstrip()[:100])

