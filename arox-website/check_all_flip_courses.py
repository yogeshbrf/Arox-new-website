with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'const flipCourses = \[(.*?)\];\s*const flipInternships', text, re.DOTALL)
if m:
    courses_str = m.group(1)
    # find each { id: ... }
    items = re.findall(r'\{\s*id:"([^"]+)"[^}]+title:"([^"]+)"[^}]+techStack:\[(.*?)\]', courses_str)
    for cid, title, tech in items:
        print(f"Course: {cid} ({title})")
        names = re.findall(r'name:"([^"]+)"', tech)
        print("  Tech:", names)

