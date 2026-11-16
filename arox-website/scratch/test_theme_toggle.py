from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Check initial theme classes
    html_class = driver.execute_script("return document.documentElement.className;")
    body_class = driver.execute_script("return document.body.className;")
    html_theme = driver.execute_script("return document.documentElement.getAttribute('data-theme');")
    print(f"Initial: html.class='{html_class}', body.class='{body_class}', data-theme='{html_theme}'")

    # Click theme toggle button
    driver.execute_script("""
        const btn = document.querySelector('.theme-toggle');
        if (btn) btn.click();
    """)
    time.sleep(1)

    html_class_2 = driver.execute_script("return document.documentElement.className;")
    body_class_2 = driver.execute_script("return document.body.className;")
    html_theme_2 = driver.execute_script("return document.documentElement.getAttribute('data-theme');")
    print(f"After toggle 1: html.class='{html_class_2}', body.class='{body_class_2}', data-theme='{html_theme_2}'")

    # Click theme toggle again
    driver.execute_script("""
        const btn = document.querySelector('.theme-toggle');
        if (btn) btn.click();
    """)
    time.sleep(1)

    html_class_3 = driver.execute_script("return document.documentElement.className;")
    body_class_3 = driver.execute_script("return document.body.className;")
    html_theme_3 = driver.execute_script("return document.documentElement.getAttribute('data-theme');")
    print(f"After toggle 2: html.class='{html_class_3}', body.class='{body_class_3}', data-theme='{html_theme_3}'")

finally:
    driver.quit()

