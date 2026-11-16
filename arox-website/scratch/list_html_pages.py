import os

for f in sorted(os.listdir(r'd:\Downloads\Arox new website\arox-website')):
    if f.endswith('.html'):
        print(f)

