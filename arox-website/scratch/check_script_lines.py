with open('training.html', encoding='utf-8') as f:
    t = f.read()

import re
matches = [m.start() for m in re.finditer(r'<script', t)]
for idx in matches:
    line_num = t[:idx].count('\n') + 1
    # print first 50 chars of script tag
    print(f"Script at line {line_num}: {t[idx:idx+60]}")

