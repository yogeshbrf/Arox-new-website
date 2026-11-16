with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
matches = [m.start() for m in re.finditer(r'cse_it', t)]
lines = t.split('\n')
for idx in matches:
    line_num = t[:idx].count('\n') + 1
    line = lines[line_num - 1]
    if 'button' not in line and 'data-domain' not in line:
        print(f"Line {line_num}: {line.strip()[:100]}")

