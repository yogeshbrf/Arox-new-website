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

    # Scroll to internship cards track
    driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        if (track) track.scrollIntoView({ behavior: 'instant', block: 'center' });
    """)
    time.sleep(1)

    # Check active card static layout
    layout_info = driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        const activeCard = track.querySelector('.internship-card-slit.active');
        const heroView = activeCard ? activeCard.querySelector('.card-hero-view') : null;
        const heroContent = activeCard ? activeCard.querySelector('.card-hero-content') : null;
        const title = activeCard ? activeCard.querySelector('.card-hero-title') : null;
        const desc = activeCard ? activeCard.querySelector('.card-hero-desc') : null;
        const graphic = activeCard ? activeCard.querySelector('.card-hero-graphic') : null;

        return {
            activeCardWidth: activeCard ? activeCard.offsetWidth : 0,
            heroViewWidth: heroView ? heroView.offsetWidth : 0,
            heroContentWidth: heroContent ? heroContent.offsetWidth : 0,
            titleRect: title ? title.getBoundingClientRect() : null,
            descRect: desc ? desc.getBoundingClientRect() : null,
            graphicRect: graphic ? graphic.getBoundingClientRect() : null
        };
    """)
    print("Internship card static layout test:", layout_info)

    # Capture screenshots of active card 0 and active card 1
    track = driver.find_element("id", "domainCardsTrack")
    track.screenshot(r"scratch/static_slit_card0.png")

    driver.execute_script("activateInternshipCard(1);")
    time.sleep(1)
    track.screenshot(r"scratch/static_slit_card1.png")
    print("Captured slit card screenshots successfully!")
finally:
    driver.quit()

