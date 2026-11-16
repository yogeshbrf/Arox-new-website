import time
import pprint
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)
    
    # Switch to INTERNSHIP view
    driver.execute_script("window.navigateToSection('internship');")
    time.sleep(1.5)
    
    # 1. Dark Mode: Switch to MANAGEMENT domain & activate POWER BI
    driver.execute_script("""
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
        });
    """)
    time.sleep(1)
    
    # Activate POWER BI
    driver.execute_script("""
        var cards = document.querySelectorAll('.internship-card-slit');
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].textContent.includes('POWER BI') || cards[i].textContent.includes('Power BI')) {
                if (typeof window.activateInternshipCard === 'function') window.activateInternshipCard(i);
                break;
            }
        }
    """)
    time.sleep(1)
    
    # Inspect POWER BI metrics
    power_bi_metrics = driver.execute_script("""
        var card = document.querySelector('.internship-card-slit.active');
        if (!card) return null;
        var r = card.getBoundingClientRect();
        var eyebrow = card.querySelector('.card-hero-eyebrow-row');
        var title = card.querySelector('.card-hero-title');
        var underline = card.querySelector('.card-hero-title-underline');
        var desc = card.querySelector('.card-hero-desc');
        var cta = card.querySelector('.card-hero-cta');
        var graphic = card.querySelector('.card-hero-graphic');
        
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
                color: cs.color
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
    print("POWER BI METRICS:")
    pprint.pprint(power_bi_metrics)
    
    # Capture crops and full track
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/hovered_power_bi_dark.png')
    
    track_el = driver.find_element('css selector', '#domainCardsTrack')
    track_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/management_rail_dark.png')
    
    # 2. Switch to CSE & IT domain -> Card 01 PYTHON FULL STACK
    driver.execute_script("""
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('CSE & IT') || b.getAttribute('data-domain') === 'cse_it') b.click();
        });
    """)
    time.sleep(1)
    driver.execute_script("if (typeof window.activateInternshipCard === 'function') window.activateInternshipCard(0);")
    time.sleep(1)
    
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/hovered_python_dark.png')
    track_el = driver.find_element('css selector', '#domainCardsTrack')
    track_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cse_it_rail_dark.png')
    
    # 3. Test LIGHT MODE
    driver.execute_script("""
        var themeToggle = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        } else {
            document.documentElement.classList.remove('theme-dark', 'dark');
            document.documentElement.classList.add('theme-light');
            document.body.classList.remove('theme-dark', 'dark');
            document.body.classList.add('theme-light');
        }
    """)
    time.sleep(1)
    
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/hovered_python_light.png')
    
    # Switch back to MANAGEMENT in light mode -> POWER BI
    driver.execute_script("""
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
        });
    """)
    time.sleep(1)
    driver.execute_script("""
        var cards = document.querySelectorAll('.internship-card-slit');
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].textContent.includes('POWER BI') || cards[i].textContent.includes('Power BI')) {
                if (typeof window.activateInternshipCard === 'function') window.activateInternshipCard(i);
                break;
            }
        }
    """)
    time.sleep(1)
    
    card_el = driver.find_element('css selector', '.internship-card-slit.active')
    card_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/hovered_power_bi_light.png')
    track_el = driver.find_element('css selector', '#domainCardsTrack')
    track_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/management_rail_light.png')

    print("All captures completed successfully!")
finally:
    driver.quit()

# 4. Generate side-by-side comparison between Reference Image and hovered_power_bi_dark.png
ref_img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794593177118_8a89a9fd.jpg')
real_img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\hovered_power_bi_dark.png')

th = 650
ref_scaled = ref_img.resize((int(ref_img.size[0] * (th / ref_img.size[1])), th), Image.Resampling.LANCZOS)
real_scaled = real_img.resize((int(real_img.size[0] * (th / real_img.size[1])), th), Image.Resampling.LANCZOS)

combo = Image.new('RGB', (ref_scaled.size[0] + real_scaled.size[0] + 40, th + 70), (10, 15, 25))
combo.paste(ref_scaled, (15, 50))
combo.paste(real_scaled, (ref_scaled.size[0] + 25, 50))
combo.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\master_reference_comparison.png')
print("Generated master_reference_comparison.png")

