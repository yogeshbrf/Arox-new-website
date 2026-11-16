import glob, re

files = ['about.html', 'apply.html', 'contact.html', 'courses.html', 'detail.html', 'footer.html', 'index.html', 'services.html', 'training.html']

for f in files:
    content = open(f, encoding='utf-8').read()
    m = re.search(r'<p class="footer-copyright-bottom".*?</p>', content, re.DOTALL)
    if m:
        print(f"{f}: {m.group(0)}")
    else:
        print(f"{f}: NOT FOUND")

