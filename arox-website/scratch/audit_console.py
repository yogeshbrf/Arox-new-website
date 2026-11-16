import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

pages = [
    'index.html',
    'courses.html',
    'training.html',
    'services.html',
    'detail.html',
    'apply.html',
    'about.html',
    'contact.html',
    'login.html'
]

total_errors = 0
for p in pages:
    driver.get(f'http://localhost:3000/{p}')
    time.sleep(1)
    logs = driver.get_log('browser')
    severe = [l for l in logs if l['level'] == 'SEVERE']
    print(f'{p}: {len(severe)} severe errors')
    for s in severe:
        print(f'   {s["message"][:120]}')
        total_errors += 1

print(f'\nTotal SEVERE errors across all pages: {total_errors}')
driver.quit()

