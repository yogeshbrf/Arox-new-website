import os
from PIL import Image

# Let's save crops of each section side by side:
# 1. Title section of Ref vs Real
# 2. Desc section of Ref vs Real
# 3. CTA button of Ref vs Real
# 4. Graphic of Ref vs Real

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
real = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\real_power_bi_card.png')

print("Ref size:", ref.size)
print("Real size:", real.size)

