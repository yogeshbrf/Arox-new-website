with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'function renderMobileInternshipRows' in line:
        for j in range(i, i+70):
            if j < len(lines):
                print(f"{j+1}: {lines[j]}", end='')
        break

