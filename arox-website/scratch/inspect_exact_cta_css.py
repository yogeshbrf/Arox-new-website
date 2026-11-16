with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

s1 = css.find('/* ─── PRE-FOOTER CTA SECTION & PROFESSIONAL CARDS ─── */')
e1 = css.find('/* Dedicated CTA Card Background Image Wrapper & Elements */', s1)

print("BLOCK 1:")
print(css[s1:e1])

s2 = css.find('.cta-content {', e1)
e2 = css.find('.cta-card .card-number {', s2)
print("BLOCK 2:")
print(css[s2:e2])

s3 = css.find('@media (max-width: 768px) {')
# find .cta-section inside media
s3_cta = css.find('.cta-section {', s3)
e3_cta = css.find('.theme-dark .cta-card,', s3_cta)
print("BLOCK 3 (Mobile):")
print(css[s3_cta:e3_cta])

