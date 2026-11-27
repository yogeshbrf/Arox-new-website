(function () {
  'use strict';

  /* ── THEME SYSTEM ─────────────────────────────────────────── */
  const THEMES = ['light', 'dark'];
  let currentTheme = localStorage.getItem('arox-theme') || 'dark';
  if (!THEMES.includes(currentTheme)) {
    currentTheme = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(t, isInit) {
    const root = document.documentElement;
    const targetClass = 'theme-' + t;
    const alreadyApplied = root.classList.contains(targetClass);

    root.style.colorScheme = t;
    root.style.backgroundColor = (t === 'dark') ? '#000000' : '#FFFFFF';
    if (document.body) {
      document.body.style.backgroundColor = (t === 'dark') ? '#000000' : '#FFFFFF';
    }

    if (!alreadyApplied) {
      root.classList.add('theme-switching');
      root.classList.remove('theme-light', 'theme-dark', 'dark');
      root.classList.add(targetClass);
      if (t === 'dark') {
        root.classList.add('dark');
      }
    }
    currentTheme = t;
    localStorage.setItem('arox-theme', t);
    updateThemeUI();
    updateLogos();
    window.dispatchEvent(new CustomEvent('arox-theme-change', { detail: { theme: t } }));

    if (!alreadyApplied) {
      // Force instant style commit then release transition suppression
      void root.offsetHeight;
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching');
      });
    }
  }

  function updateThemeUI() {
    // Sync all switch checkboxes with current theme (checked = light, unchecked = dark)
    document.querySelectorAll('#checkbox, #theme-checkbox, .theme-switch-checkbox').forEach(cb => {
      cb.checked = (currentTheme === 'light');
    });

    const icon = document.getElementById('theme-icon');
    if (icon) {
      if (!icon.querySelector('.eye-open-g')) {
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('stroke-width', '2');
        icon.innerHTML = `
          <g class="eye-open-g">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </g>
          <g class="eye-closed-g">
            <path d="M2 10s3 5 10 5 10-5 10-5"></path>
            <path d="M6 13l-1.5 2.5"></path>
            <path d="M10 15v3"></path>
            <path d="M14 15v3"></path>
            <path d="M18 13l1.5 2.5"></path>
          </g>
        `;
      }
      
      if (currentTheme === 'light') {
        icon.setAttribute('stroke', '#f59e0b');
      } else {
        icon.setAttribute('stroke', '#38bdf8');
      }
    }

    document.querySelectorAll('.mobile-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
  }

  function updateLogos() {
    const isDark = currentTheme === 'dark';
    const src = isDark ? 'public/assets/logo/logo-dark.png' : 'public/assets/logo/logo-light.png';
    document.querySelectorAll('#nav-logo-img, #footer-logo-img, .nav-logo img, .footer-brand-logo img').forEach(el => {
      if (el) el.src = src;
    });
  }

  // Preload all theme assets immediately for zero-delay instant switching
  const PRELOAD_ASSETS = [
    'public/assets/logo/logo-dark.png',
    'public/assets/logo/logo-light.png',
    'assets/logo/logo-dark.png',
    'assets/logo/logo-light.png'
  ];
  if (typeof window !== 'undefined') {
    PRELOAD_ASSETS.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Instant switch on click without event loop or label delay
  document.addEventListener('click', (e) => {
    const switchLabel = e.target.closest('.switch');
    if (switchLabel) {
      const cb = switchLabel.querySelector('input[type="checkbox"]');
      if (cb) {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        cb.checked = (nextTheme === 'light');
        applyTheme(nextTheme);
        e.preventDefault();
        return;
      }
    }
    if (e.target.matches('#checkbox, #theme-checkbox, .theme-switch-checkbox')) {
      const nextTheme = e.target.checked ? 'light' : 'dark';
      applyTheme(nextTheme);
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'checkbox' || e.target.id === 'theme-checkbox' || e.target.classList.contains('theme-switch-checkbox')) {
      const targetTheme = e.target.checked ? 'light' : 'dark';
      if (targetTheme !== currentTheme) {
        applyTheme(targetTheme);
      }
    }
  });

  const oldBtn = document.getElementById('theme-toggle-btn');
  if (oldBtn) {
    oldBtn.addEventListener('click', () => {
      const idx = THEMES.indexOf(currentTheme);
      applyTheme(THEMES[(idx + 1) % THEMES.length]);
    });
  }
  document.querySelectorAll('.mobile-theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      applyTheme(btn.dataset.theme);
    });
  });
  applyTheme(currentTheme, true);

  // Sync theme changes across multiple tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'arox-theme') {
      const newTheme = e.newValue || 'dark';
      if (newTheme !== currentTheme) {
        applyTheme(newTheme);
      }
    }
  });

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  /* ── NAVBAR & MOBILE DRAWER ─────────────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  const breadcrumbCurrent = document.querySelector('.mobile-breadcrumb-current');
  const originalBreadcrumb = breadcrumbCurrent ? breadcrumbCurrent.textContent : '';
  let lastScrollY = 0, mobileOpen = false;

  function updateMenuState(open) {
    mobileOpen = open;
    if (mobileMenu) {
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    }
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('open', open);
    }
    document.body.classList.toggle('no-scroll', open);
    document.documentElement.classList.toggle('no-scroll', open);
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = open ? 'Menu' : originalBreadcrumb;
    }
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateMenuState(!mobileOpen);
    });

    // Close when tapping outside the left drawer panel (on right side backdrop)
    mobileMenu.addEventListener('click', (e) => {
      const panel = mobileMenu.querySelector('.mobile-menu-panel');
      if (panel && !panel.contains(e.target)) {
        updateMenuState(false);
      }
    });

    mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta-btn, .mobile-login-btn').forEach(link => {
      link.addEventListener('click', () => {
        updateMenuState(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        updateMenuState(false);
      }
    });
  }

  /* ── MOBILE TOP LOGIN/PROFILE, POPOVER & BOTTOM TAB BAR ───────────────────── */
  const bottomNav = (() => {
    let nav = document.getElementById('mobile-bottom-nav');
    if (nav) return nav;
    const p = (window.location.pathname || '').toLowerCase();
    const isAbout = p.includes('about');
    const isServices = p.includes('services');
    const isTraining = p.includes('training') || p.includes('courses') || p.includes('detail') || p.includes('internship');
    const isContact = p.includes('contact');
    const isHome = !isAbout && !isServices && !isTraining && !isContact;

    nav = document.createElement('nav');
    nav.id = 'mobile-bottom-nav';
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Mobile bottom navigation');
    nav.innerHTML = `
      <a href="index.html" class="mob-bnav-item${isHome ? ' active' : ''}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.4 12 3.8l8 6.6V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.6Z" fill="currentColor" fill-opacity="0.16"/><path d="M2.5 11 12 3.2 21.5 11"/><rect x="9.5" y="13.5" width="5" height="7.5" rx="1.2" fill="currentColor" stroke="none"/></svg>
        <span>Home</span>
      </a>
      <a href="about.html" class="mob-bnav-item${isAbout ? ' active' : ''}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5" fill="currentColor" fill-opacity="0.16"/><path d="M12 11.2v5.2" stroke-width="2.2"/><circle cx="12" cy="7.7" r="1.25" fill="currentColor" stroke="none"/></svg>
        <span>About</span>
      </a>
      <a href="services.html" class="mob-bnav-item${isServices ? ' active' : ''}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 20.5 7.7 12 12.2 3.5 7.7 12 3.2Z" fill="currentColor" fill-opacity="0.32"/><path d="M3.5 12 12 16.5 20.5 12"/><path d="M3.5 16.3 12 20.8 20.5 16.3"/></svg>
        <span>Services</span>
      </a>
      <a href="courses.html" class="mob-bnav-item${isTraining ? ' active' : ''}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.2 12 4.5l9.5 4.7L12 13.9 2.5 9.2Z" fill="currentColor" fill-opacity="0.34"/><path d="M6.5 11.5v4.3c0 1.8 2.5 3.2 5.5 3.2s5.5-1.4 5.5-3.2v-4.3" fill="currentColor" fill-opacity="0.16"/><path d="M20.5 9.8v5.6"/><circle cx="20.5" cy="16.4" r="1.1" fill="currentColor" stroke="none"/></svg>
        <span>Training</span>
      </a>
      <a href="contact.html" class="mob-bnav-item${isContact ? ' active' : ''}">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 3.2h2.7a1.8 1.8 0 0 1 1.8 1.5l.4 2.4a1.8 1.8 0 0 1-.5 1.6l-1.3 1.3a13.2 13.2 0 0 0 4.1 4.1l1.3-1.3a1.8 1.8 0 0 1 1.6-.5l2.4.4a1.8 1.8 0 0 1 1.5 1.8v2.7a1.8 1.8 0 0 1-2 1.8A16.8 16.8 0 0 1 3 5.2a1.8 1.8 0 0 1 1.8-2Z" fill="currentColor" fill-opacity="0.28"/></svg>
        <span>Contact</span>
      </a>
    `;
    document.body.appendChild(nav);
    return nav;
  })();

  const mobileAuthWrap = (() => {
    const navRight = document.querySelector('#site-header .nav-right');
    if (!navRight) return null;
    let wrap = navRight.querySelector('#mobile-auth-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'mobile-auth-wrap';
      wrap.className = 'mobile-auth-wrap';
      navRight.appendChild(wrap);
    }
    return wrap;
  })();

  function closeProfileDropdown() {
    const dd = document.getElementById('mobile-profile-dropdown');
    if (dd) dd.classList.remove('open');
  }

  function clearStoredAuth() {
    try {
      localStorage.removeItem('arox_user');
      localStorage.removeItem('arox_token');
      localStorage.removeItem('arox_role');
      localStorage.removeItem('arox_token_admin');
      localStorage.removeItem('arox_token_employee');
      localStorage.removeItem('arox_token_student');
    } catch (e) {}
  }

  function renderMobileAuth(user) {
    if (!mobileAuthWrap) return;
    if (!user) {
      mobileAuthWrap.innerHTML = `
        <a href="/login" class="mobile-top-login-btn" id="mobile-top-login-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="3.8" fill="currentColor" fill-opacity="0.24"/>
            <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" fill="currentColor" fill-opacity="0.16"/>
          </svg>
          <span>Login</span>
        </a>
      `;
      return;
    }

    const safeName = String(user.name || 'AROX User').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeRole = String(user.displayRole || 'Member').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const dashUrl = user.dashboardUrl || '/student/dashboard';

    mobileAuthWrap.innerHTML = `
      <button type="button" class="mobile-profile-btn" id="mobile-profile-btn" aria-label="User Profile" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a7.2 7.2 0 0 1-5.4-2.4c.7-2.1 2.9-3.4 5.4-3.4s4.7 1.3 5.4 3.4A7.2 7.2 0 0 1 12 19.5Z"/>
        </svg>
      </button>
      <div class="mobile-profile-dropdown" id="mobile-profile-dropdown" role="menu">
        <div class="mobile-profile-header">
          <div class="mobile-profile-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a7.2 7.2 0 0 1-5.4-2.4c.7-2.1 2.9-3.4 5.4-3.4s4.7 1.3 5.4 3.4A7.2 7.2 0 0 1 12 19.5Z"/>
            </svg>
          </div>
          <div class="mobile-profile-info">
            <span class="mobile-profile-name">${safeName}</span>
            <span class="mobile-profile-role">${safeRole}</span>
          </div>
        </div>
        <div class="mobile-profile-menu">
          <a href="${dashUrl}" class="mobile-profile-link" id="mobile-profile-dashboard">
            <span class="mobile-profile-link-left">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.28"/>
                <rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.14"/>
                <rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.14"/>
                <rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="currentColor" fill-opacity="0.28"/>
              </svg>
              <span>Go to Dashboard</span>
            </span>
            <svg class="mobile-profile-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>
            </svg>
          </a>
          <button type="button" class="mobile-profile-logout" id="mobile-profile-logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10" fill="currentColor" fill-opacity="0.12"/>
              <path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10"/>
              <path d="m16 16 4.2-4L16 8"/><path d="M20 12H9.5"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    `;

    const profileBtn = document.getElementById('mobile-profile-btn');
    const dropdown = document.getElementById('mobile-profile-dropdown');
    const logoutBtn = document.getElementById('mobile-profile-logout');

    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !dropdown.classList.contains('open');
        dropdown.classList.toggle('open', willOpen);
        profileBtn.setAttribute('aria-expanded', String(willOpen));
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearStoredAuth();
        renderMobileAuth(null);
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (err) {}
      });
    }
  }

  document.addEventListener('click', (e) => {
    if (mobileAuthWrap && !mobileAuthWrap.contains(e.target)) {
      closeProfileDropdown();
    }
  });

  (function initMobileAuth() {
    let cachedUser = null;
    try {
      const raw = localStorage.getItem('arox_user');
      if (raw) cachedUser = JSON.parse(raw);
    } catch (e) {}
    renderMobileAuth(cachedUser);

    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          clearStoredAuth();
          renderMobileAuth(null);
          return;
        }
        if (!res.ok) return;
        const json = await res.json();
        if (json && json.success && json.data) {
          const d = json.data;
          const r = (d.role || 'student').toLowerCase();
          const roleMap = { super_admin: 'Admin', admin: 'Admin', trainer: 'Trainer', staff: 'Employee', employee: 'Employee', student: 'Student' };
          const normalized = {
            id: d.id,
            email: d.email,
            name: d.name || [d.first_name, d.last_name].filter(Boolean).join(' ').trim() || (d.email ? d.email.split('@')[0] : 'AROX User'),
            role: r,
            displayRole: d.displayRole || roleMap[r] || 'Member',
            dashboardUrl: d.dashboardUrl || (['admin', 'super_admin'].includes(r) ? '/admin/dashboard' : (['employee', 'trainer', 'staff'].includes(r) ? '/employee/dashboard' : '/student/dashboard'))
          };
          try { localStorage.setItem('arox_user', JSON.stringify(normalized)); } catch (e) {}
          renderMobileAuth(normalized);
        }
      })
      .catch(() => {});
  })();

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      if (isMobile) {
        if (mobileOpen || y <= 40 || y < lastScrollY) {
          header.classList.remove('hidden-nav');
          header.style.pointerEvents = '';
          if (bottomNav) {
            bottomNav.classList.remove('hidden-nav');
            bottomNav.style.pointerEvents = '';
          }
        } else if (y > lastScrollY && y > 60) {
          header.classList.add('hidden-nav');
          if (bottomNav) bottomNav.classList.add('hidden-nav');
          closeProfileDropdown();
        }
      } else {
        if (bottomNav) bottomNav.classList.remove('hidden-nav');
        if (window.isHScrollActive || window.isServicesScrollActive) {
          header.classList.add('hidden-nav');
        } else {
          if (y > lastScrollY && y > 100) header.classList.add('hidden-nav');
          else header.classList.remove('hidden-nav');
        }
      }
    }
    lastScrollY = y;
  }, { passive: true });

  /* ── NAVBAR SLIDING HOVER PILL ───────────────────────────── */
  function initNavHoverPill() {
    const navLinksList = document.querySelectorAll('.nav-links');
    navLinksList.forEach(nav => {
      let pill = nav.querySelector('.nav-sliding-pill');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'nav-sliding-pill';
        nav.insertBefore(pill, nav.firstChild);
      }

      const links = Array.from(nav.querySelectorAll('.nav-link'));
      if (!links.length) return;

      function updatePill(targetEl, immediate) {
        if (!targetEl) {
          pill.style.opacity = '0';
          return;
        }
        const navRect = nav.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const left = targetRect.left - navRect.left;
        const top = targetRect.top - navRect.top;
        const width = targetRect.width;
        const height = targetRect.height;

        if (immediate) {
          pill.style.transition = 'none';
        } else {
          pill.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        }

        pill.style.transform = `translate(${left}px, ${top}px)`;
        pill.style.width = `${width}px`;
        pill.style.height = `${height}px`;
        pill.style.opacity = '1';

        if (immediate) {
          requestAnimationFrame(() => {
            pill.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
          });
        }
      }

      nav.classList.add('nav-pill-ready');
      const activeLink = nav.querySelector('.nav-link.active');
      
      // Position on active link on load
      requestAnimationFrame(() => {
        updatePill(activeLink, true);
      });
      setTimeout(() => {
        const curActive = nav.querySelector('.nav-link.active');
        updatePill(curActive, true);
      }, 80);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          const curActive = nav.querySelector('.nav-link.active') || links[0];
          updatePill(curActive, true);
        });
      }

      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          nav.classList.add('nav-hovering');
          links.forEach(l => l.classList.remove('nav-link-hovered'));
          link.classList.add('nav-link-hovered');
          updatePill(link, false);
        });
      });

      nav.addEventListener('mouseleave', () => {
        nav.classList.remove('nav-hovering');
        links.forEach(l => l.classList.remove('nav-link-hovered'));
        const currentActive = nav.querySelector('.nav-link.active');
        if (currentActive) {
          updatePill(currentActive, false);
        } else {
          pill.style.opacity = '0';
        }
      });

      window.addEventListener('resize', () => {
        const currentHovered = nav.querySelector('.nav-link.nav-link-hovered') || nav.querySelector('.nav-link:hover');
        const currentActive = nav.querySelector('.nav-link.active');
        updatePill(currentHovered || currentActive, true);
      }, { passive: true });

      window.addEventListener('arox-theme-change', () => {
        setTimeout(() => {
          const currentHovered = nav.querySelector('.nav-link.nav-link-hovered') || nav.querySelector('.nav-link:hover');
          const currentActive = nav.querySelector('.nav-link.active');
          updatePill(currentHovered || currentActive, true);
        }, 50);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavHoverPill);
  } else {
    initNavHoverPill();
  }

  /* ── HERO SECTION ENTRANCE & PARALLAX ────────────────────────── */
  if (typeof gsap !== 'undefined') {
    gsap.ticker.lagSmoothing(500, 33);
  }
  const heroSection = document.getElementById('hero');
  if (heroSection && typeof gsap !== 'undefined') {
    const heroElements = heroSection.querySelectorAll('span.text-xs, h1, p, .flex.gap-4, .btn-primary, .btn-secondary, .scroll-indicator');
    if (heroElements.length) {
      gsap.from(heroElements, {
        opacity: 0,
        y: 18,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity'
      });
    }

    const gridBg = heroSection.querySelector('.grid-lines-bg');
    if (gridBg && window.innerWidth > 768) {
      heroSection.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 18;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 18;
        gsap.to(gridBg, { x: xPos, y: yPos, duration: 0.6, ease: 'power1.out' });
      });
    }
  }

  /* ── MAGNETIC BUTTONS ─────────────────────────────────────────── */
  function initMagnetic(btn) {
    let animX = 0, animY = 0, targetX = 0, targetY = 0, rafId = null;
    function tick() {
      animX += (targetX - animX) * 0.25;
      animY += (targetY - animY) * 0.25;
      btn.style.transform = `translate(${animX.toFixed(2)}px,${animY.toFixed(2)}px)`;
      if (Math.abs(targetX - animX) > 0.05 || Math.abs(targetY - animY) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else { rafId = null; }
    }
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      targetX = (e.clientX - r.left - r.width / 2) * 0.25;
      targetY = (e.clientY - r.top - r.height / 2) * 0.25;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
    btn.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(tick);
    });
  }
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(initMagnetic);

  /* ── GSAP STATS ─────────────────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const statCards = Array.from(document.querySelectorAll('.stat-card-gsap'));
  const N_STATS = statCards.length;
  const TOTAL_SCROLL_STATS = N_STATS * 300;

  function revealStat(card, p) {
    p = Math.max(0, Math.min(1, p));
    card.style.clipPath = `inset(${((1 - p) * 100).toFixed(4)}% 0 0% 0 round 22px)`;
    if (typeof gsap !== 'undefined') {
      gsap.set(card, { opacity: p, y: (1 - p) * 110, scale: 0.94 + p * 0.06, force3D: true });
    }
    const sweep = card.querySelector('.light-sweep');
    if (sweep) sweep.style.left = `${p * 200 - 100}%`;
    const numEl = card.querySelector('.card-number');
    if (numEl) {
      const target = parseFloat(numEl.dataset.target || '0');
      const suffix = numEl.dataset.suffix || '';
      if (p >= 0.99) {
        card._appeared = true;
        if (!card._counting && card._val !== target) {
          card._counting = true;
          if (card._val === undefined) card._val = 0;
          if (typeof gsap !== 'undefined') {
            gsap.to(card, {
              _val: target, duration: 1.2, ease: 'power3.out',
              onUpdate() { numEl.textContent = Math.round(card._val) + suffix; },
              onComplete() {
                card._counting = false;
                numEl.textContent = target + suffix;
              }
            });
          } else {
            numEl.textContent = target + suffix;
            card._counting = false;
          }
        }
      } else if (!card._appeared) {
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(card, '_val');
        }
        card._counting = false; card._val = 0;
        numEl.textContent = '0' + suffix;
      }
    }
  }

  if (N_STATS > 0 && document.getElementById('stats-section')) {
    if (window.innerWidth > 768) {
      let statsTrigger = null;
      let statsCompleted = false;
      let maxProgress = 0;

      function finalizeStats(isAtEnd) {
        if (statsCompleted) return;
        statsCompleted = true;

        // Ensure all cards are in permanent 100% revealed state
        statCards.forEach(card => {
          card._appeared = true;
          card.style.clipPath = 'none';
          card.style.opacity = '1';
          card.style.transform = 'none';
          const sweep = card.querySelector('.light-sweep');
          if (sweep) sweep.style.display = 'none';
          const numEl = card.querySelector('.card-number');
          if (numEl) {
            const target = numEl.dataset.target || '0';
            const suffix = numEl.dataset.suffix || '';
            numEl.textContent = target + suffix;
          }
        });

        if (statsTrigger) {
          const pinDistance = TOTAL_SCROLL_STATS;
          const currentY = window.scrollY;
          statsTrigger.kill(true);
          statsTrigger = null;

          if (isAtEnd) {
            const newY = Math.max(0, currentY - pinDistance);
            if (window.lenis) {
              window.lenis.scrollTo(newY, { immediate: true });
            } else {
              window.scrollTo(0, newY);
            }
          }
          ScrollTrigger.refresh();
        }
      }

      statCards.forEach(c => revealStat(c, 0));

      statsTrigger = ScrollTrigger.create({
        trigger: document.getElementById('stats-section'),
        pin: true,
        start: 'top top',
        end: `+=${TOTAL_SCROLL_STATS}`,
        scrub: 1,
        anticipatePin: 1,
        onUpdate(self) {
          if (statsCompleted) return;
          // Only play forward during initial scroll-down
          maxProgress = Math.max(maxProgress, self.progress);
          statCards.forEach((card, i) => {
            const sliceStart = i / N_STATS;
            const p = (maxProgress - sliceStart) / (1 / N_STATS);
            revealStat(card, p);
          });
          // Once full stats have appeared, mark them permanently
          if (maxProgress >= 0.99) {
            statCards.forEach(c => { c._appeared = true; });
          }
        },
        onLeave(self) {
          // Scrolled past the stats section down into next content
          if (maxProgress >= 0.95 || self.progress >= 0.95) {
            finalizeStats(true);
          }
        },
        onLeaveBack(self) {
          // If all stats appeared and user scrolls back up to hero, unpin so it never triggers again
          if (maxProgress >= 0.95) {
            finalizeStats(false);
          }
        }
      });
    } else {
      // Mobile view: Static numbers and smooth scroll without animation lock
      statCards.forEach(card => {
        card.style.clipPath = 'none';
        card.style.opacity = '1';
        card.style.transform = 'none';
        const numEl = card.querySelector('.card-number');
        if (numEl) {
          const target = numEl.dataset.target || '0';
          const suffix = numEl.dataset.suffix || '';
          numEl.textContent = target + suffix;
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     WE DELIVER — Scroll-Driven Card Burst Animation
     ─────────────────────────────────────────────────────────────
     Pixel-accurate recreation from reference frames 1–4 & video:
     
     Phase 1 (0%–25% scroll):  Hero card appears large & centered,
                               scaled up ~1.8x, filling the viewport.
                               All background cards are hidden behind it.
     
     Phase 2 (25%–50% scroll): Hero card begins shrinking toward its
                               final grid position. Background cards
                               start peeking out from behind, tiny and
                               blurred, clustered at the center.
     
     Phase 3 (50%–80% scroll): Background cards burst outward radially
                               from center, scaling up and fanning out
                               to their final grid positions. Each card
                               has a staggered delay based on distance.
     
     Phase 4 (80%–100% scroll): All cards settle into final positions.
                               Hero glow fades, blur clears, hover
                               interactions are re-enabled.
     
     This is scroll-driven (scrub) — the user controls the animation
     progress by scrolling. The section is pinned during the animation.
     Once completed, it unpins and stays in final state permanently.
     ═══════════════════════════════════════════════════════════════ */
  const deliverSection = document.getElementById('we-deliver-section');
  if (deliverSection) {
    const heroCard = document.getElementById('deliver-hero-card');
    const surroundingCards = Array.from(deliverSection.querySelectorAll('.deliver-grid-card'));
    const gridContainer = document.getElementById('deliver-grid-container');

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Per-card animation data (rotation, stagger delay, radial burst angle) ───
    // Order matches DOM: software, uiux, cloud, agile, security, ai, business, partnership
    const cardAnimData = [
      { stagger: 0.00, rotZ:  2.5, burstAngle: -135 }, // software    (top-left)
      { stagger: 0.04, rotZ: -1.8, burstAngle: -160 }, // uiux        (mid-left)
      { stagger: 0.08, rotZ:  1.5, burstAngle:  160 }, // cloud       (bot-left)
      { stagger: 0.02, rotZ: -2.0, burstAngle:  -90 }, // agile       (top-center)
      { stagger: 0.06, rotZ:  2.2, burstAngle:   90 }, // security    (bot-center)
      { stagger: 0.01, rotZ:  3.0, burstAngle:  -45 }, // ai          (top-right)
      { stagger: 0.05, rotZ: -2.5, burstAngle:   20 }, // business    (mid-right)
      { stagger: 0.09, rotZ:  1.2, burstAngle:  135 }, // partnership (bot-right)
    ];

    let deliverCompleted = false;
    let deliverTrigger = null;
    let masterTl = null;
    let maxDeliverProgress = 0;
    // Comfortable scroll distance synchronized to smooth scrolling
    const TOTAL_SCROLL_DELIVER = 1200;

    // ─── Finalize into permanent static layout & remove pin spacer ───
    function finalizeDeliver(isAtEnd) {
      if (deliverCompleted) return;
      deliverCompleted = true;

      deliverSection.classList.add('deliver-settled');
      if (masterTl) {
        masterTl.progress(1);
        masterTl.pause();
      }

      // ── Lock all 9 cards into their permanent, static CSS grid layout ──
      if (heroCard) {
        gsap.set(heroCard, { clearProps: 'transform,opacity,scale,x,y,zIndex' });
      }
      surroundingCards.forEach((card) => {
        gsap.set(card, { clearProps: 'transform,opacity,scale,x,y,rotateZ,zIndex' });
        card.style.pointerEvents = 'auto';
      });

      // ── Clean up & disable pin, remove pin-spacer and artificial scroll height ──
      if (deliverTrigger) {
        const pinDistance = TOTAL_SCROLL_DELIVER;
        const currentY = window.scrollY;
        deliverTrigger.kill(true);
        deliverTrigger = null;

        if (isAtEnd) {
          const newY = Math.max(0, currentY - pinDistance);
          if (window.lenis) {
            window.lenis.scrollTo(newY, { immediate: true });
          } else {
            window.scrollTo(0, newY);
          }
        }

        ScrollTrigger.refresh();
      }
    }

    // ─── Compute offset from each card's natural position to hero card's center ───
    function computeCenterOffsets() {
      if (!heroCard) return [];
      const heroRect = heroCard.getBoundingClientRect();
      const heroCX = heroRect.left + heroRect.width / 2;
      const heroCY = heroRect.top + heroRect.height / 2;

      return surroundingCards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          dx: heroCX - (r.left + r.width / 2),
          dy: heroCY - (r.top + r.height / 2)
        };
      });
    }

    // ─── Reduced motion fallback ───
    function runReducedMotionEntrance() {
      finalizeDeliver(false);
    }

    // ─── Mouse-following spotlight on background cards ───
    surroundingCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      // Micro-interaction on click
      card.addEventListener('click', () => {
        if (!deliverSection.classList.contains('deliver-settled')) return;
        gsap.timeline()
          .to(card, { scale: 0.98, duration: 0.1, ease: 'power1.in' })
          .to(card, { scale: 1.02, duration: 0.2, ease: 'back.out(2)' });
      });
    });

    // ─── Initialize scroll-driven animation ───
    requestAnimationFrame(() => {
      if (prefersReducedMotion) {
        finalizeDeliver(false);
        return;
      }

      if (!heroCard || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      // If page was loaded/refreshed already scrolled past the deliver section, settle immediately
      if (window.scrollY >= deliverSection.offsetTop + TOTAL_SCROLL_DELIVER) {
        finalizeDeliver(false);
        return;
      }

      // Measure offsets before setting initial state
      const offsets = computeCenterOffsets();

      // ── Set initial state: hero card large & centered, bg cards hidden behind ──
      gsap.set(heroCard, {
        scale: 1.5,
        opacity: 0,
        y: 16,
        zIndex: 30
      });

      // Background cards: collapsed behind hero at centroid, invisible
      surroundingCards.forEach((card, i) => {
        const off = offsets[i] || { dx: 0, dy: 0 };
        const anim = cardAnimData[i] || { rotZ: 0 };
        gsap.set(card, {
          x: off.dx,
          y: off.dy,
          scale: 0.18,
          opacity: 0,
          rotateZ: anim.rotZ * 1.5,
          pointerEvents: 'none',
          zIndex: 5
        });
      });

      // ── Build the master scroll-driven timeline ──
      masterTl = gsap.timeline({ paused: true });

      // Phase 1: Center Hero Card smoothly fades in and rises (0.00 → 0.18)
      masterTl.to(heroCard, {
        scale: 1.5,
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: 'power1.out'
      }, 0);

      // Phase 2: Center Hero gently scales down toward grid scale (0.18 → 0.58)
      masterTl.to(heroCard, {
        scale: 1.0,
        duration: 0.40,
        ease: 'power1.inOut'
      }, 0.18);

      // Phase 3: Background cards smoothly burst and fan out radially (0.22 → 0.86)
      surroundingCards.forEach((card, i) => {
        const anim = cardAnimData[i] || { stagger: 0, rotZ: 0 };
        const burstStart = 0.22 + anim.stagger * 1.2;
        const burstDuration = 0.52;

        masterTl.to(card, {
          x: 0,
          y: 0,
          scale: 1.0,
          opacity: 1,
          rotateZ: 0,
          duration: burstDuration,
          ease: 'power2.out',
          pointerEvents: 'auto'
        }, burstStart);
      });

      // Phase 4: Final settle (0.85 → 1.00)
      masterTl.to(surroundingCards, {
        opacity: 1,
        duration: 0.15,
        ease: 'sine.out'
      }, 0.85);

      // ── Attach ScrollTrigger for silky smooth 60/120fps scrubbing (runs ONLY ONCE) ──
      if (window.innerWidth > 768) {
        deliverTrigger = ScrollTrigger.create({
          trigger: deliverSection,
          pin: true,
          start: 'top top',
          end: `+=${TOTAL_SCROLL_DELIVER}`,
          scrub: 1,
          anticipatePin: 1,
          onUpdate(self) {
            if (deliverCompleted) return;
            maxDeliverProgress = Math.max(maxDeliverProgress, self.progress);
            if (masterTl) {
              masterTl.progress(maxDeliverProgress);
            }
            if (maxDeliverProgress >= 0.95) {
              deliverSection.classList.add('deliver-settled');
              surroundingCards.forEach(c => { c.style.pointerEvents = 'auto'; });
              // If fully revealed and user scrolls back up, unpin so they are not trapped
              if (self.direction === -1 && maxDeliverProgress >= 0.98) {
                finalizeDeliver(false);
              }
            }
          },
          onLeave(self) {
            // User scrolled past the deliver section into next content -> finalize & unpin permanently
            if (maxDeliverProgress >= 0.95 || self.progress >= 0.95) {
              finalizeDeliver(true);
            }
          },
          onLeaveBack(self) {
            // If cards were revealed and user scrolled back to top -> finalize & unpin permanently
            if (maxDeliverProgress >= 0.95) {
              finalizeDeliver(false);
            }
          }
        });
      } else {
        // Mobile: use IntersectionObserver for a single triggered animation
        gsap.set(heroCard, { scale: 1, opacity: 0, y: 30, clearProps: 'zIndex' });
        surroundingCards.forEach((card, i) => {
          gsap.set(card, { clearProps: 'x,y,rotateZ,zIndex', scale: 0.8, opacity: 0, y: 40 });
        });

        const mobileTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            finalizeDeliver(false);
          }
        });

        mobileTl.to(heroCard, {
          scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power2.out'
        }, 0);

        surroundingCards.forEach((card, i) => {
          mobileTl.to(card, {
            scale: 1, opacity: 1, y: 0,
            duration: 0.4,
            ease: 'power2.out',
            pointerEvents: 'auto'
          }, 0.15 + i * 0.06);
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
              mobileTl.play();
              observer.disconnect();
            }
          });
        }, { threshold: [0.0, 0.15, 0.3] });

        observer.observe(deliverSection);
      }
    });

    // Window resize handler — recalculate offsets if not yet completed
    window.addEventListener('resize', () => {
      if (!deliverCompleted && !prefersReducedMotion && deliverTrigger) {
        ScrollTrigger.refresh();
      }
    }, { passive: true });
  }

  /* ── DELIVER GRID CARDS (SPOTLIGHT & CLICK INTERACTION SITE-WIDE) ── */
  document.querySelectorAll('.deliver-grid-card').forEach((card) => {
    // If not already in deliverSection (which has its own scroll state tracking)
    if (!card.closest('#we-deliver-section')) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      card.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
          gsap.timeline()
            .to(card, { scale: 0.98, duration: 0.1, ease: 'power1.in' })
            .to(card, { scale: 1.02, duration: 0.2, ease: 'back.out(2)' })
            .to(card, { scale: 1, duration: 0.2, ease: 'power1.out' });
        }
      });
    }
  });

  /* ── MAGIC BENTO ─────────────────────────────────────────────── */
  const bentoGrid = document.getElementById('bento-grid');
  if (bentoGrid) {
    const bentoData = [
      {
        title: 'Web Development',
        desc: 'Modern, fast and scalable websites.',
        label: 'For Business',
        isWide: true,
        image: 'assets/our service/web development.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.2" width="18" height="15.6" rx="2.8" fill="currentColor" fill-opacity="0.14"/><path d="M3 7A2.8 2.8 0 0 1 5.8 4.2h12.4A2.8 2.8 0 0 1 21 7v2H3V7Z" fill="currentColor" fill-opacity="0.32" stroke="none"/><path d="M3 9h18"/><path d="m9.6 12.2-2.2 2.2 2.2 2.2"/><path d="m14.4 12.2 2.2 2.2-2.2 2.2"/><path d="m12.8 11.6-1.6 5.6"/></svg>'
      },
      {
        title: 'App Development',
        desc: 'High-performance mobile applications.',
        label: 'Mobile',
        isWide: false,
        image: 'assets/our service/app development.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="2.8" fill="currentColor" fill-opacity="0.16"/><path d="M10.5 5.5h3"/><circle cx="12" cy="18" r="1.1" fill="currentColor" stroke="none"/></svg>'
      },
      {
        title: 'Software Development',
        desc: 'Dedicated engineering support to build and scale your digital product.',
        label: 'Extended Team',
        isWide: false,
        image: 'assets/our service/software development.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 20.5 7.7 12 12.2 3.5 7.7 12 3.2Z" fill="currentColor" fill-opacity="0.32"/><path d="M3.5 12 12 16.5 20.5 12"/><path d="M3.5 16.3 12 20.8 20.5 16.3"/></svg>'
      },
      {
        title: 'Digital Marketing',
        desc: 'Data-driven growth strategies that work.',
        label: 'Marketing',
        isWide: false,
        image: 'assets/our service/digital marketing.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.2 10.2 18.5 5.5v13L4.2 13.8a1.2 1.2 0 0 1-.8-1.1v-1.4a1.2 1.2 0 0 1 .8-1.1Z" fill="currentColor" fill-opacity="0.2"/><path d="M7.5 14.8v4.2a1.5 1.5 0 0 0 3 0v-3.5"/></svg>'
      },
      {
        title: 'BPO Services',
        desc: 'Efficient, accurate and cost-effective support.',
        label: 'Operations',
        isWide: true,
        image: 'assets/our service/bpo services.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3.2" y="13.2" width="4" height="6.2" rx="1.6" fill="currentColor" fill-opacity="0.26"/><rect x="16.8" y="13.2" width="4" height="6.2" rx="1.6" fill="currentColor" fill-opacity="0.26"/></svg>'
      },
      {
        title: 'Branding & Designing',
        desc: 'Crafting memorable visual identities.',
        label: 'Creative',
        isWide: false,
        image: 'assets/our service/branding and designing.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 0 0 0 18c1.1 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.2 0-.7.6-1.2 1.3-1.2h2c2.7 0 4.8-2.2 4.8-4.9C21 6.7 17 3 12 3Z" fill="currentColor" fill-opacity="0.18"/><circle cx="7.8" cy="10.8" r="1.25" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.3" r="1.25" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="16.8" cy="10.8" r="1.25" fill="currentColor" stroke="none"/></svg>'
      },
      {
        title: 'Industry Training',
        desc: 'Corporate and technical training.',
        label: 'Education',
        isWide: true,
        image: 'assets/our service/industry training.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 9.2 12 4.5l9.5 4.7L12 13.9 2.5 9.2Z" fill="currentColor" fill-opacity="0.34"/><path d="M6.5 11.5v4.3c0 1.8 2.5 3.2 5.5 3.2s5.5-1.4 5.5-3.2v-4.3" fill="currentColor" fill-opacity="0.16"/><path d="M20.5 9.8v5.6"/><circle cx="20.5" cy="16.4" r="1.1" fill="currentColor" stroke="none"/></svg>'
      },
      {
        title: 'Internships',
        desc: 'Real-world experience to kickstart your career with hands-on projects and industry mentors.',
        label: 'Career',
        isWide: true,
        image: 'assets/our service/internships.png',
        icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7"/><rect x="3" y="7" width="18" height="13.5" rx="3" fill="currentColor" fill-opacity="0.15"/><path d="M3 12.4h18v5.1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5.1Z" fill="currentColor" fill-opacity="0.22" stroke="none"/><path d="M3 12.3h18"/><rect x="10.4" y="10.8" width="3.2" height="3" rx="0.9" fill="currentColor" stroke="none"/></svg>'
      }
    ];
    const arrowSVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

    bentoGrid.innerHTML = '';
    bentoData.forEach((card, idx) => {
      const el = document.createElement('article');
      const isEven = idx % 2 === 0;
      el.className = `service-card magic-bento-card ${card.isWide ? 'wide' : ''} ${isEven ? 'bento-primary' : 'bento-secondary'}`;
      el.innerHTML = `
        <div class="magic-blob-1"></div>
        <div class="magic-blob-2"></div>
        <div class="magic-bento-card__inner">
          <div class="magic-bento-card__top">
            <span class="service-meta magic-bento-card__label">${card.label}</span>
            <h3 class="service-title magic-bento-card__title magic-bento-card__title-desktop">${card.title}</h3>
            <p class="service-desc magic-bento-card__description">${card.desc}</p>
          </div>
          ${card.image ? `
          <div class="bento-card-media">
            <img src="${card.image}" alt="${card.title}" class="bento-card-img" loading="lazy" />
          </div>` : ''}
          <a href="services.html" class="arrow magic-bento-card__arrow magic-bento-card__link" aria-label="More about ${card.title}">
            <span class="magic-bento-card__arrow-text">More about ${card.title}</span>
            ${arrowSVG}
          </a>
        </div>
      `;
      bentoGrid.appendChild(el);

      el.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        const link = el.querySelector('a');
        if (link) link.click();
      });
    });
  }

  /* ── PROJECTS ─────────────────────────────────────────────────── */
  const projectsData = [
    { title: 'Apex Finance Ledger', cat: 'FINTECH • ENTERPRISE', desc: 'Next-gen banking infrastructure streaming transactions for 10M+ accounts globally.', accent: 'linear-gradient(to top right,rgba(249,115,22,.2),rgba(245,158,11,.2))', idx: 1 },
    { title: 'Helix Supply Chain', cat: 'LOGISTICS • AI ENGINE', desc: 'Automated warehouse logistics routing utilizing semantic model prediction layers.', accent: 'linear-gradient(to top right,rgba(59,130,246,.2),rgba(14,165,233,.2))', idx: 2 },
    { title: 'Nova Telecom Portal', cat: 'TELECOM • CLOUD CORE', desc: 'High-performance web dashboard handling multi-tenant subscriber data securely.', accent: 'linear-gradient(to top right,rgba(168,85,247,.2),rgba(236,72,153,.2))', idx: 3 }
  ];
  const pg = document.getElementById('projects-grid');
  if (pg) {
    projectsData.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.position = 'relative';
      card.innerHTML = `<div class="project-preview"><div class="project-preview-gradient" style="background:${proj.accent}"></div><div class="project-grid-overlay"></div><span class="project-case-label">CASE ${proj.idx}</span></div><div><span class="project-category">${proj.cat}</span><h3 class="project-title">${proj.title}</h3><p class="project-desc">${proj.desc}</p></div>`;
      let glowEl = null;
      card.addEventListener('mouseenter', () => { glowEl = document.createElement('div'); glowEl.className = 'spotlight-glow'; card.appendChild(glowEl); });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if (glowEl) { glowEl.style.left = x + 'px'; glowEl.style.top = y + 'px'; }
        gsap.to(card, { rotateX: ((y - r.height / 2) / (r.height / 2)) * -6, rotateY: ((x - r.width / 2) / (r.width / 2)) * 6, scale: 1.015, duration: 0.1, ease: 'power2.out', transformPerspective: 1000, transformStyle: 'preserve-3d' });
      });
      card.addEventListener('mouseleave', () => { if (glowEl) { glowEl.remove(); glowEl = null; } gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.3 }); });
      pg.appendChild(card);
    });
  }

  /* ── TESTIMONIALS ─────────────────────────────────────────────── */
  const testimonials = [
    { 
      quote: 'Their training program is unmatched. The engineering standards they instilled transformed our team culture.', 
      highlightedQuote: 'Their training program is <span class="quote-highlight">unmatched</span>.<br/>The engineering standards they instilled transformed our <span class="quote-accent">team culture.</span>',
      author: 'Marcus Vance', 
      role: 'Director of Talent, Helix Logistics', 
      project: 'HELIX LOGISTICS',
      projectCat: 'Logistics Engine',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80' 
    },
    { 
      quote: 'Premium is an understatement. The code clarity, testing metrics, and UI design are world-class.', 
      highlightedQuote: '<span class="quote-highlight">Premium</span> is an understatement.<br/>The code clarity, testing metrics, and UI design are <span class="quote-accent">world-class.</span>',
      author: 'Sora Takahashi', 
      role: 'Lead Architect, Nova Portal', 
      project: 'NOVA PORTAL',
      projectCat: 'Enterprise Solutions',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80' 
    },
    { 
      quote: 'AROX rebuilt our entire payment system in record time. System outages dropped to zero.', 
      highlightedQuote: '<span class="quote-highlight">AROX rebuilt</span> our entire payment system in record time.<br/>System outages dropped to <span class="quote-accent">zero.</span>',
      author: 'Elena Rostova', 
      role: 'VP of Engineering, Apex Ledger', 
      project: 'APEX LEDGER',
      projectCat: 'Fintech Solutions',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80' 
    }
  ];
  const contentArea = document.getElementById('testimonial-content-area');
  let activeIdx = 0;

  if (contentArea) {
    testimonials.forEach((t, i) => {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `
        <p class="testimonial-quote">"${t.highlightedQuote || t.quote}"</p>
        <div class="testimonial-divider">
          <div class="divider-line"></div>
          <div class="divider-dot"></div>
        </div>
        <div class="testimonial-meta-row">
          <div class="meta-left">
            <div class="testimonial-name">${t.author}</div>
            <div class="testimonial-role">${t.role}</div>
          </div>
          <div class="meta-right">
            <div class="verified-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.8 4.5 6v5.5c0 4.8 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5 7.5-9.8V6L12 2.8Z" fill="currentColor" fill-opacity="0.22"/>
                <path d="m9 12 2.1 2.1 4-4.2"/>
              </svg>
              <span>VERIFIED CLIENT</span>
            </div>
          </div>
        </div>
      `;
      contentArea.appendChild(slide);
    });
  }

  function switchTestimonial(idx) {
    if (!contentArea) return;
    const slides = contentArea.querySelectorAll('.testimonial-slide');
    if (!slides || !slides[activeIdx]) return;
    slides[activeIdx].classList.remove('active');
    slides[activeIdx].classList.add('exit');
    const prev = activeIdx;
    setTimeout(() => { if (slides[prev]) slides[prev].classList.remove('exit'); }, 400);
    activeIdx = idx;
    if (slides[idx]) slides[idx].classList.add('active');
  }

  // Swipe card stack
  const cardStack = document.getElementById('card-stack');
  const stackDotsContainer = document.getElementById('stack-dots');
  let cards = testimonials.map((_, i) => ({ id: i, origIdx: i }));

  function getStyle(index) {
    const n = cards.length;
    const isMobile = window.innerWidth <= 768;
    const xOffset = isMobile ? 24 : 60;
    const yOffset = isMobile ? 8 : 12;
    const rotOffset = isMobile ? -8 : -15;
    return {
      zIndex: n - index,
      scale: 1 - index * 0.05,
      x: n > 1 ? (index / (n - 1)) * xOffset : 0,
      y: -(index * yOffset),
      rotate: n > 1 ? (index / (n - 1)) * rotOffset : 0,
      opacity: 1 - index * 0.15
    };
  }

  function updateDots(activeOrigIdx) {
    if (!stackDotsContainer) return;
    stackDotsContainer.innerHTML = '';
    testimonials.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = i === activeOrigIdx ? 'stack-dot stack-dot-active' : 'stack-dot';
      stackDotsContainer.appendChild(dot);
    });
  }

  function buildStack() {
    if (!cardStack) return;
    cardStack.innerHTML = '';
    cards.forEach((card, index) => {
      const isTop = index === 0;
      const t = testimonials[card.origIdx];
      const s = getStyle(index);
      const div = document.createElement('div');
      div.className = 'stack-card' + (isTop ? ' is-top' : '') + ` stack-depth-${index}`;
      div.style.cssText = `z-index:${s.zIndex};transform:translate(${s.x}px,${s.y}px) rotate(${s.rotate}deg) scale(${s.scale});opacity:${s.opacity};`;
      
      if (isTop) {
        div.innerHTML = `
          <img src="${t.image}" alt="${t.author}" loading="lazy"/>
          <div class="stack-card-overlay">
            <div class="client-badge">
              <div class="badge-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="3.5" width="10" height="17" rx="2" fill="currentColor" fill-opacity="0.18"/>
                  <path d="M14 9.5h4.2A1.8 1.8 0 0 1 20 11.3v9.2h-6" fill="currentColor" fill-opacity="0.12"/>
                  <path d="M7.5 7.8h3M7.5 11.4h3M7.5 15h3"/>
                </svg>
              </div>
              <div class="badge-text-group">
                <div class="badge-title">${t.project}</div>
                <div class="badge-subtitle">${t.projectCat}</div>
              </div>
            </div>
          </div>`;
        setupDrag(div);
      } else {
        div.innerHTML = `<img src="${t.image}" alt="${t.author}" loading="lazy"/><div class="stack-card-overlay"></div>`;
      }
      cardStack.appendChild(div);
    });
    switchTestimonial(cards[0].origIdx);
    updateDots(cards[0].origIdx);
  }

  function pushToBack() {
    const [first, ...rest] = cards;
    cards = [...rest, first];
    buildStack();
  }

  let isDragging = false;
  let autoSwipeInterval;

  function autoSwipe() {
    if (!cardStack) return;
    const topCard = cardStack.querySelector('.is-top');
    if (!topCard || isDragging) return;
    gsap.to(topCard, {
      x: -150, 
      y: 50, 
      rotate: -15, 
      opacity: 0,
      duration: 0.4, 
      onComplete: () => {
        pushToBack();
      }
    });
  }

  function setupDrag(topCard) {
    let startX = 0, startY = 0, dx = 0, dy = 0;
    const s = getStyle(0);

    function onDown(cx, cy) {
      isDragging = true; 
      startX = cx; 
      startY = cy; 
      dx = 0; 
      dy = 0; 
      topCard.style.transition = 'none'; 
      clearInterval(autoSwipeInterval); 
    }
    
    function onMove(cx, cy) {
      if (!isDragging) return;
      dx = cx - startX; dy = cy - startY;
      topCard.style.transform = `translate(${s.x + dx}px,${s.y + dy}px) rotate(${s.rotate + dx * 0.05}deg) scale(1.05)`;
    }
    
    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      topCard.style.transition = '';
      if (Math.hypot(dx, dy) > 50) { 
        pushToBack(); 
      }
      else { 
        gsap.to(topCard, { x: s.x, y: s.y, rotate: s.rotate, scale: s.scale, duration: 0.4, ease: 'back.out(1)' }); 
      }
      autoSwipeInterval = setInterval(autoSwipe, 3800); 
    }

    topCard.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => { if (isDragging) onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onUp);
    topCard.addEventListener('touchstart', e => { const t = e.touches[0]; onDown(t.clientX, t.clientY); }, { passive: true });
    window.addEventListener('touchmove', e => { if (isDragging) { const t = e.touches[0]; onMove(t.clientX, t.clientY); } }, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  // Bind arrows controls
  const btnPrev = document.getElementById('stack-prev');
  const btnNext = document.getElementById('stack-next');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      clearInterval(autoSwipeInterval);
      const last = cards[cards.length - 1];
      cards = [last, ...cards.slice(0, -1)];
      buildStack();
      autoSwipeInterval = setInterval(autoSwipe, 3800);
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      clearInterval(autoSwipeInterval);
      pushToBack();
      autoSwipeInterval = setInterval(autoSwipe, 3800);
    });
  }

  if (cardStack) {
    buildStack();
    autoSwipeInterval = setInterval(autoSwipe, 3800);
  }


  /* ── LENIS SMOOTH INERTIA SCROLLING ── */
  function initLenis() {
    if (window.lenis) return;
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    window.lenis = lenis;

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  if (typeof Lenis !== 'undefined') {
    initLenis();
  } else {
    // Only load Lenis on desktop for performance (skip on mobile/touch devices)
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (!isMobile) {
      const lenisScript = document.createElement('script');
      lenisScript.src = "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js";
      lenisScript.defer = true;
      lenisScript.onload = initLenis;
      document.head.appendChild(lenisScript);
    }
  }

  /* ── SCROLL REVEAL ANIMATIONS ─────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 1. General Section Headers across all pages (initial scroll-down reveal)
    const sectionHeaders = document.querySelectorAll(
      '.section-header, .services-header, .projects-header, .testimonials-header, .process-header'
    );
    sectionHeaders.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          },
          clearProps: 'transform,opacity'
        });
      }
    });

    // 2. Purpose & Aspiration Cards (About Page We Deliver Card Style)
    const aboutDeliverCards = document.querySelectorAll('.about-deliver-card');
    if (aboutDeliverCards.length) {
      const triggerEl = document.getElementById('mission-section') || aboutDeliverCards[0];
      const rect = triggerEl.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        gsap.from(aboutDeliverCards, {
          opacity: 0,
          y: 35,
          scale: 0.97,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top 82%',
            toggleActions: 'play none none none',
            once: true
          },
          clearProps: 'transform,scale,opacity'
        });
      }
    }

    // 3. Core Values Grid Tiles (About Page)
    const valueTiles = document.querySelectorAll('#values-section .value-tile');
    if (valueTiles.length) {
      const gridEl = document.querySelector('#values-section .grid') || valueTiles[0];
      const rect = gridEl.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        gsap.from(valueTiles, {
          opacity: 0,
          y: 28,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 86%',
            toggleActions: 'play none none none',
            once: true
          },
          clearProps: 'transform,scale,opacity'
        });
      }
    }

    // 4. Operating Model / How We Do It Process Cards (About Page)
    const processCards = document.querySelectorAll('#process-section .process-card');
    if (processCards.length) {
      const gridEl = document.querySelector('#process-section .process-cards-grid') || processCards[0];
      const rect = gridEl.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        gsap.from(processCards, {
          opacity: 0,
          y: 25,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 86%',
            toggleActions: 'play none none none',
            once: true
          },
          clearProps: 'transform,opacity'
        });
      }
    }

    // 5. Pre-footer CTA Section & Cards
    const revealTargets = document.querySelectorAll('.cta-card, .cta-section');
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight) {
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true
          },
          clearProps: 'transform,opacity'
        });
      }
    });
  }

  /* ── FOOTER RESPONSIVE ACCORDION / WEBVIEW SHOW-ALL ──────────── */
  function initFooterResponsive() {
    const footerCols = document.querySelectorAll('footer details.footer-col, .site-footer details.footer-col');
    if (!footerCols.length) return;

    function updateFooterState() {
      if (window.innerWidth > 768) {
        // Desktop / webview: expand ALL columns
        footerCols.forEach(col => col.setAttribute('open', ''));
      } else {
        // Mobile view: collapse all columns by default
        footerCols.forEach(col => col.removeAttribute('open'));
      }
    }

    // Ensure state on initial load
    updateFooterState();

    // On resize, update state
    window.addEventListener('resize', updateFooterState, { passive: true });
  }

  /* ── FOOTER INSTANT DIRECT NAVIGATION (NO SMOOTH SCROLLING) ── */
  function initFooterInstantNavigation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('footer a, .site-footer a');
      if (!link || !link.href) return;

      try {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('tel:') || href.startsWith('mailto:')) return;

        const url = new URL(link.href, window.location.href);
        const isSamePage = url.origin === window.location.origin && url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '');
        
        if (isSamePage && url.hash) {
          e.preventDefault();
          history.pushState(null, '', link.href);
          
          const hashId = url.hash.replace('#', '');
          const targetEl = document.getElementById(hashId) || document.querySelector(url.hash);
          if (targetEl) {
            const nav = document.getElementById('site-header');
            const navHeight = nav ? nav.offsetHeight : 70;
            const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
            if (window.lenis && typeof window.lenis.scrollTo === 'function') {
              window.lenis.scrollTo(targetTop, { immediate: true });
            } else {
              window.scrollTo({ top: targetTop, behavior: 'instant' });
            }
          }
        }
      } catch (_) {}
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFooterResponsive();
      initFooterInstantNavigation();
    });
  } else {
    initFooterResponsive();
    initFooterInstantNavigation();
  }

  /* ── PAGE NAVIGATION: Native instant navigation with zero delay ── */
  function initPageTransitions() {
    try {
      sessionStorage.removeItem('arox-page-transition');
    } catch (e) {}
    document.documentElement.classList.remove('page-is-entering');
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  initPageTransitions();

  /* ── IMAGE PROTECTION: Prevent double-click selection, dragging, and copying across all sections ── */
  function initImageProtection() {
    function protectImages() {
      document.querySelectorAll('img, picture, svg').forEach((img) => {
        img.setAttribute('draggable', 'false');
      });
    }

    protectImages();

    // Prevent dragstart on images
    document.addEventListener('dragstart', (e) => {
      if (e.target && (e.target.nodeName === 'IMG' || (e.target.closest && e.target.closest('img, picture, svg')))) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Prevent selection start on images
    document.addEventListener('selectstart', (e) => {
      if (e.target && (e.target.nodeName === 'IMG' || (e.target.closest && e.target.closest('img, picture, svg')))) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Prevent double-click selecting images across all sections
    document.addEventListener('dblclick', (e) => {
      if (e.target && (e.target.nodeName === 'IMG' || (e.target.closest && e.target.closest('img, picture, svg, .card-hero-logo, .bento-card-img')))) {
        e.preventDefault();
        if (window.getSelection) {
          const sel = window.getSelection();
          if (sel) sel.removeAllRanges();
        }
      }
    }, true);

    // Prevent context menu (Save/Copy image) on images
    document.addEventListener('contextmenu', (e) => {
      if (e.target && (e.target.nodeName === 'IMG' || (e.target.closest && e.target.closest('img, picture')))) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Prevent copy command when an image is targeted
    document.addEventListener('copy', (e) => {
      const active = document.activeElement;
      if (active && (active.nodeName === 'IMG' || (active.closest && active.closest('img, picture')))) {
        e.preventDefault();
        return false;
      }
    }, true);

    if (window.MutationObserver) {
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length) {
            protectImages();
            break;
          }
        }
      });
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageProtection);
  } else {
    initImageProtection();
  }
})();


  /* ============================================================
     MOBILE DELIVER COMPONENT AUTO-SCROLL (3s cadence - User Ref Image)
  ============================================================ */
  function initMobileDeliverAutoScroll() {
    const pill = document.getElementById('mobileDeliverPill');
    const textEl = document.getElementById('mobileDeliverPillText');
    const descEl = document.getElementById('mobileDeliverDesc');
    const dotsEl = document.getElementById('mobileDeliverDots');
    if (!pill || !textEl || !descEl) return;

    const points = [
      { pill: "AI automations", desc: "Autonomous workflows, LLMs & intelligent system integrations" },
      { pill: "Custom software", desc: "Bespoke architectures engineered for speed, scale & resilience" },
      { pill: "Cloud architecture", desc: "Resilient zero-downtime microservices on modern cloud stacks" },
      { pill: "UI/UX experiences", desc: "Pixel-perfect, human-centered interfaces driving engagement" },
      { pill: "Agile engineering", desc: "Rapid sprint cycles, continuous feedback & on-time delivery" },
      { pill: "Cybersecurity", desc: "Zero-trust identity, hardened networks & defense-in-depth" },
      { pill: "24/7 SLA support", desc: "Continuous monitoring, uptime guarantees & rapid resolution" }
    ];

    let currentIndex = 0;
    let timer = null;

    function renderDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = points.map((_, i) =>
        `<span class="mobile-deliver-dot ${i === currentIndex ? 'active' : ''}"></span>`
      ).join('');
    }

    function setPoint(index) {
      currentIndex = (index + points.length) % points.length;
      textEl.classList.add('anim-out');
      descEl.classList.add('anim-fade');
      setTimeout(() => {
        textEl.textContent = points[currentIndex].pill;
        descEl.textContent = points[currentIndex].desc;
        textEl.classList.remove('anim-out');
        textEl.classList.add('anim-in-prep');
        void textEl.offsetWidth; // trigger reflow
        textEl.classList.remove('anim-in-prep');
        descEl.classList.remove('anim-fade');
        renderDots();
      }, 250);
    }

    function startTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        setPoint(currentIndex + 1);
      }, 3000);
    }

    renderDots();
    startTimer();

    pill.addEventListener('click', () => {
      setPoint(currentIndex + 1);
      startTimer();
    });
  }

  // Auto-init on DOMContentLoaded or immediate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileDeliverAutoScroll);
  } else {
    initMobileDeliverAutoScroll();
  }
