import re

files = ['index.html', 'about.html', 'services.html', 'training.html', 'courses.html', 'contact.html', 'detail.html']

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        html = fp.read()
    
    # find #cta or .cta-section
    idx = html.find('id="cta"')
    if idx == -1:
        idx = html.find('class="cta-section"')
    if idx != -1:
        end = html.find('</section>', idx)
        print(f"=== {f} ===")
        print(html[idx:min(idx+500, end+10)])
    else:
        print(f"=== {f}: NO CTA FOUND ===")

