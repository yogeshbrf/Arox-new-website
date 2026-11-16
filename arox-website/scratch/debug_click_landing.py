import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    
    mech_link = driver.find_element("xpath", "//footer//a[contains(@href, 'domain=mech')]")
    print("Clicking link:", mech_link.get_attribute("href"))
    mech_link.click()
    
    for sec in range(1, 5):
        time.sleep(1)
        info = driver.execute_script("""
            return {
                url: window.location.href,
                currentActiveDomain: window.currentActiveDomain,
                activePillText: document.querySelector('.intern-cat-pill.active') ? document.querySelector('.intern-cat-pill.active').textContent.trim() : null,
                activePillDomain: document.querySelector('.intern-cat-pill.active') ? document.querySelector('.intern-cat-pill.active').getAttribute('data-domain') : null,
                hasInternTrigger: Boolean(window.internTrigger),
                scrollY: window.scrollY
            };
        """)
        print(f"At {sec}s:", info)

finally:
    driver.quit()

