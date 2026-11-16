import numpy as np
from PIL import Image

p2 = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592164269_a537bb8d.jpg"

img = Image.open(p2).convert('RGBA')
arr = np.array(img)

# Check top left corner
print("Top-left 5x5 pixels RGB:")
print(arr[:5, :5, :3])

# Check brightness of background
rgb = arr[:, :, :3]
max_rgb = np.max(rgb, axis=2)
black_mask = max_rgb < 15
print("Percentage of pixels near black (<15):", np.mean(black_mask) * 100)

