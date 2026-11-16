with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<button[^>]*theme[^>]*>', text, re.IGNORECASE)
for m in matches:
    print(m)

