import re

files = ['about.html', 'contact.html', 'courses.html', 'detail.html', 'footer.html', 'index.html', 'services.html', 'training.html']

for f in files:
    content = open(f, encoding='utf-8').read()
    # Check copyright
    c_match = re.search(r'<p class="footer-copyright-bottom".*?</p>', content, re.DOTALL)
    # Check service links
    s_match = re.search(r'href="services\.html#(development|creative|business|infrastructure)"', content)
    # Check internship links
    i_match = re.search(r'href="training\.html\?domain=(cse_it|ece|mech|management)#internshipDomainWrap"', content)
    print(f"{f}:")
    print(f"  Copyright: {bool(c_match)}")
    print(f"  Service links: {bool(s_match)}")
    print(f"  Internship links: {bool(i_match)}")

