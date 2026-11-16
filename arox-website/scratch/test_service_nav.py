import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)
try:
    print("=== TEST Service Card Navigation from index.html ===")
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    
    creative_link = driver.find_element("xpath", "//footer//a[contains(@href, 'service=creative')]")
    print("Found Creative link href:", creative_link.get_attribute("href"))
    creative_link.click()
    time.sleep(2.5)
    
    current_url = driver.current_url
    print("Landed on URL:", current_url)
    assert "services.html" in current_url and "service=creative" in current_url
    
    # Check active category pill
    active_btn = driver.find_element("css selector", ".services-category-pill-btn.active")
    print("Active services category pill:", active_btn.get_attribute("textContent").strip())
    assert "Creative" in active_btn.get_attribute("textContent")
    
    print("scrollY on services.html:", driver.execute_script("return window.scrollY;"))
    assert driver.execute_script("return window.scrollY;") > 300, "Did not scroll to service card!"
    print("✅ Service card external navigation PASSED!")

    print("\n=== TEST Service Card Navigation on same page (services.html) ===")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    
    infra_link = driver.find_element("xpath", "//footer//a[contains(@href, 'service=infrastructure')]")
    print("Found Infrastructure link href:", infra_link.get_attribute("href"))
    infra_link.click()
    time.sleep(2)
    
    active_btn2 = driver.find_element("css selector", ".services-category-pill-btn.active")
    print("Active pill after click:", active_btn2.get_attribute("textContent").strip())
    assert "Infrastructure" in active_btn2.get_attribute("textContent")
    print("✅ Service card same page navigation PASSED!")

finally:
    driver.quit()

