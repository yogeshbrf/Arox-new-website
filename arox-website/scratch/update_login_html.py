import re

login_html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login & Registration | Arox Tech</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --primary-blue: #0078FF;
      --primary-blue-gradient: linear-gradient(145deg, #0084FF 0%, #0066FF 100%);
      --bg-page: #F3F6FB;
      --card-bg: #FFFFFF;
      --text-dark: #0F172A;
      --text-muted: #64748B;
      --input-bg: #F0F4FA;
      --input-border: #E2E8F0;
      --font-display: 'Montserrat', sans-serif;
      --font-body: 'Inter', sans-serif;
    }

    html, body {
      width: 100%;
      min-height: 100vh;
      font-family: var(--font-body);
      background-color: #FFFFFF;
      color: var(--text-dark);
      overflow-x: hidden;
      margin: 0;
      padding: 0;
    }

    /* ─── BACK TO HOME BUTTON ─── */
    .back-home-btn {
      position: absolute;
      top: 28px;
      left: 32px;
      z-index: 100;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 20px;
      border-radius: 9999px;
      font-family: var(--font-display);
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .back-home-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2.2;
    }

    /* White variant on blue background */
    .back-home-white {
      background: rgba(255, 255, 255, 0.15);
      border: 1.5px solid rgba(255, 255, 255, 0.65);
      color: #FFFFFF;
      backdrop-filter: blur(8px);
    }
    .back-home-white:hover {
      background: rgba(255, 255, 255, 0.28);
      border-color: #FFFFFF;
      transform: translateX(-3px);
    }

    /* Dark variant on white background */
    .back-home-dark {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      color: #1E293B;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    }
    .back-home-dark:hover {
      background: #F8FAFC;
      border-color: #CBD5E1;
      transform: translateX(-3px);
      box-shadow: 0 6px 18px rgba(0, 120, 255, 0.12);
    }

    /* ─── DESKTOP FULL-SCREEN LAYOUT ─── */
    .desktop-auth-container {
      width: 100vw;
      min-height: 100vh;
      height: 100vh;
      display: flex;
      overflow: hidden;
      position: relative;
    }

    /* Blue Panel */
    .auth-blue-panel {
      width: 48%;
      min-width: 48%;
      height: 100%;
      background: var(--primary-blue-gradient);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 40px 48px 36px 48px;
      box-sizing: border-box;
      z-index: 10;
      transition: all 0.4s ease;
    }

    /* Curved edges on blue panel */
    .desktop-auth-container.is-signin .auth-blue-panel {
      order: 1;
      border-top-right-radius: 140px;
      border-bottom-right-radius: 140px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .desktop-auth-container.is-register .auth-blue-panel {
      order: 2;
      border-top-left-radius: 140px;
      border-bottom-left-radius: 140px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    /* White Form Panel */
    .auth-white-panel {
      flex: 1;
      height: 100%;
      background: #FFFFFF;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 48px;
      box-sizing: border-box;
      z-index: 5;
    }

    .desktop-auth-container.is-signin .auth-white-panel {
      order: 2;
    }
    .desktop-auth-container.is-register .auth-white-panel {
      order: 1;
    }

    /* Centered Content in Blue Panel */
    .blue-panel-center {
      margin: auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 440px;
    }
    .blue-panel-title {
      font-family: var(--font-display);
      font-size: 2.75rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 12px;
    }
    .blue-panel-sub {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.92);
      font-weight: 500;
      margin-bottom: 26px;
    }
    .btn-white-outline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 48px;
      border: 2px solid #FFFFFF;
      border-radius: 9999px;
      background: transparent;
      color: #FFFFFF;
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      text-decoration: none;
    }
    .btn-white-outline:hover {
      background: #FFFFFF;
      color: var(--primary-blue);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    /* Portal Access Section at Bottom of Blue Panel */
    .portal-access-wrap {
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: auto;
    }
    .portal-header-line {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      margin-bottom: 12px;
    }
    .portal-line {
      flex: 1;
      height: 1.5px;
      background: rgba(255, 255, 255, 0.35);
    }
    .portal-title {
      font-family: var(--font-display);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.85);
      text-transform: uppercase;
    }

    /* Pill Segmented Bar */
    .portal-pill-bar {
      display: flex;
      align-items: center;
      width: 100%;
      background: rgba(255, 255, 255, 0.18);
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      border-radius: 9999px;
      padding: 4px;
      gap: 4px;
      backdrop-filter: blur(10px);
    }
    .portal-pill-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 8px 12px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: #FFFFFF;
      font-family: var(--font-display);
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }
    .portal-pill-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .portal-pill-btn.active {
      background: #FFFFFF;
      color: var(--primary-blue);
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    }
    .portal-pill-btn:not(.active):hover {
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
    }

    /* ─── FORM CONTENT IN WHITE PANEL ─── */
    .form-box {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .form-box-title {
      font-family: var(--font-display);
      font-size: 2.6rem;
      font-weight: 800;
      color: var(--text-dark);
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 8px;
    }
    .form-box-sub {
      font-size: 1.05rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 28px;
    }

    .auth-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Input Pill Group */
    .input-pill-wrapper {
      width: 100%;
      height: 54px;
      background: var(--input-bg);
      border: 1.5px solid var(--input-border);
      border-radius: 9999px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 14px;
      box-sizing: border-box;
      transition: all 0.25s ease;
    }
    .input-pill-wrapper:focus-within {
      background: #FFFFFF;
      border-color: var(--primary-blue);
      box-shadow: 0 0 0 4px rgba(0, 120, 255, 0.12);
    }
    .input-pill-icon {
      color: #71829D;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .input-pill-divider {
      width: 1.5px;
      height: 22px;
      background: #CBD5E1;
      flex-shrink: 0;
    }
    .input-pill-field {
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--font-body);
      font-size: 0.98rem;
      color: #1E293B;
    }
    .input-pill-field::placeholder {
      color: #8E9BAE;
      font-weight: 400;
    }

    /* Password Eye Button */
    .btn-toggle-eye {
      background: transparent;
      border: none;
      color: #71829D;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      flex-shrink: 0;
      transition: color 0.2s ease;
    }
    .btn-toggle-eye:hover {
      color: var(--primary-blue);
    }

    /* Forgot Password Link */
    .forgot-link-row {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: -4px;
      margin-bottom: 8px;
    }
    .forgot-link {
      font-family: var(--font-display);
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--primary-blue);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .forgot-link:hover {
      color: #0056cc;
      text-decoration: underline;
    }

    /* Submit Pill Button */
    .btn-submit-pill {
      width: 100%;
      height: 52px;
      border-radius: 9999px;
      background: var(--primary-blue-gradient);
      color: #FFFFFF;
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(0, 120, 255, 0.35);
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-submit-pill:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(0, 120, 255, 0.45);
    }
    .btn-submit-pill:active {
      transform: translateY(0);
    }

    /* Mobile container hidden on desktop */
    .mobile-auth-container {
      display: none;
    }

    /* ============================================================
       MOBILE LAYOUT (Max width: 900px)
       Matches Reference Image 2 (Sign In) and Image 3 (Create Account)
    ============================================================ */
    @media (max-width: 900px) {
      body {
        background-color: #FFFFFF;
      }
      .desktop-auth-container {
        display: none !important;
      }
      .mobile-auth-container {
        display: flex !important;
        flex-direction: column;
        width: 100%;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }

      /* Back to Home Mobile */
      .mob-back-home {
        position: absolute;
        top: 18px;
        left: 18px;
        z-index: 50;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 16px;
        border-radius: 9999px;
        font-family: var(--font-display);
        font-size: 0.82rem;
        font-weight: 700;
        text-decoration: none;
      }
      .mob-back-home svg {
        width: 14px;
        height: 14px;
        stroke: currentColor;
        stroke-width: 2.2;
      }

      /* Mobile Sign In View: Top Blue Arch, Bottom White Form */
      .mob-signin-wrap {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100vh;
      }
      .mob-signin-top-blue {
        width: 100%;
        background: var(--primary-blue-gradient);
        border-radius: 0 0 50% 50% / 0 0 70px 70px;
        padding: 24px 20px 28px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        box-sizing: border-box;
      }
      .mob-signin-top-blue .mob-back-home {
        background: rgba(255, 255, 255, 0.15);
        border: 1.5px solid rgba(255, 255, 255, 0.65);
        color: #FFFFFF;
      }

      .mob-signin-heading {
        font-family: var(--font-display);
        font-size: 1.85rem;
        font-weight: 800;
        color: #FFFFFF;
        letter-spacing: -0.02em;
        margin-top: 52px;
        margin-bottom: 6px;
      }
      .mob-signin-sub {
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.92);
        margin-bottom: 16px;
      }
      .mob-signin-reg-btn {
        padding: 8px 36px;
        border: 1.5px solid #FFFFFF;
        border-radius: 9999px;
        color: #FFFFFF;
        font-family: var(--font-display);
        font-size: 0.92rem;
        font-weight: 700;
        background: transparent;
        cursor: pointer;
        margin-bottom: 22px;
      }

      .mob-portal-wrap {
        width: 100%;
        max-width: 320px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .mob-portal-wrap .portal-header-line {
        margin-bottom: 10px;
      }
      .mob-portal-wrap .portal-title {
        font-size: 0.65rem;
      }
      .mob-portal-wrap .portal-pill-btn {
        padding: 7px 10px;
        font-size: 0.78rem;
      }

      .mob-signin-bottom-white {
        flex: 1;
        width: 100%;
        padding: 34px 24px 40px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
      }
      .mob-signin-bottom-white .form-box-title {
        font-size: 2.1rem;
        margin-bottom: 6px;
      }
      .mob-signin-bottom-white .form-box-sub {
        font-size: 0.88rem;
        margin-bottom: 24px;
      }
      .mob-signin-bottom-white .auth-form {
        max-width: 330px;
        gap: 15px;
      }
      .mob-signin-bottom-white .input-pill-wrapper {
        height: 50px;
      }
      .mob-signin-bottom-white .btn-submit-pill {
        height: 50px;
        font-size: 1.05rem;
      }

      /* Mobile Create Account View: Top White Form, Bottom Blue Arch */
      .mob-register-wrap {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100vh;
      }
      .mob-reg-top-white {
        width: 100%;
        padding: 24px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        box-sizing: border-box;
      }
      .mob-reg-top-white .mob-back-home {
        background: #FFFFFF;
        border: 1.5px solid #E2E8F0;
        color: #1E293B;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      .mob-reg-heading {
        font-family: var(--font-display);
        font-size: 2.1rem;
        font-weight: 800;
        color: var(--text-dark);
        letter-spacing: -0.02em;
        margin-top: 52px;
        margin-bottom: 6px;
      }
      .mob-reg-sub {
        font-size: 0.88rem;
        color: var(--text-muted);
        margin-bottom: 20px;
      }
      .mob-reg-top-white .auth-form {
        max-width: 330px;
        gap: 13px;
      }
      .mob-reg-top-white .input-pill-wrapper {
        height: 48px;
      }
      .mob-reg-top-white .btn-submit-pill {
        height: 50px;
        font-size: 1.05rem;
        margin-top: 6px;
      }

      .mob-reg-bottom-blue {
        width: 100%;
        background: var(--primary-blue-gradient);
        border-radius: 50% 50% 0 0 / 70px 70px 0 0;
        padding: 24px 20px 32px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        margin-top: 24px;
      }
      .mob-reg-welcome-title {
        font-family: var(--font-display);
        font-size: 1.7rem;
        font-weight: 800;
        color: #FFFFFF;
        margin-top: 18px;
        margin-bottom: 6px;
      }
      .mob-reg-welcome-sub {
        font-size: 0.88rem;
        color: rgba(255, 255, 255, 0.92);
        margin-bottom: 16px;
      }
      .mob-reg-login-btn {
        padding: 8px 36px;
        border: 1.5px solid #FFFFFF;
        border-radius: 9999px;
        color: #FFFFFF;
        font-family: var(--font-display);
        font-size: 0.92rem;
        font-weight: 700;
        background: transparent;
        cursor: pointer;
      }
    }
  </style>
