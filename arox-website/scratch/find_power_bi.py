with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find occurrences of POWER BI or power bi
matches = [m.start() for m in re.finditer(r'POWER BI', html, re.IGNORECASE)]
print(f"Found {len(matches)} occurrences of POWER BI")
for idx in matches:
    start = max(0, idx - 150)
    end = min(len(html), idx + 350)
    print("--- OCCURRENCE ---")
    print(html[start:end])

