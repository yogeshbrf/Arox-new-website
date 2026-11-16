import json
from PIL import Image

ref_path = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794593177118_8a89a9fd.jpg'
real_path = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\real_power_bi_card.png'

ref = Image.open(ref_path)
real = Image.open(real_path)

print(f"Reference Image: {ref.size} (aspect ratio: {ref.size[0]/ref.size[1]:.3f})")
print(f"Real Card Image: {real.size} (aspect ratio: {real.size[0]/real.size[1]:.3f})")

# In reference image, let's find the card border if there's any outer margin
# Let's inspect pixel colors at corners and edges of ref
w, h = ref.size
print("Ref corner [10, 10]:", ref.getpixel((10, 10)))
print("Ref center top [w//2, 10]:", ref.getpixel((w//2, 10)))
print("Ref center [w//2, h//2]:", ref.getpixel((w//2, h//2)))
print("Ref bottom right [w-10, h-10]:", ref.getpixel((w-10, h-10)))

# Let's also check real card pixels
rw, rh = real.size
print("Real corner [10, 10]:", real.getpixel((10, 10)))
print("Real center [rw//2, rh//2]:", real.getpixel((rw//2, rh//2)))

