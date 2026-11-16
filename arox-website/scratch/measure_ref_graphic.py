from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
w, h = ref.size

# Graphic is on the lower right
# Let's find bounding box of yellow bars (yellow has high red and high green, low blue)
# and laptop screen (blue/white/cyan)
yellow_min_x, yellow_min_y, yellow_max_x, yellow_max_y = 9999, 9999, -1, -1
laptop_min_x, laptop_min_y, laptop_max_x, laptop_max_y = 9999, 9999, -1, -1

for x in range(int(0.25*w), w - 30):
    for y in range(int(0.35*h), h - 30):
        r, g, b = ref.getpixel((x, y))[:3]
        # Yellow bars
        if r > 180 and g > 140 and b < 80:
            if x < yellow_min_x: yellow_min_x = x
            if y < yellow_min_y: yellow_min_y = y
            if x > yellow_max_x: yellow_max_x = x
            if y > yellow_max_y: yellow_max_y = y
        # Laptop screen or graphics
        if (r + g + b) / 3 > 120 and (b > r or (r > 150 and g > 150 and b > 150)):
            if x < laptop_min_x: laptop_min_x = x
            if y < laptop_min_y: laptop_min_y = y
            if x > laptop_max_x: laptop_max_x = x
            if y > laptop_max_y: laptop_max_y = y

print(f"Yellow chart: ({yellow_min_x}, {yellow_min_y}, {yellow_max_x}, {yellow_max_y})")
print(f"Yellow top %: {yellow_min_y/h*100:.1f}%, bottom %: {yellow_max_y/h*100:.1f}%, right %: {yellow_max_x/w*100:.1f}%")
print(f"Laptop/Graphic: ({laptop_min_x}, {laptop_min_y}, {laptop_max_x}, {laptop_max_y})")
print(f"Graphic left %: {laptop_min_x/w*100:.1f}%, top %: {laptop_min_y/h*100:.1f}%, right %: {laptop_max_x/w*100:.1f}%, bottom %: {laptop_max_y/h*100:.1f}%")

