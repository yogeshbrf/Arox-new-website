from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/training.html')
    info = driver.execute_script("""
        const card = document.querySelector('.cta-card');
        const content = document.querySelector('.cta-content');
        const heading = document.querySelector('.cta-heading');
        const text = document.querySelector('.cta-text');
        const cardRect = card.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        return {
            card: { width: cardRect.width, left: cardRect.left, right: cardRect.right },
            content: { width: contentRect.width, left: contentRect.left, right: contentRect.right },
            computedMaxWidth: window.getComputedStyle(content).maxWidth,
            computedMargin: window.getComputedStyle(content).margin,
            computedPadding: window.getComputedStyle(content).padding
        };
    """)
    print("Training CTA layout info:", info)
finally:
    driver.quit()

