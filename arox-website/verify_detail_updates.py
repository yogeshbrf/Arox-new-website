from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

def verify():
    opts = Options()
    opts.add_argument('--headless')
    opts.add_experimental_option('mobileEmulation', {'deviceName': 'iPhone 12 Pro'})
    driver = webdriver.Chrome(options=opts)
    
    # 1. Test mobile view (390x844)
    driver.get('http://localhost:3000/detail.html?course=full-stack-web-development&from=training')
    time.sleep(1)
    
    # Collect layout metrics
    metrics = driver.execute_script('''
        const hero = document.querySelector('.detail-hero');
        const backBtn = document.getElementById('back-to-courses-btn');
        const title = hero.querySelector('.hero-title');
        const desc = hero.querySelector('.hero-desc');
        const btnsWrap = hero.querySelector('.hero-btns');
        const btns = btnsWrap.querySelectorAll('a');
        const visual = hero.querySelector('.hero-visual');
        const reviewsWrap = document.getElementById('reviews-container');
        const tracks = reviewsWrap.querySelectorAll('.reviews-marquee-track');
        const cards = reviewsWrap.querySelectorAll('.review-card');
        
        function getBox(el) {
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
                x: r.x, y: r.y, w: r.width, h: r.height,
                fontSize: cs.fontSize,
                display: cs.display,
                flexDirection: cs.flexDirection,
                textAlign: cs.textAlign,
                animation: cs.animationName
            };
        }
        
        return {
            backBtn: getBox(backBtn),
            title: getBox(title),
            desc: getBox(desc),
            btnsWrap: getBox(btnsWrap),
            btn1: getBox(btns[0]),
            btn2: getBox(btns[1]),
            visual: getBox(visual),
            reviewsWrap: getBox(reviewsWrap),
            track1: getBox(tracks[0]),
            track2: getBox(tracks[1]),
            cardCount: cards.length,
            card0: getBox(cards[0]),
            card1: getBox(cards[1]),
            card2: getBox(cards[2])
        };
    ''')
    
    print("--- MOBILE VIEW METRICS (390px) ---")
    import pprint
    pprint.pprint(metrics)
    
    # Assertions
    assert metrics['backBtn']['x'] <= 25, f"Back btn not at top left! x={metrics['backBtn']['x']}"
    assert metrics['backBtn']['fontSize'] == '11px', f"Back btn size not 11px! size={metrics['backBtn']['fontSize']}"
    assert abs(metrics['btn1']['y'] - metrics['btn2']['y']) < 3, f"Hero btns not in single row! y1={metrics['btn1']['y']}, y2={metrics['btn2']['y']}"
    assert metrics['track1']['animation'] == 'reviewsMarqueeLeft', f"Track 1 missing marquee animation! {metrics['track1']['animation']}"
    assert metrics['cardCount'] == 6, f"Expected 6 cards (3 + 3 clone), got {metrics['cardCount']}"
    
    # Take mobile screenshots
    driver.save_screenshot('detail_mobile_hero.png')
    
    driver.execute_script("document.getElementById('reviews-container').scrollIntoView();")
    time.sleep(0.5)
    driver.save_screenshot('detail_mobile_reviews.png')
    
    # Check console logs
    logs = driver.get_log('browser')
    errors = [l for l in logs if l['level'] == 'SEVERE']
    print(f"Console errors: {len(errors)}")
    for e in errors:
        print("  Error:", e['message'])
    
    driver.quit()
    
    # 2. Test desktop view
    opts2 = Options()
    opts2.add_argument('--headless')
    opts2.add_argument('--window-size=1280,800')
    driver2 = webdriver.Chrome(options=opts2)
    driver2.get('http://localhost:3000/detail.html?course=full-stack-web-development&from=training')
    time.sleep(1)
    
    desktop_metrics = driver2.execute_script('''
        const reviewsWrap = document.getElementById('reviews-container');
        const track1 = reviewsWrap.querySelector('.reviews-marquee-track:first-child');
        const track2 = reviewsWrap.querySelector('.reviews-marquee-track:nth-child(2)');
        const cs1 = window.getComputedStyle(track1);
        const cs2 = window.getComputedStyle(track2);
        const cards = reviewsWrap.querySelectorAll('.review-card');
        return {
            track1Display: cs1.display,
            track2Display: cs2.display,
            card0: cards[0].getBoundingClientRect(),
            card1: cards[1].getBoundingClientRect(),
            card2: cards[2].getBoundingClientRect()
        };
    ''')
    print("--- DESKTOP VIEW METRICS ---")
    pprint.pprint(desktop_metrics)
    
    # On desktop, track1 is display: contents, track2 is none, and 3 cards are in 3 columns (different x coordinates, same y)
    assert desktop_metrics['track1Display'] == 'contents', f"Desktop track1 not contents: {desktop_metrics['track1Display']}"
    assert desktop_metrics['track2Display'] == 'none', f"Desktop track2 not hidden: {desktop_metrics['track2Display']}"
    assert abs(desktop_metrics['card0']['y'] - desktop_metrics['card1']['y']) < 5, "Desktop cards not aligned horizontally!"
    assert desktop_metrics['card0']['x'] < desktop_metrics['card1']['x'] < desktop_metrics['card2']['x'], "Desktop cards not in 3 columns!"
    
    driver2.save_screenshot('detail_desktop_reviews.png')
    driver2.quit()
    print("All checks passed successfully!")

if __name__ == '__main__':
    verify()
