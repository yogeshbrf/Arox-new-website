with open(r'd:\Downloads\Arox new website\arox-website\detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Script src in detail.html:", re.findall(r'<script[^>]*src="([^"]+)"', text))
idx = text.rfind('<script')
print(text[idx:])

