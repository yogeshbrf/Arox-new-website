import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    driver.execute_script("window.navigateToSection('internship');")
    time.sleep(1.5)

    info = driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        const activeCard = track ? track.querySelector('.internship-card-slit.active') : null;
        const heroView = activeCard ? activeCard.querySelector('.card-hero-view') : null;
        const heroContent = activeCard ? activeCard.querySelector('.card-hero-content') : null;

        return {
            trackWidth: track ? track.offsetWidth : 0,
            trackHeight: track ? track.offsetHeight : 0,
            activeCardWidth: activeCard ? activeCard.offsetWidth : 0,
            heroViewWidth: heroView ? heroView.offsetWidth : 0,
            heroContentWidth: heroContent ? heroContent.offsetWidth : 0,
            computedHeroViewWidth: heroView ? window.getComputedStyle(heroView).width : null,
            computedHeroContentWidth: heroContent ? window.getComputedStyle(heroContent).width : null
        };
    """)
    print("Internship view with navigateToSection info:", info)

    track = driver.find_element("id", "domainCardsTrack")
    track.screenshot(r"scratch/static_slit_card_ok.png")
    print("Screenshot saved to scratch/static_slit_card_ok.png!")
finally:
    driver.quit()

