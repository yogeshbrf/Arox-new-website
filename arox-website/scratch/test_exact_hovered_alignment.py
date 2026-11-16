import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains

def test():
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
        
        # 1. CSE & IT Domain - Card 01 (Python Full Stack) in Dark Mode
        # Scroll to slit track
        driver.execute_script("""
            var track = document.getElementById('domainCardsTrack');
            if (track) track.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_hovered_python_dark.png")
        print("Saved desktop_hovered_python_dark.png")
        
        # 2. Switch to MANAGEMENT domain
        driver.execute_script("""
            var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
            domainBtns.forEach(b => {
                if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
            });
        """)
        time.sleep(1)
        
        # Hover/Click Business Analytics card
        driver.execute_script("""
            var cards = document.querySelectorAll('.internship-card-slit');
            cards.forEach(c => {
                if (c.textContent.includes('BUSINESS ANALYTICS')) c.click();
            });
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_hovered_business_analytics.png")
        print("Saved desktop_hovered_business_analytics.png")
        
        # Hover/Click HR & FINANCE card
        driver.execute_script("""
            var cards = document.querySelectorAll('.internship-card-slit');
            cards.forEach(c => {
                if (c.textContent.includes('HR & FINANCE') || c.textContent.includes('HR & Finance')) c.click();
            });
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_hovered_hr_finance.png")
        print("Saved desktop_hovered_hr_finance.png")
        
        # 3. Light Mode Check on Python Full Stack
        driver.execute_script("""
            document.documentElement.classList.remove('dark', 'theme-dark');
            document.documentElement.classList.add('theme-light', 'light');
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            
            // Switch back to CSE & IT
            var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
            domainBtns.forEach(b => {
                if (b.textContent.includes('CSE & IT') || b.getAttribute('data-domain') === 'cse_it') b.click();
            });
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_hovered_python_light.png")
        print("Saved desktop_hovered_python_light.png")

    finally:
        driver.quit()

if __name__ == "__main__":
    test()

