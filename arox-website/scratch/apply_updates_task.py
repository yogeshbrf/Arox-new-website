import re

# 1. Update training.html and courses.html
def update_training_and_courses(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # A. Update renderMobileInternship click handler
    old_card_click = """        card.addEventListener('click', () => {
          window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=internship`;
        });"""

    new_card_click = """        const exploreBtn = card.querySelector('.arox-intern-explore-btn');
        if (exploreBtn) {
          exploreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof window.openInternshipModal === 'function') {
              window.openInternshipModal(item);
            } else if (typeof openModal === 'function') {
              openModal(item);
            }
          });
        }

        card.addEventListener('click', () => {
          if (typeof window.openInternshipModal === 'function') {
            window.openInternshipModal(item);
          } else if (typeof openModal === 'function') {
            openModal(item);
          }
        });"""

    if old_card_click in content:
        content = content.replace(old_card_click, new_card_click)
        print(f'[{filepath}] Replaced mobile internship click handler with openInternshipModal!')
    else:
        print(f'[{filepath}] Warning: old_card_click not found directly, checking...')

    # B. Ensure openModal resolves string item if string passed
    old_open_modal_start = """    window.openInternshipModal = openModal;
    function openModal(item) {
      currentInternship = item;"""

    new_open_modal_start = """    window.openInternshipModal = openModal;
    function openModal(item) {
      if (typeof item === 'string') {
        let found = null;
        if (window.DOMAIN_COURSES) {
          for (const d in window.DOMAIN_COURSES) {
            found = window.DOMAIN_COURSES[d].find(c => c.id === item || c.title.toLowerCase() === item.toLowerCase());
            if (found) break;
          }
        }
        if (found) item = found;
      }
      currentInternship = item;"""

    if old_open_modal_start in content:
        content = content.replace(old_open_modal_start, new_open_modal_start)
        print(f'[{filepath}] Updated openModal string resolution!')
    else:
        print(f'[{filepath}] Warning: old_open_modal_start not found directly!')

    # C. Add mobile modal styling enhancements & autofill background removal CSS
    autofill_and_modal_css = """
    /* ============================================================
       PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND (INPUT FIELDS)
    ============================================================ */
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: inherit !important;
      transition: background-color 999999s ease-in-out 0s, color 999999s ease-in-out 0s !important;
      background-color: transparent !important;
    }

    html.dark input:-webkit-autofill,
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
    }

    /* Modal Responsive Layout Enhancements on Mobile Screens */
    @media (max-width: 768px) {
      .modal-backdrop {
        padding: 10px !important;
        align-items: center !important;
      }
      .modal-window {
        width: 100% !important;
        max-width: 100% !important;
        max-height: calc(100vh - 20px) !important;
        border-radius: 20px !important;
        margin: auto !important;
      }
      .modal-right-panel {
        width: 100% !important;
        padding: 24px 18px !important;
        max-height: calc(100vh - 20px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      #modal-right-title-text {
        font-size: 1.35rem !important;
        padding-right: 36px !important;
        line-height: 1.2 !important;
      }
      #modal-learn-list {
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }
      .modal-cta-row {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
      }
      .modal-apply-trigger-btn,
      .modal-syllabus-download-btn {
        width: 100% !important;
        justify-content: center !important;
        padding: 13px 20px !important;
      }
    }
"""

    marker_css = "/* Modal Responsive */"
    if "/* PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND */" not in content:
        if marker_css in content:
            content = content.replace(marker_css, autofill_and_modal_css + "\n    " + marker_css)
            print(f'[{filepath}] Injected autofill and mobile modal CSS!')
        else:
            print(f'[{filepath}] Warning: marker_css not found!')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{filepath}] Saved successfully!')

update_training_and_courses('training.html')
update_training_and_courses('courses.html')

# 2. Update login.html with Autofill Removal CSS
with open('login.html', 'r', encoding='utf-8') as f:
    login_content = f.read()

login_autofill_css = """    /* ============================================================
       PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND ON INPUT PILLS
    ============================================================ */
    .input-pill-field:-webkit-autofill,
    .input-pill-field:-webkit-autofill:hover, 
    .input-pill-field:-webkit-autofill:focus, 
    .input-pill-field:-webkit-autofill:active {
      -webkit-text-fill-color: #1E293B !important;
      -webkit-box-shadow: 0 0 0 1000px #F0F4FA inset !important;
      box-shadow: 0 0 0 1000px #F0F4FA inset !important;
      transition: background-color 999999s ease-in-out 0s, color 999999s ease-in-out 0s !important;
      border-radius: 9999px !important;
      background-color: transparent !important;
    }

    .input-pill-wrapper:focus-within .input-pill-field:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #FFFFFF inset !important;
      box-shadow: 0 0 0 1000px #FFFFFF inset !important;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: inherit !important;
      transition: background-color 999999s ease-in-out 0s !important;
      background-color: transparent !important;
    }
"""

if "PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND" not in login_content:
    login_marker = "/* Password Eye Button */"
    login_content = login_content.replace(login_marker, login_autofill_css + "\n    " + login_marker)
    with open('login.html', 'w', encoding='utf-8') as f:
        f.write(login_content)
    print('[login.html] Injected autofill removal CSS successfully!')

# 3. Update apply.html and contact.html
for fn in ['apply.html', 'contact.html']:
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    if "PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND" not in c:
        generic_autofill_css = """
<style>
/* PREVENT / REMOVE BROWSER AUTOFILL BACKGROUND */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
  box-shadow: 0 0 0 1000px transparent inset !important;
  -webkit-text-fill-color: inherit !important;
  transition: background-color 999999s ease-in-out 0s !important;
  background-color: transparent !important;
}
</style>
"""
        c = c.replace('</head>', generic_autofill_css + '\n</head>')
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'[{fn}] Injected autofill removal CSS successfully!')

