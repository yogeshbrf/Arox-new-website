import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3000/training.html?tab=internship&domain=mech#internshipDomainWrap")
    time.sleep(1)
    
    # Check internTrigger
    st_info = driver.execute_script("""
        return {
            hasInternTrigger: Boolean(window.internTrigger),
            start: window.internTrigger ? window.internTrigger.start : null,
            end: window.internTrigger ? window.internTrigger.end : null,
            scrollY: window.scrollY
        };
    """)
    print("Intern trigger info at 1s:", st_info)
    
    # Call switchInternshipDomain('mech')
    driver.execute_script("window.switchInternshipDomain('mech', false);")
    time.sleep(0.5)
    
    active_pill = driver.find_element("css selector", ".intern-cat-pill.active")
    print("Active pill after switchInternshipDomain:", active_pill.text)
    print("ScrollY after switch:", driver.execute_script("return window.scrollY;"))
finally:
    driver.quit()

