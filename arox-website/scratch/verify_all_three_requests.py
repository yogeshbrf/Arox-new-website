import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    # -------------------------------------------------------------
    # 1. Verify Request 1 & 2: Internship card on training.html
    # -------------------------------------------------------------
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Switch to internship section
    driver.execute_script("window.navigateToSection('internship');")
    time.sleep(1.5)

    # Activate Card 4 (index 4 is 05 DATA ANALYTICS & DATA SCIENCE)
    driver.execute_script("activateInternshipCard(4);")
    time.sleep(1.5)

    card4_info = driver.execute_script("""
        const track = document.getElementById('domainCardsTrack');
        const activeCard = track.querySelector('.internship-card-slit.active');
        const img = activeCard ? activeCard.querySelector('.hero-card-img') : null;
        const title = activeCard ? activeCard.querySelector('.card-hero-title') : null;
        const cardStyle = activeCard ? window.getComputedStyle(activeCard) : null;
        const imgStyle = img ? window.getComputedStyle(img) : null;

        return {
            title: title ? title.innerText.replace(/\\n/g, ' ') : null,
            imgSrc: img ? img.src : null,
            imgNaturalWidth: img ? img.naturalWidth : 0,
            imgNaturalHeight: img ? img.naturalHeight : 0,
            cardBorder: cardStyle ? cardStyle.border : null,
            cardBoxShadow: cardStyle ? cardStyle.boxShadow : null,
            cardTransition: cardStyle ? cardStyle.transition : null,
            imgFilter: imgStyle ? imgStyle.filter : null
        };
    """)
    print("=== DATA ANALYTICS CARD & DARK THEME STYLE INFO ===")
    for k, v in card4_info.items():
        print(f"  {k}: {v}")

    # Capture active Data Analytics card screenshot
    track = driver.find_element(By.ID, "domainCardsTrack")
    track.screenshot(r"scratch/data_analytics_card_verified.png")
    print("Captured scratch/data_analytics_card_verified.png")

    # -------------------------------------------------------------
    # 2. Verify Request 3: CTA on services.html (Exact match to Image 2!)
    # -------------------------------------------------------------
    driver.get('http://localhost:3000/services.html')
    time.sleep(2)
    driver.execute_script("""
        const cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
    """)
    time.sleep(1)

    services_cta_info = driver.execute_script("""
        const card = document.querySelector('.cta-card');
        const content = document.querySelector('.cta-content');
        const heading = document.querySelector('.cta-heading');
        const text = document.querySelector('.cta-text');
        const actions = document.querySelector('.cta-actions');
        const cardRect = card.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();

        return {
            headingText: heading ? heading.innerText : null,
            cardWidth: cardRect.width,
            cardLeft: cardRect.left,
            cardRight: cardRect.right,
            contentWidth: contentRect.width,
            contentLeft: contentRect.left,
            contentRight: contentRect.right,
            clearanceToRight: cardRect.right - contentRect.right
        };
    """)
    print("\n=== SERVICES CTA (IMAGE 2 MATCH) INFO ===")
    for k, v in services_cta_info.items():
        print(f"  {k}: {v}")

    cta_services_el = driver.find_element(By.CSS_SELECTOR, '.cta-card')
    cta_services_el.screenshot(r"scratch/services_cta_verified.png")
    print("Captured scratch/services_cta_verified.png")

    # -------------------------------------------------------------
    # 3. Verify Request 3 on index.html
    # -------------------------------------------------------------
    driver.get('http://localhost:3000/index.html')
    time.sleep(2)
    driver.execute_script("""
        const cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
    """)
    time.sleep(1)

    cta_index_el = driver.find_element(By.CSS_SELECTOR, '.cta-card')
    cta_index_el.screenshot(r"scratch/index_cta_verified.png")
    print("Captured scratch/index_cta_verified.png")

finally:
    driver.quit()

