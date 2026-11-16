import glob
import re

html_files = glob.glob('*.html')
for hf in sorted(html_files):
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    sections = re.findall(r'<section([^>]*)>', content, re.IGNORECASE)
    print(f'=== {hf} ({len(sections)} sections) ===')
    for s in sections:
        # extract id and class
        id_m = re.search(r'id=["\']([^"\']*)["\']', s)
        cls_m = re.search(r'class=["\']([^"\']*)["\']', s)
        sid = id_m.group(1) if id_m else ''
        scls = cls_m.group(1) if cls_m else ''
        print(f'  id: "{sid}" | class: "{scls}"')

