import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3000/training.html?tab=internship&domain=mech#internshipDomainWrap")
    time.sleep(2)
    logs = driver.get_log('browser')
    print("=== Console logs on training.html ===")
    for entry in logs:
        print(entry['level'], entry['message'])
finally:
    driver.quit()

