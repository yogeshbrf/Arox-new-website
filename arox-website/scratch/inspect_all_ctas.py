import os
import re

base = r'd:\Downloads\Arox new website\arox-website'
html_files = [f for f in os.listdir(base) if f.endswith('.html') and not f.endswith('.original.html')]

for hf in sorted(html_files):
    p = os.path.join(base, hf)
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    cta_matches = re.findall(r'<section[^>]*class="[^"]*cta[^"]*"[^>]*>[\s\S]*?<\/section>', content, re.IGNORECASE)
    print(f"=== {hf} ===")
    if cta_matches:
        for c in cta_matches:
            # print first 500 chars of cta section
            print(c[:400])
            print('...')
    else:
        # maybe id="cta" or similar
        m2 = re.findall(r'<section[^>]*id="cta"[^>]*>[\s\S]*?<\/section>', content, re.IGNORECASE)
        if m2:
            print("Found by id='cta':", m2[0][:400])
        else:
            print("No CTA section found")
    print("\n")

