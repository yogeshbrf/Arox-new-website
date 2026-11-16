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
        
        # 1. Desktop Training View (Light Mode)
        driver.execute_script("""
            document.documentElement.classList.remove('dark', 'theme-dark');
            document.documentElement.classList.add('theme-light', 'light');
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            var hscroll = document.getElementById('hscrollSection');
            hscroll.classList.remove('is-internship-view');
            hscroll.classList.add('is-training-view');
            hscroll.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_training_light.png")
        
        # 2. Desktop Internship View (Light Mode) - to compare with Image 1 (Power BI reference)
        driver.execute_script("""
            var hscroll = document.getElementById('hscrollSection');
            hscroll.classList.remove('is-training-view');
            hscroll.classList.add('is-internship-view');
            
            // Click the Internship pill button if it exists
            var pills = document.querySelectorAll('#coursesPillNav button, .pill-btn, .toggle-btn, [data-view="internship"]');
            pills.forEach(p => {
                if (p.textContent.includes('INTERNSHIP') || p.getAttribute('data-view') === 'internship') {
                    p.click();
                }
            });
            hscroll.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_internship_light.png")
        
        # 3. Mobile View (Dark mode) - to compare with Image 2 (Mobile Training & Internship reference)
        driver.set_window_size(390, 844)
        driver.execute_script("""
            document.documentElement.classList.add('dark', 'theme-dark');
            document.documentElement.classList.remove('theme-light', 'light');
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            window.scrollTo(0, 0);
        """)
        time.sleep(1)
        
        # Scroll to mobile training cards
        driver.execute_script("""
            var t = document.querySelector('.arox-mob-train-row') || document.querySelector('#aroxMobileTrainingTrack') || document.querySelector('.mobile-cards-row');
            if (t) t.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_view_training_section.png")
        
        # Scroll to mobile internship cards
        driver.execute_script("""
            var i = document.querySelector('.arox-mob-intern-row') || document.querySelector('#aroxMobileInternTrack');
            if (i) i.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_view_internship_section.png")
        
        print("All comparison screenshots captured!")
    finally:
        driver.quit()

if __name__ == "__main__":
    run()

