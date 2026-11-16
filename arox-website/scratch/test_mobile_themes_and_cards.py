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

    # Scroll to mobile view
    driver.execute_script("""
        const el = document.getElementById('aroxMobileCoursesView');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    """)
    time.sleep(0.5)

    # 1. Capture DARK THEME Mobile View
    mobile_el = driver.find_element(By.ID, 'aroxMobileCoursesView')
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_dark_square_cards.png')
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_dark_full.png')
    print("Dark theme screenshots captured!")

    # Check Training Card 1 in Dark Theme
    t_card_info = driver.execute_script("""
        const c = document.querySelector('#aroxMobileTrainingTrack .arox-mob-card');
        return {
            title: c.querySelector('.arox-train-title')?.innerText,
            sub: c.querySelector('.arox-train-sub')?.innerText,
            img: c.querySelector('.arox-train-img')?.src,
            width: c.offsetWidth,
            height: c.offsetHeight
        };
    """)
    print("Training card 1 info (Dark):", t_card_info)

    # Check Internship Card 1 in Dark Theme
    i_card_info = driver.execute_script("""
        const c = document.querySelector('#aroxMobileInternTrack .arox-mob-card');
        return {
            l1: c.querySelector('.arox-intern-l1')?.innerText,
            l2: c.querySelector('.arox-intern-l2')?.innerText,
            img: c.querySelector('.arox-intern-img')?.src,
            width: c.offsetWidth,
            height: c.offsetHeight
        };
    """)
    print("Internship card 1 info (Dark):", i_card_info)

    # 2. Switch to LIGHT THEME
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

    # 3. Capture LIGHT THEME Mobile View
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_light_square_cards.png')
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_light_full.png')
    print("Light theme screenshots captured!")

    # 4. Test clicking MANAGEMENT pill in Light Theme
    driver.execute_script("""
        const mgmt = document.querySelector('.arox-mob-pill[data-domain="management"]');
        if (mgmt) mgmt.click();
    """)
    time.sleep(0.8)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_light_management.png')
    print("Light theme Management pill screenshot captured!")

    # 5. Test clicking a card (e.g. Power BI) in Light Theme
    driver.execute_script("""
        const card = document.querySelector('#aroxMobileInternTrack .arox-mob-card');
        if (card) card.click();
    """)
    time.sleep(0.8)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\mobile_light_modal_opened.png')
    print("Light theme modal screenshot captured!")

finally:
    driver.quit()

