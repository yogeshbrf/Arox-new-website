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
    driver.execute_script("""
        var pills = document.querySelectorAll('#coursesPillNav button, .pill-btn, .toggle-btn, [data-view="internship"]');
        pills.forEach(p => {
            if (p.textContent.includes('INTERNSHIP') || p.getAttribute('data-view') === 'internship') p.click();
        });
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
        });
        var cards = document.querySelectorAll('.internship-card-slit');
        cards.forEach(c => {
            if (c.textContent.includes('POWER BI') || c.textContent.includes('Power BI')) c.click();
        });
    """)
    time.sleep(1)
    
    # Get active card info
    info = driver.execute_script("""
        var card = document.querySelector('.internship-card-slit.active');
        if (!card) return null;
        var r = card.getBoundingClientRect();
        var eyebrow = card.querySelector('.hero-eyebrow');
        var title = card.querySelector('.hero-title');
        var underline = card.querySelector('.hero-title-underline');
        var desc = card.querySelector('.hero-desc');
        var cta = card.querySelector('.hero-cta');
        var graphic = card.querySelector('.hero-graphic-wrap') || card.querySelector('.hero-graphic');
        
        function getBox(el) {
            if (!el) return null;
            var b = el.getBoundingClientRect();
            var cs = window.getComputedStyle(el);
            return {
                left: b.left - r.left,
                top: b.top - r.top,
                width: b.width,
                height: b.height,
                fontSize: cs.fontSize,
                lineHeight: cs.lineHeight,
                color: cs.color,
                margin: cs.margin,
                padding: cs.padding
            };
        }
        
        return {
            card: { width: r.width, height: r.height, top: r.top, left: r.left },
            eyebrow: getBox(eyebrow),
            title: getBox(title),
            underline: getBox(underline),
            desc: getBox(desc),
            cta: getBox(cta),
            graphic: getBox(graphic)
        };
    """)
    pprint.pprint(info)
    
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('scratch/active_power_bi_crop.png')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/active_power_bi_crop.png')
    print('Saved crop screenshot successfully')
finally:
    driver.quit()

