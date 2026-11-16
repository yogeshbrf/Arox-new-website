import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    for page in ['index.html', 'training.html']:
        driver.get(f'http://localhost:3000/{page}')
        time.sleep(2)
        driver.execute_script("""
            const cta = document.querySelector('.cta-section');
            if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
        """)
        time.sleep(1)
        cta_el = driver.find_element(By.CSS_SELECTOR, '.cta-card')
        cta_el.screenshot(rf'd:\Downloads\Arox new website\arox-website\scratch\current_cta_{page.replace(".html", "")}.png')
        print(f"Captured current CTA for {page}")
finally:
    driver.quit()

