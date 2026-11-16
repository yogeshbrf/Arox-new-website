with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'arox-service-card' in l and 'className' in l:
        print(f"Line {i+1}:")
        for j in range(i, min(i+50, len(lines))):
            print(lines[j], end='')
        break

