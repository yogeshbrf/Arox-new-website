import glob

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    if 'Turn ideas into digital experiences' in c:
        print(f"Found in {f}")

