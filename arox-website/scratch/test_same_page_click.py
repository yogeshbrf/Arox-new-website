import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3000/training.html")
    time.sleep(1)
    
    # Scroll to footer
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    
    # Click ECE
    ece_link = driver.find_element("xpath", "//footer//a[contains(@href, 'domain=ece')]")
    ece_link.click()
    time.sleep(1.5)
    
    active_pill = driver.find_element("css selector", ".intern-cat-pill.active")
    print("Active pill data-domain:", active_pill.get_attribute("data-domain"))
    print("Active pill textContent:", active_pill.get_attribute("textContent").strip())
    print("currentActiveDomain:", driver.execute_script("return window.currentActiveDomain;"))
    print("scrollY:", driver.execute_script("return window.scrollY;"))
finally:
    driver.quit()

