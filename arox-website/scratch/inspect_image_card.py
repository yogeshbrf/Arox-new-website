from PIL import Image

img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794600885893_a2660f84.jpg')
w, h = img.size

# Check row 10 to see where the border begins horizontally
for x in range(0, w, 2):
    p = img.getpixel((x, 10))
    if sum(p) > 30: # border detected
        print(f"Top border at y=10 around x={x}, color={p}")
        break

# Check border positions
for y in range(0, h, 2):
    p = img.getpixel((w//2, y))
    if sum(p) > 40:
        print(f"Top edge of card around y={y}, color={p}")
        break

for y in range(h-1, 0, -2):
    p = img.getpixel((w//2, y))
    if sum(p) > 40:
        print(f"Bottom edge of card around y={y}, color={p}")
        break

for x in range(0, w, 2):
    p = img.getpixel((x, h//2))
    if sum(p) > 40:
        print(f"Left edge of card around x={x}, color={p}")
        break

for x in range(w-1, 0, -2):
    p = img.getpixel((x, h//2))
    if sum(p) > 40:
        print(f"Right edge of card around x={x}, color={p}")
        break
