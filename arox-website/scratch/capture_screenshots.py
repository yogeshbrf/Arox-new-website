import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# 1. Desktop screenshot of single line footer
opts_d = Options()
opts_d.add_argument("--headless=new")
opts_d.add_argument("--window-size=1440,900")
driver_d = webdriver.Chrome(options=opts_d)
try:
    driver_d.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver_d.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    driver_d.save_screenshot(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\footer_desktop_single_line.png")
    
    # 2. Desktop MECH landing screenshot
    driver_d.get("http://localhost:3000/training.html?tab=internship&domain=mech#internshipDomainWrap")
    time.sleep(2)
    driver_d.save_screenshot(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\mech_domain_cards_desktop.png")
finally:
    driver_d.quit()

# 3. Mobile screenshot of single line footer and MECH landing
opts_m = Options()
opts_m.add_argument("--headless=new")
opts_m.add_argument("--window-size=390,844")
driver_m = webdriver.Chrome(options=opts_m)
try:
    driver_m.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver_m.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    driver_m.save_screenshot(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\footer_mobile_single_line.png")
    
    # 4. Mobile MECH landing screenshot
    driver_m.get("http://localhost:3000/training.html?tab=internship&domain=mech#internshipDomainWrap")
    time.sleep(2.5)
    driver_m.save_screenshot(r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\mech_domain_cards_mobile.png")
finally:
    driver_m.quit()

print("All screenshots captured and saved to artifacts directory!")

