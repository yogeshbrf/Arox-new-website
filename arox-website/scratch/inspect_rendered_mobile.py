from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    training_cards = driver.execute_script("""
        const cards = document.querySelectorAll('#aroxMobileTrainingTrack .arox-mob-card');
        return Array.from(cards).map(c => ({
            title: c.querySelector('.arox-mtt-title')?.innerText,
            sub: c.querySelector('.arox-mtt-sub')?.innerText,
            img: c.querySelector('.arox-mob-card-img')?.src
        }));
    """)
    print("Training cards rendered:", len(training_cards))
    for tc in training_cards[:4]:
        print(tc)

    intern_cards = driver.execute_script("""
        const cards = document.querySelectorAll('#aroxMobileInternTrack .arox-mob-card');
        return Array.from(cards).map(c => ({
            line1: c.querySelector('.arox-mit-line1')?.innerText,
            line2: c.querySelector('.arox-mit-line2')?.innerText,
            img: c.querySelector('.arox-mob-card-img')?.src
        }));
    """)
    print("\nInternship cards rendered:", len(intern_cards))
    for ic in intern_cards[:4]:
        print(ic)

finally:
    driver.quit()

