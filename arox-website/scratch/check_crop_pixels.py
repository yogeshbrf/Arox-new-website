from PIL import Image

img = Image.open(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\scratch\current_mob_footer_bottom.png")
w, h = img.size
print(f"Crop size: {w}x{h}")
for y in range(0, h, 20):
    row = [img.getpixel((x, y)) for x in range(20, w-20, 40)]
    print(f"y={y}: center={img.getpixel((w//2, y))} sample={row[:2]}")
