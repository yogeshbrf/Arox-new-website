import time
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def run_captures():
    # 1. Desktop captures (1440x900)
    opts = Options()
    opts.add_argument('--headless=new')
    opts.add_argument('--window-size=1440,1000')
    driver = webdriver.Chrome(options=opts)
    
    try:
        # Index Desktop Dark
        driver.get('http://localhost:3000/index.html')
        time.sleep(1.5)
        cta_el = driver.find_element('css selector', '#cta')
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_desktop_dark_card.png')
        cta_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_desktop_dark_section.png')
        
        # Index Desktop Light
        driver.execute_script("""
            var toggle = document.getElementById('themeToggle');
            if (toggle) toggle.click();
            else {
                document.documentElement.classList.add('theme-light');
                document.body.classList.add('theme-light');
            }
        """)
        time.sleep(1)
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_desktop_light_card.png')
        
        # Services Desktop Dark
        driver.get('http://localhost:3000/services.html')
        time.sleep(1.5)
        cta_el = driver.find_element('css selector', '#cta')
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_services_desktop.png')

        # Training Desktop Dark
        driver.get('http://localhost:3000/training.html')
        time.sleep(1.5)
        cta_el = driver.find_element('css selector', '#cta')
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_training_desktop.png')

    finally:
        driver.quit()

    # 2. Mobile captures (390x844 iPhone 14)
    opts_m = Options()
    opts_m.add_argument('--headless=new')
    opts_m.add_argument('--window-size=390,844')
    driver_m = webdriver.Chrome(options=opts_m)
    
    try:
        # Index Mobile Dark
        driver_m.get('http://localhost:3000/index.html')
        time.sleep(1.5)
        cta_el = driver_m.find_element('css selector', '#cta')
        driver_m.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver_m.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_mobile_dark_card.png')
        cta_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_mobile_dark_section.png')
        
        # Index Mobile Light
        driver_m.execute_script("""
            var toggle = document.getElementById('mobileThemeToggle') || document.getElementById('themeToggle');
            if (toggle) toggle.click();
            else {
                document.documentElement.classList.add('theme-light');
                document.body.classList.add('theme-light');
            }
        """)
        time.sleep(1)
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_mobile_light_card.png')

        # Services Mobile Dark
        driver_m.get('http://localhost:3000/services.html')
        time.sleep(1.5)
        cta_el = driver_m.find_element('css selector', '#cta')
        driver_m.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver_m.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_services_mobile.png')

        # Training Mobile Dark
        driver_m.get('http://localhost:3000/training.html')
        time.sleep(1.5)
        cta_el = driver_m.find_element('css selector', '#cta')
        driver_m.execute_script("arguments[0].scrollIntoView({block: 'center'});", cta_el)
        time.sleep(0.5)
        cta_card = driver_m.find_element('css selector', '#cta .cta-card')
        cta_card.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/cta_training_mobile.png')

    finally:
        driver_m.quit()

    print("All captures completed successfully!")

    # 3. Create composite comparison: Reference Image vs Desktop Dark CTA
    ref = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794594719213_1613e34d.jpg')
    real = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\cta_desktop_dark_section.png')
    
    # Resize both to same width 1000
    target_w = 1000
    ref_h = int(ref.size[1] * (target_w / ref.size[0]))
    real_h = int(real.size[1] * (target_w / real.size[0]))
    
    ref_res = ref.resize((target_w, ref_h), Image.Resampling.LANCZOS)
    real_res = real.resize((target_w, real_h), Image.Resampling.LANCZOS)
    
    comp = Image.new('RGB', (target_w, ref_h + real_h + 30), (10, 10, 10))
    comp.paste(ref_res, (0, 0))
    comp.paste(real_res, (0, ref_h + 30))
    comp.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\cta_reference_match_comparison.png')
    print("Generated cta_reference_match_comparison.png")

if __name__ == '__main__':
    run_captures()

