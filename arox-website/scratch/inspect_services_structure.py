import re

with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("File size:", len(html))

# Find section titles or category headings in services.html
headings = re.findall(r'<h[23][^>]*>(.*?)</h[23]>', html, re.DOTALL)
print("Headings:")
for h in headings[:30]:
    clean_h = re.sub(r'<[^>]+>', '', h).strip()
    if clean_h:
        print("  -", clean_h)

# Search for "Development", "Creative", "Business", "Infrastructure"
for kw in ["Development", "Creative", "Business Solutions", "Infrastructure"]:
    matches = [m.start() for m in re.finditer(re.escape(kw), html, re.IGNORECASE)]
    print(f"Keyword '{kw}': {len(matches)} occurrences")

# Find service cards markup structure
card_match = re.search(r'<div[^>]*class=[\'"][^\'"]*service-card[^\'"]*[\'"][^>]*>.*?(?=<!--\s*Card|<div[^>]*class=[\'"][^\'"]*service-card|\Z)', html, re.DOTALL)
if card_match:
    print("\nSample Service Card Markup:\n", card_match.group(0)[:600])

