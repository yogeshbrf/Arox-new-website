with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

# 1. Update line 9380 in training.html
old_init_pills = """       // Initialize category pills and default cards
       initCategoryPills();
       renderDomainCards(window.currentActiveDomain || 'cse_it');
       if (typeof window.renderMobileInternshipRows === 'function') {
         window.renderMobileInternshipRows(window.currentActiveDomain || 'cse_it');
       }"""

new_init_pills = """       // Initialize category pills and default cards
       initCategoryPills();
       const initDom = window.currentActiveDomain || (new URLSearchParams(window.location.search)).get('domain') || 'cse_it';
       window.currentActiveDomain = initDom;
       document.querySelectorAll('.intern-cat-pill').forEach(pill => {
         pill.classList.toggle('active', pill.getAttribute('data-domain') === initDom);
       });
       renderDomainCards(initDom);
       if (typeof window.renderMobileInternshipRows === 'function') {
         window.renderMobileInternshipRows(initDom);
       }"""

if old_init_pills in t:
    t = t.replace(old_init_pills, new_init_pills)
    print("✅ Line 9380 updated to sync active pill with currentActiveDomain")
else:
    print("❌ old_init_pills not found")

# 2. Update switchInternshipDomain to always sync pill class
old_switch_dom = """    window.switchInternshipDomain = function(domainKey, fromScroll = false) {
      const track = document.getElementById('domainCardsTrack');
      const needsRender = !track || track.children.length === 0;
      if (domainKey === window.currentActiveDomain && !fromScroll && !needsRender) return;
      window.currentActiveDomain = domainKey;

      const pills = document.querySelectorAll('.intern-cat-pill');
      pills.forEach(pill => {
        if (pill.getAttribute('data-domain') === domainKey) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });"""

new_switch_dom = """    window.switchInternshipDomain = function(domainKey, fromScroll = false) {
      const track = document.getElementById('domainCardsTrack');
      const needsRender = !track || track.children.length === 0;

      // Always sync pills
      const pills = document.querySelectorAll('.intern-cat-pill');
      pills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-domain') === domainKey);
      });

      if (domainKey === window.currentActiveDomain && !fromScroll && !needsRender) return;
      window.currentActiveDomain = domainKey;"""

if old_switch_dom in t:
    t = t.replace(old_switch_dom, new_switch_dom)
    print("✅ switchInternshipDomain updated to always sync pills")
else:
    print("❌ old_switch_dom not found")

# Save training.html
with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

# Mirror to courses.html
with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("✅ Mirroring to courses.html complete")

