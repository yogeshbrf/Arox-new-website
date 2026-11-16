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
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)
    
    # Switch to INTERNSHIP view
    driver.execute_script("window.navigateToSection('internship');")
    time.sleep(1.5)
    
    # Domain is CSE & IT by default, Card 0 is Python Full Stack Development
    driver.execute_script("if (typeof window.activateInternshipCard === 'function') window.activateInternshipCard(0);")
    time.sleep(1)
    
    # Measure track and cards
    metrics = driver.execute_script("""
        var track = document.getElementById('domainCardsTrack');
        var active = track.querySelector('.internship-card-slit.active');
        var inactives = track.querySelectorAll('.internship-card-slit:not(.active)');
        
        var tr = track.getBoundingClientRect();
        var ar = active ? active.getBoundingClientRect() : null;
        var in_rects = Array.from(inactives).map(c => {
            var r = c.getBoundingClientRect();
            return { width: Math.round(r.width), height: Math.round(r.height) };
        });
        
        return {
            track: { width: Math.round(tr.width), height: Math.round(tr.height) },
            activeCard: ar ? { width: Math.round(ar.width), height: Math.round(ar.height) } : null,
            inactiveCardsCount: inactives.length,
            inactiveCardSample: in_rects[0],
            allInactiveWidths: in_rects.map(r => r.width)
        };
    """)
    print("RENDERED METRICS:")
    pprint.pprint(metrics)
    
    # Capture screenshot of the entire track
    track_el = driver.find_element('css selector', '#domainCardsTrack')
    track_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/user_ref_matched_rail.png')
    
    # Also capture active card alone
    active_el = driver.find_element('css selector', '.internship-card-slit.active')
    active_el.screenshot('C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/user_ref_matched_card.png')

    print("Screenshots captured successfully!")

finally:
    driver.quit()

# Create side-by-side comparison between Reference Image and user_ref_matched_rail.png
ref_img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794595153943_1e0b7c13.jpg')
real_img = Image.open(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\user_ref_matched_rail.png')

target_w = 1100
ref_h = int(ref_img.size[1] * (target_w / ref_img.size[0]))
real_h = int(real_img.size[1] * (target_w / real_img.size[0]))

ref_scaled = ref_img.resize((target_w, ref_h), Image.Resampling.LANCZOS)
real_scaled = real_img.resize((target_w, real_h), Image.Resampling.LANCZOS)

combo = Image.new('RGB', (target_w, ref_h + real_h + 30), (8, 12, 20))
combo.paste(ref_scaled, (0, 0))
combo.paste(real_scaled, (0, ref_h + 30))
combo.save(r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\user_rail_reference_comparison.png')
print("Generated user_rail_reference_comparison.png")

