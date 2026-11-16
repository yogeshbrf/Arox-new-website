from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
w, h = ref.size

# Let's inspect vertical scanlines or crop portions:
# 1. Eyebrow: around y = 0.05*h to 0.15*h
# 2. Title: around y = 0.12*h to 0.35*h
# 3. Underline: around y = 0.30*h to 0.40*h
# 4. Description: around y = 0.35*h to 0.50*h
# 5. Button: around y = 0.48*h to 0.60*h
# 6. Graphic: from y = 0.40*h to 0.98*h, x = 0.35*w to 0.98*w

# Let's crop eyebrow, title, desc, button, graphic and save them to scratch
ref.crop((0, int(0.05*h), int(0.7*w), int(0.15*h))).save('scratch/ref_eyebrow.png')
ref.crop((0, int(0.12*h), int(0.6*w), int(0.35*h))).save('scratch/ref_title.png')
ref.crop((0, int(0.32*h), int(0.65*w), int(0.48*h))).save('scratch/ref_desc.png')
ref.crop((0, int(0.46*h), int(0.55*w), int(0.60*h))).save('scratch/ref_button.png')
ref.crop((int(0.3*w), int(0.40*h), w, h)).save('scratch/ref_graphic.png')
print("Cropped reference subregions successfully")

