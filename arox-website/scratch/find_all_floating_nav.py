import os

for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['.git', 'node_modules', 'scratch', '.user_uploaded']):
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.css')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
            if 'services-floating-nav' in txt:
                print("Found in:", path)

