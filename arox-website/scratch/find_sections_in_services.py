with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines[:1450]):
    if '<section' in line or 'id="services' in line or 'id="root"' in line or 'id="hero"' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")

