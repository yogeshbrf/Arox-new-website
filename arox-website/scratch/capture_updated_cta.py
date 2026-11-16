import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    for page in ['training.html', 'index.html', 'services.html']:
        driver.get(f'http://localhost:3000/{page}')
        time.sleep(2)
        driver.execute_script("""
            const cta = document.querySelector('.cta-section');
            if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
        """)
        time.sleep(1)
        cta_el = driver.find_element(By.CSS_SELECTOR, '.cta-card')
        cta_el.screenshot(rf'scratch/updated_cta_{page.replace(".html", "")}.png')
        print(f"Captured updated CTA for {page}")
finally:
    driver.quit()

