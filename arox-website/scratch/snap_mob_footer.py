import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts_m = Options()
opts_m.add_argument("--headless=new")
opts_m.add_argument("--window-size=390,844")
driver = webdriver.Chrome(options=opts_m)
try:
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    footer = driver.find_element("tag name", "footer")
    driver.execute_script("arguments[0].scrollIntoView(true);", footer)
    time.sleep(0.5)
    driver.save_screenshot(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\scratch\current_mob_footer_view.png")
    print("Screenshot saved to current_mob_footer_view.png")
finally:
    driver.quit()

