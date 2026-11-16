from PIL import Image

im = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794594719213_1613e34d.jpg')
left, top = 86, 46

# Check pixels near top-left corner
# Where does y=top start having blue?
for y in range(top, top + 40):
    for x in range(left, left + 40):
        r, g, b = im.getpixel((x, y))[:3]
        if b > 100 and b > r + 30:
            # First blue pixel on this scanline
            print(f"y={y - top}: starts at x={x - left}")
            break

