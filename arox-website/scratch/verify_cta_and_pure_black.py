import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(options=chrome_options)

pages = [
    ('index.html', 'Home'),
    ('about.html', 'About'),
    ('services.html', 'Services'),
    ('training.html', 'Training'),
    ('courses.html', 'Courses'),
    ('contact.html', 'Contact'),
    ('detail.html?course=python-full-stack', 'Detail')
]

results = []

try:
    # 1. TEST DESKTOP (1440x900)
    driver.set_window_size(1440, 900)
    print("=== TESTING DESKTOP (1440x900) ===")
    
    for page, name in pages:
        url = f"http://localhost:3000/{page}"
        driver.get(url)
        time.sleep(1)
        
        # Ensure Dark Mode
        driver.execute_script("""
            document.documentElement.classList.remove('theme-light');
            document.documentElement.classList.add('theme-dark', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            if (window.applyTheme) window.applyTheme('dark');
        """)
        time.sleep(0.5)
        
        # Check CTA section
        cta_info = driver.execute_script("""
            var ctaSec = document.querySelector('.cta-section');
            var ctaCard = document.querySelector('.cta-card');
            if (!ctaSec || !ctaCard) return null;
            var secStyle = window.getComputedStyle(ctaSec);
            var cardStyle = window.getComputedStyle(ctaCard);
            var secRect = ctaSec.getBoundingClientRect();
            var cardRect = ctaCard.getBoundingClientRect();
            var winWidth = window.innerWidth;
            return {
                secWidth: secRect.width,
                cardWidth: cardRect.width,
                winWidth: winWidth,
                secPadding: secStyle.padding,
                cardBorderRadius: cardStyle.borderRadius,
                cardBgColor: cardStyle.backgroundColor,
                cardBgImage: cardStyle.backgroundImage
            };
        """)
        
        # Check all sections for pure black in dark mode
        sections_bg = driver.execute_script("""
            var secs = document.querySelectorAll('section, main > section');
            var bgList = [];
            secs.forEach(function(s) {
                var cs = window.getComputedStyle(s);
                bgList.push({
                    id: s.id || s.className.substring(0, 30),
                    bg: cs.backgroundColor,
                    computedBg: cs.background
                });
            });
            return bgList;
        """)
        
        print(f"[{name}] Desktop CTA:")
        if cta_info:
            print(f"  Sec width: {cta_info['cardWidth']} / {cta_info['winWidth']}px | Radius: {cta_info['cardBorderRadius']} | Padding: {cta_info['secPadding']}")
        print(f"[{name}] Sections background in Dark Mode:")
        for s in sections_bg:
            print(f"  Section '{s['id']}': {s['bg']}")
            
    # Take screenshot of Desktop CTA on Home
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver.execute_script("""
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        var cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView();
    """)
    time.sleep(0.5)
    driver.save_screenshot("scratch/desktop_cta_dark.png")
    
    # 2. TEST MOBILE VIEW (390x844)
    print("\n=== TESTING MOBILE (390x844) ===")
    driver.set_window_size(390, 844)
    
    # Test Dark Mode Mobile CTA
    driver.get("http://localhost:3000/training.html")
    time.sleep(1)
    driver.execute_script("""
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (window.applyTheme) window.applyTheme('dark');
        var cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView();
    """)
    time.sleep(0.5)
    
    mob_dark_cta = driver.execute_script("""
        var ctaCard = document.querySelector('.cta-card');
        var cs = window.getComputedStyle(ctaCard);
        return {
            bgImg: cs.backgroundImage,
            bgCol: cs.backgroundColor,
            width: ctaCard.getBoundingClientRect().width,
            radius: cs.borderRadius
        };
    """)
    print("Mobile Training Dark CTA:", mob_dark_cta)
    driver.save_screenshot("scratch/mobile_cta_dark.png")
    
    # Test Light Mode Mobile CTA
    driver.execute_script("""
        document.documentElement.classList.remove('theme-dark', 'dark');
        document.documentElement.classList.add('theme-light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (window.applyTheme) window.applyTheme('light');
    """)
    time.sleep(0.5)
    mob_light_cta = driver.execute_script("""
        var ctaCard = document.querySelector('.cta-card');
        var cs = window.getComputedStyle(ctaCard);
        return {
            bgImg: cs.backgroundImage,
            bgCol: cs.backgroundColor,
            width: ctaCard.getBoundingClientRect().width,
            radius: cs.borderRadius
        };
    """)
    print("Mobile Training Light CTA:", mob_light_cta)
    driver.save_screenshot("scratch/mobile_cta_light.png")

    # Also test Home Mobile Dark & Light CTA
    driver.get("http://localhost:3000/index.html")
    time.sleep(1)
    driver.execute_script("""
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        if (window.applyTheme) window.applyTheme('dark');
        var cta = document.querySelector('.cta-section');
        if (cta) cta.scrollIntoView();
    """)
    time.sleep(0.5)
    home_mob_dark_cta = driver.execute_script("""
        var ctaCard = document.querySelector('.cta-card');
        var cs = window.getComputedStyle(ctaCard);
        return {
            bgImg: cs.backgroundImage,
            bgCol: cs.backgroundColor,
            width: ctaCard.getBoundingClientRect().width,
            radius: cs.borderRadius
        };
    """)
    print("Mobile Home Dark CTA:", home_mob_dark_cta)
    driver.save_screenshot("scratch/mobile_home_cta_dark.png")

finally:
    driver.quit()
    print("Done testing.")

