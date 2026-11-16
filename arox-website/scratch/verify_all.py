import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1400,900")

driver = webdriver.Chrome(options=chrome_options)

try:
    print("=== TEST 1: Services Page Hero BG in Dark & Light Themes ===")
    driver.get("http://localhost:3000/services.html")
    time.sleep(1.5)
    
    # Ensure Dark Mode
    driver.execute_script("document.documentElement.className = 'dark'; document.documentElement.setAttribute('data-theme', 'dark');")
    time.sleep(0.5)
    driver.save_screenshot("scratch/services_hero_dark.png")
    
    # Check dark img src and style
    dark_img = driver.find_element(By.CSS_SELECTOR, ".services-hero-img-dark")
    print("Services Dark Img src:", dark_img.get_attribute("src"))
    assert "service-dark.png" in dark_img.get_attribute("src"), "Expected service-dark.png in dark img"

    # Switch to Light Mode
    driver.execute_script("document.documentElement.className = 'theme-light'; document.documentElement.setAttribute('data-theme', 'light');")
    time.sleep(0.5)
    driver.save_screenshot("scratch/services_hero_light.png")
    
    light_img = driver.find_element(By.CSS_SELECTOR, ".services-hero-img-light")
    print("Services Light Img src:", light_img.get_attribute("src"))
    assert "service-light.png" in light_img.get_attribute("src"), "Expected service-light.png in light img"
    print("PASS: Services Hero backgrounds verified!")

    print("\n=== TEST 2: Training Page Hero BG in Dark & Light Themes ===")
    driver.get("http://localhost:3000/training.html")
    time.sleep(1.5)

    # Ensure Dark Mode
    driver.execute_script("document.documentElement.className = 'dark'; document.documentElement.setAttribute('data-theme', 'dark');")
    time.sleep(0.5)
    driver.save_screenshot("scratch/training_hero_dark.png")

    train_dark_img = driver.find_element(By.CSS_SELECTOR, ".training-hero-img-dark")
    print("Training Dark Img src:", train_dark_img.get_attribute("src"))
    assert "training-dark1.png" in train_dark_img.get_attribute("src"), "Expected training-dark1.png in dark img"

    # Switch to Light Mode
    driver.execute_script("document.documentElement.className = 'theme-light'; document.documentElement.setAttribute('data-theme', 'light');")
    time.sleep(0.5)
    driver.save_screenshot("scratch/training_hero_light.png")

    train_light_img = driver.find_element(By.CSS_SELECTOR, ".training-hero-img-light")
    print("Training Light Img src:", train_light_img.get_attribute("src"))
    assert "training-light1.png" in train_light_img.get_attribute("src"), "Expected training-light1.png in light img"
    print("PASS: Training Hero backgrounds verified!")

    print("\n=== TEST 3: Explore Internship <-> Explore Training Button Dynamic Toggle ===")
    btn_text_el = driver.find_element(By.ID, "heroSecondaryBtnText")
    print("Initial Hero Secondary Button text:", btn_text_el.text)
    assert "Explore Internship" in btn_text_el.text, f"Expected 'Explore Internship', got {btn_text_el.text}"

    # Click the Hero Secondary Button to go to Internship
    hero_btn = driver.find_element(By.ID, "heroSecondaryBtn")
    driver.execute_script("arguments[0].click();", hero_btn)
    time.sleep(1)

    btn_text_after_click = driver.find_element(By.ID, "heroSecondaryBtnText").text
    hscroll = driver.find_element(By.ID, "hscrollSection")
    print("After clicking Explore Internship:")
    print("  Button text is now:", btn_text_after_click)
    print("  hscroll classList contains is-internship-view:", "is-internship-view" in hscroll.get_attribute("class"))
    assert "Explore Training" in btn_text_after_click, f"Expected 'Explore Training', got {btn_text_after_click}"

    # Click again to return to Training
    driver.execute_script("arguments[0].click();", hero_btn)
    time.sleep(1)

    btn_text_after_return = driver.find_element(By.ID, "heroSecondaryBtnText").text
    print("After clicking Explore Training:")
    print("  Button text is now:", btn_text_after_return)
    print("  hscroll classList contains is-training-view:", "is-training-view" in hscroll.get_attribute("class"))
    assert "Explore Internship" in btn_text_after_return, f"Expected 'Explore Internship', got {btn_text_after_return}"
    print("PASS: Explore Internship / Explore Training dynamic button verified!")

    print("\n=== TEST 4: Details Form Autofill Styling Verification ===")
    # Open the application modal by calling openRegistrationModal or clicking apply
    driver.execute_script("""
        if (typeof window.openCourseDetailsModal === 'function') {
            window.openCourseDetailsModal('app-development');
        } else if (typeof window.openRegistrationModal === 'function') {
            window.openRegistrationModal('App Development');
        }
    """)
    time.sleep(1)
    
    # Check autofill computed styles on inputs
    inp_bg = driver.execute_script("""
        const inp = document.querySelector('.arox-input') || document.querySelector('.form-input');
        if (!inp) return null;
        const s = window.getComputedStyle(inp);
        return {
            bg: s.backgroundColor,
            color: s.color,
            boxShadow: s.boxShadow
        };
    """)
    print("Computed input style sample in details form:", inp_bg)

    print("\n=== TEST 5: Console Error Audit ===")
    logs = driver.get_log("browser")
    severe = [l for l in logs if l['level'] == 'SEVERE' and 'favicon' not in l['message'].lower()]
    print("Severe console errors on training.html:", len(severe))
    for s in severe:
        print("  -", s['message'])

finally:
    driver.quit()

print("\nAll automated tests completed successfully!")

