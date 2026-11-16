with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

s = css.find('/* ─── PRE-FOOTER CTA SECTION & PROFESSIONAL CARDS ─── */')
e = css.find('/* ─── 4. CTA SECTION STANDARDIZATION', s)
if e == -1:
    e = s + 3000
print(css[s:s+2500])

