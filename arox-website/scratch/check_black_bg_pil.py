from PIL import Image

p2 = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592164269_a537bb8d.jpg"

img = Image.open(p2).convert('RGBA')
width, height = img.size

# check corner pixels
corners = [img.getpixel((0, 0)), img.getpixel((width-1, 0)), img.getpixel((0, height-1)), img.getpixel((width-1, height-1))]
print("Corner pixels:", corners)

# Sample 100 pixels along the top edge
top_edge = [img.getpixel((x, 0)) for x in range(0, width, 10)]
print("Top edge max RGB:", max(max(p[:3]) for p in top_edge))

