import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

pages = ['login.html', 'training.html', 'courses.html', 'services.html', 'index.html']

try:
    for page in pages:
        driver.get(f'http://localhost:3000/{page}')
        time.sleep(1)
        logs = driver.get_log('browser')
        severe_errors = [l for l in logs if l['level'] == 'SEVERE']
        print(f"{page}: {len(severe_errors)} SEVERE errors")
        if severe_errors:
            for e in severe_errors:
                print("  ", e['message'])
finally:
    driver.quit()

