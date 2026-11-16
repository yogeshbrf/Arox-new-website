import os
import re

base = r'd:\Downloads\Arox new website\arox-website'
html_files = ['index.html', 'about.html', 'services.html', 'training.html', 'courses.html', 'contact.html', 'detail.html']

for hf in html_files:
    p = os.path.join(base, hf)
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    idx = content.find('id="cta"')
    if idx == -1:
        idx = content.find('class="cta-section"')
    print(f"=== {hf} ===")
    if idx != -1:
        idx_end = content.find('</section>', idx)
        print(content[idx:idx_end+10])
    else:
        print("Not found")
    print('='*50)

