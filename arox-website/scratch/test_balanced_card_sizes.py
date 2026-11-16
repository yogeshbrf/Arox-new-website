import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    driver.execute_script("""
        const el = document.getElementById('aroxMobileCoursesView');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    """)
    time.sleep(0.5)

    # Measure Training Card
    t_info = driver.execute_script("""
        const c = document.querySelector('.arox-exact-train-card');
        return {
            title: c.querySelector('.arox-train-title')?.innerText,
            width: c.offsetWidth,
            height: c.offsetHeight
        };
    """)
    print("Training Card Size:", t_info)

    # Measure Internship Card
    i_info = driver.execute_script("""
        const c = document.querySelector('.arox-mob-card-intern');
        return {
            title: c.querySelector('.arox-intern-top-text')?.innerText.replace('\\n', ' '),
            width: c.offsetWidth,
            height: c.offsetHeight
        };
    """)
    print("Internship Card Size:", i_info)

    # 1. Dark Theme Screenshot
    mobile_el = driver.find_element(By.ID, 'aroxMobileCoursesView')
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\balanced_mobile_dark.png')
    print("Captured balanced_mobile_dark.png")

    # 2. Switch to Light Theme
    driver.execute_script("""
        document.documentElement.classList.remove('dark', 'theme-dark');
        document.documentElement.classList.add('theme-light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (document.body) {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            document.body.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('arox-theme', 'light');
    """)
    time.sleep(1)

    # Light Theme Screenshot
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\balanced_mobile_light.png')
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\balanced_mobile_full_light.png')
    print("Captured balanced_mobile_light.png")

finally:
    driver.quit()

