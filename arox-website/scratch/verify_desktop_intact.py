from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1600,1000')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Check desktop elements visibility
    pill_nav = driver.find_element(By.ID, 'coursesPillNav')
    hscroll_track = driver.find_element(By.ID, 'hscrollTrack')
    mobile_view = driver.find_element(By.ID, 'aroxMobileCoursesView')

    print("Desktop test:")
    print("coursesPillNav displayed:", pill_nav.is_displayed())
    print("hscrollTrack displayed:", hscroll_track.is_displayed())
    print("aroxMobileCoursesView displayed:", mobile_view.is_displayed())

    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\desktop_view_intact.png')
    print("Desktop screenshot captured!")
finally:
    driver.quit()

