with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.internship-card-slit.active' in line:
        for j in range(max(0, i-5), min(len(lines), i+45)):
            print(f"{j+1}: {lines[j]}", end='')
        print("---")

