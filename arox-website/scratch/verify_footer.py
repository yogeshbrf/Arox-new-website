import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless')
options.add_argument('--window-size=1440,900')

driver = webdriver.Chrome(options=options)
try:
    # 1. Desktop Dark
    driver.get('http://localhost:3000/index.html')
    time.sleep(1)
    footer = driver.find_element(By.TAG_NAME, 'footer')
    driver.execute_script("arguments[0].scrollIntoView(true);", footer)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_desktop_dark.png')
    print('Captured footer_desktop_dark.png')

    # 2. Desktop Light
    driver.execute_script("""
        document.documentElement.className = 'theme-light';
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.backgroundColor = '#FFFFFF';
        window.dispatchEvent(new Event('arox-theme-change'));
    """)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_desktop_light.png')
    print('Captured footer_desktop_light.png')

    # 3. Mobile Dark
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride', {
        'width': 390,
        'height': 844,
        'deviceScaleFactor': 2,
        'mobile': True
    })
    driver.execute_script("""
        document.documentElement.className = 'theme-dark dark';
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.backgroundColor = '#000000';
        window.dispatchEvent(new Event('arox-theme-change'));
    """)
    time.sleep(0.5)
    footer = driver.find_element(By.TAG_NAME, 'footer')
    driver.execute_script("arguments[0].scrollIntoView(true);", footer)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_mobile_dark.png')
    print('Captured footer_mobile_dark.png')

    # 4. Mobile Light
    driver.execute_script("""
        document.documentElement.className = 'theme-light';
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.backgroundColor = '#FFFFFF';
        window.dispatchEvent(new Event('arox-theme-change'));
    """)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_mobile_light.png')
    print('Captured footer_mobile_light.png')

finally:
    driver.quit()

