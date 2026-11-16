with open('training.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'URLSearchParams' in line or 'internshipDomainWrap' in line:
        print(f"--- Around line {i+1} ---")
        for j in range(max(0, i-5), min(len(lines), i+20)):
            print(f"{j+1}: {lines[j]}", end='')

