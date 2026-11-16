from PIL import Image

# Open cutout
cutout = Image.open("scratch/business_analytics_cutout.png")

# Composite on the dark card background color: #08162d
card_bg = Image.new("RGBA", cutout.size, (8, 22, 45, 255))
card_bg.paste(cutout, (0, 0), cutout)
card_bg.save("scratch/test_ba_on_dark.png")

# Composite on light card background: #f3f7fd
card_light = Image.new("RGBA", cutout.size, (243, 247, 253, 255))
card_light.paste(cutout, (0, 0), cutout)
card_light.save("scratch/test_ba_on_light.png")

print("Composites saved!")

