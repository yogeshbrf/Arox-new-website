import re

with open('services.html', 'r', encoding='utf-8') as f:
    s_content = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    i_content = f.read()

print("=== SERVICES.HTML ===")
# Find service cards in services.html
for m in re.finditer(r'class="([^"]*service-card[^"]*)"', s_content):
    print("Found class in services.html:", m.group(1))

# Check react/jsx in services.html
cards = re.findall(r'<div[^>]*arox-service-card[^>]*>', s_content)
print("arox-service-card in services.html count:", len(cards))
# let's see how a card is rendered in services.html
card_block = re.search(r'(\.arox-service-card\s*\{[^}]+\})', s_content)
if card_block:
    print("CSS:", card_block.group(1))

# find jsx snippet
jsx_match = re.search(r'(<div[^>]*className=[^>]*arox-service-card[^>]*>.*?</div>\s*</div>)', s_content, re.DOTALL)
if jsx_match:
    print("JSX snippet:", jsx_match.group(1)[:400])

print("\n=== INDEX.HTML ===")
for m in re.finditer(r'class="([^"]*(?:service|bento)[^"]*card[^"]*)"', i_content):
    print("Found class in index.html:", m.group(1))

