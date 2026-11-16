"""
Mobile login layout overhaul for login.html
- Replaces mobile CSS (lines 298-468) with new blue-panel-top/bottom layout
- Replaces mobile HTML (lines 611-721) with new structure
- Updates JS toggleAuth() for new layout
- Updates CSS variables: --sweep:1.2s, --swap-delay:0.7s, --fade:0.4s, adds --stagger:0.04s
- Keeps all desktop layout, placeholders, autocomplete-off, routing unchanged
"""

with open('login.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Update CSS timing variables ──────────────────────────────────────
content = content.replace(
    '      --sweep: 1.8s;\n      --swap-delay: 1.2s;\n      --fade: 0.6s;',
    '      --sweep: 1.2s;\n      --swap-delay: 0.7s;\n      --fade: 0.4s;\n      --stagger: 0.04s;'
)
content = content.replace(
    ':root { --sweep: 0.01s; --swap-delay: 0.01s; --fade: 0.01s; }',
    ':root { --sweep: 0.01s; --swap-delay: 0.01s; --fade: 0.01s; --stagger: 0.001s; }'
)

# ── 2. Replace MOBILE CSS block ──────────────────────────────────────────
OLD_MOB_CSS = """    /* ══════════════════════════════════════════
       MOBILE LAYOUT  (≤768px)
       Consistent order: Back→Tabs→Title→Fields→Button→SwitchStrip
       Blue sweep curtain rises from bottom during transition
       ══════════════════════════════════════════ */
    @media (max-width: 768px) {
      .auth-card { display: none !important; }
      .auth-mobile {
        display: flex !important; flex-direction: column;
        width: 100%; min-height: 100vh; min-height: 100dvh;
        position: relative; overflow: hidden;
        padding: env(safe-area-inset-top) env(safe-area-inset-right)
                 env(safe-area-inset-bottom) env(safe-area-inset-left);
      }

      /* ── MOBILE SWEEP (blue curtain, rises from bottom) ── */
      .mob-sweep {
        position: absolute; bottom: 0; left: 0;
        width: 100%; height: 0;
        background: var(--primary-blue-gradient);
        border-radius: 60px 60px 0 0;
        z-index: 50; pointer-events: none;
      }
      .auth-mobile.mob-sweeping .mob-sweep {
        animation: mobSweep var(--sweep) ease-in-out forwards;
      }
      @keyframes mobSweep {
        0%   { height: 0;    border-radius: 60px 60px 0 0; }
        35%  { height: 110%; border-radius: 0; }
        65%  { height: 110%; border-radius: 0; }
        100% { height: 0;    border-radius: 60px 60px 0 0; }
      }

      /* ── BACK TO HOME (mobile) ── */
      .mob-back {
        position: absolute; top: clamp(10px,2.5vw,16px); left: clamp(12px,3vw,16px);
        z-index: 100; display: inline-flex; align-items: center; gap: 5px;
        padding: clamp(5px,1.2vw,7px) clamp(10px,2.5vw,14px);
        border-radius: 9999px;
        background: rgba(0,0,0,0.06); border: 1.5px solid rgba(0,0,0,0.1);
        color: #1E293B;
        font-family: var(--font-display); font-size: clamp(0.7rem,1.8vw,0.8rem);
        font-weight: 700; text-decoration: none;
      }
      .mob-back svg { width:13px; height:13px; stroke:currentColor; stroke-width:2.2; }

      /* ── MOBILE CONTENT (everything between back-btn and sweep) ── */
      .mob-content {
        display: flex; flex-direction: column;
        flex: 1; width: 100%; z-index: 5;
        position: relative;
      }

      /* ── PORTAL TABS (position 2, at top) ── */
      .mob-tabs {
        padding: clamp(48px,10vw,60px) clamp(16px,4vw,24px) 0;
        display: flex; justify-content: center;
        flex-shrink: 0;
      }
      .mob-tabs .portal-bar {
        max-width: 320px; width: 100%;
        background: rgba(0,120,255,0.08);
        border-color: rgba(0,120,255,0.18);
      }
      .mob-tabs .portal-btn {
        color: var(--text-dark);
        padding: clamp(6px,1.5vw,8px) clamp(8px,2vw,12px);
        font-size: clamp(0.72rem,1.9vw,0.8rem);
        gap: 5px;
      }
      .mob-tabs .portal-btn svg { width:14px; height:14px; fill:currentColor; }
      .mob-tabs .portal-btn.active {
        background: var(--primary-blue); color: #fff;
        box-shadow: 0 3px 10px rgba(0,120,255,0.25);
      }
      .mob-tabs .portal-btn:not(.active):hover {
        background: rgba(0,120,255,0.08);
      }

      /* ── FORM AREA (position 3-5, scrollable) ── */
      .mob-form-area {
        flex: 1; position: relative;
        overflow-y: auto; overflow-x: hidden;
        padding: 0 clamp(20px,5vw,28px);
      }
      .mob-form {
        width: 100%; max-width: 360px;
        margin: 0 auto;
        display: flex; flex-direction: column;
        align-items: center; text-align: center;
        padding: clamp(20px,4vw,30px) 0 clamp(16px,3vw,24px);
      }
      .mob-form .form-title {
        font-size: clamp(1.5rem,5.5vw,2rem);
        margin-bottom: 4px;
      }
      .mob-form .form-sub {
        font-size: clamp(0.78rem,2.2vw,0.88rem);
        margin-bottom: clamp(16px,3.5vw,24px);
      }
      .mob-form .auth-form { gap: 12px; }
      .mob-form .pill-wrap {
        height: clamp(46px,6vh,50px);
        padding: 0 16px; gap: 10px;
      }
      .mob-form .pill-input {
        font-size: clamp(0.82rem,2.2vw,0.93rem);
        text-overflow: ellipsis;
      }
      .mob-form .btn-submit {
        height: clamp(46px,6vh,50px);
        font-size: clamp(0.95rem,2.5vw,1.05rem);
      }
      .mob-form .forgot-row { margin-top: -2px; margin-bottom: 4px; }
      .mob-form .forgot-link { font-size: clamp(0.8rem,2vw,0.88rem); }

      /* Mobile form visibility (JS-controlled: display:none/flex + animation class) */
      .mob-form-enter {
        animation: mobFormIn var(--fade) ease forwards;
      }
      @keyframes mobFormIn {
        from { opacity: 0; transform: translateY(15px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── SWITCH STRIP (position 6, blue at bottom) ── */
      .mob-strip {
        flex-shrink: 0;
        background: var(--primary-blue-gradient);
        border-radius: clamp(30px,6vw,50px) clamp(30px,6vw,50px) 0 0;
        padding: clamp(24px,5vw,36px) clamp(20px,4vw,28px) clamp(28px,5vw,40px);
        display: flex; flex-direction: column;
        align-items: center; text-align: center;
        z-index: 6; /* above mob-content so it overlaps scroll if needed */
      }
      .mob-strip-title {
        font-family: var(--font-display);
        font-size: clamp(1.15rem,3.5vw,1.45rem);
        font-weight: 800; color: #fff;
        margin-bottom: 4px;
      }
      .mob-strip-sub {
        font-size: clamp(0.78rem,2.2vw,0.88rem);
        color: rgba(255,255,255,0.9);
        margin-bottom: clamp(12px,2.5vw,18px);
      }
      .mob-strip .btn-outline {
        padding: clamp(7px,1.5vw,9px) clamp(28px,7vw,40px);
        font-size: clamp(0.82rem,2.2vw,0.92rem);
      }

      /* Switch strip inner content (toggled by JS) */
      .mob-strip-inner { display:flex; flex-direction:column; align-items:center; }

      /* ── Enter animation for switch strip content ── */
      .mob-strip-enter {
        animation: mobFormIn var(--fade) ease forwards;
      }
    }

    /* ── Extra tight: ≤400px ── */
    @media (max-width: 400px) {
      .mob-tabs { padding-top: 44px; }
      .mob-tabs .portal-btn { padding: 5px 6px; font-size: 0.7rem; gap: 3px; }
      .mob-tabs .portal-btn svg { width: 12px; height: 12px; }
      .mob-tabs .portal-bar { max-width: 290px; padding: 3px; gap: 2px; }
      .mob-form .form-title { font-size: 1.4rem; }
      .mob-form .form-sub { font-size: 0.76rem; margin-bottom: 14px; }
      .mob-form .pill-wrap { height: 44px; padding: 0 14px; gap: 8px; }
      .mob-form .pill-input { font-size: 0.8rem; }
      .mob-form .auth-form { gap: 10px; }
      .mob-strip { padding: 18px 16px 24px; border-radius: 28px 28px 0 0; }
      .mob-strip-title { font-size: 1.05rem; }
      .mob-strip-sub { font-size: 0.76rem; margin-bottom: 10px; }
      .mob-strip .btn-outline { padding: 6px 24px; font-size: 0.8rem; }
    }"""

NEW_MOB_CSS = """    /* ══════════════════════════════════════════
       MOBILE LAYOUT  (≤768px)
       LOGIN:    blue panel TOP  (curve bottom) → white form BELOW
       REGISTER: white form TOP → blue panel BOTTOM (curve top)
       Vertical sweep curtain covers full card at midpoint
       ══════════════════════════════════════════ */
    @media (max-width: 768px) {
      .auth-card { display: none !important; }
      .auth-mobile {
        display: flex !important; flex-direction: column;
        width: 100%; height: 100vh; height: 100dvh;
        position: relative; overflow: hidden; background: #fff;
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
      }

      /* ── VERTICAL SWEEP SHAPE (covers full card at midpoint) ── */
      .mob-sweep-shape {
        position: absolute; left: 0; width: 100%;
        background: var(--primary-blue-gradient);
        z-index: 50; pointer-events: none;
        border-radius: 0;
        /* Default (login→register): starts above, moves down */
        top: -310%; height: 320%;
        transition: top var(--sweep) ease-in-out;
        will-change: top;
      }
      /* Trigger: sweep down (login→register) */
      .auth-mobile.mob-sweep-down .mob-sweep-shape {
        top: 100%;
      }
      /* Trigger: sweep up (register→login) — shape starts below */
      .auth-mobile.mob-sweep-up .mob-sweep-shape {
        top: -310%;
        transition: none; /* instant reposition, then... */
      }
      .auth-mobile.mob-sweep-up-go .mob-sweep-shape {
        top: -310%;
        transition: top var(--sweep) ease-in-out;
      }

      /* ── TOP PANEL (blue, login state) ── */
      .mob-panel-top {
        flex-shrink: 0;
        background: var(--primary-blue-gradient);
        border-radius: 0 0 50% 50% / 0 0 55px 55px;
        padding: clamp(10px,2.5vh,16px) clamp(20px,5vw,28px) clamp(22px,4vh,32px);
        display: flex; flex-direction: column; align-items: center;
        z-index: 10; position: relative;
        min-height: clamp(220px, 40vh, 260px);
      }
      /* hide top panel in register mode */
      .auth-mobile.mob-active .mob-panel-top {
        display: none;
      }

      /* ── BOTTOM PANEL (blue, register state) ── */
      .mob-panel-bottom {
        display: none; /* shown in register mode */
        flex-shrink: 0;
        background: var(--primary-blue-gradient);
        border-radius: 50% 50% 0 0 / 55px 55px 0 0;
        padding: clamp(22px,4vh,32px) clamp(20px,5vw,28px) clamp(14px,2.5vh,20px);
        flex-direction: column; align-items: center; text-align: center;
        z-index: 10; position: relative;
        min-height: clamp(200px, 36vh, 240px);
      }
      .auth-mobile.mob-active .mob-panel-bottom {
        display: flex;
      }

      /* ── BACK TO HOME pill (inside top panel for login, top of form for register) ── */
      .mob-back-pill {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 6px 14px; border-radius: 9999px; height: 30px;
        background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.55);
        color: #fff; text-decoration: none;
        font-family: var(--font-display); font-size: 12px; font-weight: 700;
        align-self: flex-start; margin-bottom: clamp(10px,2vh,16px);
        backdrop-filter: blur(6px); flex-shrink: 0;
      }
      .mob-back-pill svg { width:14px; height:14px; stroke:currentColor; stroke-width:2.2; flex-shrink:0; }

      /* back pill in register (white area, dark style) */
      .mob-back-pill-dark {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 6px 14px; border-radius: 9999px; height: 30px;
        background: rgba(0,0,0,0.05); border: 1.5px solid rgba(0,0,0,0.1);
        color: #1E293B; text-decoration: none;
        font-family: var(--font-display); font-size: 12px; font-weight: 700;
        align-self: flex-start; margin-bottom: clamp(10px,2vh,14px);
        flex-shrink: 0;
      }
      .mob-back-pill-dark svg { width:14px; height:14px; stroke:currentColor; stroke-width:2.2; flex-shrink:0; }

      /* ── PANEL HEADING / SUB / BUTTON ── */
      .mob-panel-heading {
        font-family: var(--font-display);
        font-size: clamp(1.25rem,5.5vw,1.375rem);
        font-weight: 700; color: #fff; margin-bottom: 6px; text-align: center;
      }
      .mob-panel-sub {
        font-size: clamp(0.75rem,3.2vw,0.8125rem);
        color: rgba(255,255,255,0.9); margin-bottom: 14px; text-align: center;
      }
      .mob-btn-outline {
        display: inline-flex; align-items: center; justify-content: center;
        height: 35px; padding: 0 22px; border: 2px solid #fff; border-radius: 9999px;
        background: transparent; color: #fff;
        font-family: var(--font-display); font-size: 13px; font-weight: 700;
        cursor: pointer; transition: all 0.25s ease; margin-bottom: 14px;
      }
      .mob-btn-outline:hover { background: #fff; color: var(--primary-blue); }

      /* ── PORTAL ACCESS inside panels ── */
      .mob-portal-wrap {
        width: 100%; display: flex; flex-direction: column; align-items: center;
        margin-top: auto; /* push to bottom of top panel */
      }
      .mob-panel-bottom .mob-portal-wrap {
        margin-top: 0; margin-bottom: 10px; /* at top of bottom panel */
      }
      .mob-portal-hdr {
        display: flex; align-items: center; width: 100%; gap: 8px; margin-bottom: 8px;
      }
      .mob-portal-line { flex: 1; height: 1.5px; background: rgba(255,255,255,0.35); }
      .mob-portal-lbl {
        font-family: var(--font-display); font-size: 10px; font-weight: 800;
        letter-spacing: 1.5px; color: rgba(255,255,255,0.85); text-transform: uppercase;
        white-space: nowrap;
      }
      .mob-portal-bar {
        display: flex; align-items: center; width: 100%;
        background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.4);
        border-radius: 9999px; padding: 3px; gap: 3px;
      }
      .mob-portal-btn {
        flex: 1; display: inline-flex; align-items: center; justify-content: center;
        gap: 4px; height: 34px; border-radius: 9999px; border: none;
        background: transparent; color: #fff;
        font-family: var(--font-display); font-size: clamp(11px,2.8vw,12px); font-weight: 600;
        cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
        min-width: 0;
      }
      .mob-portal-btn svg { width: 13px; height: 13px; fill: currentColor; flex-shrink: 0; }
      .mob-portal-btn.active {
        background: #fff; color: var(--primary-blue); font-weight: 700;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
      .mob-portal-btn:not(.active):hover { background: rgba(255,255,255,0.12); }

      /* ── FORM AREA (scrollable, flex:1) ── */
      .mob-form-area {
        flex: 1; overflow-y: auto; overflow-x: hidden;
        display: flex; flex-direction: column;
        padding: 0 clamp(20px,5vw,28px);
      }

      /* ── REGISTER FORM AREA (top white zone in register mode) ── */
      .mob-reg-top {
        display: none; flex-direction: column; align-items: flex-start;
        flex-shrink: 0;
        padding: clamp(10px,2vh,14px) clamp(20px,5vw,28px) 0;
      }
      .auth-mobile.mob-active .mob-reg-top { display: flex; }

      /* ── INDIVIDUAL FORMS ── */
      .mob-form {
        width: 100%; max-width: 400px;
        margin: 0 auto;
        display: flex; flex-direction: column;
        align-items: center; text-align: center;
        padding: clamp(16px,3.5vh,24px) 0 clamp(12px,2.5vh,20px);
      }
      .mob-form .form-title {
        font-size: clamp(1.5rem,6.5vw,1.625rem);
        margin-bottom: 4px;
      }
      .mob-form .form-sub {
        font-size: clamp(0.75rem,3vw,0.8125rem);
        margin-bottom: clamp(14px,3vh,20px);
      }
      .mob-form .auth-form { gap: 10px; }
      .mob-form .pill-wrap {
        height: 44px; padding: 0 16px; gap: 10px;
      }
      .mob-form .pill-icon svg { width: 17px; height: 17px; }
      .mob-form .pill-input {
        font-size: 14px; text-overflow: ellipsis;
      }
      .mob-form .pill-input::placeholder {
        font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .mob-form .btn-submit {
        height: 45px; font-size: 14px; margin-top: 2px;
      }
      .mob-form .forgot-row { margin-top: -2px; margin-bottom: 4px; }
      .mob-form .forgot-link { font-size: 12px; }
      .mob-form .eye-btn svg { width: 17px; height: 17px; }

      /* ── ENTER ANIMATIONS ── */
      @keyframes mobFormIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .mob-form-enter { animation: mobFormIn var(--fade) ease forwards; }
      .mob-panel-enter { animation: mobFormIn var(--fade) ease forwards; }
    }

    /* ── Extra tight: ≤360px ── */
    @media (max-width: 360px) {
      .mob-form-area { padding: 0 16px; }
      .mob-reg-top { padding-left: 16px; padding-right: 16px; }
      .mob-form .form-title { font-size: 1.375rem; }
      .mob-form .pill-wrap { height: 42px; padding: 0 13px; gap: 8px; }
      .mob-form .pill-input { font-size: 13px; }
      .mob-form .btn-submit { height: 43px; font-size: 13px; }
      .mob-portal-btn { font-size: 10px; gap: 3px; }
      .mob-portal-btn svg { width: 12px; height: 12px; }
    }"""

if OLD_MOB_CSS in content:
    content = content.replace(OLD_MOB_CSS, NEW_MOB_CSS)
    print("✅ Mobile CSS replaced successfully")
else:
    print("❌ OLD_MOB_CSS not found — check whitespace")

# ── 3. Replace MOBILE HTML block ────────────────────────────────────────
OLD_MOB_HTML = """  <!-- ══════════════════════════════════════════
       MOBILE  (≤768px)
       Order: Back → Tabs → Title → Fields → Button → Switch strip
       ══════════════════════════════════════════ -->
  <div class="auth-mobile" id="authMobile">

    <!-- Blue sweep curtain (animation overlay) -->
    <div class="mob-sweep" id="mobSweep"></div>

    <!-- 1. Back to Home -->
    <a href="index.html" class="mob-back" aria-label="Back to home page">
      <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Back to Home</span>
    </a>

    <div class="mob-content">

      <!-- 2. Portal Access tabs -->
      <div class="mob-tabs">
        <div class="portal-bar">
          <button type="button" class="portal-btn active" data-role="student" onclick="setPortalRole('student')" aria-label="Student portal">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>Student
          </button>
          <button type="button" class="portal-btn" data-role="employee" onclick="setPortalRole('employee')" aria-label="Employee portal">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>Employee
          </button>
          <button type="button" class="portal-btn" data-role="admin" onclick="setPortalRole('admin')" aria-label="Admin portal">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>Admin
          </button>
        </div>
      </div>

      <!-- 3-5. Form area (scrollable) -->
      <div class="mob-form-area">

        <!-- Sign In form -->
        <div class="mob-form" id="mobFormSignin">
          <h1 class="form-title">Sign In</h1>
          <p class="form-sub">Enter your email and password to log in</p>
          <form class="auth-form" onsubmit="handleSignIn(event)" autocomplete="off">
            <label for="msi-email" class="sr-only">Email</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
              <span class="pill-div"></span>
              <input type="email" id="msi-email" name="m_login_email" class="pill-input" placeholder="Registered email address" required autocomplete="off" readonly />
            </div>
            <label for="msi-pass" class="sr-only">Password</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
              <span class="pill-div"></span>
              <input type="password" id="msi-pass" name="m_login_pass" class="pill-input" placeholder="Enter your password" required autocomplete="new-password" readonly />
              <button type="button" class="eye-btn" onclick="toggleEye('msi-pass',this)" aria-label="Toggle password visibility">
                <svg class="eo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="ec" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <div class="forgot-row"><a href="#" class="forgot-link" onclick="handleForgot(event)">Forgot Password?</a></div>
            <button type="submit" class="btn-submit">Login</button>
          </form>
        </div>

        <!-- Create Account form (hidden by default) -->
        <div class="mob-form" id="mobFormRegister" style="display:none">
          <h1 class="form-title">Create Account</h1>
          <p class="form-sub">Please fill all mandatory fields to register</p>
          <form class="auth-form" onsubmit="handleRegister(event)" autocomplete="off">
            <label for="mrg-name" class="sr-only">Full name</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              <span class="pill-div"></span>
              <input type="text" id="mrg-name" name="m_reg_name" class="pill-input" placeholder="Full name (as per official records)" required autocomplete="off" readonly />
            </div>
            <label for="mrg-email" class="sr-only">Email</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
              <span class="pill-div"></span>
              <input type="email" id="mrg-email" name="m_reg_email" class="pill-input" placeholder="Official email address" required autocomplete="off" readonly />
            </div>
            <label for="mrg-phone" class="sr-only">Phone</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <span class="pill-div"></span>
              <input type="tel" id="mrg-phone" name="m_reg_phone" class="pill-input" placeholder="10-digit mobile number" inputmode="tel" maxlength="10" pattern="[0-9]{10}" required autocomplete="off" readonly />
            </div>
            <label for="mrg-pass" class="sr-only">Password</label>
            <div class="pill-wrap">
              <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
              <span class="pill-div"></span>
              <input type="password" id="mrg-pass" name="m_reg_pass" class="pill-input" placeholder="Strong password (min 8 chars)" minlength="8" required autocomplete="new-password" readonly />
              <button type="button" class="eye-btn" onclick="toggleEye('mrg-pass',this)" aria-label="Toggle password visibility">
                <svg class="eo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="ec" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <button type="submit" class="btn-submit">Register</button>
          </form>
        </div>
      </div>
    </div>

    <!-- 6. Switch strip (blue, at bottom) -->
    <div class="mob-strip">
      <div class="mob-strip-inner" id="mobStripSignin">
        <p class="mob-strip-title">New here?</p>
        <p class="mob-strip-sub">Don't have an account with us yet?</p>
        <button type="button" class="btn-outline" onclick="toggleAuth('register')">Register</button>
      </div>
      <div class="mob-strip-inner" id="mobStripRegister" style="display:none">
        <p class="mob-strip-title">Welcome Back!</p>
        <p class="mob-strip-sub">Already have an active account?</p>
        <button type="button" class="btn-outline" onclick="toggleAuth('signin')">Login</button>
      </div>
    </div>

  </div>"""

NEW_MOB_HTML = """  <!-- ══════════════════════════════════════════
       MOBILE  (≤768px)
       LOGIN:    blue panel TOP  → white form BELOW
       REGISTER: white form TOP → blue panel BOTTOM
       ══════════════════════════════════════════ -->
  <div class="auth-mobile" id="authMobile">

    <!-- Vertical sweep shape (animation overlay) -->
    <div class="mob-sweep-shape" id="mobSweepShape"></div>

    <!-- ═══ TOP BLUE PANEL (shown in LOGIN state) ═══ -->
    <div class="mob-panel-top" id="mobPanelTop">

      <!-- Back to Home pill (white style, inside blue panel) -->
      <a href="index.html" class="mob-back-pill" aria-label="Back to home page">
        <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Back to Home</span>
      </a>

      <!-- Panel heading + sub + Register button -->
      <h2 class="mob-panel-heading">Hello, Welcome!</h2>
      <p class="mob-panel-sub">Don't have an account with us yet?</p>
      <button type="button" class="mob-btn-outline" onclick="toggleAuth('register')">Register</button>

      <!-- PORTAL ACCESS + tabs (at bottom of top panel) -->
      <div class="mob-portal-wrap">
        <div class="mob-portal-hdr">
          <span class="mob-portal-line"></span>
          <span class="mob-portal-lbl">PORTAL ACCESS</span>
          <span class="mob-portal-line"></span>
        </div>
        <div class="mob-portal-bar" id="mobPortalBarTop">
          <button type="button" class="mob-portal-btn active" data-role="student" onclick="setPortalRole('student')" aria-label="Student portal">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>Student
          </button>
          <button type="button" class="mob-portal-btn" data-role="employee" onclick="setPortalRole('employee')" aria-label="Employee portal">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>Employee
          </button>
          <button type="button" class="mob-portal-btn" data-role="admin" onclick="setPortalRole('admin')" aria-label="Admin portal">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>Admin
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ REGISTER TOP ZONE: Back + form heading (shown in REGISTER state) ═══ -->
    <div class="mob-reg-top" id="mobRegTop">
      <a href="index.html" class="mob-back-pill-dark" aria-label="Back to home page">
        <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Back to Home</span>
      </a>
    </div>

    <!-- ═══ SCROLLABLE FORM AREA ═══ -->
    <div class="mob-form-area" id="mobFormArea">

      <!-- Sign In form (shown in LOGIN state) -->
      <div class="mob-form" id="mobFormSignin">
        <h1 class="form-title">Sign In</h1>
        <p class="form-sub">Enter your email and password to log in</p>
        <form class="auth-form" onsubmit="handleSignIn(event)" autocomplete="off">
          <label for="msi-email" class="sr-only">Email</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
            <span class="pill-div"></span>
            <input type="email" id="msi-email" name="m_login_email" class="pill-input" placeholder="Registered email address" required autocomplete="off" readonly />
          </div>
          <label for="msi-pass" class="sr-only">Password</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
            <span class="pill-div"></span>
            <input type="password" id="msi-pass" name="m_login_pass" class="pill-input" placeholder="Enter your password" required autocomplete="new-password" readonly />
            <button type="button" class="eye-btn" onclick="toggleEye('msi-pass',this)" aria-label="Toggle password visibility">
              <svg class="eo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="ec" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <div class="forgot-row"><a href="#" class="forgot-link" onclick="handleForgot(event)">Forgot Password?</a></div>
          <button type="submit" class="btn-submit">Login</button>
        </form>
      </div>

      <!-- Create Account form (shown in REGISTER state) -->
      <div class="mob-form" id="mobFormRegister" style="display:none">
        <h1 class="form-title">Create Account</h1>
        <p class="form-sub">Please fill all mandatory fields to register</p>
        <form class="auth-form" onsubmit="handleRegister(event)" autocomplete="off">
          <label for="mrg-name" class="sr-only">Full name</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <span class="pill-div"></span>
            <input type="text" id="mrg-name" name="m_reg_name" class="pill-input" placeholder="Full name (as per official records)" required autocomplete="off" readonly />
          </div>
          <label for="mrg-email" class="sr-only">Email</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
            <span class="pill-div"></span>
            <input type="email" id="mrg-email" name="m_reg_email" class="pill-input" placeholder="Official email address" required autocomplete="off" readonly />
          </div>
          <label for="mrg-phone" class="sr-only">Phone</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
            <span class="pill-div"></span>
            <input type="tel" id="mrg-phone" name="m_reg_phone" class="pill-input" placeholder="10-digit mobile number" inputmode="tel" maxlength="10" pattern="[0-9]{10}" required autocomplete="off" readonly />
          </div>
          <label for="mrg-pass" class="sr-only">Password</label>
          <div class="pill-wrap">
            <span class="pill-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
            <span class="pill-div"></span>
            <input type="password" id="mrg-pass" name="m_reg_pass" class="pill-input" placeholder="Strong password (min 8 chars)" minlength="8" required autocomplete="new-password" readonly />
            <button type="button" class="eye-btn" onclick="toggleEye('mrg-pass',this)" aria-label="Toggle password visibility">
              <svg class="eo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="ec" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <button type="submit" class="btn-submit">Register</button>
        </form>
      </div>
    </div>

    <!-- ═══ BOTTOM BLUE PANEL (shown in REGISTER state) ═══ -->
    <div class="mob-panel-bottom" id="mobPanelBottom">
      <!-- PORTAL ACCESS + tabs -->
      <div class="mob-portal-wrap">
        <div class="mob-portal-hdr">
          <span class="mob-portal-line"></span>
          <span class="mob-portal-lbl">PORTAL ACCESS</span>
          <span class="mob-portal-line"></span>
        </div>
        <div class="mob-portal-bar" id="mobPortalBarBottom">
          <button type="button" class="mob-portal-btn active" data-role="student" onclick="setPortalRole('student')" aria-label="Student portal">
            <svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>Student
          </button>
          <button type="button" class="mob-portal-btn" data-role="employee" onclick="setPortalRole('employee')" aria-label="Employee portal">
            <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>Employee
          </button>
          <button type="button" class="mob-portal-btn" data-role="admin" onclick="setPortalRole('admin')" aria-label="Admin portal">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>Admin
          </button>
        </div>
      </div>
      <!-- Panel heading + sub + Login button -->
      <h2 class="mob-panel-heading">Welcome Back!</h2>
      <p class="mob-panel-sub">Already have an active account?</p>
      <button type="button" class="mob-btn-outline" onclick="toggleAuth('signin')">Login</button>
    </div>

  </div>"""

if OLD_MOB_HTML in content:
    content = content.replace(OLD_MOB_HTML, NEW_MOB_HTML)
    print("✅ Mobile HTML replaced successfully")
else:
    print("❌ OLD_MOB_HTML not found — check whitespace")

# ── 4. Replace the MOBILE toggleAuth() JS section ───────────────────────
OLD_MOB_JS = """    /* ── TOGGLE AUTH MODE (the main animation driver) ── */
    function toggleAuth(mode) {
      if (isAnimating || mode === currentMode) return;
      isAnimating = true;
      currentMode = mode;

      const sweepMs = cssMs('--sweep');
      const swapMs  = cssMs('--swap-delay');
      const fadeMs  = cssMs('--fade');
      const isReg   = mode === 'register';

      /* ─── DESKTOP: just toggle .active, CSS handles everything ─── */
      const card = document.getElementById('authCard');
      card.classList.toggle('active', isReg);

      /* ─── MOBILE: JS-driven sweep + content swap ─── */
      const mobile = document.getElementById('authMobile');

      const oldForm  = document.getElementById(isReg ? 'mobFormSignin' : 'mobFormRegister');
      const newForm  = document.getElementById(isReg ? 'mobFormRegister' : 'mobFormSignin');
      const oldStrip = document.getElementById(isReg ? 'mobStripSignin' : 'mobStripRegister');
      const newStrip = document.getElementById(isReg ? 'mobStripRegister' : 'mobStripSignin');

      // 1. Start sweep curtain
      mobile.classList.add('mob-sweeping');

      // 2. Fade out old content immediately
      oldForm.style.transition = `opacity ${fadeMs}ms ease`;
      oldForm.style.opacity = '0';
      oldStrip.style.transition = `opacity ${fadeMs}ms ease`;
      oldStrip.style.opacity = '0';

      // 3. At swap-delay: swap content
      setTimeout(() => {
        oldForm.style.display = 'none';
        oldForm.style.opacity = '';
        oldForm.style.transition = '';
        oldStrip.style.display = 'none';
        oldStrip.style.opacity = '';
        oldStrip.style.transition = '';

        newForm.style.display = 'flex';
        newForm.classList.add('mob-form-enter');
        newStrip.style.display = 'flex';
        newStrip.classList.add('mob-strip-enter');
      }, swapMs);

      // 4. After full sweep: clean up
      setTimeout(() => {
        newForm.classList.remove('mob-form-enter');
        newStrip.classList.remove('mob-strip-enter');
        mobile.classList.remove('mob-sweeping');
        isAnimating = false;
      }, sweepMs + 150);

      // URL hash (pushState for back/forward)
      history.pushState({ mode }, '', isReg ? '#register' : '#login');

      // Clear all fields on every toggle
      clearForms();
      setTimeout(initReadonly, 50);
    }"""

NEW_MOB_JS = """    /* ── PORTAL ROLE (also syncs both mobile portal bars) ── */
    function setPortalRole(role) {
      currentRole = role;
      document.querySelectorAll('.portal-btn, .mob-portal-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-role') === role);
      });
      try { localStorage.setItem('arox_user_role', role); } catch(e){}
    }

    /* ── TOGGLE AUTH MODE (the main animation driver) ── */
    function toggleAuth(mode) {
      if (isAnimating || mode === currentMode) return;
      isAnimating = true;
      currentMode = mode;

      const sweepMs = cssMs('--sweep');
      const swapMs  = cssMs('--swap-delay');
      const fadeMs  = cssMs('--fade');
      const isReg   = mode === 'register';

      /* ─── DESKTOP: just toggle .active, CSS handles everything ─── */
      const card = document.getElementById('authCard');
      card.classList.toggle('active', isReg);

      /* ─── MOBILE: vertical sweep + panel swap ─── */
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        const mobile     = document.getElementById('authMobile');
        const shape      = document.getElementById('mobSweepShape');
        const oldForm    = document.getElementById(isReg ? 'mobFormSignin'   : 'mobFormRegister');
        const newForm    = document.getElementById(isReg ? 'mobFormRegister' : 'mobFormSignin');

        // 1. Fade out old form
        oldForm.style.transition = `opacity ${fadeMs}ms ease`;
        oldForm.style.opacity = '0';

        // 2. Trigger vertical sweep
        if (isReg) {
          // Login→Register: sweep shape drops DOWN
          // shape starts at top: -310% (default). Animate to top:100%
          shape.style.transition = `top ${sweepMs}ms ease-in-out`;
          shape.style.top = '100%';
        } else {
          // Register→Login: sweep shape rises UP
          // Instantly position shape below, then animate up
          shape.style.transition = 'none';
          shape.style.top = '100%';
          // force reflow
          shape.offsetHeight;
          shape.style.transition = `top ${sweepMs}ms ease-in-out`;
          shape.style.top = '-310%';
        }

        // 3. At swap-delay: swap panels + forms
        setTimeout(() => {
          // hide old form
          oldForm.style.display = 'none';
          oldForm.style.opacity = '';
          oldForm.style.transition = '';

          // toggle mobile class (shows/hides panels via CSS)
          mobile.classList.toggle('mob-active', isReg);

          // show new form with entry animation
          newForm.style.display = 'flex';
          newForm.classList.add('mob-form-enter');

          // sync portal role active state in the newly visible portal bar
          document.querySelectorAll('.mob-portal-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-role') === currentRole);
          });
        }, swapMs);

        // 4. After full sweep: clean up shape
        setTimeout(() => {
          newForm.classList.remove('mob-form-enter');
          // Reset shape to hidden position for next animation
          shape.style.transition = 'none';
          shape.style.top = isReg ? '-310%' : '100%';
          isAnimating = false;
        }, sweepMs + 150);
      } else {
        // Desktop: animation is CSS only, just unlock after sweep
        setTimeout(() => { isAnimating = false; }, cssMs('--sweep') + 150);
      }

      // URL hash (pushState for back/forward)
      history.pushState({ mode }, '', isReg ? '#register' : '#login');

      // Clear all fields on every toggle
      clearForms();
      setTimeout(initReadonly, 50);
    }"""

if OLD_MOB_JS in content:
    content = content.replace(OLD_MOB_JS, NEW_MOB_JS)
    print("✅ Mobile JS replaced successfully")
else:
    print("❌ OLD_MOB_JS not found — check whitespace")

# ── 5. Replace the old setPortalRole (now merged into toggleAuth block) ─
# Remove the old standalone setPortalRole since we merged it above
OLD_PORTAL_FN = """    /* ── Portal role ── */
    function setPortalRole(role) {
      currentRole = role;
      document.querySelectorAll('.portal-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-role') === role);
      });
      try { localStorage.setItem('arox_user_role', role); } catch(e){}
    }"""

if OLD_PORTAL_FN in content:
    content = content.replace(OLD_PORTAL_FN, '    /* setPortalRole is defined inside toggleAuth block above */')
    print("✅ Old setPortalRole removed")
else:
    print("⚠️  Old setPortalRole not found (may already be merged)")

# ── 6. Update DOMContentLoaded init for new mobile structure ────────────
OLD_INIT = """      // Set initial mode from URL hash (no animation)
      const hash = window.location.hash;
      if (hash === '#register' || hash === '#signup') {
        currentMode = 'register';
        // Desktop
        document.getElementById('authCard').classList.add('active');
        // Mobile
        document.getElementById('mobFormSignin').style.display = 'none';
        document.getElementById('mobFormRegister').style.display = 'flex';
        document.getElementById('mobStripSignin').style.display = 'none';
        document.getElementById('mobStripRegister').style.display = 'flex';
      }"""

NEW_INIT = """      // Set initial mode from URL hash (no animation)
      const hash = window.location.hash;
      if (hash === '#register' || hash === '#signup') {
        currentMode = 'register';
        // Desktop
        document.getElementById('authCard').classList.add('active');
        // Mobile: toggle mob-active class (CSS shows bottom panel + reg form)
        document.getElementById('authMobile').classList.add('mob-active');
        document.getElementById('mobFormSignin').style.display = 'none';
        document.getElementById('mobFormRegister').style.display = 'flex';
      }"""

if OLD_INIT in content:
    content = content.replace(OLD_INIT, NEW_INIT)
    print("✅ DOMContentLoaded init updated")
else:
    print("❌ DOMContentLoaded init not found")

# ── 7. Update popstate handler for new mobile structure ──────────────────
OLD_POPSTATE = """    /* ── BROWSER BACK / FORWARD ── */
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      const target = (hash === '#register' || hash === '#signup') ? 'register' : 'signin';
      if (target !== currentMode) {
        isAnimating = false; // reset lock so popstate always works
        toggleAuth(target);
      }
    });"""

NEW_POPSTATE = """    /* ── BROWSER BACK / FORWARD ── */
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      const target = (hash === '#register' || hash === '#signup') ? 'register' : 'signin';
      if (target !== currentMode) {
        isAnimating = false; // reset lock so popstate always works
        toggleAuth(target);
      }
    });

    /* ── RESIZE: re-sync mobile state if crossing breakpoint ── */
    window.addEventListener('resize', () => {
      const mobile = document.getElementById('authMobile');
      if (mobile && window.matchMedia('(max-width: 768px)').matches) {
        const isReg = currentMode === 'register';
        mobile.classList.toggle('mob-active', isReg);
        // Reset sweep shape position
        const shape = document.getElementById('mobSweepShape');
        if (shape) { shape.style.transition = 'none'; shape.style.top = '-310%'; }
      }
    });"""

if OLD_POPSTATE in content:
    content = content.replace(OLD_POPSTATE, NEW_POPSTATE)
    print("✅ Popstate + resize handler updated")
else:
    print("❌ Popstate handler not found")

# ── Write output ─────────────────────────────────────────────────────────
with open('login.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ login.html written successfully")
print(f"   File size: {len(content):,} bytes")

