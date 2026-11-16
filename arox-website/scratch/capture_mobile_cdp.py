import os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from PIL import Image

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

try:
    os.makedirs('scratch/shots', exist_ok=True)
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride', {
        'width': 390,
        'height': 844,
        'deviceScaleFactor': 2,
        'mobile': True
    })
    
    driver.get('http://localhost:3000/login.html')
    time.sleep(1)
    driver.save_screenshot('scratch/shots/cdp_mobile_signin.png')

    driver.execute_script("toggleAuthMode('register');")
    time.sleep(0.5)
    driver.save_screenshot('scratch/shots/cdp_mobile_register.png')

    print('CDP mobile screenshots taken successfully!')
finally:
    driver.quit()

def side_by_side(img1_path, img2_path, out_path):
    im1 = Image.open(img1_path).convert('RGB')
    im2 = Image.open(img2_path).convert('RGB')
    
    h = 844
    w1 = int(im1.width * (h / im1.height))
    w2 = int(im2.width * (h / im2.height))
    
    im1_resized = im1.resize((w1, h), Image.Resampling.LANCZOS)
    im2_resized = im2.resize((w2, h), Image.Resampling.LANCZOS)
    
    combined = Image.new('RGB', (w1 + w2 + 10, h), (240, 240, 240))
    combined.paste(im1_resized, (0, 0))
    combined.paste(im2_resized, (w1 + 10, 0))
    combined.save(out_path)
    print(f'Saved {out_path}')

ref2 = r'C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/.user_uploaded/media_1794608973553_b32b385c.jpg'
ref3 = r'C:/Users/HP VICTUS/.gemini/antigravity/brain/b147def7-8180-4222-afd7-765a60d13056/.user_uploaded/media_1794608981527_4bae92fb.jpg'

side_by_side('scratch/shots/cdp_mobile_signin.png', ref2, 'scratch/shots/compare_cdp_mobile_signin.png')
side_by_side('scratch/shots/cdp_mobile_register.png', ref3, 'scratch/shots/compare_cdp_mobile_register.png')

