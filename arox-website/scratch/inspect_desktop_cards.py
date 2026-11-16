with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find cards in hscrollSection
# Let's see the HTML around hscrollSection
match = re.search(r'<section[^>]*id="hscrollSection"[^>]*>(.*?)</section>', text, re.DOTALL)
if match:
    hscroll_html = match.group(1)
    print("Length of hscrollSection:", len(hscroll_html))
    # find classes of cards inside
    cards = re.findall(r'<div[^>]*class="([^"]*card[^"]*)"', hscroll_html)
    print("Found card classes:", set(cards))
else:
    print("hscrollSection not found in simple regex")

