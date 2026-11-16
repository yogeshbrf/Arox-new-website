import os

with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Hero CSS
old_hero_css = """    background-color: #020617 !important;
    background-image: url('assets/training-hero-dark.jpg') !important;
    background-size: cover !important;
    background-position: right center !important;
    background-repeat: no-repeat !important;
  }
  .theme-dark .page-hero-pro.hero-courses,
  .dark .page-hero-pro.hero-courses,
  html.dark .page-hero-pro.hero-courses,
  body.theme-dark .page-hero-pro.hero-courses {
    background-color: #020617 !important;
    background-image: url('assets/training-hero-dark.jpg') !important;
    background-size: cover !important;
    background-position: right center !important;
    background-repeat: no-repeat !important;
  }
  .theme-light .page-hero-pro.hero-courses,
  [data-theme="light"] .page-hero-pro.hero-courses,
  html.theme-light .page-hero-pro.hero-courses,
  body.theme-light .page-hero-pro.hero-courses,
  html:not(.dark) .page-hero-pro.hero-courses {
    background-color: #EBF3FF !important;
    background-image: url('assets/training-hero-light.jpg') !important;"""

new_hero_css = """    background-color: #020617 !important;
    background-image: url('assets/hero/training-dark1.png') !important;
    background-size: cover !important;
    background-position: right center !important;
    background-repeat: no-repeat !important;
  }
  .theme-dark .page-hero-pro.hero-courses,
  .dark .page-hero-pro.hero-courses,
  html.dark .page-hero-pro.hero-courses,
  body.theme-dark .page-hero-pro.hero-courses {
    background-color: #020617 !important;
    background-image: url('assets/hero/training-dark1.png') !important;
    background-size: cover !important;
    background-position: right center !important;
    background-repeat: no-repeat !important;
  }
  .theme-light .page-hero-pro.hero-courses,
  [data-theme="light"] .page-hero-pro.hero-courses,
  html.theme-light .page-hero-pro.hero-courses,
  body.theme-light .page-hero-pro.hero-courses,
  html:not(.dark) .page-hero-pro.hero-courses {
    background-color: #EBF3FF !important;
    background-image: url('assets/hero/service-light.png') !important;"""

assert old_hero_css in html, "old_hero_css not found"
html = html.replace(old_hero_css, new_hero_css, 1)

# 2. Update Hero Background Wrapper Images
old_hero_imgs = """  <div class="training-hero-bg-wrapper" aria-hidden="true">
    <img src="assets/training-hero-dark.jpg" class="training-bg-img training-hero-img-dark" alt="Training Background" loading="eager" />
    <img src="assets/training-hero-light.jpg" class="training-bg-img training-hero-img-light" alt="Training Background" loading="eager" />
    <div class="training-hero-gradient-overlay"></div>
  </div>"""

new_hero_imgs = """  <div class="training-hero-bg-wrapper" aria-hidden="true">
    <img src="assets/hero/training-dark1.png" class="training-bg-img training-hero-img-dark" alt="Training Background" loading="eager" />
    <img src="assets/hero/service-light.png" class="training-bg-img training-hero-img-light" alt="Training Background" loading="eager" />
    <div class="training-hero-gradient-overlay"></div>
  </div>"""

assert old_hero_imgs in html, "old_hero_imgs not found"
html = html.replace(old_hero_imgs, new_hero_imgs, 1)

# 3. Update Hero Secondary Button and Click Handler
old_hero_btn = """        <button onclick="if(typeof window.navigateToSection === 'function'){ window.navigateToSection('internship'); } else { scrollToCoursesSection(); }" class="training-btn-secondary">
          <span>Explore Internships</span>
        </button>"""

new_hero_btn = """        <button id="heroSecondaryBtn" onclick="handleHeroSecondaryClick(event)" class="training-btn-secondary">
          <span id="heroSecondaryBtnText">Explore Internship</span>
        </button>"""

assert old_hero_btn in html, "old_hero_btn not found"
html = html.replace(old_hero_btn, new_hero_btn, 1)

