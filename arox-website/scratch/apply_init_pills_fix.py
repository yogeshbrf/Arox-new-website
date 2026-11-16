with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

target = """    // Initialize category pills and default cards
    initCategoryPills();
    renderDomainCards(window.currentActiveDomain || 'cse_it');
    if (typeof window.renderMobileInternshipRows === 'function') {
      window.renderMobileInternshipRows(window.currentActiveDomain || 'cse_it');
    }"""

replacement = """    // Initialize category pills and default cards
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

assert target in t, "Target not found in training.html"
t = t.replace(target, replacement)

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("✅ Successfully updated line 9382 and mirrored to courses.html")

