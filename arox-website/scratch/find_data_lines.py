with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'data-domain' in line or 'internshipData' in line or 'coursesData' in line or 'domainTracks' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")

