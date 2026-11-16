from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless')
opts.add_argument('--window-size=390,844')
driver = webdriver.Chrome(options=opts)

driver.get('http://localhost:3000/detail.html?course=full-stack-web-development&from=training')

info = driver.execute_script("""
    const hero = document.querySelector('.detail-hero');
    const backBtn = document.getElementById('back-to-courses-btn');
    const title = hero.querySelector('.hero-title');
    const desc = hero.querySelector('.hero-desc');
    const btns = hero.querySelector('.hero-btns');
    const visual = hero.querySelector('.hero-visual');
    const features = hero.querySelector('.hero-features');
    
    function getBox(el) {
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
            rect: {x: r.x, y: r.y, w: r.width, h: r.height},
            textAlign: cs.textAlign,
            display: cs.display,
            flexDirection: cs.flexDirection,
            fontSize: cs.fontSize
        };
    }
    
    return {
        backBtn: getBox(backBtn),
        title: getBox(title),
        desc: getBox(desc),
        btns: getBox(btns),
        visual: getBox(visual),
        features: getBox(features)
    };
""")

import pprint
pprint.pprint(info)
driver.quit()

