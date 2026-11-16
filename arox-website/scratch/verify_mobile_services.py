import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def verify_mobile_services():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=390,844")
    opts.add_argument("--disable-gpu")
    
    driver = webdriver.Chrome(options=opts)
    
    try:
        # Load services page on mobile
        driver.get("http://localhost:3000/services.html")
        time.sleep(3)
        
        # Check browser console logs for any errors
        logs = driver.get_log('browser')
        errors = [l for l in logs if l['level'] == 'SEVERE']
        print("Console errors count:", len(errors))
        for err in errors:
            print("  ERR:", err['message'])
            
        # Check if mobile services container is present
        mob_view = driver.find_elements(By.ID, "aroxMobileServicesView")
        print("Found aroxMobileServicesView:", len(mob_view))
        
        # Check sections
        sections = driver.find_elements(By.CLASS_NAME, "arox-mob-service-section")
        print("Found mobile sections count:", len(sections))
        
        headings = driver.find_elements(By.CLASS_NAME, "arox-mob-service-heading")
        heading_texts = [h.text for h in headings]
        print("Section headings found in order:", heading_texts)
        
        # Check cards
        cards = driver.find_elements(By.CLASS_NAME, "arox-mob-service-card")
        print("Total mobile service cards rendered:", len(cards))
        
        card_titles = driver.find_elements(By.CLASS_NAME, "arox-mob-card-title")
        titles_text = [t.text for t in card_titles]
        print("Card titles rendered:", titles_text)
        
        # Check card dimensions of the first card
        if cards:
            size = cards[0].size
            print(f"First card dimensions: width={size['width']}px, height={size['height']}px (Aspect ratio={size['width']/size['height']:.2f})")
            
        # Scroll to Development section and capture screenshot in dark theme
        driver.execute_script("""
            var el = document.getElementById('aroxMobileServicesView');
            if (el) el.scrollIntoView({behavior:'instant', block:'start'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_dark_native_1.png")
        print("Saved mobile_services_dark_native_1.png")
        
        # Scroll to Creative & Experience
        if len(sections) > 1:
            driver.execute_script("arguments[0].scrollIntoView({behavior:'instant', block:'start'});", sections[1])
            time.sleep(1)
            driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_dark_native_2.png")
            print("Saved mobile_services_dark_native_2.png")
            
        # Scroll to Business Solutions & Infrastructure
        if len(sections) > 2:
            driver.execute_script("arguments[0].scrollIntoView({behavior:'instant', block:'start'});", sections[2])
            time.sleep(1)
            driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_dark_native_3.png")
            print("Saved mobile_services_dark_native_3.png")

        # Scroll to Infrastructure specifically (matching the reference image)
        if len(sections) > 3:
            driver.execute_script("arguments[0].scrollIntoView({behavior:'instant', block:'start'});", sections[3])
            time.sleep(1)
            driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_dark_infra.png")
            print("Saved mobile_services_dark_infra.png")
            
        # Test Light Theme
        driver.execute_script("""
            document.documentElement.classList.remove('dark', 'theme-dark');
            document.documentElement.classList.add('theme-light', 'light');
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            var el = document.getElementById('aroxMobileServicesView');
            if (el) el.scrollIntoView({behavior:'instant', block:'start'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_light_native.png")
        print("Saved mobile_services_light_native.png")
        
        # Test Navigation by clicking a card
        driver.execute_script("""
            var card = document.querySelector('.arox-mob-service-card');
            if (card) card.click();
        """)
        time.sleep(2)
        print("Current URL after card click:", driver.current_url)
        
        # Test Desktop View to verify desktop is completely intact and unaffected
        driver.set_window_size(1440, 1000)
        driver.get("http://localhost:3000/services.html")
        time.sleep(2)
        
        mob_disp = driver.execute_script("""
            var mob = document.getElementById('aroxMobileServicesView');
            return mob ? window.getComputedStyle(mob).display : 'none';
        """)
        desktop_disp = driver.execute_script("""
            var d = document.getElementById('services-stack-wrapper');
            return d ? window.getComputedStyle(d).display : 'none';
        """)
        print(f"On Desktop 1440px: Mobile view display = '{mob_disp}', Desktop stack display = '{desktop_disp}'")
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_services_intact.png")
        print("Saved desktop_services_intact.png")

    finally:
        driver.quit()

if __name__ == "__main__":
    verify_mobile_services()

