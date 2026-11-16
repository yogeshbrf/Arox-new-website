import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)
try:
    driver.get('http://localhost:3000/login.html#login')
    time.sleep(1)
    
    # Click Register button
    driver.execute_script("toggleAuth('register')")
    time.sleep(2.5)

    # Check classes and element at point
    mobile = driver.find_element('id', 'authMobile')
    shape = driver.find_element('id', 'mobSweepShape')
    panel_top = driver.find_element('id', 'mobPanelTop')
    
    print('authMobile class:', mobile.get_attribute('class'))
    print('shape style:', shape.get_attribute('style'))
    print('shape computed top:', shape.value_of_css_property('top'))
    print('shape computed opacity:', shape.value_of_css_property('opacity'))
    print('shape computed visibility:', shape.value_of_css_property('visibility'))
    print('panel_top display:', panel_top.value_of_css_property('display'))
    
    top_elem = driver.execute_script("return document.elementFromPoint(195, 10).outerHTML.substring(0, 150);")
    print('Element at point (195, 10):', top_elem)

finally:
    driver.quit()

