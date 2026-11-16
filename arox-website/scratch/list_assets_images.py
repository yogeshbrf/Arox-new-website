import os

for root, dirs, files in os.walk('assets'):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            full = os.path.join(root, f)
            print(full)

