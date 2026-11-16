import os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    os.makedirs('scratch/shots', exist_ok=True)

    # 1. Desktop Sign In
    driver.get('http://localhost:3000/login.html')
    time.sleep(1)
    driver.save_screenshot('scratch/shots/desktop_signin.png')
    
    # 2. Desktop Create Account (switch to register)
    driver.execute_script("toggleAuthMode('register');")
    time.sleep(0.6)
    driver.save_screenshot('scratch/shots/desktop_register.png')

    # 3. Mobile Sign In
    driver.set_window_size(390, 844)
    driver.get('http://localhost:3000/login.html')
    time.sleep(1)
    driver.execute_script("toggleAuthMode('signin');")
    time.sleep(0.6)
    driver.save_screenshot('scratch/shots/mobile_signin.png')

    # 4. Mobile Create Account
    driver.execute_script("toggleAuthMode('register');")
    time.sleep(0.6)
    driver.save_screenshot('scratch/shots/mobile_register.png')

    # Check browser logs
    logs = driver.get_log('browser')
    print('Console logs count:', len(logs))
    for l in logs:
        print('LOG:', l)

    print('All 4 login screenshots captured successfully!')
finally:
    driver.quit()

