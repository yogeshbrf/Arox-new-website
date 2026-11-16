from PIL import Image

im = Image.open('assets/CTC-d.png')
# check left side and right side
print("Format:", im.format, "Mode:", im.mode)
print("Pixel at x=100, y=362:", im.getpixel((100, 362)))
print("Pixel at x=1800, y=362:", im.getpixel((1800, 362)))

