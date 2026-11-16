from PIL import Image

img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794600885893_a2660f84.jpg')
w, h = img.size

# Let's find:
# 1. Heading "Turn ideas into digital experiences."
# 2. Text "Discover how AROX Tech..."
# 3. Button "Start a Project" (Bright cyan/blue button)
# Let's find the bounding box of the blue button (Start a Project):
blue_pixels = []
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))[:3]
        # blue button has high B, decent G, lower R
        if b > 180 and g > 120 and r < 80:
            blue_pixels.append((x, y))

if blue_pixels:
    min_x = min(p[0] for p in blue_pixels)
    max_x = max(p[0] for p in blue_pixels)
    min_y = min(p[1] for p in blue_pixels)
    max_y = max(p[1] for p in blue_pixels)
    print(f"Blue Button bounding box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
    print(f"  Width: {max_x - min_x}, Height: {max_y - min_y}")

# Find white text (Heading)
white_pixels = []
for y in range(0, 150):
    for x in range(0, 600):
        r, g, b = img.getpixel((x, y))[:3]
        if r > 200 and g > 200 and b > 200:
            white_pixels.append((x, y))

if white_pixels:
    min_x = min(p[0] for p in white_pixels)
    max_x = max(p[0] for p in white_pixels)
    min_y = min(p[1] for p in white_pixels)
    max_y = max(p[1] for p in white_pixels)
    print(f"Heading text bounding box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
    print(f"  Width: {max_x - min_x}, Height: {max_y - min_y}")

# Find subtitle text (grey text between heading and button)
grey_pixels = []
for y in range(min_y if white_pixels else 100, min_y if blue_pixels else 200):
    for x in range(0, 600):
        r, g, b = img.getpixel((x, y))[:3]
        if 90 < r < 180 and 90 < g < 180 and 100 < b < 200:
            grey_pixels.append((x, y))

if grey_pixels:
    min_x = min(p[0] for p in grey_pixels)
    max_x = max(p[0] for p in grey_pixels)
    min_y = min(p[1] for p in grey_pixels)
    max_y = max(p[1] for p in grey_pixels)
    print(f"Subtitle text bounding box: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
    print(f"  Width: {max_x - min_x}, Height: {max_y - min_y}")

