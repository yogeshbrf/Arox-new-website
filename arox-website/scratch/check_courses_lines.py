with open('courses.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.internship-cards-rail,' in line or '.internship-card-slit.active {' in line or '.card-hero-title {' in line or '.card-hero-graphic {' in line:
        print(f"courses.html Line {i+1}: {line.strip()}")

