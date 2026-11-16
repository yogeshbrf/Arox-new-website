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
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver.execute_script("""
        document.documentElement.classList.remove('theme-dark', 'dark');
        document.documentElement.classList.add('theme-light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (window.applyTheme) window.applyTheme('light');
        var cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView();
    """)
    time.sleep(0.5)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_cta_light.png")
finally:
    driver.quit()

