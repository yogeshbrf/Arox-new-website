import re, json

with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find DOMAIN_COURSES definition
match = re.search(r'const DOMAIN_COURSES = ({.*?});\s*const', html, re.DOTALL)
if match:
    # let's parse or print keys and titles
    js_text = match.group(1)
    # find all { id: "...", title: "..." }
    items = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"].*?title:\s*[\'"]([^\'"]+)[\'"]', js_text, re.DOTALL)
    print(f"Total courses: {len(items)}")
    for id_val, title in items:
        print(f"  id: {id_val:<32} title: {title}")
else:
    print("DOMAIN_COURSES not found with regex")

