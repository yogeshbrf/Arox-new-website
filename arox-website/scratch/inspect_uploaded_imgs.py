from PIL import Image

p1 = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592152160_32afc57b.png"
p2 = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592164269_a537bb8d.jpg"

with Image.open(p1) as img1:
    print(f"Image 1 (HR & Finance): mode={img1.mode}, size={img1.size}")
    if 'A' in img1.mode:
        print("  Has alpha channel! Checking bbox:", img1.getbbox())
    else:
        print("  No alpha channel")

with Image.open(p2) as img2:
    print(f"Image 2 (Business Analytics): mode={img2.mode}, size={img2.size}")

