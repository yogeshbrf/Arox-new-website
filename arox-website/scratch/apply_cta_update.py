import re

def update_css():
    css_files = ['css/style.css']
    if os.path.exists('arox-website/css/style.css'):
        css_files.append('arox-website/css/style.css')
        
    for fpath in css_files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Update Desktop .cta-section and .cta-card
        s1 = content.find('/* ─── PRE-FOOTER CTA SECTION & PROFESSIONAL CARDS ─── */')
        e1 = content.find('/* Dedicated CTA Card Background Image Wrapper & Elements */', s1)
        if s1 != -1 and e1 != -1:
            new_desktop_cta = """/* ─── PRE-FOOTER CTA SECTION & PROFESSIONAL CARDS ─── */
.cta-section {
  position: relative;
  width: 100% !important;
  max-width: 100% !important;
  padding: 4rem 1.5rem !important;
  margin: 0 !important;
  background: var(--background);
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  box-sizing: border-box;
}

.cta-card {
  position: relative;
  width: 100% !important;
  max-width: 1240px !important;
  margin: 0 auto !important;
  border-radius: 28px !important;
  padding: 0 !important;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 280px;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Dark Theme CTA Card */
.theme-dark .cta-card,
.theme-navy .cta-card,
[data-theme="dark"] .cta-card,
html.dark .cta-card,
body.theme-dark .cta-card {
  background-color: #000000 !important;
  background-image: url('../assets/CTC-d.png');
  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 102, 255, 0.15) !important;
}

.theme-dark .cta-card:hover,
.theme-navy .cta-card:hover,
[data-theme="dark"] .cta-card:hover {
  border-color: rgba(0, 210, 255, 0.45) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 180, 255, 0.25) !important;
  transform: translateY(-2px) !important;
}

/* Light Theme CTA Card */
.theme-light .cta-card,
[data-theme="light"] .cta-card,
html.theme-light .cta-card,
body.theme-light .cta-card,
html:not(.dark) .cta-card {
  background-color: #f8fafc;
  background-image: url('../assets/CTC-l.png');
  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
  border: 1px solid rgba(0, 102, 255, 0.18) !important;
  box-shadow: 0 16px 44px rgba(0, 102, 255, 0.08) !important;
}

.theme-light .cta-card:hover,
[data-theme="light"] .cta-card:hover {
  border-color: rgba(0, 102, 255, 0.4) !important;
  box-shadow: 0 20px 50px rgba(0, 102, 255, 0.14) !important;
  transform: translateY(-2px) !important;
}

"""
            content = content[:s1] + new_desktop_cta + content[e1:]

        # 2. Update .cta-content desktop padding & width
        content = re.sub(
            r'(\.cta-content\s*\{[^}]*?max-width:\s*)[^;]+;',
            r'\g<1>680px;',
            content,
            count=1
        )
        content = re.sub(
            r'(\.cta-content\s*\{[^}]*?padding:\s*)[^;]+;',
            r'\g<1>3.5rem 3.5rem;',
            content,
            count=1
        )

        # 3. Update Mobile (@media max-width: 768px)
        mobile_old = """.cta-section {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .cta-card {
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-height: 520px;
    border-left: none !important;
    border-right: none !important;
  }

  .cta-card-bg-wrapper {
    display: none !important;
  }

  .cta-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 4.5rem 1.5rem 3.5rem !important;
  }

  .cta-heading {
    font-size: 1.85rem;
  }

  .cta-text {
    font-size: 0.95rem;
    margin-bottom: 1.75rem;
  }

  .cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .cta-actions .btn-primary,
  .cta-actions .primary-btn,
  .cta-actions .btn-secondary,
  .cta-actions .secondary-btn {
    width: 100%;
  }"""

        mobile_new = """.cta-section {
    padding: 2rem 1.25rem 3rem !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .cta-card {
    padding: 0 !important;
    margin: 0 auto !important;
    border-radius: 22px !important;
    width: 100% !important;
    max-width: 440px !important;
    min-height: 320px !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    overflow: hidden !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
  }

  .theme-light .cta-card,
  [data-theme="light"] .cta-card,
  html.theme-light .cta-card,
  body.theme-light .cta-card,
  html:not(.dark) .cta-card {
    border: 1px solid rgba(0, 102, 255, 0.16) !important;
    box-shadow: 0 10px 30px rgba(0, 102, 255, 0.08) !important;
  }

  .cta-card-bg-wrapper {
    display: none !important;
  }

  .cta-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 2.2rem 1.4rem 2rem !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
  }

  .cta-heading {
    font-size: 1.45rem !important;
    line-height: 1.22 !important;
    margin-bottom: 0.65rem !important;
    text-align: center !important;
  }

  .cta-text {
    font-size: 0.88rem !important;
    line-height: 1.5 !important;
    margin-bottom: 1.35rem !important;
    max-width: 320px !important;
    text-align: center !important;
  }

  .cta-actions {
    flex-direction: column !important;
    width: 100% !important;
    max-width: 240px !important;
    margin: 0 auto !important;
    gap: 10px !important;
    align-items: center !important;
  }

  .cta-actions a,
  .cta-actions button,
  .cta-actions .btn-primary,
  .cta-actions .primary-btn,
  .cta-actions .btn-secondary,
  .cta-actions .secondary-btn {
    width: 100% !important;
    justify-content: center !important;
    padding: 12px 20px !important;
    font-size: 0.9rem !important;
    border-radius: 9999px !important;
  }"""

        if mobile_old in content:
            content = content.replace(mobile_old, mobile_new)
            print(f"Replaced mobile CTA rules in {fpath}")
        else:
            print(f"Warning: mobile_old block not matched directly in {fpath}")

        # Occurrence 3 cleanup
        occ3_old = """.cta-section {
    padding: 3.5rem 1.25rem;
  }

  .cta-card {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
    text-align: center;
  }"""
        occ3_new = """.cta-section {
    padding: 2rem 1.25rem 3rem !important;
  }

  .cta-card {
    padding: 0 !important;
    border-radius: 22px !important;
    min-height: 320px !important;
    max-width: 440px !important;
  }"""
        if occ3_old in content:
            content = content.replace(occ3_old, occ3_new)
            print(f"Replaced occurrence 3 in {fpath}")

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fpath} successfully!")

import os
update_css()

