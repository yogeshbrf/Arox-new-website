with open(r'd:\Downloads\Arox new website\arox-website\scratch\build_exact_training_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update CSS in updated_mobile_css to strongly hide .scroll-hint
scroll_hint_css = """
      /* STRICTLY HIDE SCROLL HINT ON MOBILE */
      .scroll-hint,
      .hscroll-section .scroll-hint,
      .hscroll-section.is-training-view .scroll-hint,
      .hscroll-section.is-internship-view .scroll-hint {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
"""

if 'STRICTLY HIDE SCROLL HINT ON MOBILE' not in text:
    target = "@media (max-width: 768px) {"
    text = text.replace(target, target + scroll_hint_css, 1)

# 2. Update JS in updated_mobile_js to navigate properly
old_train_click = """      card.addEventListener('click', () => {
        openModal(fullCourse);
      });"""

new_train_click = """      card.addEventListener('click', () => {
        window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=training`;
      });
      const exploreBtn = card.querySelector('.arox-train-explore-btn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=training`;
        });
      }"""

old_intern_click = """        card.addEventListener('click', () => {
          openModal(item);
        });"""

new_intern_click = """        card.addEventListener('click', () => {
          window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=internship`;
        });"""

text = text.replace(old_train_click, new_train_click)
text = text.replace(old_intern_click, new_intern_click)

# Also ensure scrollHint hidden in initAroxMobileCourses
hide_hint_js = """    // Hide scroll hint on mobile
    const scrollHintEl = document.querySelector('.scroll-hint');
    if (scrollHintEl) {
      scrollHintEl.style.setProperty('display', 'none', 'important');
      scrollHintEl.style.setProperty('opacity', '0', 'important');
      scrollHintEl.style.setProperty('visibility', 'hidden', 'important');
    }
"""

if '// Hide scroll hint on mobile' not in text:
    idx_init = text.find('if (!trainTrack || !internTrack) return;')
    if idx_init != -1:
        text = text[:idx_init + len('if (!trainTrack || !internTrack) return;')] + "\n" + hide_hint_js + text[idx_init + len('if (!trainTrack || !internTrack) return;'):]

with open(r'd:\Downloads\Arox new website\arox-website\scratch\build_exact_training_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("build_exact_training_cards.py updated with proper navigation and hidden scroll-hint!")

