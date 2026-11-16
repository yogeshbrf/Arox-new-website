with open('training.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

tests = [
    ("1. Rail", r'(\.internship-cards-rail,\s*\.domain-cards-track\s*\{[^}]*?height:\s*)[^;]+;'),
    ("2. Inactive slit", r'(\.internship-card-slit\s*\{[^}]*?flex:\s*)0 0 \d+px;'),
    ("3. Active slit", r'\.internship-card-slit\.active\s*\{[^}]*?\}.*?\.theme-dark \.internship-card-slit\.active\s*\{[^}]*?\}'),
    ("4. Padding", r'(\.card-hero-view\s*\{[^}]*?padding:\s*)[^;]+;'),
    ("5. Max width", r'(\.card-hero-content\s*\{[^}]*?max-width:\s*)[^;]+;'),
    ("6. Eyebrow", r'\.card-hero-eyebrow-row\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-fade-line\s*\{[^}]*?\}'),
    ("7. Title", r'\.card-hero-title\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-title-underline\s*\{[^}]*?\}'),
    ("8. Desc", r'\.card-hero-desc\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-desc\s*\{[^}]*?\}'),
    ("9. CTA", r'\.card-hero-cta\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-cta:hover\s*\{[^}]*?\}'),
    ("10. Graphic", r'\.card-hero-graphic\s*\{[^}]*?\}.*?\.internship-card-slit\.active:hover \.hero-card-img\s*\{[^}]*?\}'),
    ("11. Waves", r'\.card-hero-waves\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-waves\s*\{[^}]*?\}'),
]

for name, pattern in tests:
    m = re.search(pattern, content, flags=re.DOTALL)
    print(f"{name}: {'MATCHED' if m else 'FAILED'}")

