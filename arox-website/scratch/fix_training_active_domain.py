with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

# 1. Fix line 7383 hardcoded 'cse_it' in setActiveType
old_set_active = """      // Requirement: Immediately show initial internship card (CSE & IT domain)
      window.currentActiveDomain = 'cse_it';
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain('cse_it', true);
      } else if (typeof window.renderDomainCards === 'function') {
        window.renderDomainCards('cse_it');
      }"""

new_set_active = """      // Immediately show requested domain or default (CSE & IT domain)
      const targetDom = window.currentActiveDomain || (new URLSearchParams(window.location.search)).get('domain') || 'cse_it';
      window.currentActiveDomain = targetDom;
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain(targetDom, true);
      } else if (typeof window.renderDomainCards === 'function') {
        window.renderDomainCards(targetDom);
      }"""

if old_set_active in t:
    t = t.replace(old_set_active, new_set_active)
    print("✅ Fixed setActiveType domain reset")
else:
    print("❌ old_set_active not found")

# 2. Fix line 7103 hardcoded in beginSectionScrollBarrier
old_barrier_dom = """      if (window.currentActiveDomain !== 'cse_it' && typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain('cse_it', true);
      }"""

new_barrier_dom = """      const targetDom = window.currentActiveDomain || (new URLSearchParams(window.location.search)).get('domain') || 'cse_it';
      if (typeof window.switchInternshipDomain === 'function') {
        window.switchInternshipDomain(targetDom, true);
      }"""

if old_barrier_dom in t:
    t = t.replace(old_barrier_dom, new_barrier_dom)
    print("✅ Fixed beginSectionScrollBarrier domain reset")
else:
    print("❌ old_barrier_dom not found")

# 3. Fix line 10574 in mobile courses init
old_mob_init = """    renderMobileInternship('cse_it');
  }"""

new_mob_init = """    const initialMobDom = window.currentActiveDomain || (new URLSearchParams(window.location.search)).get('domain') || 'cse_it';
    if (pillsRow) {
      const pillBtns = pillsRow.querySelectorAll('.arox-mob-pill');
      pillBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-domain') === initialMobDom);
      });
    }
    renderMobileInternship(initialMobDom);
  }"""

if old_mob_init in t:
    t = t.replace(old_mob_init, new_mob_init)
    print("✅ Fixed mobile init domain reset")
else:
    print("❌ old_mob_init not found")

# Save training.html
with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

# Mirror to courses.html
with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("✅ training.html mirrored to courses.html successfully")

