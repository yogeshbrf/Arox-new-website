import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    # 1. Test mobile login
    driver.get('http://localhost:3000/login.html')
    time.sleep(2)
    driver.save_screenshot(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\mobile_login_signin.png')

    # Toggle to register on mobile
    driver.execute_script("document.querySelector('.register-btn').click();")
    time.sleep(1.5)
    driver.save_screenshot(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\mobile_login_register.png')

    # 2. Test mobile CTA on training.html
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)
    driver.execute_script("""
        const cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
    """)
    time.sleep(1)
    driver.save_screenshot(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\mobile_cta_view.png')
    print("Mobile tests passed and captured!")
finally:
    driver.quit()

