from PIL import Image

p2 = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592164269_a537bb8d.jpg"

img = Image.open(p2).convert('RGBA')
datas = img.getdata()

new_data = []
# Flood fill or threshold with smooth alpha
for item in datas:
    r, g, b, a = item
    brightness = max(r, g, b)
    if brightness <= 4:
        new_data.append((0, 0, 0, 0))
    elif brightness < 20:
        alpha = int((brightness - 4) / 16.0 * 255)
        new_data.append((r, g, b, alpha))
    else:
        new_data.append(item)

img.putdata(new_data)
out_path = "scratch/business_analytics_cutout.png"
img.save(out_path, "PNG")
print("Saved cutout to", out_path)

