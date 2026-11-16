from PIL import Image

im = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794594719213_1613e34d.jpg')
w, h = im.size

# Find the blue card bounding box inside the black background
top, bottom, left, right = None, None, None, None

# Find top
for y in range(h):
    for x in range(w):
        r, g, b = im.getpixel((x, y))[:3]
        if b > 100 and b > r + 30: # blue card pixel
            if top is None:
                top = y
            break
    if top is not None:
        break

# Find bottom
for y in range(h-1, -1, -1):
    for x in range(w):
        r, g, b = im.getpixel((x, y))[:3]
        if b > 100 and b > r + 30:
            if bottom is None:
                bottom = y
            break
    if bottom is not None:
        break

# Find left
for x in range(w):
    for y in range(h):
        r, g, b = im.getpixel((x, y))[:3]
        if b > 100 and b > r + 30:
            if left is None:
                left = x
            break
    if left is not None:
        break

# Find right
for x in range(w-1, -1, -1):
    for y in range(h):
        r, g, b = im.getpixel((x, y))[:3]
        if b > 100 and b > r + 30:
            if right is None:
                right = x
            break
    if right is not None:
        break

print(f"Card bounding box: left={left}, top={top}, right={right}, bottom={bottom}")
card_w = right - left
card_h = bottom - top
print(f"Card size: {card_w} x {card_h} (aspect ratio: {card_w/card_h:.2f})")
print(f"Margins around card in 1024x271 image: left={left} ({left/w*100:.1f}%), right={w-right} ({(w-right)/w*100:.1f}%), top={top} ({top/h*100:.1f}%), bottom={h-bottom} ({(h-bottom)/h*100:.1f}%)")

# Let's inspect the corner radius by looking at where the curve cuts off at the top-left corner
for offset in range(100):
    p = im.getpixel((left + offset, top + offset))
    # print distance to first solid blue pixel

