with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "card.className = 'arox-mob-card-intern'" in line or 'arox-mob-card-intern' in line and '<script' not in line and 'style' not in line:
        for j in range(max(0, i-5), min(len(lines), i+35)):
            print(f"{j+1}: {lines[j]}", end='')
        break

