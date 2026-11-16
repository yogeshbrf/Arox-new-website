import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(options=chrome_options)
try:
    driver.set_window_size(390, 844)
    driver.get("http://localhost:3000/training.html")
    time.sleep(2)
    
    # Scroll directly to arox-mob-card-intern
    driver.execute_script("""
        var internCard = document.querySelector('.arox-mob-card-intern');
        if (internCard) {
            internCard.scrollIntoView({ behavior: 'instant', block: 'center' });
        } else {
            var view = document.querySelector('.arox-mobile-courses-view');
            if (view) view.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    """)
    time.sleep(1)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_internship_new_layout_dark.png")
    
    # Switch to light mode
    driver.execute_script("""
        document.documentElement.classList.remove('theme-dark', 'dark');
        document.documentElement.classList.add('theme-light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (window.applyTheme) window.applyTheme('light');
    """)
    time.sleep(0.5)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_internship_new_layout_light.png")

finally:
    driver.quit()

