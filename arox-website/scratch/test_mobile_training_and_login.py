import os, time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

try:
    os.makedirs('scratch/shots', exist_ok=True)
    # Set iPhone 12/13/14 viewport (390 x 844)
    driver.execute_cdp_cmd('Emulation.setDeviceMetricsOverride', {
        'width': 390,
        'height': 844,
        'deviceScaleFactor': 2,
        'mobile': True
    })

    # ==========================================
    # TEST 1: TRAINING MOBILE FLIP & PILLS
    # ==========================================
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Check Pills Row
    pills = driver.find_elements(By.CSS_SELECTOR, '.arox-mob-pill')
    print(f'Found {len(pills)} mobile pills:')
    for p in pills:
        rect = p.rect
        print(f'  Pill "{p.text}": x={rect["x"]}, y={rect["y"]}, w={rect["width"]}, h={rect["height"]}')

    # Scroll to training cards section
    train_cards = driver.find_elements(By.CSS_SELECTOR, '.arox-mobile-flip-card')
    print(f'Found {len(train_cards)} mobile flip cards.')
    
    if train_cards:
        first_card = train_cards[0]
        driver.execute_script("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", first_card)
        time.sleep(0.5)
        
        # Take screenshot of un-flipped card
        driver.save_screenshot('scratch/shots/mob_training_unflipped.png')
        print('Captured un-flipped card screenshot.')

        # Click the card to flip!
        print('Clicking first training card to flip in 3D...')
        driver.execute_script("arguments[0].click();", first_card)
        time.sleep(0.8) # Wait for 0.6s transition

        has_flipped_class = 'flipped' in first_card.get_attribute('class')
        print(f'First card has class "flipped": {has_flipped_class}')

        # Take screenshot of flipped card
        driver.save_screenshot('scratch/shots/mob_training_flipped.png')
        print('Captured flipped card screenshot (revealing back details)!')

        # Click again to unflip!
        print('Clicking again to flip back...')
        driver.execute_script("arguments[0].click();", first_card)
        time.sleep(0.8)
        has_flipped_class_after = 'flipped' in first_card.get_attribute('class')
        print(f'First card has class "flipped" after second click: {has_flipped_class_after}')

    # Check console logs for training.html
    train_logs = driver.get_log('browser')
    severe_train_errors = [l for l in train_logs if l['level'] == 'SEVERE']
    print(f'training.html SEVERE errors: {len(severe_train_errors)}')
    for l in severe_train_errors:
        print('  Error:', l['message'])

    # ==========================================
    # TEST 2: LOGIN CONSOLE & INTERACTIVITY
    # ==========================================
    driver.get('http://localhost:3000/login.html')
    time.sleep(1)

    login_logs = driver.get_log('browser')
    severe_login_errors = [l for l in login_logs if l['level'] == 'SEVERE']
    print(f'login.html SEVERE errors: {len(severe_login_errors)}')
    for l in severe_login_errors:
        print('  Error:', l['message'])

    print('\nAll tests completed successfully!')

finally:
    driver.quit()

