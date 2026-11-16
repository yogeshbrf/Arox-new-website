from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794595153943_1e0b7c13.jpg')

# Active card colors:
# Top-left, center, bottom-right of active card (x in [50, 450], y in [50, 380])
print("=== ACTIVE CARD COLORS ===")
print("Top-left (100, 80):", ref.getpixel((100, 80))[:3])
print("Center-left (100, 200):", ref.getpixel((100, 200))[:3])
print("Center (250, 200):", ref.getpixel((250, 200))[:3])
print("Bottom-left (100, 350):", ref.getpixel((100, 350))[:3])
print("Bottom-center (250, 350):", ref.getpixel((250, 350))[:3])
print("Active card border top (250, 20):", ref.getpixel((250, 20))[:3])
print("Active card border right (506, 200):", ref.getpixel((506, 200))[:3])

print("\n=== INACTIVE SLIT CARDS COLORS ===")
# Inactive card 02 is around x = 540
# Let's inspect vertically through card 02 (x = 540)
for y in [30, 80, 150, 220, 300, 380]:
    print(f"Card 02 at y={y}:", ref.getpixel((540, y))[:3])

# Inactive card 03 at x = 595
print("Card 03 at y=200:", ref.getpixel((595, 200))[:3])
# Inactive card 05 at x = 705
print("Card 05 at y=200:", ref.getpixel((705, 200))[:3])

print("\n=== RAIL CONTAINER (GAP/BACKGROUND) ===")
# Gap between active card and card 02 is at x = 514
print("Gap at (514, 200):", ref.getpixel((514, 200))[:3])
# Gap between card 02 and 03 at x = 570
print("Gap at (570, 200):", ref.getpixel((570, 200))[:3])
# Rail container border/corner
print("Rail corner (10, 10):", ref.getpixel((10, 10))[:3])

