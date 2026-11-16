with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
matches = [m.start() for m in re.finditer(r'data-domain', t)]
lines = t.split('\n')
for idx in matches:
    line_num = t[:idx].count('\n') + 1
    print(f"Line {line_num}:")
    for l in lines[max(0, line_num-3):min(len(lines), line_num+15)]:
        print("  ", l)

