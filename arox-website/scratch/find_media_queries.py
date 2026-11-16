with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '@media' in line and '768' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")

