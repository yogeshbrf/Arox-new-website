from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/courses.html')
    time.sleep(2)

    training_cards = driver.execute_script("""
        const cards = document.querySelectorAll('#aroxMobileTrainingTrack .arox-mob-card');
        return Array.from(cards).map(c => ({
            title: c.querySelector('.arox-mtt-title')?.innerText,
            sub: c.querySelector('.arox-mtt-sub')?.innerText
        }));
    """)
    print("courses.html - Training cards rendered:", len(training_cards))

    intern_cards = driver.execute_script("""
        const cards = document.querySelectorAll('#aroxMobileInternTrack .arox-mob-card');
        return Array.from(cards).map(c => ({
            line1: c.querySelector('.arox-mit-line1')?.innerText,
            line2: c.querySelector('.arox-mit-line2')?.innerText
        }));
    """)
    print("courses.html - Internship cards rendered:", len(intern_cards))

finally:
    driver.quit()

