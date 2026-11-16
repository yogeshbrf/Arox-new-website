# Inspect services.html and training.html
print("=== SERVICES.HTML ===")
with open('services.html', encoding='utf-8') as f:
    s_html = f.read()

# Look for development, creative, business, infrastructure or service cards
import re
print("Matches for '#development' or id='development' in services.html:")
for m in re.finditer(r'id=["\'](development|creative|business|infrastructure)["\']', s_html, re.I):
    print(m.group(0))

# Find filter buttons or domain tabs in services.html
for m in re.finditer(r'<button[^>]*class=["\'][^"\']*(tab|filter|domain)[^"\']*["\'][^>]*>(.*?)</button>', s_html, re.I):
    print("Filter/tab btn:", m.group(0)[:100])

# Find service cards in services.html
for m in re.finditer(r'class=["\'][^"\']*card[^"\']*["\'][^>]*id=["\']([^"\']+)["\']', s_html, re.I):
    print("Card with id:", m.group(1))

print("\n=== TRAINING.HTML ===")
with open('training.html', encoding='utf-8') as f:
    t_html = f.read()

# Look for domain tabs or cards in training.html
for m in re.finditer(r'data-domain=["\']([^"\']+)["\']', t_html):
    print("data-domain:", m.group(1))

for m in re.finditer(r'id=["\']([^"\']*(?:internship|domain|cse|ece|mech|management)[^"\']*)["\']', t_html, re.I):
    print("Relevant ID in training.html:", m.group(1))

