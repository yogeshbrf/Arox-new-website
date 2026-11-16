from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_argument('--headless')
opts.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=opts)

driver.get('http://localhost:3000/detail.html?course=full-stack-web-development&from=training')
time.sleep(1)

# Check hero
hero = driver.find_element('class name', 'detail-hero')
hero.screenshot('detail_hero_mobile_current.png')

# Check reviews
reviews_sec = driver.find_element('id', 'reviews-container').find_element('xpath', './ancestor::section')
driver.execute_script("arguments[0].scrollIntoView();", reviews_sec)
time.sleep(0.5)
reviews_sec.screenshot('detail_reviews_mobile_current.png')

driver.quit()
print("Captured detail screenshots")

