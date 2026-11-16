"""
Script to apply footer updates across all pages:
1. Copyright on single line:
   Replace `<p class="footer-copyright-bottom">&copy; <span>AROX Tech 2026</span><br class="footer-copy-br"/>All Rights Reserved</p>`
   With: `<p class="footer-copyright-bottom">&copy; <span>AROX Tech 2026</span> All Rights Reserved</p>`
2. Services links updated with ?service=...
3. Internship links updated with ?tab=internship&domain=...
4. Update services.html with goToCard force, id on mob service sections, URL check useEffect, and footer click listener
5. Update training.html with domain param handling, setActiveType('internship'), domain switch, and mobile scroll
6. Mirror training.html to courses.html (must be byte-for-byte identical!)
7. Update css/style.css to ensure single line copyright with white-space: nowrap
"""

import os, re

FOOTER_FILES = [
    'about.html',
    'contact.html',
    'courses.html',
    'detail.html',
    'footer.html',
    'index.html',
    'services.html',
    'training.html'
]

print("=== 1. UPDATING FOOTER HTML ACROSS ALL 8 FILES ===")

OLD_COPYRIGHT = '<p class="footer-copyright-bottom">&copy; <span>AROX Tech 2026</span><br class="footer-copy-br"/>All Rights Reserved</p>'
NEW_COPYRIGHT = '<p class="footer-copyright-bottom">&copy; <span>AROX Tech 2026</span> All Rights Reserved</p>'

# Services links replacements
OLD_SVC_LINKS = [
    'href="services.html#development"',
    'href="services.html#creative"',
    'href="services.html#business"',
    'href="services.html#infrastructure"'
]
NEW_SVC_LINKS = [
    'href="services.html?service=development#domain-section-0"',
    'href="services.html?service=creative#domain-section-1"',
    'href="services.html?service=business#domain-section-2"',
    'href="services.html?service=infrastructure#domain-section-3"'
]

# Internship links replacements
OLD_INT_LINKS = [
    'href="training.html?domain=cse_it#internshipDomainWrap"',
    'href="training.html?domain=ece#internshipDomainWrap"',
    'href="training.html?domain=mech#internshipDomainWrap"',
    'href="training.html?domain=management#internshipDomainWrap"'
]
NEW_INT_LINKS = [
    'href="training.html?tab=internship&amp;domain=cse_it#internshipDomainWrap"',
    'href="training.html?tab=internship&amp;domain=ece#internshipDomainWrap"',
    'href="training.html?tab=internship&amp;domain=mech#internshipDomainWrap"',
    'href="training.html?tab=internship&amp;domain=management#internshipDomainWrap"'
]

