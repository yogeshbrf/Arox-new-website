from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_argument('--headless')
opts.add_experimental_option('mobileEmulation', {'deviceName': 'iPhone 12 Pro'})
driver = webdriver.Chrome(options=opts)
driver.get('http://localhost:3000/training.html?tab=internship&domain=cse_it')
time.sleep(1)

# Open first internship modal
driver.execute_script('''
    const btn = document.querySelector('.arox-mob-btn-card') || document.querySelector('.intern-explore-pill') || document.querySelector('.arox-mobile-track-card');
    if (btn) btn.click();
    else {
        // Fallback: trigger openModal
        if (typeof window.openModalWithItem === 'function') {
            window.openModalWithItem('python-full-stack');
        }
    }
''')
time.sleep(0.5)

info = driver.execute_script('''
    const modal = document.querySelector('.modal-window');
    const panel = document.getElementById('modal-right-panel');
    const title = document.getElementById('modal-right-title-text');
    const pills = document.getElementById('modal-tech-pills');
    const learn = document.getElementById('modal-learn-list');
    const btns = document.querySelectorAll('.modal-cta-row button, .modal-cta-row a');
    
    function getBox(el) {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
            x: r.x, y: r.y, w: r.width, h: r.height,
            fontSize: cs.fontSize,
            display: cs.display,
            gridTemplateColumns: cs.gridTemplateColumns,
            padding: cs.padding
        };
    }
    
    return {
        modal: getBox(modal),
        panel: getBox(panel),
        title: getBox(title),
        pills: getBox(pills),
        learn: getBox(learn),
        btn1: getBox(btns[0]),
        btn2: getBox(btns[1])
    };
''')
import pprint
pprint.pprint(info)
driver.save_screenshot('modal_current_mobile.png')
driver.quit()

