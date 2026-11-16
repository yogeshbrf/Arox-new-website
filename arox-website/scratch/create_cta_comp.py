from PIL import Image

im_ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794597039255_c53a7331.jpg')
im_actual = Image.open('scratch/updated_cta_training.png')

# Resize actual to match height of ref
target_h = im_ref.height
w_actual = int(im_actual.width * (target_h / im_actual.height))
im_actual_resized = im_actual.resize((w_actual, target_h), Image.Resampling.LANCZOS)

comp = Image.new('RGB', (im_ref.width + w_actual + 20, target_h), (20, 20, 20))
comp.paste(im_ref, (0, 0))
comp.paste(im_actual_resized, (im_ref.width + 20, 0))

comp.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\cta_task3_comparison.png')
print("Comparison image saved to cta_task3_comparison.png")

