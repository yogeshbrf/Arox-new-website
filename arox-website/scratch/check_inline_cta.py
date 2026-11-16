import re

pages = ['index.html', 'about.html', 'services.html', 'training.html', 'courses.html', 'contact.html', 'detail.html']

for p in pages:
    with open(p, 'r', encoding='utf-8') as fp:
        html = fp.read()
    
    # Check for .cta- in <style>
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    found = []
    for sb in style_blocks:
        if '.cta-' in sb or '#cta' in sb:
            found.append(sb[:150].strip().replace('\n', ' '))
    print(f"{p}: {len(found)} style blocks touching cta: {found}")

