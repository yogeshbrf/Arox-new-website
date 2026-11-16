import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def run():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1440,1000")
    opts.add_argument("--disable-gpu")
    
    driver = webdriver.Chrome(options=opts)
    
    try:
        # 1. Desktop Training page - Training Cards (Image 3 reference)
        driver.set_window_size(1440, 1000)
        driver.get("http://localhost:3000/training.html")
        time.sleep(2)
        
        # Scroll to training cards section if it exists
        driver.execute_script("window.scrollTo(0, 400);")
        time.sleep(1)
        driver.save_screenshot("scratch/desktop_training_section.png")
        
        # Scroll to internship cards section (Image 1 reference)
        driver.execute_script("var el = document.getElementById('hscrollSection') || document.querySelector('.internship-slider') || document.querySelector('.slit-card-container'); if(el) el.scrollIntoView({behavior:'instant', block:'center'});")
        time.sleep(1)
        driver.save_screenshot("scratch/desktop_internship_section.png")
        
        # 2. Desktop Services page (Image 4 reference)
        driver.get("http://localhost:3000/services.html")
        time.sleep(2)
        driver.execute_script("var el = document.querySelector('.services-grid') || document.querySelector('.services-section'); if(el) el.scrollIntoView({behavior:'instant', block:'center'});")
        time.sleep(1)
        driver.save_screenshot("scratch/desktop_services_section.png")
        
        # 3. Mobile Training page (Image 2 reference)
        driver.set_window_size(390, 844)
        driver.get("http://localhost:3000/training.html")
        time.sleep(2)
        
        # Scroll to mobile training section
        driver.execute_script("var el = document.querySelector('.arox-mob-train-row') || document.querySelector('#mobileTrainingSection'); if(el) el.scrollIntoView({behavior:'instant', block:'center'});")
        time.sleep(1)
        driver.save_screenshot("scratch/mobile_training_section.png")
        
        # Scroll to mobile internship section
        driver.execute_script("var el = document.querySelector('.arox-mob-intern-row') || document.querySelector('#mobileInternshipSection'); if(el) el.scrollIntoView({behavior:'instant', block:'center'});")
        time.sleep(1)
        driver.save_screenshot("scratch/mobile_internship_section.png")
        
        # 4. Mobile Services page (Image 4 mobile reference)
        driver.get("http://localhost:3000/services.html")
        time.sleep(2)
        driver.execute_script("var el = document.querySelector('.services-grid') || document.querySelector('.arox-service-card'); if(el) el.scrollIntoView({behavior:'instant', block:'center'});")
        time.sleep(1)
        driver.save_screenshot("scratch/mobile_services_section.png")
        
        print("Screenshots taken successfully!")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    run()

