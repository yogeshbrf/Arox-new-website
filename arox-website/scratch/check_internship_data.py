with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find internshipData or domain data
idx = html.find('internshipData')
if idx != -1:
    print(html[idx:idx+4000])
else:
    print("internshipData not found directly by name")

