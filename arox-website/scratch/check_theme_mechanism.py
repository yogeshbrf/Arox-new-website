with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(?:theme-dark|theme-light|data-theme|\.dark)', text)
print("Theme class occurrences:", len(matches))
print(set(matches))

# Let's see theme toggle function
m = re.search(r'function\s+([a-zA-Z0-9_]*theme[a-zA-Z0-9_]*)\s*\(', text, re.IGNORECASE)
if m:
    print("Found theme function:", m.group(0))

# Search for theme button
idx = text.find('theme-toggle')
if idx != -1:
    print(text[idx-50:idx+200])

