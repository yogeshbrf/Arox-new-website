import os
from PIL import Image

card_dir = 'd:/Downloads/Arox new website/arox-website/assets/internships/cards'
files = [f for f in os.listdir(card_dir) if f.endswith('.png')]

print(f"Total card images: {len(files)}")
for f in sorted(files):
    p = os.path.join(card_dir, f)
    with Image.open(p) as img:
        # find bounding box of non-transparent pixels
        bbox = img.getbbox()
        print(f"{f}: size={img.size}, bbox={bbox}")

