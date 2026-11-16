import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=390,844")
driver = webdriver.Chrome(options=options)
try:
    print("=== TEST Mobile: Copyright single line at 390px ===")
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    
    copy_el = driver.find_element("class name", "footer-copyright-bottom")
    print("Copyright text:", copy_el.text)
    print("Copyright height:", copy_el.size['height'])
    assert copy_el.size['height'] <= 28, f"Copyright height is {copy_el.size['height']}px (wrapped!)"
    print("✅ Copyright is rendered on a single line on mobile!")

    print("\n=== TEST Mobile: Navigate to MECH internship cards from footer ===")
    mech_link = driver.find_element("xpath", "//footer//a[contains(@href, 'domain=mech')]")
    # Open parent details if closed
    driver.execute_script("""
        const a = arguments[0];
        const det = a.closest('details');
        if (det) det.open = true;
        a.click();
    """, mech_link)
    time.sleep(2.5)
    
    print("Mobile landed on:", driver.current_url)
    assert "training.html" in driver.current_url and "domain=mech" in driver.current_url
    
    # Check mobile pill active
    active_mob_pill = driver.find_element("css selector", "#aroxMobilePillsRow .arox-mob-pill.active")
    print("Active mobile domain pill:", active_mob_pill.get_attribute("textContent").strip())
    assert "MECH" in active_mob_pill.get_attribute("textContent").upper()
    print("✅ Mobile MECH internship domain navigation PASSED!")

    print("\n=== TEST Mobile: Navigate to Creative service cards from footer ===")
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    
    creative_link = driver.find_element("xpath", "//footer//a[contains(@href, 'service=creative')]")
    driver.execute_script("""
        const a = arguments[0];
        const det = a.closest('details');
        if (det) det.open = true;
        a.click();
    """, creative_link)
    time.sleep(2.5)
    
    print("Mobile landed on:", driver.current_url)
    assert "services.html" in driver.current_url and "service=creative" in driver.current_url
    print("scrollY on mobile services:", driver.execute_script("return window.scrollY;"))
    assert driver.execute_script("return window.scrollY;") > 200
    print("✅ Mobile Creative service card navigation PASSED!")

finally:
    driver.quit()
