from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1200,800')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/detail.html?course=full-stack-web-development')
    time.sleep(1.5)
    title = driver.title
    h1 = driver.execute_script("return document.querySelector('h1')?.innerText;")
    print("detail.html title:", title)
    print("detail.html h1:", h1)
finally:
    driver.quit()

