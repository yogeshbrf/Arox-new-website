import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)
pages = ['index.html', 'about.html', 'services.html', 'training.html', 'courses.html', 'detail.html', 'apply.html', 'contact.html', 'login.html']
all_clean = True

try:
    for p in pages:
        driver.get(f'http://localhost:3000/{p}')
        time.sleep(0.5)
        logs = driver.get_log('browser')
        severe = [l for l in logs if l['level'] == 'SEVERE']
        if severe:
            print(f'{p}: {len(severe)} severe errors:')
            for s in severe:
                print('  ', s['message'])
            all_clean = False
        else:
            print(f'{p}: 0 severe errors (CLEAN)')
finally:
    driver.quit()

if all_clean:
    print('ALL PAGES CLEAN!')
