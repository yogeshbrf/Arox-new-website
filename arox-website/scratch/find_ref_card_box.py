from PIL import Image

ref_path = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794593177118_8a89a9fd.jpg'
ref = Image.open(ref_path)
w, h = ref.size

# Find top border
top = 0
for y in range(h):
    # check if horizontal scanline has bright pixels (card border)
    brights = [x for x in range(w) if sum(ref.getpixel((x, y))) > 60]
    if len(brights) > 100:
        top = y
        break

# Find bottom border
bottom = h - 1
for y in range(h - 1, -1, -1):
    brights = [x for x in range(w) if sum(ref.getpixel((x, y))) > 60]
    if len(brights) > 100:
        bottom = y
        break

# Find left border
left = 0
for x in range(w):
    brights = [y for y in range(h) if sum(ref.getpixel((x, y))) > 60]
    if len(brights) > 100:
        left = x
        break

# Find right border
right = w - 1
for x in range(w - 1, -1, -1):
    brights = [y for y in range(h) if sum(ref.getpixel((x, y))) > 60]
    if len(brights) > 100:
        right = x
        break

print(f"Card in ref image: left={left}, top={top}, right={right}, bottom={bottom}")
print(f"Card size in ref image: width={right - left}, height={bottom - top}, aspect ratio={(right - left)/(bottom - top):.3f}")

# Crop the card from ref
card_crop = ref.crop((left, top, right, bottom))
card_crop.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
print("Saved ref_card_crop.png")

