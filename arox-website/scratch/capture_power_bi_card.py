import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def capture_power_bi():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1440,1000")
    opts.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=opts)
    
    try:
        driver.get("http://localhost:3000/training.html")
        time.sleep(2)
        
        # Switch to Internship tab
        driver.execute_script("""
            var hscroll = document.getElementById('hscrollSection');
            hscroll.classList.remove('is-training-view');
            hscroll.classList.add('is-internship-view');
            var pills = document.querySelectorAll('#coursesPillNav button, .pill-btn, .toggle-btn, [data-view="internship"]');
            pills.forEach(p => {
                if (p.textContent.includes('INTERNSHIP') || p.getAttribute('data-view') === 'internship') p.click();
            });
        """)
        time.sleep(1)
        
        # Switch to MANAGEMENT domain
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
            cards.forEach(c => {
                if (c.textContent.includes('POWER BI') || c.textContent.includes('Power BI')) c.click();
            });
            var track = document.getElementById('domainCardsTrack');
            if (track) track.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/current_power_bi_hovered.png")
        print("Captured current_power_bi_hovered.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    capture_power_bi()

