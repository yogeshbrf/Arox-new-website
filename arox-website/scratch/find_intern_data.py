import json, re

with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the internship data array or structure
data_match = re.search(r'const\s+domainTracks\s*=\s*({.*?});\s*(?:const|let|var|function)', html, re.DOTALL)
if data_match:
    print("Found domainTracks!")
else:
    # search for internship cards data
    print("Searching for internship card definitions...")
    for match in re.finditer(r'(CSE & IT|MANAGEMENT|ECE|MECH)', html):
        idx = match.start()
        print(html[idx-50:idx+200])
        print("---")
        break

