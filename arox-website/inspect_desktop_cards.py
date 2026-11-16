with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
css_match = re.search(r'/\* =+ FLIP CARD.*?/\* =+', text, re.DOTALL)
if css_match:
    print("CSS for flip card:")
    print(css_match.group(0)[:2500])

html_match = re.search(r'<div class="flip-card-wrapper".*?</div>\s*</div>\s*</div>\s*</div>', text, re.DOTALL)
if html_match:
    print("\nHTML for flip card:")
    print(html_match.group(0)[:3000])

