import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def test_mobile():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--window-size=390,844")
    opts.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=opts)
    
    try:
        driver.get("http://localhost:3000/training.html")
        time.sleep(2)
        
        # Click MANAGEMENT pill
        driver.execute_script("""
            var pills = document.querySelectorAll('.arox-mob-pill');
            pills.forEach(p => {
                if (p.textContent.includes('MANAGEMENT')) p.click();
            });
        """)
        time.sleep(1)
        
        # Scroll to mobile internship track
        driver.execute_script("""
            var track = document.getElementById('aroxMobileInternTrack');
            if (track) {
                track.scrollIntoView({behavior:'instant', block:'center'});
                track.scrollLeft = 900; // scroll to Business Analytics & HR & Finance
            }
        """)
        time.sleep(1)
        driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_mgmt_new_images.png")
        print("Saved mobile_mgmt_new_images.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_mobile()

