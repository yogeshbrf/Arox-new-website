import time
import pprint
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)

try:
    driver.get('http://localhost:3000/services.html')
    time.sleep(2)
    
    # 1. At scroll = 0 (before navVisible is true)
    res0 = driver.execute_script("""
        var nav = document.getElementById('services-floating-nav');
        var pills = document.querySelector('.services-category-pills-bar');
        var header = document.getElementById('site-header');
        
        function getInfo(el) {
            if (!el) return null;
            var r = el.getBoundingClientRect();
            var cs = window.getComputedStyle(el);
            return {
                rect: { top: r.top, left: r.left, width: r.width, height: r.height },
                display: cs.display,
                visibility: cs.visibility,
                opacity: cs.opacity,
                pointerEvents: cs.pointerEvents,
                zIndex: cs.zIndex
            };
        }
        
        // Element at (720, 25) - where the floating nav pills are
        var elAtPoint = document.elementFromPoint(720, 25);
        
        return {
            scroll: window.scrollY,
            nav: getInfo(nav),
            pills: getInfo(pills),
            header: getInfo(header),
            elAtPoint: elAtPoint ? { tagName: elAtPoint.tagName, className: elAtPoint.className, id: elAtPoint.id } : null
        };
    """)
    print("AT SCROLL = 0:")
    pprint.pprint(res0)
    
    # 2. Scroll into services section where nav appears
    driver.execute_script("window.scrollTo(0, 1000);")
    time.sleep(1)
    res1000 = driver.execute_script("""
        var nav = document.getElementById('services-floating-nav');
        var pills = document.querySelector('.services-category-pills-bar');
        var header = document.getElementById('site-header');
        var elAtPoint = document.elementFromPoint(720, 25);
        
        return {
            scroll: window.scrollY,
            nav: nav ? { opacity: window.getComputedStyle(nav).opacity, pointerEvents: window.getComputedStyle(nav).pointerEvents } : null,
            pills: pills ? { pointerEvents: window.getComputedStyle(pills).pointerEvents } : null,
            elAtPoint: elAtPoint ? { tagName: elAtPoint.tagName, className: elAtPoint.className, id: elAtPoint.id } : null
        };
    """)
    print("\nAT SCROLL = 1000:")
    pprint.pprint(res1000)
    
finally:
    driver.quit()

