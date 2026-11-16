from PIL import Image

img = Image.open(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\scratch\current_mob_footer_view.png")
print("Size:", img.size)

# Crop the bottom 300px
crop = img.crop((0, img.height - 350, img.width, img.height))
crop.save(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\scratch\current_mob_footer_bottom.png")
print("Saved bottom crop to current_mob_footer_bottom.png")

