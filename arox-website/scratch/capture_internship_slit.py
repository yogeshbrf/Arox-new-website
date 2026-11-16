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
        
        cards = driver.find_elements("css selector", ".internship-card-slit")
        print("Found slit cards:", len(cards))
        
        if cards:
            driver.execute_script("arguments[0].scrollIntoView({behavior:'instant', block:'center'});", cards[0])
            time.sleep(1)
            driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_internship_active_card.png")
            print("Saved desktop_internship_active_card.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    run()
