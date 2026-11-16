import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)
try:
    driver.get('http://localhost:3000/login.html#login')
    time.sleep(1)
    
    driver.execute_script("toggleAuth('register')")
    time.sleep(2.0)
    driver.save_screenshot("scratch/final_after_toggle_to_reg.png")
    
    img = Image.open("scratch/final_after_toggle_to_reg.png")
    w, h = img.size
    print(f"Image dimensions: {w}x{h}")
    for y in range(0, 100, 10):
        # Sample across x
        pixels = [img.getpixel((x, y)) for x in range(20, w-20, 50)]
        print(f"y={y}: center={img.getpixel((w//2, y))} sample={pixels[:2]}")
finally:
    driver.quit()

