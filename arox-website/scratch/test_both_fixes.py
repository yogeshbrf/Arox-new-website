import time
import pprint
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)

try:
    print("=== TESTING BUG FIX 2 (services-floating-nav click bug) ===")
    driver.get('http://localhost:3000/services.html')
    time.sleep(2)
    
    # Check at scroll = 0
    test_scroll_0 = driver.execute_script("""
        var el = document.elementFromPoint(720, 25);
        var nav = document.getElementById('services-floating-nav');
        var csNav = window.getComputedStyle(nav);
        return {
            scroll: window.scrollY,
            navVisible: csNav.visibility,
            navPointerEvents: csNav.pointerEvents,
            navOpacity: csNav.opacity,
            elAtPoint: el ? { tag: el.tagName, id: el.id, className: el.className } : null
        };
    """)
    print("At scroll = 0 (before nav shows):")
    pprint.pprint(test_scroll_0)
    
    # Try clicking at (720, 25)
    driver.execute_script("""
        var el = document.elementFromPoint(720, 25);
        if (el) el.click();
    """)
    time.sleep(1)
    scroll_after_click_0 = driver.execute_script("return window.scrollY;")
    print(f"Scroll position after clicking spot at top: {scroll_after_click_0} (expected 0, did NOT navigate to card!)")
    
    # Scroll to services section
    driver.execute_script("window.scrollTo(0, 1200);")
    time.sleep(1)
    test_scroll_1200 = driver.execute_script("""
        var el = document.elementFromPoint(720, 25);
        var nav = document.getElementById('services-floating-nav');
        var csNav = window.getComputedStyle(nav);
        return {
            scroll: window.scrollY,
            navVisible: csNav.visibility,
            navPointerEvents: csNav.pointerEvents,
            navOpacity: csNav.opacity,
            elAtPoint: el ? { tag: el.tagName, id: el.id, className: el.className } : null
        };
    """)
    print("\nAt scroll = 1200 (while nav shows):")
    pprint.pprint(test_scroll_1200)
    
    # Scroll way past services section to tech-stack or footer
    driver.execute_script("""
        var tech = document.getElementById('tech-stack-section') || document.querySelector('footer');
        if (tech) tech.scrollIntoView();
        else window.scrollTo(0, 8000);
    """)
    time.sleep(1)
    test_scroll_past = driver.execute_script("""
        var el = document.elementFromPoint(720, 25);
        var nav = document.getElementById('services-floating-nav');
        var csNav = window.getComputedStyle(nav);
        return {
            scroll: window.scrollY,
            navVisible: csNav.visibility,
            navPointerEvents: csNav.pointerEvents,
            navOpacity: csNav.opacity,
            elAtPoint: el ? { tag: el.tagName, id: el.id, className: el.className } : null
        };
    """)
    print("\nAt scroll past services (after nav moves away):")
    pprint.pprint(test_scroll_past)
    
    # Click at (720, 25) while past services
    scroll_before_click_past = driver.execute_script("return window.scrollY;")
    driver.execute_script("""
        var el = document.elementFromPoint(720, 25);
        if (el) el.click();
    """)
    time.sleep(1)
    scroll_after_click_past = driver.execute_script("return window.scrollY;")
    print(f"Scroll before click: {scroll_before_click_past}, after click: {scroll_after_click_past} (did NOT navigate to card!)")

finally:
    driver.quit()

print("Bug Fix 2 test completed!")

