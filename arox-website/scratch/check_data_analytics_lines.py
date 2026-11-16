with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'data_analytics.png' in l:
        print(f"{i+1}: {l.strip()}")

