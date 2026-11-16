from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1200,800')
driver = webdriver.Chrome(options=options)

try:
    slugs = ['power-bi', 'salesforce', 'python-full-stack', 'full-stack-web-development']
    for s in slugs:
        driver.get(f'http://localhost:3000/detail.html?course={s}')
        time.sleep(1)
        h1 = driver.execute_script("return document.querySelector('h1')?.innerText;")
        print(f"Slug: {s} -> H1: {h1.replace(chr(10), ' ')}")
finally:
    driver.quit()

