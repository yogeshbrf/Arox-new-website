import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
print("All HTML files:", html_files)

for f in html_files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Check for cta section or class
    has_cta = 'cta' in content.lower()
    cta_matches = re.findall(r'<section[^>]*class=[\'"][^\'\"]*cta[^\'\"]*[\'"][^>]*>', content, re.IGNORECASE)
    cta_ids = re.findall(r'<section[^>]*id=[\'"][^\'\"]*cta[^\'\"]*[\'"][^>]*>', content, re.IGNORECASE)
    print(f"{f}: cta classes = {cta_matches}, cta ids = {cta_ids}")

