import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's search for selectors that style sections in dark mode
selectors = [
    'body', 'main', 'section',
    '#hero', '.home-hero-pro', '.page-hero-pro',
    '#stats-section', '.stats-section',
    '#we-deliver-section', '.deliver-section-wrap',
    '#services-section', '.services-section',
    '#projects-section', '.featured-projects-section',
    '#testimonials-section', '.testimonials-section',
    '#mission-section', '#values-section', '#process-section',
    '#tech-stack-section',
    '#hscrollSection', '.hscroll-section', '.arox-mobile-courses-view',
    '#contact-content-section', '.contact-section',
    '.detail-section',
    '.cta-section', '#cta', '.cta-card',
    'footer', '.site-footer'
]

print("Checking dark mode rules for section selectors...")
for sel in selectors:
    pattern = rf'([^{{}}]*({re.escape(sel)})[^{{}}]*)\{{([^}}]*background[^}}]*)}}'
    matches = re.findall(pattern, css)
    dark_matches = []
    for m in matches:
        rule_sel, _, rule_body = m
        if any(d in rule_sel for d in ['dark', 'navy', 'data-theme']):
            dark_matches.append((rule_sel.strip(), rule_body.strip()))
    if dark_matches:
        print(f"\nSelector {sel}: {len(dark_matches)} dark rules found")
        for s, b in dark_matches[:3]:
            # extract background
            bg_lines = [line.strip() for line in b.split(';') if 'background' in line]
            print(f"  {s[:50]}... => {'; '.join(bg_lines)}")

