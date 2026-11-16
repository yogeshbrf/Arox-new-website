from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
real = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\real_power_bi_card.png')

# Let's save a 2x1 comparison where real is on right and ref is on left:
w_ref, h_ref = ref.size
w_real, h_real = real.size

# Target height 600
target_h = 600
scale_ref = target_h / h_ref
scale_real = target_h / h_real

ref_resized = ref.resize((int(w_ref * scale_ref), target_h), Image.Resampling.LANCZOS)
real_resized = real.resize((int(w_real * scale_real), target_h), Image.Resampling.LANCZOS)

comp = Image.new('RGB', (ref_resized.size[0] + real_resized.size[0] + 40, target_h + 60), (10, 15, 25))
comp.paste(ref_resized, (20, 40))
comp.paste(real_resized, (ref_resized.size[0] + 30, 40))

comp.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\visual_audit_comparison.png')
print("Saved visual_audit_comparison.png")

