from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794595153943_1e0b7c13.jpg')
w, h = ref.size

# Let's inspect horizontal scanline at y = 100 (where numbers 02, 03, ... are located)
# and y = 200 (middle)
# and find the borders between cards
# Let's check brightness or gradient of borders
scanline_y = 200

# Let's find the right edge of active card
# Active card starts around x = 16 (padding inside rail)
# Let's scan from x = 16 to x = 600 at y = 200
active_left = None
active_right = None

# Let's inspect pixel colors across x from 0 to w at y = 200
row = [ref.getpixel((x, 200))[:3] for x in range(w)]

# Active card has a distinct border with glow
# Let's find where the active card border is
# Let's inspect x from 10 to 600
for x in range(10, 50):
    if sum(row[x]) > 40:
        active_left = x
        break

# The active card has a right border around x = 400..600
# In between active card and card 02, there is a gap / dark space
for x in range(450, 600):
    # look for bright border of card 01 or card 02
    r, g, b = row[x]
    # let's inspect the colors around here

print("Sampling row at y=200 around 450-550:")
for x in range(480, 530, 2):
    print(f"x={x}: {ref.getpixel((x, 200))[:3]}")

# Let's also inspect numbers row at y = 90
print("\nSampling row at y=90 for slit numbers:")
for x in range(500, 1010, 10):
    print(f"x={x}: {ref.getpixel((x, 90))[:3]}")

