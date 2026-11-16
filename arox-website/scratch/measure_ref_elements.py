from PIL import Image

ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\ref_card_crop.png')
w, h = ref.size

# The card border has a glowing border around x=20-40.
# Let's find text by looking inside x in [50, 450]
def find_box(x1, y1, x2, y2, threshold=140):
    min_x, min_y, max_x, max_y = 9999, 9999, -1, -1
    for x in range(x1, x2):
        for y in range(y1, y2):
            r, g, b = ref.getpixel((x, y))[:3]
            if (r + g + b) / 3 > threshold:
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y
    return (min_x, min_y, max_x, max_y)

pill_bar = find_box(60, 80, 100, 130, 120)
eyebrow_txt = find_box(90, 80, 600, 130, 140)
title_power = find_box(60, 140, 500, 240, 180)
title_bi = find_box(60, 230, 300, 320, 140)
underline = find_box(65, 320, 180, 350, 120)
desc = find_box(60, 350, 650, 470, 120)
btn = find_box(50, 470, 360, 560, 100)

print("Eyebrow pill bar:", pill_bar, f"left %: {pill_bar[0]/w*100:.1f}%, top %: {pill_bar[1]/h*100:.1f}%")
print("Eyebrow text:", eyebrow_txt)
print("Title POWER:", title_power, f"left %: {title_power[0]/w*100:.1f}%, top %: {title_power[1]/h*100:.1f}%, h: {title_power[3]-title_power[1]}")
print("Title BI:", title_bi, f"left %: {title_bi[0]/w*100:.1f}%, top %: {title_bi[1]/h*100:.1f}%, h: {title_bi[3]-title_bi[1]}")
print("Underline:", underline, f"left %: {underline[0]/w*100:.1f}%, width: {underline[2]-underline[0]}, height: {underline[3]-underline[1]}")
print("Description:", desc, f"left %: {desc[0]/w*100:.1f}%, width: {desc[2]-desc[0]}, height: {desc[3]-desc[1]}")
print("CTA Button:", btn, f"left %: {btn[0]/w*100:.1f}%, top %: {btn[1]/h*100:.1f}%, width: {btn[2]-btn[0]}, height: {btn[3]-btn[1]}")
