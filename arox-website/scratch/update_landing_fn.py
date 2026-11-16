with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

import re

old_fn = """  // Immediate URL landing & footer click redirection to corresponding internship domain cards
  function handleUrlDomainLanding() {
    const params = new URLSearchParams(window.location.search);
    const dom = params.get('domain');
    const tab = params.get('tab');
    if (dom || tab === 'internship' || window.location.hash.includes('internshipDomainWrap')) {
      const targetDomain = dom || window.currentActiveDomain || 'cse_it';
      window.currentActiveDomain = targetDomain;
      if (typeof window.setActiveType === 'function') {
        window.setActiveType('internship', false);
      }
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain(targetDomain, false);
      }
      document.querySelectorAll('.intern-cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
      });
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          if (typeof window.renderMobileInternship === 'function') {
            window.renderMobileInternship(targetDomain);
          }
          const mobPills = document.querySelectorAll('#aroxMobilePillsRow .arox-mob-pill');
          mobPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-domain') === targetDomain));
          const internSection = document.getElementById('aroxMobInternSection') || document.getElementById('internshipDomainWrap');
          if (internSection) {
            internSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
      } else {
        setTimeout(() => {
          const hscroll = document.getElementById('hscrollSection') || document.getElementById('internshipDomainWrap');
          if (hscroll) {
            const topY = hscroll.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: topY, behavior: 'smooth' });
          }
        }, 350);
      }
    }
  }"""

new_fn = """  // Immediate URL landing & footer click redirection to corresponding internship domain cards
  function handleUrlDomainLanding() {
    const params = new URLSearchParams(window.location.search);
    const dom = params.get('domain');
    const tab = params.get('tab');
    if (dom || tab === 'internship' || window.location.hash.includes('internshipDomainWrap')) {
      const targetDomain = dom || window.currentActiveDomain || 'cse_it';
      window.currentActiveDomain = targetDomain;
      if (typeof window.setActiveType === 'function') {
        window.setActiveType('internship', false);
      }
      
      const trySwitch = (attempts = 0) => {
        if (window.innerWidth <= 768) {
          if (typeof window.renderMobileInternship === 'function') {
            window.renderMobileInternship(targetDomain);
          }
          const mobPills = document.querySelectorAll('#aroxMobilePillsRow .arox-mob-pill');
          mobPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-domain') === targetDomain));
          const internSection = document.getElementById('aroxMobInternSection') || document.getElementById('internshipDomainWrap');
          if (internSection) {
            internSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        // Desktop: wait for internTrigger start/end to be ready
        if (window.internTrigger && typeof window.internTrigger.start === 'number' && typeof window.switchInternshipDomain === 'function') {
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        } else if (attempts < 12) {
          setTimeout(() => trySwitch(attempts + 1), 80);
        } else if (typeof window.switchInternshipDomain === 'function') {
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        }
      };

      trySwitch(0);
    }
  }"""

assert old_fn in t, "old_fn not found in training.html"
t = t.replace(old_fn, new_fn)

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("✅ Updated handleUrlDomainLanding with trySwitch and mirrored to courses.html")

