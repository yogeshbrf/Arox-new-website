with open('login.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .mob-sweep-shape CSS
old_sweep_css = """      /* ── VERTICAL SWEEP SHAPE (covers full card at midpoint) ── */
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
      }"""

new_sweep_css = """      /* ── VERTICAL SWEEP SHAPE (covers full card at midpoint) ── */
      .mob-sweep-shape {
        position: absolute; left: 0; width: 100%;
        background: var(--primary-blue-gradient);
        z-index: 50; pointer-events: none;
        border-radius: 0;
        height: 150%;
        top: -160%;
        opacity: 0;
        visibility: hidden;
        transition: top var(--sweep) ease-in-out;
        will-change: top, opacity;
      }
      .auth-mobile.mob-sweeping .mob-sweep-shape {
        opacity: 1;
        visibility: visible;
      }"""

if old_sweep_css in content:
    content = content.replace(old_sweep_css, new_sweep_css)
    print("✅ .mob-sweep-shape CSS updated")
else:
    print("❌ old_sweep_css not found")

# 2. Update .mob-panel-top hide rule
old_panel_top = """      /* hide top panel in register mode */
      .auth-mobile.mob-active .mob-panel-top {
        display: none;
      }"""

new_panel_top = """      /* hide top panel in register mode */
      .auth-mobile.mob-active .mob-panel-top {
        display: none !important;
      }"""

if old_panel_top in content:
    content = content.replace(old_panel_top, new_panel_top)
    print("✅ .mob-panel-top hide rule updated")
else:
    print("❌ old_panel_top not found")

# 3. Update .mob-back-pill-dark and .mob-reg-top
old_pill_dark = """      /* back pill in register (white area, dark style) */
      .mob-back-pill-dark {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 6px 14px; border-radius: 9999px; height: 30px;
        background: rgba(0,0,0,0.05); border: 1.5px solid rgba(0,0,0,0.1);
        color: #1E293B; text-decoration: none;
        font-family: var(--font-display); font-size: 12px; font-weight: 700;
        align-self: flex-start; margin-bottom: clamp(10px,2vh,14px);
        flex-shrink: 0;
      }
      .mob-back-pill-dark svg { width:14px; height:14px; stroke:currentColor; stroke-width:2.2; flex-shrink:0; }"""

new_pill_dark = """      /* back pill in register (white area, dark style matching reference) */
      .mob-back-pill-dark {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 16px; border-radius: 9999px; height: 32px;
        background: #fff; border: 1.5px solid #E2E8F0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        color: #0F172A; text-decoration: none;
        font-family: var(--font-display); font-size: 12px; font-weight: 700;
        align-self: flex-start; margin-bottom: clamp(6px,1.5vh,12px);
        flex-shrink: 0;
      }
      .mob-back-pill-dark:hover {
        background: #F8FAFC; border-color: #CBD5E1;
      }
      .mob-back-pill-dark svg { width:14px; height:14px; stroke:currentColor; stroke-width:2.2; flex-shrink:0; }"""

if old_pill_dark in content:
    content = content.replace(old_pill_dark, new_pill_dark)
    print("✅ .mob-back-pill-dark CSS updated")
else:
    print("❌ old_pill_dark not found")

old_reg_top = """      /* ── REGISTER FORM AREA (top white zone in register mode) ── */
      .mob-reg-top {
        display: none; flex-direction: column; align-items: flex-start;
        flex-shrink: 0;
        padding: clamp(10px,2vh,14px) clamp(20px,5vw,28px) 0;
      }"""

new_reg_top = """      /* ── REGISTER FORM AREA (top white zone in register mode) ── */
      .mob-reg-top {
        display: none; flex-direction: column; align-items: flex-start;
        flex-shrink: 0;
        padding: clamp(12px,2.5vh,18px) clamp(20px,5vw,28px) 0;
        position: relative; z-index: 10;
      }"""

if old_reg_top in content:
    content = content.replace(old_reg_top, new_reg_top)
    print("✅ .mob-reg-top CSS updated")
else:
    print("❌ old_reg_top not found")

# 4. Update JS mobile sweep logic
old_js_mobile = """      /* ─── MOBILE: vertical sweep + panel swap ─── */
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
      }"""

new_js_mobile = """      /* ─── MOBILE: vertical sweep + panel swap ─── */
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
        mobile.classList.add('mob-sweeping');
        if (isReg) {
          // Login→Register: sweep shape drops DOWN from -160% to 110%
          shape.style.transition = 'none';
          shape.style.top = '-160%';
          shape.offsetHeight; // force reflow
          shape.style.transition = `top ${sweepMs}ms ease-in-out`;
          shape.style.top = '110%';
        } else {
          // Register→Login: sweep shape rises UP from 110% to -160%
          shape.style.transition = 'none';
          shape.style.top = '110%';
          shape.offsetHeight; // force reflow
          shape.style.transition = `top ${sweepMs}ms ease-in-out`;
          shape.style.top = '-160%';
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
          mobile.classList.remove('mob-sweeping');
          shape.style.transition = 'none';
          shape.style.top = isReg ? '110%' : '-160%';
          isAnimating = false;
        }, sweepMs + 50);
      }"""

if old_js_mobile in content:
    content = content.replace(old_js_mobile, new_js_mobile)
    print("✅ JS mobile sweep logic updated")
else:
    print("❌ old_js_mobile not found")

# 5. Update resize handler
old_resize = """    /* ── RESIZE: re-sync mobile state if crossing breakpoint ── */
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

new_resize = """    /* ── RESIZE: re-sync mobile state if crossing breakpoint ── */
    window.addEventListener('resize', () => {
      const mobile = document.getElementById('authMobile');
      if (mobile && window.matchMedia('(max-width: 768px)').matches) {
        const isReg = currentMode === 'register';
        mobile.classList.toggle('mob-active', isReg);
        // Reset sweep shape position
        const shape = document.getElementById('mobSweepShape');
        if (shape) {
          shape.style.transition = 'none';
          shape.style.top = isReg ? '110%' : '-160%';
          mobile.classList.remove('mob-sweeping');
        }
      }
    });"""

if old_resize in content:
    content = content.replace(old_resize, new_resize)
    print("✅ resize handler updated")
else:
    print("❌ old_resize not found")

with open('login.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved login.html successfully!")

