import os

matches = []
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.mp4'):
            matches.append(os.path.join(root, f))

print("Total mp4 files found:", len(matches))
for m in matches[:20]:
    print(" ", m)

