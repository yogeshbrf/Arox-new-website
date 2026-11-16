with open('training.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if '.flip-card-front' in l or 'class="flip-card' in l or 'flip-card-wrapper' in l:
        print(f"Line {i+1}: {l.strip()}")

