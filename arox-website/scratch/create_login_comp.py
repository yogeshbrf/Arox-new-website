from PIL import Image

im_ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794597564283_9c5af9aa.jpg')
im_actual = Image.open('scratch/login_signin_fullscreen.png')

# Resize actual to match height of ref
target_h = im_ref.height
w_actual = int(im_actual.width * (target_h / im_actual.height))
im_actual_resized = im_actual.resize((w_actual, target_h), Image.Resampling.LANCZOS)

comp = Image.new('RGB', (im_ref.width + w_actual + 20, target_h), (30, 30, 30))
comp.paste(im_ref, (0, 0))
comp.paste(im_actual_resized, (im_ref.width + 20, 0))

comp.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\login_reference_comparison.png')
print("Comparison image saved to login_reference_comparison.png")

