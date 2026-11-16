with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<input[^>]+class="([^"]+)"', text)
print('Input classes in training.html:', set(matches))