# 4. Update scrollToCoursesSection script to include handleHeroSecondaryClick
old_scroll_script = """<script>
  window.scrollToCoursesSection = function() {
    const target = document.getElementById('hscrollSection') || document.querySelector('.hscroll-section');
    if (target) {
      const st = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getById('trainingHScroll') : null;
      const targetY = (st && st.start !== undefined) ? st.start : (target.getBoundingClientRect().top + window.scrollY);
      window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
    }
  };
</script>"""

new_scroll_script = """<script>
  window.scrollToCoursesSection = function() {
    const target = document.getElementById('hscrollSection') || document.querySelector('.hscroll-section');
    if (target) {
      const st = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getById('trainingHScroll') : null;
      const targetY = (st && st.start !== undefined) ? st.start : (target.getBoundingClientRect().top + window.scrollY);
      window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
    }
  };

  window.handleHeroSecondaryClick = function(event) {
    if (event && event.preventDefault) event.preventDefault();
    const hscroll = document.getElementById('hscrollSection');
    const isCurrentlyIntern = hscroll && hscroll.classList.contains('is-internship-view');

    if (window.innerWidth <= 768) {
      const trainSection = document.getElementById('aroxMobTrainingSection') || document.querySelector('.arox-mob-section:nth-of-type(1)');
      const internSection = document.getElementById('aroxMobInternSection') || document.querySelector('.arox-mob-section:nth-of-type(2)');
      if (isCurrentlyIntern) {
        if (typeof window.navigateToSection === 'function') {
          window.navigateToSection('training');
        }
        if (trainSection) {
          trainSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        if (typeof window.navigateToSection === 'function') {
          window.navigateToSection('internship');
        }
        if (internSection) {
          internSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return;
    }

    if (typeof window.navigateToSection === 'function') {
      window.navigateToSection(isCurrentlyIntern ? 'training' : 'internship');
    }
  };
</script>"""

assert old_scroll_script in html, "old_scroll_script not found"
html = html.replace(old_scroll_script, new_scroll_script, 1)

# 5. Update mobile section tags to add IDs
old_mob_sections = """  <div class="arox-mobile-courses-view" id="aroxMobileCoursesView">
    <!-- SECTION 1: TRAINING -->
    <div class="arox-mob-section">
      <h2 class="arox-mob-heading">Training</h2>
      <p class="arox-mob-sub">Skill-Based Training for a Better Career!</p>
      <div class="arox-mob-scroll-track" id="aroxMobileTrainingTrack">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- SECTION 2: INTERNSHIP -->
    <div class="arox-mob-section">
      <h2 class="arox-mob-heading">Internship</h2>"""

new_mob_sections = """  <div class="arox-mobile-courses-view" id="aroxMobileCoursesView">
    <!-- SECTION 1: TRAINING -->
    <div class="arox-mob-section" id="aroxMobTrainingSection">
      <h2 class="arox-mob-heading">Training</h2>
      <p class="arox-mob-sub">Skill-Based Training for a Better Career!</p>
      <div class="arox-mob-scroll-track" id="aroxMobileTrainingTrack">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- SECTION 2: INTERNSHIP -->
    <div class="arox-mob-section" id="aroxMobInternSection">
      <h2 class="arox-mob-heading">Internship</h2>"""

assert old_mob_sections in html, "old_mob_sections not found"
html = html.replace(old_mob_sections, new_mob_sections, 1)

# 6. Update Autofill CSS
old_autofill = """    html.dark input:-webkit-autofill,
    html.theme-dark input:-webkit-autofill,
    body.theme-dark input:-webkit-autofill,
    html.dark .form-input:-webkit-autofill,
    html.theme-dark .form-input:-webkit-autofill,
    body.theme-dark .form-input:-webkit-autofill,
    html.dark .arox-input:-webkit-autofill,
    html.theme-dark .arox-input:-webkit-autofill,
    body.theme-dark .arox-input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #161822 inset !important;
      box-shadow: 0 0 0 1000px #161822 inset !important;
      -webkit-text-fill-color: #F8FAFC !important;
    }

    html.theme-light input:-webkit-autofill,
    html:not(.dark) input:-webkit-autofill,
    body.theme-light input:-webkit-autofill,
    html.theme-light .form-input:-webkit-autofill,
    html:not(.dark) .form-input:-webkit-autofill,
    body.theme-light .form-input:-webkit-autofill,
    html.theme-light .arox-input:-webkit-autofill,
    html:not(.dark) .arox-input:-webkit-autofill,
    body.theme-light .arox-input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
      box-shadow: 0 0 0 1000px #FFFFFF inset !important;
      -webkit-text-fill-color: #0F172A !important;
    }"""

