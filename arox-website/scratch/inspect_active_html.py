import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1440,1000')
driver = webdriver.Chrome(options=opts)
try:
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)
    driver.execute_script("""
        var pills = document.querySelectorAll('#coursesPillNav button, .pill-btn, .toggle-btn, [data-view="internship"]');
        pills.forEach(p => {
            if (p.textContent.includes('INTERNSHIP') || p.getAttribute('data-view') === 'internship') p.click();
        });
        var domainBtns = document.querySelectorAll('#internshipCategoryPills button, .intern-cat-pill');
        domainBtns.forEach(b => {
            if (b.textContent.includes('MANAGEMENT') || b.getAttribute('data-domain') === 'management') b.click();
        });
        var cards = document.querySelectorAll('.internship-card-slit');
        cards.forEach(c => {
            if (c.textContent.includes('POWER BI') || c.textContent.includes('Power BI')) c.click();
        });
    """)
    time.sleep(1)
    
    html = driver.execute_script("""
        var card = document.querySelector('.internship-card-slit.active');
        return card ? card.innerHTML : 'NO ACTIVE CARD';
    """)
    print("CARD INNER HTML:")
    print(html[:1000])
finally:
    driver.quit()

