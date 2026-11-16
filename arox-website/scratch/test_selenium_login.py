import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=390,844")
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(options=options)
try:
    # 1. Test #register
    driver.get("http://localhost:3000/login.html#register")
    time.sleep(1)
    driver.save_screenshot("scratch/test_register_mobile.png")
    print("Screenshot saved to scratch/test_register_mobile.png")

    img = Image.open("scratch/test_register_mobile.png")
    w, h = img.size
    print(f"Image size: {w}x{h}")
    # Inspect top 50px
    top_pixels = [img.getpixel((w//2, y)) for y in range(0, min(80, h), 10)]
    for y, p in zip(range(0, min(80, h), 10), top_pixels):
        print(f"y={y}: rgb={p}")

    # 2. Test #login
    driver.get("http://localhost:3000/login.html#login")
    time.sleep(1)
    driver.save_screenshot("scratch/test_login_mobile.png")
    print("Screenshot saved to scratch/test_login_mobile.png")

    # 3. Test toggle transition to register
    reg_btn = driver.find_element("xpath", "//div[@id='mobPanelTop']//button[contains(text(),'Register')]")
    reg_btn.click()
    time.sleep(1.8) # wait for animation to complete
    driver.save_screenshot("scratch/test_after_toggle_to_register.png")
    print("Screenshot saved to scratch/test_after_toggle_to_register.png")

    img_after = Image.open("scratch/test_after_toggle_to_register.png")
    top_pixels_after = [img_after.getpixel((w//2, y)) for y in range(0, min(80, h), 10)]
    for y, p in zip(range(0, min(80, h), 10), top_pixels_after):
        print(f"after toggle y={y}: rgb={p}")

finally:
    driver.quit()

