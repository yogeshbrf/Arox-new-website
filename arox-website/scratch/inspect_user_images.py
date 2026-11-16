from PIL import Image

for name, path in [
    ("Image 1", r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794679947449_c16e8c81.png"),
    ("Image 2", r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794679947450_506aa5e7.png"),
    ("Image 3", r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794679954342_d62b0847.jpg"),
]:
    img = Image.open(path)
    print(f"{name}: size={img.size}, mode={img.mode}")

