import time
import pprint
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)
try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)
    
    # Navigate to internship view
    driver.execute_script("""
        window.navigateToSection('internship');
    """)
    time.sleep(1.5)
    
    # Click MANAGEMENT domain
    driver.execute_script("""
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
        });
    """)
    time.sleep(1)
    
    # Click POWER BI card
    driver.execute_script("""
        var cards = document.querySelectorAll('.internship-card-slit');
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].textContent.includes('POWER BI') || cards[i].textContent.includes('Power BI')) {
                if (typeof window.activateInternshipCard === 'function') {
                    window.activateInternshipCard(i);
                } else {
                    cards[i].click();
                }
                break;
            }
        }
    """)
    time.sleep(1)
    
    # Inspect active card
    info = driver.execute_script("""
        var card = document.querySelector('.internship-card-slit.active');
        if (!card) return null;
        var r = card.getBoundingClientRect();
        var eyebrow = card.querySelector('.card-hero-eyebrow-row');
        var title = card.querySelector('.card-hero-title');
        var underline = card.querySelector('.card-hero-title-underline');
        var desc = card.querySelector('.card-hero-desc');
        var cta = card.querySelector('.card-hero-cta');
        var graphic = card.querySelector('.card-hero-graphic') || card.querySelector('.card-hero-graphic-wrap') || card.querySelector('img');
        
        function getBox(el) {
            if (!el) return null;
            var b = el.getBoundingClientRect();
            var cs = window.getComputedStyle(el);
            return {
                left: Math.round(b.left - r.left),
                top: Math.round(b.top - r.top),
                width: Math.round(b.width),
                height: Math.round(b.height),
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                color: cs.color,
                margin: cs.margin,
                padding: cs.padding
            };
        }
        
        return {
            card: { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) },
            eyebrow: getBox(eyebrow),
            title: getBox(title),
            underline: getBox(underline),
            desc: getBox(desc),
            cta: getBox(cta),
            graphic: getBox(graphic)
        };
    """)
    pprint.pprint(info)
    
    # Take screenshot of the whole track and the active card
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/real_power_bi_card.png')
    
    track_el = driver.find_element('css selector', '#domainCardsTrack')
    track_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/real_cards_track.png')
    print("Screenshots taken successfully!")
finally:
    driver.quit()

