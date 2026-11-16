import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)
try:
    # 1. Start at #login
    driver.get('http://localhost:3000/login.html#login')
    time.sleep(1)
    
    # 2. Toggle to register
    driver.execute_script("toggleAuth('register')")
    time.sleep(2.0)
    
    # 3. Toggle back to signin
    driver.execute_script("toggleAuth('signin')")
    time.sleep(2.0)
    driver.save_screenshot("scratch/final_after_toggle_back_to_login.png")
    
    img = Image.open("scratch/final_after_toggle_back_to_login.png")
    w, h = img.size
    print(f"Back to Login dimensions: {w}x{h}")
    # In login, top SHOULD be blue!
    top_pixel = img.getpixel((w//2, 20))
    print(f"In login state, top at y=20: {top_pixel} (should be blue gradient)")
    
    # Check bottom in login state: should be white!
    bottom_pixel = img.getpixel((w//2, h - 30))
    print(f"In login state, bottom at y={h-30}: {bottom_pixel}")

finally:
    driver.quit()

