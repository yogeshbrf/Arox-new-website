import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
options.add_argument("--disable-gpu")

driver = webdriver.Chrome(options=options)
try:
    print("=== TEST 1: Copyright single line on index.html ===")
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    
    # Scroll to footer
    footer = driver.find_element("tag name", "footer")
    driver.execute_script("arguments[0].scrollIntoView(true);", footer)
    time.sleep(0.5)
    
    copy_el = driver.find_element("class name", "footer-copyright-bottom")
    print("Copyright text:", copy_el.text)
    assert "© AROX Tech 2026 All Rights Reserved" in copy_el.text or "AROX Tech 2026 All Rights Reserved" in copy_el.text
    # Check that there is no <br> inside
    brs = copy_el.find_elements("tag name", "br")
    print(f"Number of <br> tags in copyright: {len(brs)}")
    assert len(brs) == 0, "Found <br> tag in copyright!"
    print("✅ Copyright single-line test PASSED!")

    print("\n=== TEST 2: Navigate to MECH domain in internship cards from index.html ===")
    # Click MECH link in footer
    mech_link = driver.find_element("xpath", "//footer//a[contains(@href, 'domain=mech')]")
    print("Found MECH link with href:", mech_link.get_attribute("href"))
    mech_link.click()
    time.sleep(2)
    
    current_url = driver.current_url
    print("Landed on URL:", current_url)
    assert "training.html" in current_url and "domain=mech" in current_url
    
    # Verify MECH is active
    active_pill = driver.find_element("css selector", ".intern-cat-pill.active")
    print("Active pill text:", active_pill.text)
    assert "MECH" in active_pill.text.upper()
    
    # Verify section is internship view
    hscroll = driver.find_element("id", "hscrollSection")
    print("hscroll classes:", hscroll.get_attribute("class"))
    assert "is-internship-view" in hscroll.get_attribute("class")
    print("✅ MECH domain navigation from external page PASSED!")

    print("\n=== TEST 3: Click ECE from footer while already on training page ===")
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    ece_link = driver.find_element("xpath", "//footer//a[contains(@href, 'domain=ece')]")
    ece_link.click()
    time.sleep(1.5)
    
    active_pill2 = driver.find_element("css selector", ".intern-cat-pill.active")
    print("Active pill text after footer click:", active_pill2.text)
    assert "ECE" in active_pill2.text.upper()
    print("✅ ECE domain navigation on same page PASSED!")

    print("\n=== TEST 4: Navigate to Creative & Experience service card from footer ===")
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(0.5)
    
    creative_link = driver.find_element("xpath", "//footer//a[contains(@href, 'service=creative')]")
    print("Found Creative link href:", creative_link.get_attribute("href"))
    creative_link.click()
    time.sleep(2)
    
    current_url = driver.current_url
    print("Landed on URL:", current_url)
    assert "services.html" in current_url and "service=creative" in current_url
    
    # Check that Creative & Experience is active or in view
    active_btn = driver.find_element("css selector", ".services-category-pill-btn.active")
    print("Active services category pill:", active_btn.text)
    assert "Creative" in active_btn.text
    print("✅ Service card navigation from external page PASSED!")

finally:
    driver.quit()

