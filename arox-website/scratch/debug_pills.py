import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Chrome(options=options)
try:
    driver.get("http://localhost:3000/training.html?tab=internship&domain=mech#internshipDomainWrap")
    time.sleep(2)
    
    pills = driver.find_elements("css selector", ".intern-cat-pill")
    print(f"Total .intern-cat-pill elements: {len(pills)}")
    for i, p in enumerate(pills):
        print(f"Pill {i}: domain={p.get_attribute('data-domain')} class={p.get_attribute('class')} text={p.text}")
        
    mob_pills = driver.find_elements("css selector", ".arox-mob-pill")
    print(f"Total .arox-mob-pill elements: {len(mob_pills)}")
    for i, p in enumerate(mob_pills):
        print(f"Mob Pill {i}: domain={p.get_attribute('data-domain')} class={p.get_attribute('class')} text={p.text}")

    print("window.currentActiveDomain:", driver.execute_script("return window.currentActiveDomain;"))
finally:
    driver.quit()

