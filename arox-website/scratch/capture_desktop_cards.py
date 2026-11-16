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
    driver.set_window_size(1440, 900)
    driver.get("http://localhost:3000/training.html")
    time.sleep(1.5)
    
    # Scroll to cards section
    driver.execute_script("""
        var sec = document.getElementById('hscrollSection');
        if (sec) sec.scrollIntoView();
    """)
    time.sleep(1)
    driver.save_screenshot("scratch/desktop_training_cards.png")
    
    # Switch to Internship tab
    driver.execute_script("""
        var internBtn = document.querySelector('button[data-type=\"internship\"]');
        if (internBtn) internBtn.click();
    """)
    time.sleep(1)
    driver.save_screenshot("scratch/desktop_internship_cards.png")
finally:
    driver.quit()

