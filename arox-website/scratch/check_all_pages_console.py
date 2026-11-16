import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)

pages = ['index.html', 'about.html', 'services.html', 'training.html', 'courses.html', 'contact.html', 'detail.html']
for page in pages:
    driver.get(f'http://localhost:3000/{page}')
    time.sleep(1.2)
    logs = driver.get_log('browser')
    severe = [l for l in logs if l['level'] == 'SEVERE']
    print(f"{page:<15} SEVERE errors: {len(severe)}")
    if severe:
        for s in severe[:2]:
            print("   ", s['message'])

driver.quit()
print("All pages console check done!")

