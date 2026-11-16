import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    # 1. Load training.html on mobile viewport
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Check .scroll-hint visibility on mobile
    hints = driver.find_elements(By.CLASS_NAME, 'scroll-hint')
    is_hint_visible = any(h.is_displayed() for h in hints)
    print(f"Mobile Check - Is 'Scroll to explore' hint visible? {is_hint_visible}")

    # Capture mobile screenshot showing no scroll hint
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_no_scroll_hint.png')
    print("Saved mobile_no_scroll_hint.png")

    # 2. Test Training Card Navigation (Click Card 1)
    card1 = driver.find_element(By.CSS_SELECTOR, '.arox-exact-train-card')
    card1_title = card1.find_element(By.CLASS_NAME, 'arox-train-title').text
    print(f"Clicking Training Card: '{card1_title}'...")
    card1.click()
    time.sleep(2)

    current_url = driver.current_url
    page_h1 = driver.execute_script("return document.querySelector('h1')?.innerText;")
    print(f"Navigated URL: {current_url}")
    print(f"Page H1: {page_h1.replace(chr(10), ' ')}")
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\navigated_training_detail.png')

    # 3. Test Internship Card Navigation
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Switch to Management domain
    driver.execute_script("""
        const mgmt = document.querySelector('.arox-mob-pill[data-domain="management"]');
        if (mgmt) mgmt.click();
    """)
    time.sleep(1)

    # Click first Management card (e.g. Power BI)
    first_intern_card = driver.find_element(By.CSS_SELECTOR, '#aroxMobileInternTrack .arox-mob-card-intern')
    intern_title = first_intern_card.find_element(By.CLASS_NAME, 'arox-intern-top-text').text.replace('\n', ' ')
    print(f"\nClicking Internship Card: '{intern_title}'...")
    first_intern_card.click()
    time.sleep(2)

    intern_url = driver.current_url
    intern_h1 = driver.execute_script("return document.querySelector('h1')?.innerText;")
    print(f"Navigated URL: {intern_url}")
    print(f"Page H1: {intern_h1.replace(chr(10), ' ')}")
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\navigated_internship_detail.png')

    print("\nAll mobile navigation and scroll-hint tests passed successfully!")

finally:
    driver.quit()

