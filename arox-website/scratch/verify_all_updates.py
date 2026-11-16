import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(options=chrome_options)

try:
    # 1. TEST DESKTOP INTERNSHIP CARD ALIGNMENT & SIZING
    print("=== TESTING DESKTOP INTERNSHIP CARDS ===")
    driver.set_window_size(1440, 900)
    driver.get("http://localhost:3000/training.html")
    time.sleep(1.5)
    
    # Switch to Internship tab
    driver.execute_script("""
        var internBtn = document.querySelector('button[data-type="internship"]');
        if (internBtn) internBtn.click();
        var sec = document.getElementById('hscrollSection');
        if (sec) sec.scrollIntoView();
    """)
    time.sleep(1)
    
    # Check layout of active internship card
    desktop_info = driver.execute_script("""
        var activeCard = document.querySelector('.internship-card-slit.active');
        if (!activeCard) return null;
        var heroView = activeCard.querySelector('.card-hero-view');
        var content = activeCard.querySelector('.card-hero-content');
        var graphic = activeCard.querySelector('.card-hero-graphic');
        var img = activeCard.querySelector('.hero-card-img');
        var desc = activeCard.querySelector('.card-hero-desc');
        var cta = activeCard.querySelector('.card-hero-cta');
        
        var csHero = window.getComputedStyle(heroView);
        var csContent = window.getComputedStyle(content);
        var csGraphic = window.getComputedStyle(graphic);
        
        var rectCard = activeCard.getBoundingClientRect();
        var rectContent = content.getBoundingClientRect();
        var rectGraphic = graphic.getBoundingClientRect();
        var rectDesc = desc.getBoundingClientRect();
        var rectCta = cta.getBoundingClientRect();
        
        return {
            cardWidth: rectCard.width,
            cardHeight: rectCard.height,
            contentTop: rectContent.top - rectCard.top,
            contentLeft: rectContent.left - rectCard.left,
            contentWidth: rectContent.width,
            descWidth: rectDesc.width,
            graphicRight: rectCard.right - rectGraphic.right,
            graphicBottom: rectCard.bottom - rectGraphic.bottom,
            graphicWidth: rectGraphic.width,
            graphicHeight: rectGraphic.height,
            alignItems: csHero.alignItems,
            overlap: (rectContent.right > rectGraphic.left && rectContent.bottom > rectGraphic.top)
        };
    """)
    print("Desktop Internship Card Layout:", desktop_info)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/desktop_internship_card_aligned.png")
    
    # 2. TEST MOBILE VIEW INTERNSHIP CARDS (390x844)
    print("\n=== TESTING MOBILE INTERNSHIP CARDS ===")
    driver.set_window_size(390, 844)
    driver.get("http://localhost:3000/training.html")
    time.sleep(1.5)
    
    # Scroll to mobile internship section
    driver.execute_script("""
        var internTrack = document.getElementById('aroxMobInternTrack');
        if (internTrack) internTrack.scrollIntoView({ block: 'center' });
    """)
    time.sleep(0.8)
    
    mobile_intern_info = driver.execute_script("""
        var card = document.querySelector('.arox-mob-card-intern');
        if (!card) return null;
        var imgBox = card.querySelector('.arox-intern-img-box');
        var textBox = card.querySelector('.arox-intern-text-box');
        var btn = card.querySelector('.arox-intern-explore-btn');
        
        var cardRect = card.getBoundingClientRect();
        var imgRect = imgBox ? imgBox.getBoundingClientRect() : null;
        var textRect = textBox ? textBox.getBoundingClientRect() : null;
        var btnRect = btn ? btn.getBoundingClientRect() : null;
        
        return {
            cardWidth: cardRect.width,
            cardHeight: cardRect.height,
            hasImgTop: imgRect && (imgRect.top < textRect.top),
            hasTextMiddle: textRect && (textRect.top < btnRect.top),
            hasBtnBottom: btnRect && (btnRect.bottom <= cardRect.bottom + 5),
            btnText: btn ? btn.textContent.trim() : null
        };
    """)
    print("Mobile Internship Card Layout:", mobile_intern_info)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_internship_new_layout_dark.png")
    
    # Light theme mobile
    driver.execute_script("""
        document.documentElement.classList.remove('theme-dark', 'dark');
        document.documentElement.classList.add('theme-light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (window.applyTheme) window.applyTheme('light');
    """)
    time.sleep(0.5)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_internship_new_layout_light.png")

    # 3. TEST MOBILE SERVICES CARDS (390x844)
    print("\n=== TESTING MOBILE SERVICES CARDS ===")
    driver.get("http://localhost:3000/services.html")
    time.sleep(2)
    
    driver.execute_script("""
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (window.applyTheme) window.applyTheme('dark');
        var sCard = document.querySelector('.arox-service-card');
        if (sCard) sCard.scrollIntoView({ block: 'center' });
    """)
    time.sleep(1)
    
    mobile_services_info = driver.execute_script("""
        var sCard = document.querySelector('.arox-service-card');
        if (!sCard) return null;
        var tagline = sCard.querySelector('.card-tagline');
        var divider = sCard.querySelector('.card-divider');
        var title = sCard.querySelector('.card-title-text');
        var videoBox = sCard.querySelector('.card-video-box');
        
        return {
            taglineDisplay: tagline ? window.getComputedStyle(tagline).display : 'none',
            dividerDisplay: divider ? window.getComputedStyle(divider).display : 'none',
            title: title ? title.textContent.trim() : null,
            videoBoxHeight: videoBox ? videoBox.getBoundingClientRect().height : null
        };
    """)
    print("Mobile Service Card Layout:", mobile_services_info)
    driver.save_screenshot("C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/mobile_services_no_explanation.png")

finally:
    driver.quit()
    print("Done testing.")

