with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts_src = re.findall(r'<script[^>]*src="([^"]+)"', text)
for s in scripts_src:
    print(s)

