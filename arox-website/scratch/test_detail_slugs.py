from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1200,800')
driver = webdriver.Chrome(options=options)

try:
    for slug in ['python-full-stack', 'power-bi', 'ui-ux-design', 'cyber-security']:
        driver.get(f'http://localhost:3000/detail.html?course={slug}')
        time.sleep(1)
        title = driver.title
        h1 = driver.execute_script("return document.querySelector('h1')?.innerText;")
        print(f"slug '{slug}': title='{title}', h1='{h1}'")
finally:
    driver.quit()

