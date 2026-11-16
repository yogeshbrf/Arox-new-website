import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def run():
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
        
        # Click MANAGEMENT domain pill
        driver.execute_script("""
            var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .domain-pill, .domain-btn');
            domainBtns.forEach(b => {
                if (b.textContent.includes('MANAGEMENT')) b.click();
            });
        """)
        time.sleep(1)
        
        # Scroll slit cards into view
        driver.execute_script("""
            var cards = document.querySelectorAll('.internship-card-slit');
            if (cards.length > 0) cards[0].scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_mgmt_powerbi.png")
        
        # Click card 02 or Power BI card if not active
        driver.execute_script("""
            var cards = document.querySelectorAll('.internship-card-slit');
            cards.forEach(c => {
                if (c.textContent.includes('POWER BI') || c.textContent.includes('Power BI')) c.click();
            });
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_mgmt_powerbi_active.png")
        print("Captured desktop management cards!")
    finally:
        driver.quit()

if __name__ == "__main__":
    run()

