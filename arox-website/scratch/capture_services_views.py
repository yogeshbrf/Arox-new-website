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
        # Desktop services (Dark mode)
        driver.get("http://localhost:3000/services.html")
        time.sleep(2)
        driver.execute_script("""
            var grid = document.querySelector('.services-grid') || document.querySelector('.services-section');
            if (grid) grid.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_services_view.png")
        
        # Mobile services (Dark mode)
        driver.set_window_size(390, 844)
        time.sleep(1)
        driver.execute_script("""
            var card = document.querySelector('.arox-service-card');
            if (card) card.scrollIntoView({behavior:'instant', block:'center'});
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_view.png")
        print("Captured services views!")
    finally:
        driver.quit()

if __name__ == "__main__":
    run()

