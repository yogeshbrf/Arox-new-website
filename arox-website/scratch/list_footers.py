import glob

for f in glob.glob('*.html'):
    content = open(f, encoding='utf-8').read()
    if '<footer' in content:
        print(f, "has footer, size:", len(content))

