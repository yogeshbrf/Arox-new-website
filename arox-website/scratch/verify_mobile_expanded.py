import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless')

driver = webdriver.Chrome(options=options)
try:
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride', {
        'width': 390,
        'height': 844,
        'deviceScaleFactor': 2,
        'mobile': True
    })
    driver.get('http://localhost:3000/index.html')
    time.sleep(1)
    
    # Open Services and Internship details
    driver.execute_script("""
        document.querySelectorAll('details.footer-col-services, details.footer-col-internships').forEach(d => d.setAttribute('open', ''));
    """)
    time.sleep(0.5)
    footer = driver.find_element(By.TAG_NAME, 'footer')
    driver.execute_script("arguments[0].scrollIntoView(true);", footer)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_mobile_expanded_dark.png')
    print('Captured footer_mobile_expanded_dark.png')

    # Now light theme
    driver.execute_script("""
        document.documentElement.className = 'theme-light';
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.backgroundColor = '#FFFFFF';
        window.dispatchEvent(new Event('arox-theme-change'));
    """)
    time.sleep(0.5)
    footer.screenshot('scratch/footer_mobile_expanded_light.png')
    print('Captured footer_mobile_expanded_light.png')

finally:
    driver.quit()

