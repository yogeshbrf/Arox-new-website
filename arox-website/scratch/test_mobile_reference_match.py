import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2.5)

    # Scroll directly to aroxMobileCoursesView
    driver.execute_script("""
        const el = document.getElementById('aroxMobileCoursesView');
        if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    """)
    time.sleep(1)

    # 1. Capture primary mobile view (Training + Internship CSE & IT)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_reference_match.png')
    print("Captured mobile_reference_match.png")

    # Capture element screenshot of the entire aroxMobileCoursesView
    mobile_view = driver.find_element(By.ID, 'aroxMobileCoursesView')
    if mobile_view:
        mobile_view.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_courses_view_element.png')
        print("Captured mobile_courses_view_element.png")

    # 2. Test clicking ECE pill
    driver.execute_script("""
        const eceBtn = document.querySelector('.arox-mob-pill[data-domain="ece"]');
        if (eceBtn) eceBtn.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_view_ece.png')
    print("Captured mobile_view_ece.png")

    # 3. Test clicking MANAGEMENT pill
    driver.execute_script("""
        const mgmtBtn = document.querySelector('.arox-mob-pill[data-domain="management"]');
        if (mgmtBtn) mgmtBtn.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_view_mgmt.png')
    print("Captured mobile_view_mgmt.png")

    # 4. Test clicking a card (e.g. Power BI) to verify modal opens
    driver.execute_script("""
        const card = document.querySelector('#aroxMobileInternTrack .arox-mob-card');
        if (card) card.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_modal_opened.png')
    print("Captured mobile_modal_opened.png")

finally:
    driver.quit()

