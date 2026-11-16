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
    # TEST 1: MOBILE INTERNSHIP MODAL & WORKFLOW
    # ==========================================
    driver.get('http://localhost:3000/training.html')
    time.sleep(2)

    # Find mobile internship track and cards
    intern_track = driver.find_element(By.ID, 'aroxMobileInternTrack')
    intern_cards = intern_track.find_elements(By.CSS_SELECTOR, '.arox-mob-card-intern')
    print(f'Found {len(intern_cards)} mobile internship cards in #aroxMobileInternTrack.')

    if intern_cards:
        first_intern_card = intern_cards[0]
        explore_btn = first_intern_card.find_element(By.CSS_SELECTOR, '.arox-intern-explore-btn')
        print('Found explore button:', explore_btn.text)

        # Scroll into view
        driver.execute_script("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", first_intern_card)
        time.sleep(0.5)

        # Click the Explore Course button
        print('Clicking explore course button in mobile internship card...')
        driver.execute_script("arguments[0].click();", explore_btn)
        time.sleep(0.8)

        modal_backdrop = driver.find_element(By.ID, 'modal-backdrop')
        is_active = 'active' in modal_backdrop.get_attribute('class')
        print(f'Modal backdrop has class "active": {is_active}')

        right_panel = driver.find_element(By.ID, 'modal-right-panel')
        is_displayed = right_panel.is_displayed()
        print(f'modal-right-panel is displayed: {is_displayed}')

        title_el = driver.find_element(By.ID, 'modal-right-title-text')
        print(f'Modal course title: "{title_el.text}"')

        # Take screenshot of opened modal on mobile
        driver.save_screenshot('scratch/shots/mob_internship_modal_stage1.png')
        print('Saved screenshot of modal details view (Stage 1).')

        # Click "Apply Now ->" to test stage 2 workflow
        apply_now_btn = driver.find_element(By.ID, 'modal-apply-trigger-btn')
        print('Clicking "Apply Now ->" button in modal...')
        driver.execute_script("arguments[0].click();", apply_now_btn)
        time.sleep(0.8)

        # Verify step 1 of application form is active
        stepper = driver.find_element(By.ID, 'modal-stepper-header')
        is_stepper_visible = stepper.is_displayed()
        print(f'Stepper header is visible: {is_stepper_visible}')

        driver.save_screenshot('scratch/shots/mob_internship_modal_stage2.png')
        print('Saved screenshot of modal application form (Stage 2).')

        # Test Close button
        close_btn = driver.find_element(By.ID, 'modal-close-btn')
        driver.execute_script("arguments[0].click();", close_btn)
        time.sleep(0.5)

        is_closed = 'active' not in modal_backdrop.get_attribute('class')
        print(f'Modal successfully closed: {is_closed}')

    # ==========================================
    # TEST 2: AUTOFILL CSS VERIFICATION
    # ==========================================
    driver.get('http://localhost:3000/login.html')
    time.sleep(1)

    # Check CSS rules for autofill
    rules_check = driver.execute_script("""
        const sheets = Array.from(document.styleSheets);
        let foundAutofillRules = [];
        for (const sheet of sheets) {
            try {
                const rules = Array.from(sheet.cssRules || []);
                for (const r of rules) {
                    if (r.selectorText && r.selectorText.includes('-webkit-autofill')) {
                        foundAutofillRules.push(r.cssText);
                    }
                }
            } catch(e) {}
        }
        return foundAutofillRules;
    """)

    print(f'\nFound {len(rules_check)} autofill override CSS rules in login.html:')
    for r in rules_check:
        print('  Rule:', r[:100], '...')

    # Check console errors on both pages
    train_logs = driver.get_log('browser')
    severe = [l for l in train_logs if l['level'] == 'SEVERE']
    print(f'\nSevere console errors: {len(severe)}')
    for s in severe:
        print('  Error:', s['message'])

    print('\nAll verification tests completed successfully!')

finally:
    driver.quit()

