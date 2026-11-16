from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_argument('--headless')
opts.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=opts)

driver.get('http://localhost:3000/training.html')
time.sleep(1)

# Scroll to training section
train_sec = driver.find_element('id', 'aroxMobTrainingSection')
driver.execute_script("arguments[0].scrollIntoView();", train_sec)
time.sleep(0.5)

# Screenshot front view of cards
card0 = driver.find_element('css selector', '#aroxMobileTrainingTrack .arox-mobile-flip-card')
card0.screenshot('mob_train_card_front.png')
print("Captured mob_train_card_front.png")

# Click card to flip it
driver.execute_script("arguments[0].click();", card0)
time.sleep(0.8)

card0.screenshot('mob_train_card_back.png')
print("Captured mob_train_card_back.png")

# Verify tech icons inside card0 back
tech_items = driver.execute_script("""
    const card = document.querySelector('#aroxMobileTrainingTrack .arox-mobile-flip-card');
    const icons = card.querySelectorAll('.arox-mob-tech-icon-item');
    return Array.from(icons).map(i => i.innerText.trim());
""")
print(f"Tech items in card 0 back: {len(tech_items)} items -> {tech_items}")
assert len(tech_items) == 7, f"Expected 7 tech items for Full Stack, got {len(tech_items)}"

driver.quit()
print("MOBILE TRAINING CARDS FRONT & BACK VERIFIED!")

