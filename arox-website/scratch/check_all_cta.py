import glob
import re

for fpath in glob.glob('*.html'):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    cta_blocks = re.findall(r'<section[^>]*id=["\']cta["\'].*?</section>', content, re.DOTALL)
    if not cta_blocks:
        cta_blocks = re.findall(r'<section[^>]*class=["\'][^"\']*cta-section[^"\']*["\'].*?</section>', content, re.DOTALL)
    print(f"{fpath}: {len(cta_blocks)} cta section(s) found")
    if cta_blocks:
        # Check class of content
        m = re.search(r'class=["\']([^"\']*cta-[^"\']*)["\']', cta_blocks[0])
        if m:
            print(f"  sample class: {m.group(1)}")

