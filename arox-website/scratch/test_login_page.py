import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
driver = webdriver.Chrome(options=options)

try:
    driver.get('http://localhost:3000/login.html')
    time.sleep(2)

    # 1. Capture Sign In Fullscreen
    driver.save_screenshot(r'scratch/login_signin_fullscreen.png')
    print("1. Captured Sign In Fullscreen screenshot")

    # Inspect Sign In state
    signin_info = driver.execute_script("""
        const container = document.getElementById('container');
        const email = document.getElementById('login-email');
        const pass = document.getElementById('login-password');
        const backBtn = document.querySelector('.back-home-btn');
        const logo = document.querySelector('.brand-logo-img');
        const leftRoles = document.querySelector('.role-left');
        const activeRole = document.querySelector('.role-left .role-btn.active');

        return {
            containerWidth: container.offsetWidth,
            containerHeight: container.offsetHeight,
            emailVal: email ? email.value : null,
            emailPlaceholder: email ? email.placeholder : null,
            passVal: pass ? pass.value : null,
            passPlaceholder: pass ? pass.placeholder : null,
            backBtnVisible: backBtn ? window.getComputedStyle(backBtn).display : 'none',
            hasLogo: !!logo,
            leftRolesPresent: !!leftRoles,
            activeRoleText: activeRole ? activeRole.innerText.trim() : null
        };
    """)
    print("Sign In info:", signin_info)

    # 2. Click Employee role button on left
    driver.execute_script("""
        const empBtn = document.querySelector('.role-left [data-role="employee"]');
        if (empBtn) empBtn.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'scratch/login_role_employee_selected.png')
    print("2. Captured Employee Role selected screenshot")

    # 3. Click Register button to slide to Create Account
    driver.execute_script("""
        const regBtn = document.querySelector('.register-btn');
        if (regBtn) regBtn.click();
    """)
    time.sleep(2)
    driver.save_screenshot(r'scratch/login_register_fullscreen.png')
    print("3. Captured Register Fullscreen screenshot")

    # Inspect Register state
    reg_info = driver.execute_script("""
        const container = document.getElementById('container');
        const rightRoles = document.querySelector('.role-right');
        const activeRightRole = document.querySelector('.role-right .role-btn.active');
        return {
            containerActive: container.classList.contains('active'),
            rightRolesPresent: !!rightRoles,
            activeRightRoleText: activeRightRole ? activeRightRole.innerText.trim() : null
        };
    """)
    print("Register info:", reg_info)

    # 4. Click Admin role on right
    driver.execute_script("""
        const adminBtn = document.querySelector('.role-right [data-role="admin"]');
        if (adminBtn) adminBtn.click();
    """)
    time.sleep(1)
    driver.save_screenshot(r'scratch/login_role_admin_selected.png')
    print("4. Captured Admin Role selected screenshot")

    # 5. Switch back to Login
    driver.execute_script("""
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) loginBtn.click();
    """)
    time.sleep(2)
    driver.save_screenshot(r'scratch/login_back_to_signin.png')
    print("5. Captured Back to Sign In screenshot")

finally:
    driver.quit()