</head>
<body>

  <!-- ============================================================
       DESKTOP FULL-SCREEN AUTHENTICATION
  ============================================================ -->
  <div class="desktop-auth-container is-signin" id="desktopAuthContainer">
    
    <!-- Top-Left "Back to Home" Button -->
    <a href="index.html" class="back-home-btn back-home-white" id="desktopBackHomeBtn">
      <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Back to Home</span>
    </a>

    <!-- BLUE PANEL (Left for Sign In, Right for Register) -->
    <div class="auth-blue-panel" id="desktopBluePanel">
      
      <!-- Placeholder div for spacing -->
      <div style="height: 40px;"></div>

      <!-- Sign In Content: "Hello, Welcome!" -->
      <div class="blue-panel-center" id="desktopBlueSigninContent">
        <h2 class="blue-panel-title">Hello, Welcome!</h2>
        <p class="blue-panel-sub">Don't have an account with us yet?</p>
        <button type="button" class="btn-white-outline" onclick="toggleAuthMode('register')">Register</button>
      </div>

      <!-- Register Content: "Welcome Back!" -->
      <div class="blue-panel-center" id="desktopBlueRegisterContent" style="display: none;">
        <h2 class="blue-panel-title">Welcome Back!</h2>
        <p class="blue-panel-sub">Already have an active account?</p>
        <button type="button" class="btn-white-outline" onclick="toggleAuthMode('signin')">Login</button>
      </div>

      <!-- Bottom: PORTAL ACCESS -->
      <div class="portal-access-wrap">
        <div class="portal-header-line">
          <span class="portal-line"></span>
          <span class="portal-title">PORTAL ACCESS</span>
          <span class="portal-line"></span>
        </div>
        <div class="portal-pill-bar">
          <button type="button" class="portal-pill-btn active" data-role="student" onclick="setPortalRole('student')">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
            Student
          </button>
          <button type="button" class="portal-pill-btn" data-role="employee" onclick="setPortalRole('employee')">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
            Employee
          </button>
          <button type="button" class="portal-pill-btn" data-role="admin" onclick="setPortalRole('admin')">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
            Admin
          </button>
        </div>
      </div>

    </div>

    <!-- WHITE PANEL (Right for Sign In, Left for Register) -->
    <div class="auth-white-panel" id="desktopWhitePanel">

      <!-- Form: Sign In -->
      <div class="form-box" id="desktopSigninBox">
        <h1 class="form-box-title">Sign In</h1>
        <p class="form-box-sub">Enter your email and password to log in</p>

        <form class="auth-form" onsubmit="handleSignInSubmit(event)">
          <!-- Email Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="email" id="desktop-signin-email" class="input-pill-field" placeholder="Enter your email" required autocomplete="off" />
          </div>

          <!-- Password Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="password" id="desktop-signin-pass" class="input-pill-field" placeholder="Enter your password" required autocomplete="off" />
            <button type="button" class="btn-toggle-eye" onclick="togglePassVisibility('desktop-signin-pass', this)" aria-label="Toggle password visibility">
              <svg class="eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg class="eye-closed" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-link-row">
            <a href="#" class="forgot-link" onclick="handleForgotPassword(event)">Forgot Password?</a>
          </div>

          <!-- Login Submit Button -->
          <button type="submit" class="btn-submit-pill">Login</button>
        </form>
      </div>

      <!-- Form: Create Account -->
      <div class="form-box" id="desktopRegisterBox" style="display: none;">
        <h1 class="form-box-title">Create Account</h1>
        <p class="form-box-sub">Please fill all mandatory fields to register</p>

        <form class="auth-form" onsubmit="handleRegisterSubmit(event)">
          <!-- Full Name Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="text" id="desktop-reg-name" class="input-pill-field" placeholder="Enter your full name" required autocomplete="off" />
          </div>

          <!-- Email Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="email" id="desktop-reg-email" class="input-pill-field" placeholder="Enter your email address" required autocomplete="off" />
          </div>

          <!-- Contact Number Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="tel" id="desktop-reg-phone" class="input-pill-field" placeholder="Enter 10-digit contact number" pattern="[0-9]{10}" required autocomplete="off" />
          </div>

          <!-- Password Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="password" id="desktop-reg-pass" class="input-pill-field" placeholder="Enter your password (min 6 chars)" minlength="6" required autocomplete="off" />
            <button type="button" class="btn-toggle-eye" onclick="togglePassVisibility('desktop-reg-pass', this)" aria-label="Toggle password visibility">
              <svg class="eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg class="eye-closed" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>

          <!-- Register Submit Button -->
          <button type="submit" class="btn-submit-pill" style="margin-top: 8px;">Register</button>
        </form>
      </div>

    </div>

  </div>


  <!-- ============================================================
       MOBILE AUTHENTICATION (Image 2 Sign In, Image 3 Create Account)
  ============================================================ -->
  <div class="mobile-auth-container" id="mobileAuthContainer">

    <!-- 1. MOBILE SIGN IN VIEW -->
    <div class="mob-signin-wrap" id="mobSigninView">
      
      <!-- Top Blue Section with Curvature -->
      <div class="mob-signin-top-blue">
        <a href="index.html" class="mob-back-home">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Back to Home</span>
        </a>

        <h2 class="mob-signin-heading">Hello, Welcome!</h2>
        <p class="mob-signin-sub">Don't have an account with us yet?</p>
        <button type="button" class="mob-signin-reg-btn" onclick="toggleAuthMode('register')">Register</button>

        <!-- Portal Access -->
        <div class="mob-portal-wrap">
          <div class="portal-header-line">
            <span class="portal-line"></span>
            <span class="portal-title">PORTAL ACCESS</span>
            <span class="portal-line"></span>
          </div>
          <div class="portal-pill-bar">
            <button type="button" class="portal-pill-btn active" data-role="student" onclick="setPortalRole('student')">
              <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
              Student
            </button>
            <button type="button" class="portal-pill-btn" data-role="employee" onclick="setPortalRole('employee')">
              <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              Employee
            </button>
            <button type="button" class="portal-pill-btn" data-role="admin" onclick="setPortalRole('admin')">
              <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              Admin
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom White Form -->
      <div class="mob-signin-bottom-white">
        <h1 class="form-box-title">Sign In</h1>
        <p class="form-box-sub">Enter your email and password to log in</p>

        <form class="auth-form" onsubmit="handleSignInSubmit(event)">
          <!-- Email Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="email" id="mobile-signin-email" class="input-pill-field" placeholder="Enter your email" required autocomplete="off" />
          </div>

          <!-- Password Pill -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="password" id="mobile-signin-pass" class="input-pill-field" placeholder="Enter your password" required autocomplete="off" />
            <button type="button" class="btn-toggle-eye" onclick="togglePassVisibility('mobile-signin-pass', this)" aria-label="Toggle password visibility">
              <svg class="eye-open" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg class="eye-closed" style="display:none;" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>

          <!-- Forgot Password -->
          <div class="forgot-link-row">
            <a href="#" class="forgot-link" onclick="handleForgotPassword(event)">Forgot Password?</a>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit-pill">Login</button>
        </form>
      </div>

    </div>


    <!-- 2. MOBILE CREATE ACCOUNT VIEW -->
    <div class="mob-register-wrap" id="mobRegisterView" style="display: none;">
      
      <!-- Top White Form -->
      <div class="mob-reg-top-white">
        <a href="index.html" class="mob-back-home">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Back to Home</span>
        </a>

        <h1 class="mob-reg-heading">Create Account</h1>
        <p class="mob-reg-sub">Please fill all mandatory fields to register</p>

        <form class="auth-form" onsubmit="handleRegisterSubmit(event)">
          <!-- Name -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="text" id="mobile-reg-name" class="input-pill-field" placeholder="Enter your full name" required autocomplete="off" />
          </div>

          <!-- Email -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="email" id="mobile-reg-email" class="input-pill-field" placeholder="Enter your email address" required autocomplete="off" />
          </div>

          <!-- Phone -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="tel" id="mobile-reg-phone" class="input-pill-field" placeholder="Enter 10-digit contact number" pattern="[0-9]{10}" required autocomplete="off" />
          </div>

          <!-- Password -->
          <div class="input-pill-wrapper">
            <span class="input-pill-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <span class="input-pill-divider"></span>
            <input type="password" id="mobile-reg-pass" class="input-pill-field" placeholder="Enter your password (min 6 chars)" minlength="6" required autocomplete="off" />
            <button type="button" class="btn-toggle-eye" onclick="togglePassVisibility('mobile-reg-pass', this)" aria-label="Toggle password visibility">
              <svg class="eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg class="eye-closed" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit-pill">Register</button>
        </form>
      </div>

      <!-- Bottom Blue Arch -->
      <div class="mob-reg-bottom-blue">
        <!-- Portal Access -->
        <div class="mob-portal-wrap">
          <div class="portal-header-line">
            <span class="portal-line"></span>
            <span class="portal-title">PORTAL ACCESS</span>
            <span class="portal-line"></span>
          </div>
          <div class="portal-pill-bar">
            <button type="button" class="portal-pill-btn active" data-role="student" onclick="setPortalRole('student')">
              <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
              Student
            </button>
            <button type="button" class="portal-pill-btn" data-role="employee" onclick="setPortalRole('employee')">
              <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              Employee
            </button>
            <button type="button" class="portal-pill-btn" data-role="admin" onclick="setPortalRole('admin')">
              <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              Admin
            </button>
          </div>
        </div>

        <h3 class="mob-reg-welcome-title">Welcome Back!</h3>
        <p class="mob-reg-welcome-sub">Already have an active account?</p>
        <button type="button" class="mob-reg-login-btn" onclick="toggleAuthMode('signin')">Login</button>
      </div>

    </div>

  </div>

  <script>
    // State management
    let currentRole = 'student';
    let currentAuthMode = 'signin';

    function setPortalRole(role) {
      currentRole = role;
      document.querySelectorAll('.portal-pill-btn').forEach(btn => {
        if (btn.getAttribute('data-role') === role) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      try {
        localStorage.setItem('arox_user_role', role);
      } catch (e) {}
    }

    function toggleAuthMode(mode) {
      currentAuthMode = mode;
      
      const deskContainer = document.getElementById('desktopAuthContainer');
      const deskBackBtn = document.getElementById('desktopBackHomeBtn');
      const blueSignin = document.getElementById('desktopBlueSigninContent');
      const blueReg = document.getElementById('desktopBlueRegisterContent');
      const whiteSignin = document.getElementById('desktopSigninBox');
      const whiteReg = document.getElementById('desktopRegisterBox');

      const mobSignin = document.getElementById('mobSigninView');
      const mobReg = document.getElementById('mobRegisterView');

      if (mode === 'register') {
        // Desktop Switch to Register
        if (deskContainer) {
          deskContainer.classList.remove('is-signin');
          deskContainer.classList.add('is-register');
        }
        if (deskBackBtn) {
          deskBackBtn.className = 'back-home-btn back-home-dark';
        }
        if (blueSignin) blueSignin.style.display = 'none';
        if (blueReg) blueReg.style.display = 'flex';
        if (whiteSignin) whiteSignin.style.display = 'none';
        if (whiteReg) whiteReg.style.display = 'flex';

        // Mobile Switch to Register
        if (mobSignin) mobSignin.style.display = 'none';
        if (mobReg) mobReg.style.display = 'flex';

        // Update URL hash without scroll jump
        history.replaceState(null, '', '#register');
      } else {
        // Desktop Switch to Sign In
        if (deskContainer) {
          deskContainer.classList.remove('is-register');
          deskContainer.classList.add('is-signin');
        }
        if (deskBackBtn) {
          deskBackBtn.className = 'back-home-btn back-home-white';
        }
        if (blueSignin) blueSignin.style.display = 'flex';
        if (blueReg) blueReg.style.display = 'none';
        if (whiteSignin) whiteSignin.style.display = 'flex';
        if (whiteReg) whiteReg.style.display = 'none';

        // Mobile Switch to Sign In
        if (mobSignin) mobSignin.style.display = 'flex';
        if (mobReg) mobReg.style.display = 'none';

        // Update URL hash without scroll jump
        history.replaceState(null, '', '#login');
      }
    }

    function togglePassVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeClosed) eyeClosed.style.display = 'block';
      } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeClosed) eyeClosed.style.display = 'none';
      }
    }

    function handleForgotPassword(e) {
      e.preventDefault();
      const email = prompt('Please enter your registered email address to reset password:');
      if (email && email.trim()) {
        alert(`A password reset link has been dispatched to ${email.trim()}. Please check your inbox.`);
      }
    }

    function handleSignInSubmit(e) {
      e.preventDefault();
      alert(`Successfully signed in as ${currentRole.toUpperCase()}! Redirecting to dashboard...`);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }

    function handleRegisterSubmit(e) {
      e.preventDefault();
      alert(`Account created successfully for ${currentRole.toUpperCase()} portal! Redirecting to sign in...`);
      toggleAuthMode('signin');
    }

    // Initialize from URL hash or localStorage
    document.addEventListener('DOMContentLoaded', () => {
      // Clear any auto-filled values
      const signinInputs = document.querySelectorAll('#desktop-signin-email, #desktop-signin-pass, #mobile-signin-email, #mobile-signin-pass');
      signinInputs.forEach(i => { i.value = ''; });

      const hash = window.location.hash;
      if (hash === '#register' || hash === '#signup') {
        toggleAuthMode('register');
      } else {
        toggleAuthMode('signin');
      }

      try {
        const savedRole = localStorage.getItem('arox_user_role');
        if (savedRole && ['student', 'employee', 'admin'].includes(savedRole)) {
          setPortalRole(savedRole);
        }
      } catch (e) {}
    });
  </script>
</body>
</html>
"""

with open('login.html', 'w', encoding='utf-8') as f:
    f.write(login_html_template)
print('Updated login.html successfully!')

