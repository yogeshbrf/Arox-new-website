import json
from PIL import Image

# Let's inspect CSS rules for .internship-card-slit.active, .card-hero-view, .card-hero-content,
# .card-hero-eyebrow-row, .card-hero-title, .card-hero-title-underline, .card-hero-desc,
# .card-hero-cta, .card-hero-graphic in training.html!

with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the CSS block for expanded card / hero view
start_css = html.find('.internship-card-slit.active {')
end_css = html.find('/* End of card hero styles */', start_css)
if end_css == -1:
    end_css = start_css + 2500

print("CURRENT CSS RULES:")
print(html[start_css:end_css])