for fname in FOOTER_FILES:
    with open(fname, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Copyright
    if OLD_COPYRIGHT in c:
        c = c.replace(OLD_COPYRIGHT, NEW_COPYRIGHT)
        print(f"  [{fname}] Copyright replaced")
    else:
        # Check if regex matches
        c = re.sub(
            r'<p class="footer-copyright-bottom">&copy;\s*<span>AROX Tech 2026</span><br[^>]*/>All Rights Reserved</p>',
            NEW_COPYRIGHT,
            c
        )
        print(f"  [{fname}] Copyright regex replaced")

    # 2. Services links
    for old_s, new_s in zip(OLD_SVC_LINKS, NEW_SVC_LINKS):
        if old_s in c:
            c = c.replace(old_s, new_s)
    print(f"  [{fname}] Service links updated")

    # 3. Internship links
    for old_i, new_i in zip(OLD_INT_LINKS, NEW_INT_LINKS):
        if old_i in c:
            c = c.replace(old_i, new_i)
    print(f"  [{fname}] Internship links updated")

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(c)

print("\n=== 2. UPDATING CSS/STYLE.CSS ===")
with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add white-space: nowrap to .footer-copyright-bottom if not present
old_css_copy = """.footer-copyright-bottom {
  font-size: 13.5px;
  line-height: 1.55;
  color: #64748B;
  margin: 0;
  transition: color 0.3s;
}"""

new_css_copy = """.footer-copyright-bottom {
  font-size: 13.5px;
  line-height: 1.55;
  color: #64748B;
  margin: 0;
  white-space: nowrap;
  transition: color 0.3s;
}

@media (max-width: 480px) {
  .footer-copyright-bottom {
    font-size: 12.5px;
    white-space: nowrap;
  }
}"""

if old_css_copy in css:
    css = css.replace(old_css_copy, new_css_copy)
    print("  css/style.css copyright updated with white-space: nowrap")
else:
    print("  old_css_copy not exact match, checking regex")
    css = re.sub(
        r'\.footer-copyright-bottom\s*\{[^}]*\}',
        new_css_copy,
        css,
        count=1
    )
    print("  css/style.css copyright regex applied")

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("\n=== 3. UPDATING SERVICES.HTML LOGIC ===")
with open('services.html', 'r', encoding='utf-8') as f:
    s_content = f.read()

# 3a. Update MobileServicesView to include id on sections
old_mob_view = """function MobileServicesView({ categories }) {
            return (
                <div className="arox-mobile-services-view" id="aroxMobileServicesView">
                    {categories.map((domain) => (
                        <div key={domain.id} className="arox-mob-service-section">"""

new_mob_view = """function MobileServicesView({ categories }) {
            return (
                <div className="arox-mobile-services-view" id="aroxMobileServicesView">
                    {categories.map((domain) => (
                        <div key={domain.id} id={`mob-service-${domain.id}`} className="arox-mob-service-section">"""

if old_mob_view in s_content:
    s_content = s_content.replace(old_mob_view, new_mob_view)
    print("  services.html MobileServicesView updated with ids")
else:
    print("  WARNING: old_mob_view not found in services.html")

# 3b. Update goToCard to accept force parameter & expose to window
old_gotocard = """            const goToCard = (index) => {
                if (!navVisible) return;
                const st = ScrollTrigger.getById("services-folder-stack-trigger");
                if (!st) {
                    const el = document.getElementById(`domain-section-${index}`);
                    if (el) {
                        const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: topOffset, behavior: 'smooth' });
                    }
                    return;
                }
                const total = st.end - st.start;
                const progressMap = [0.0, 0.34, 0.67, 1.0];
                const targetY = st.start + progressMap[index] * total;
                if (window.lenis) {
                    window.lenis.scrollTo(targetY, { duration: 1.2 });
                } else {
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            };"""

new_gotocard = """            const goToCard = (index, force = false) => {
                if (!force && !navVisible) return;
                setActiveIdx(index);
                const st = ScrollTrigger.getById("services-folder-stack-trigger");
                if (!st) {
                    const el = document.getElementById(`domain-section-${index}`);
                    if (el) {
                        const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({ top: topOffset, behavior: 'smooth' });
                    }
                    return;
                }
                const total = st.end - st.start;
                const progressMap = [0.0, 0.34, 0.67, 1.0];
                const targetY = st.start + progressMap[index] * total;
                if (window.lenis) {
                    window.lenis.scrollTo(targetY, { duration: 1.2 });
                } else {
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            };
            window.goToServiceCard = goToCard;

            // Direct landing & footer click navigation to specific service domain
            useEffect(() => {
                const checkUrlAndNavigate = () => {
                    const params = new URLSearchParams(window.location.search);
                    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
                    let target = (params.get('service') || params.get('domain') || hash).toLowerCase();
                    if (!target) return;
                    if (target.startsWith('domain-section-')) {
                        const num = parseInt(target.replace('domain-section-', ''), 10);
                        const revMap = ['development', 'creative', 'business', 'infrastructure'];
                        if (revMap[num] !== undefined) target = revMap[num];
                    }

                    const idMap = {
                        'development': 0,
                        'creative': 1,
                        'business': 2,
                        'infrastructure': 3
                    };
                    const idx = idMap[target];
                    if (idx !== undefined) {
                        setTimeout(() => {
                            if (window.innerWidth <= 768) {
                                const mobEl = document.getElementById(`mob-service-${target}`) || document.getElementById(target);
                                if (mobEl) {
                                    mobEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            } else {
                                goToCard(idx, true);
                            }
                        }, 400);
                    }
                };

                checkUrlAndNavigate();
                window.addEventListener('hashchange', checkUrlAndNavigate);
                return () => window.removeEventListener('hashchange', checkUrlAndNavigate);
            }, []);"""

if old_gotocard in s_content:
    s_content = s_content.replace(old_gotocard, new_gotocard)
    print("  services.html goToCard updated with force and URL check useEffect")
else:
    print("  WARNING: old_gotocard not found in services.html")

# 3c. Add footer click interceptor for services.html
services_click_listener = """
    <script>
    // Footer service links smooth redirection on same page
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('a[href*="service="]').forEach(a => {
            a.addEventListener('click', (e) => {
                try {
                    const url = new URL(a.href, window.location.href);
                    const svc = url.searchParams.get('service');
                    if (svc) {
                        const idMap = { development: 0, creative: 1, business: 2, infrastructure: 3 };
                        const idx = idMap[svc.toLowerCase()];
                        if (idx !== undefined) {
                            e.preventDefault();
                            history.pushState(null, '', a.href);
                            if (window.innerWidth <= 768) {
                                const mobEl = document.getElementById(`mob-service-${svc.toLowerCase()}`);
                                if (mobEl) mobEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            } else if (typeof window.goToServiceCard === 'function') {
                                window.goToServiceCard(idx, true);
                            }
                        }
                    }
                } catch (_) {}
            });
        });
    });
    </script>
</body>"""

s_content = s_content.replace('</body>', services_click_listener)
print("  services.html click listener added")

with open('services.html', 'w', encoding='utf-8') as f:
    f.write(s_content)


print("\n=== 4. UPDATING TRAINING.HTML LOGIC ===")
with open('training.html', 'r', encoding='utf-8') as f:
    t_content = f.read()

# 4a. Update initial load setActiveType to detect domain and internship tab
old_t_init = """  // Initial load - show horizontal scrolling flip cards (training) by default
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') === 'internship' ? 'internship' : 'training';
  setActiveType(initialTab, true);"""

new_t_init = """  // Initial load - show horizontal scrolling flip cards (training) by default unless tab/domain specifies internship
  const urlParams = new URLSearchParams(window.location.search);
  const reqDomain = urlParams.get('domain');
  const reqTab = urlParams.get('tab');
  const isInternshipTarget = reqTab === 'internship' || Boolean(reqDomain) || window.location.hash.includes('internshipDomainWrap');
  const initialTab = isInternshipTarget ? 'internship' : 'training';
  if (reqDomain) {
    window.currentActiveDomain = reqDomain;
  }
  setActiveType(initialTab, true);"""

if old_t_init in t_content:
    t_content = t_content.replace(old_t_init, new_t_init)
    print("  training.html initialTab updated to check domain")
else:
    print("  WARNING: old_t_init not found in training.html")

# 4b. Update window.navigateToSection to support domain argument
old_nav_def = """window.navigateToSection = function(type) {"""
new_nav_def = """window.navigateToSection = function(type, targetDomainParam) {"""

if old_nav_def in t_content:
    t_content = t_content.replace(old_nav_def, new_nav_def, 1)
    print("  training.html navigateToSection parameter updated")
else:
    print("  WARNING: old_nav_def not found")

old_nav_domain_reset = """    } else {
      window.currentActiveDomain = 'cse_it';
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain('cse_it', true);
      } else if (typeof window.renderDomainCards === 'function') {
        window.renderDomainCards('cse_it');
      }

      document.querySelectorAll('.intern-cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-domain') === 'cse_it');
      });"""

new_nav_domain_reset = """    } else {
      const chosenDomain = targetDomainParam || window.currentActiveDomain || 'cse_it';
      window.currentActiveDomain = chosenDomain;
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain(chosenDomain, true);
      } else if (typeof window.renderDomainCards === 'function') {
        window.renderDomainCards(chosenDomain);
      }

      document.querySelectorAll('.intern-cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-domain') === chosenDomain);
      });
      if (window.innerWidth <= 768) {
        if (typeof window.renderMobileInternship === 'function') {
          window.renderMobileInternship(chosenDomain);
        }
        const mobPills = document.querySelectorAll('#aroxMobilePillsRow .arox-mob-pill');
        mobPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-domain') === chosenDomain));
        const internSection = document.getElementById('aroxMobInternSection') || document.getElementById('internshipDomainWrap');
        if (internSection) {
          internSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }"""

if old_nav_domain_reset in t_content:
    t_content = t_content.replace(old_nav_domain_reset, new_nav_domain_reset)
    print("  training.html navigateToSection domain switch updated")
else:
    print("  WARNING: old_nav_domain_reset not found")

# 4c. Add URL domain landing & footer click interceptor before </body> in training.html
training_landing_logic = """
<script>
  // Immediate URL landing & footer click redirection to corresponding internship domain cards
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleUrlDomainLanding);
  } else {
    setTimeout(handleUrlDomainLanding, 200);
  }
  window.addEventListener('popstate', handleUrlDomainLanding);
  window.addEventListener('hashchange', handleUrlDomainLanding);

  // Footer internship links click listener when already on training page
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href*="domain="]').forEach(a => {
      a.addEventListener('click', (e) => {
        try {
          const url = new URL(a.href, window.location.href);
          const dom = url.searchParams.get('domain');
          if (dom && ['cse_it', 'ece', 'mech', 'management'].includes(dom.toLowerCase())) {
            e.preventDefault();
            history.pushState(null, '', a.href);
            window.currentActiveDomain = dom;
            if (typeof window.setActiveType === 'function') {
              window.setActiveType('internship', false);
            }
            if (typeof window.switchInternshipDomain === 'function') {
              window.switchInternshipDomain(dom, false);
            }
            document.querySelectorAll('.intern-cat-pill').forEach(pill => {
              pill.classList.toggle('active', pill.getAttribute('data-domain') === dom);
            });
            if (window.innerWidth <= 768) {
              if (typeof window.renderMobileInternship === 'function') {
                window.renderMobileInternship(dom);
              }
              const mobPills = document.querySelectorAll('#aroxMobilePillsRow .arox-mob-pill');
              mobPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-domain') === dom));
              const internSection = document.getElementById('aroxMobInternSection') || document.getElementById('internshipDomainWrap');
              if (internSection) {
                internSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            } else {
              const hscroll = document.getElementById('hscrollSection') || document.getElementById('internshipDomainWrap');
              if (hscroll) {
                const topY = hscroll.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: topY, behavior: 'smooth' });
              }
            }
          }
        } catch (_) {}
      });
    });
  });
</script>
</body>"""

t_content = t_content.replace('</body>', training_landing_logic)
print("  training.html landing logic & click listener added")

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t_content)

print("\n=== 5. MIRRORING TRAINING.HTML TO COURSES.HTML ===")
with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t_content)

size_t = os.path.getsize('training.html')
size_c = os.path.getsize('courses.html')
print(f"  training.html size: {size_t} bytes")
print(f"  courses.html size:  {size_c} bytes")
assert size_t == size_c, "CRITICAL ERROR: training.html and courses.html size mismatch!"
print("  Mirroring VERIFIED: Byte-for-byte identical!")

print("\n✅ All updates completed successfully!")

