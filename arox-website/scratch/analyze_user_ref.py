from PIL import Image

ref_path = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794595153943_1e0b7c13.jpg'
ref = Image.open(ref_path)
w, h = ref.size
print(f"Reference image size: {w} x {h} (aspect ratio: {w/h:.3f})")

# Let's inspect the bounding box of the whole rail (container)
# It has a dark background with blue glowing border or rounded corners
# Let's inspect horizontal scanline across the middle (y = h // 2)
# and vertical scanline across x = w // 4
middle_y = h // 2
scanline = [ref.getpixel((x, middle_y))[:3] for x in range(w)]

# Find where the rail starts and ends horizontally
for x in range(w):
    r, g, b = ref.getpixel((x, middle_y))[:3]
    if (r + g + b) > 30:
        left_rail = x
        break

for x in range(w - 1, -1, -1):
    r, g, b = ref.getpixel((x, middle_y))[:3]
    if (r + g + b) > 30:
        right_rail = x
        break

print(f"Rail horizontally: {left_rail} to {right_rail} (width: {right_rail - left_rail})")

# Let's find top and bottom of the rail
middle_x = w // 2
for y in range(h):
    r, g, b = ref.getpixel((middle_x, y))[:3]
    if (r + g + b) > 30:
        top_rail = y
        break

for y in range(h - 1, -1, -1):
    r, g, b = ref.getpixel((middle_x, y))[:3]
    if (r + g + b) > 30:
        bottom_rail = y
        break

print(f"Rail vertically: {top_rail} to {bottom_rail} (height: {bottom_rail - top_rail})")