new_autofill = """    /* Complete removal of added background on autofill in details form */
    .arox-input:-webkit-autofill,
    .arox-input:-webkit-autofill:hover,
    .arox-input:-webkit-autofill:focus,
    .arox-input:-webkit-autofill:active,
    .arox-select:-webkit-autofill,
    .google-input:-webkit-autofill,
    .google-input:-webkit-autofill:hover,
    .google-input:-webkit-autofill:focus,
    .google-input:-webkit-autofill:active,
    .google-select:-webkit-autofill,
    .form-input:-webkit-autofill,
    .form-input:-webkit-autofill:hover,
    .form-input:-webkit-autofill:focus,
    .form-input:-webkit-autofill:active,
    .form-select:-webkit-autofill,
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #000000 inset !important;
      box-shadow: 0 0 0 1000px #000000 inset !important;
      -webkit-text-fill-color: #FFFFFF !important;
      color: #FFFFFF !important;
      caret-color: #FFFFFF !important;
      background-color: transparent !important;
      background-image: none !important;
      transition: background-color 999999s ease-in-out 0s, color 999999s ease-in-out 0s !important;
    }

    .theme-light .arox-input:-webkit-autofill,
    .theme-light .arox-input:-webkit-autofill:hover,
    .theme-light .arox-input:-webkit-autofill:focus,
    .theme-light .arox-input:-webkit-autofill:active,
    .theme-light .arox-select:-webkit-autofill,
    .theme-light .google-input:-webkit-autofill,
    .theme-light .google-input:-webkit-autofill:hover,
    .theme-light .google-input:-webkit-autofill:focus,
    .theme-light .google-input:-webkit-autofill:active,
    .theme-light .google-select:-webkit-autofill,
    .theme-light .form-input:-webkit-autofill,
    .theme-light .form-input:-webkit-autofill:hover,
    .theme-light .form-input:-webkit-autofill:focus,
    .theme-light .form-input:-webkit-autofill:active,
    .theme-light .form-select:-webkit-autofill,
    [data-theme="light"] .arox-input:-webkit-autofill,
    [data-theme="light"] .arox-input:-webkit-autofill:hover,
    [data-theme="light"] .arox-input:-webkit-autofill:focus,
    [data-theme="light"] .arox-input:-webkit-autofill:active,
    [data-theme="light"] .form-input:-webkit-autofill,
    [data-theme="light"] .form-input:-webkit-autofill:hover,
    [data-theme="light"] .form-input:-webkit-autofill:focus,
    [data-theme="light"] .form-input:-webkit-autofill:active,
    html.theme-light input:-webkit-autofill,
    html.theme-light .arox-input:-webkit-autofill,
    html.theme-light .form-input:-webkit-autofill,
    html:not(.dark) input:-webkit-autofill,
    html:not(.dark) .arox-input:-webkit-autofill,
    html:not(.dark) .form-input:-webkit-autofill,
    body.theme-light input:-webkit-autofill,
    body.theme-light .arox-input:-webkit-autofill,
    body.theme-light .form-input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
      box-shadow: 0 0 0 1000px #FFFFFF inset !important;
      -webkit-text-fill-color: #0F172A !important;
      color: #0F172A !important;
      caret-color: #0F172A !important;
      background-color: transparent !important;
      background-image: none !important;
      transition: background-color 999999s ease-in-out 0s, color 999999s ease-in-out 0s !important;
    }"""

