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

    # Scroll directly to aroxMobileCoursesView
    driver.execute_script("""
        const el = document.getElementById('aroxMobileCoursesView');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    """)
    time.sleep(1)

    # 1. Capture Dark Theme Screenshots
    mobile_el = driver.find_element(By.ID, 'aroxMobileCoursesView')
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_cards_dark_view.png')
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_cards_dark_full.png')
    print("Dark theme screenshots captured!")

    # 2. Inspect Training Card 1 elements
    card1_info = driver.execute_script("""
        const c = document.querySelector('.arox-exact-train-card');
        return {
            num: c.querySelector('.arox-train-num-box')?.innerText,
            badge: c.querySelector('.arox-train-cat-badge')?.innerText,
            title: c.querySelector('.arox-train-title')?.innerText,
            desc: c.querySelector('.arox-train-desc')?.innerText,
            img: c.querySelector('.arox-train-graphic-img')?.src,
            btn: c.querySelector('.arox-train-explore-btn')?.innerText,
            width: c.offsetWidth,
            height: c.offsetHeight
        };
    """)
    print("Card 1 Info (Dark):", card1_info)

    # 3. Switch to Light Theme (as in the uploaded user reference image)
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

    # 4. Capture Light Theme Screenshots (Matching uploaded image)
    mobile_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_cards_light_view.png')
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_cards_light_full.png')
    
    # Capture single card screenshot
    card1_el = driver.find_element(By.CSS_SELECTOR, '.arox-exact-train-card')
    card1_el.screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_card1_light.png')
    print("Light theme screenshots captured!")

    # 5. Click 'Explore Course' on Card 1 to test modal
    driver.execute_script("""
        const btn = document.querySelector('.arox-exact-train-card .arox-train-explore-btn');
        if (btn) btn.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'd:\Downloads\Arox new website\arox-website\scratch\exact_card_modal_opened.png')
    print("Modal opened screenshot captured!")

finally:
    driver.quit()

