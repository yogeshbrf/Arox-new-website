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

    # Switch to internship view
    driver.execute_script("""
        // Switch to internship view if not already active
        const internshipBtn = document.querySelector('[data-view="internship"]') || document.getElementById('internshipToggleBtn');
        if (internshipBtn) {
            internshipBtn.click();
        } else {
            document.body.classList.add('is-internship-view');
            const track = document.getElementById('domainCardsTrack');
            if (track) {
                track.style.display = 'flex';
                if (typeof renderDomainCards === 'function') renderDomainCards('cse_it');
            }
        }
    """)
    time.sleep(1)

    # Scroll to track
    driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        if (track) track.scrollIntoView({ behavior: 'instant', block: 'center' });
    """)
    time.sleep(1)

    info = driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        const activeCard = track.querySelector('.internship-card-slit.active');
        const heroView = activeCard ? activeCard.querySelector('.card-hero-view') : null;
        const heroContent = activeCard ? activeCard.querySelector('.card-hero-content') : null;

        return {
            trackDisplay: window.getComputedStyle(track).display,
            trackWidth: track.offsetWidth,
            trackHeight: track.offsetHeight,
            activeCardWidth: activeCard ? activeCard.offsetWidth : 0,
            heroViewWidth: heroView ? heroView.offsetWidth : 0,
            heroContentWidth: heroContent ? heroContent.offsetWidth : 0
        };
    """)
    print("Internship view info:", info)

    track = driver.find_element("id", "domainCardsTrack")
    track.screenshot(r"scratch/static_slit_card0.png")
    print("Screenshot saved to scratch/static_slit_card0.png")
finally:
    driver.quit()