assert old_autofill in html, "old_autofill not found"
html = html.replace(old_autofill, new_autofill, 1)

# 7. Update setActiveType to sync heroSecondaryBtnText
old_cta_training = """      // Update CTA button label for Training section
      const ctaApplyBtnText = document.getElementById('ctaApplyBtnText');
      if (ctaApplyBtnText) {
        ctaApplyBtnText.textContent = 'Apply for Internship';
      }"""

new_cta_training = """      // Update CTA and Hero button labels for Training section
      const ctaApplyBtnText = document.getElementById('ctaApplyBtnText');
      if (ctaApplyBtnText) {
        ctaApplyBtnText.textContent = 'Apply for Internship';
      }
      const heroSecondaryBtnText = document.getElementById('heroSecondaryBtnText');
      if (heroSecondaryBtnText) {
        heroSecondaryBtnText.textContent = 'Explore Internship';
      }"""

assert old_cta_training in html, "old_cta_training not found"
html = html.replace(old_cta_training, new_cta_training, 1)

old_cta_intern = """        // Update CTA button label for Internship section
        const ctaApplyBtnText = document.getElementById('ctaApplyBtnText');
        if (ctaApplyBtnText) {
          ctaApplyBtnText.textContent = 'Apply for Training';
        }"""

new_cta_intern = """        // Update CTA and Hero button labels for Internship section
        const ctaApplyBtnText = document.getElementById('ctaApplyBtnText');
        if (ctaApplyBtnText) {
          ctaApplyBtnText.textContent = 'Apply for Training';
        }
        const heroSecondaryBtnText = document.getElementById('heroSecondaryBtnText');
        if (heroSecondaryBtnText) {
          heroSecondaryBtnText.textContent = 'Explore Training';
        }"""

assert old_cta_intern in html, "old_cta_intern not found"
html = html.replace(old_cta_intern, new_cta_intern, 1)

# 8. Add mobile observer after initialTab setActiveType
old_init_tab = """  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') === 'internship' ? 'internship' : 'training';
  setActiveType(initialTab, true);"""

new_init_tab = """  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') === 'internship' ? 'internship' : 'training';
  setActiveType(initialTab, true);

  // Sync hero button when scrolling between sections on mobile
  if ('IntersectionObserver' in window) {
    const mobTrainEl = document.getElementById('aroxMobTrainingSection');
    const mobInternEl = document.getElementById('aroxMobInternSection');
    if (mobTrainEl && mobInternEl) {
      const mobSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const btnText = document.getElementById('heroSecondaryBtnText');
            const hscroll = document.getElementById('hscrollSection');
            if (entry.target.id === 'aroxMobInternSection') {
              if (btnText) btnText.textContent = 'Explore Training';
              if (hscroll) {
                hscroll.classList.add('is-internship-view');
                hscroll.classList.remove('is-training-view');
              }
            } else if (entry.target.id === 'aroxMobTrainingSection') {
              if (btnText) btnText.textContent = 'Explore Internship';
              if (hscroll) {
                hscroll.classList.remove('is-internship-view');
                hscroll.classList.add('is-training-view');
              }
            }
          }
        });
      }, { threshold: 0.3 });
      mobSectionObserver.observe(mobTrainEl);
      mobSectionObserver.observe(mobInternEl);
    }
  }"""

assert old_init_tab in html, "old_init_tab not found"
html = html.replace(old_init_tab, new_init_tab, 1)

# 9. Add autocomplete="off" to modal forms
html = html.replace('<form id="google-form-1" onsubmit="return false;">', '<form id="google-form-1" autocomplete="off" onsubmit="return false;">', 1)
html = html.replace('<form id="google-form-2" onsubmit="return false;">', '<form id="google-form-2" autocomplete="off" onsubmit="return false;">', 1)
html = html.replace('<form id="google-form-3" onsubmit="return false;">', '<form id="google-form-3" autocomplete="off" onsubmit="return false;">', 1)

# Write to training.html
with open('training.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Mirror to courses.html (must remain byte-for-byte identical)
with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully updated training.html and mirrored to courses.html")

