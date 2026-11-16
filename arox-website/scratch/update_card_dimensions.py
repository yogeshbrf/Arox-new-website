import re

updated_mobile_css = """
    /* ============================================================
       MOBILE VIEW: BALANCED TRAINING & INTERNSHIP CARDS
    ============================================================ */
    .arox-mobile-courses-view {
      display: none;
    }

    @media (max-width: 768px) {
      /* Hide desktop elements on mobile */
      .courses-pill-nav-container,
      #hscrollTrack,
      #internshipDomainWrap,
      .mobile-internship-stage,
      .scroll-hint {
        display: none !important;
      }

      /* Unpin and naturalize courses section on mobile */
      #hscrollSection,
      .hscroll-section,
      .hscroll-section.is-training-view,
      .hscroll-section.is-internship-view {
        height: auto !important;
        min-height: auto !important;
        max-height: none !important;
        overflow: visible !important;
        padding: 30px 16px 42px 16px !important;
        display: block !important;
        transition: background-color 0.3s ease !important;
      }

      /* DARK THEME: Container */
      html.dark #hscrollSection,
      html.theme-dark #hscrollSection,
      body.theme-dark #hscrollSection,
      [data-theme="dark"] #hscrollSection {
        background: #060B14 !important;
      }

      /* LIGHT THEME: Container */
      html.theme-light #hscrollSection,
      html:not(.dark) #hscrollSection,
      body.theme-light #hscrollSection,
      [data-theme="light"] #hscrollSection {
        background: #F4F8FD !important;
      }

      /* Mobile View Display */
      .arox-mobile-courses-view {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }

      .arox-mob-section {
        width: 100% !important;
        margin-bottom: 34px !important;
      }
      .arox-mob-section:last-child {
        margin-bottom: 0 !important;
      }

      /* HEADINGS & SUBTITLES */
      .arox-mob-heading {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: clamp(24px, 6vw, 29px) !important;
        font-weight: 800 !important;
        letter-spacing: -0.015em !important;
        margin: 0 0 4px 0 !important;
        line-height: 1.15 !important;
        transition: color 0.3s ease !important;
      }

      .arox-mob-sub {
        font-family: var(--font-sans, 'Montserrat', sans-serif) !important;
        font-size: 13px !important;
        font-weight: 400 !important;
        margin: 0 0 14px 0 !important;
        line-height: 1.4 !important;
        transition: color 0.3s ease !important;
      }

      /* Heading colors: DARK */
      html.dark .arox-mob-heading,
      html.theme-dark .arox-mob-heading,
      body.theme-dark .arox-mob-heading {
        color: #FFFFFF !important;
      }
      html.dark .arox-mob-sub,
      html.theme-dark .arox-mob-sub,
      body.theme-dark .arox-mob-sub {
        color: #94A3B8 !important;
      }

      /* Heading colors: LIGHT */
      html.theme-light .arox-mob-heading,
      html:not(.dark) .arox-mob-heading,
      body.theme-light .arox-mob-heading {
        color: #0A1629 !important;
      }
      html.theme-light .arox-mob-sub,
      html:not(.dark) .arox-mob-sub,
      body.theme-light .arox-mob-sub {
        color: #475569 !important;
      }

      /* HORIZONTAL SCROLL TRACKS */
      .arox-mob-scroll-track {
        display: flex !important;
        gap: 14px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 4px 2px 18px 2px !important;
        margin: 0 -16px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
      }
      .arox-mob-scroll-track::-webkit-scrollbar {
        display: none !important;
      }

      /* ============================================================
         1. REDUCED TRAINING CARDS (228px x 358px)
      ============================================================ */
      .arox-exact-train-card {
        width: 228px !important;
        min-width: 228px !important;
        height: 358px !important;
        position: relative !important;
        border-radius: 24px !important;
        overflow: hidden !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 18px 16px 16px 16px !important;
        box-sizing: border-box !important;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
      }

      .arox-exact-train-card:active {
        transform: scale(0.98) !important;
      }

      /* Training Card: LIGHT THEME */
      html.theme-light .arox-exact-train-card,
      html:not(.dark) .arox-exact-train-card,
      body.theme-light .arox-exact-train-card {
        background: #FFFFFF !important;
        border: 1px solid rgba(226, 232, 240, 0.95) !important;
        box-shadow: 0 10px 28px rgba(0, 102, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
      }

      /* Training Card: DARK THEME */
      html.dark .arox-exact-train-card,
      html.theme-dark .arox-exact-train-card,
      body.theme-dark .arox-exact-train-card {
        background: #0E1726 !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
      }

      /* Decorative Background Wave Art */
      .arox-train-deco-bg {
        position: absolute !important;
        right: -6px !important;
        bottom: -6px !important;
        width: 140px !important;
        height: 140px !important;
        pointer-events: none !important;
        z-index: 1 !important;
        opacity: 0.9 !important;
      }
      .arox-train-deco-bg img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
      }
      html.dark .arox-train-deco-bg {
        opacity: 0.35 !important;
      }

      /* Card Content wrapper */
      .arox-train-content-top {
        position: relative !important;
        z-index: 2 !important;
        display: flex !important;
        flex-direction: column !important;
      }

      /* Header Row: Blue Number Box (left) + Category Badge (right) */
      .arox-train-header-row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        margin-bottom: 12px !important;
      }

      /* Solid Blue Rounded Number Box: '01', '02', '03'... */
      .arox-train-num-box {
        background: #0066FF !important;
        color: #FFFFFF !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 10px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        letter-spacing: 0.02em !important;
        box-shadow: 0 3px 12px rgba(0, 102, 255, 0.35) !important;
      }

      /* Category Badge: 'DEV', 'DESIGN', 'DATA', 'SECURITY'... */
      .arox-train-cat-badge {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 9.5px !important;
        font-weight: 700 !important;
        letter-spacing: 0.08em !important;
        padding: 4px 10px !important;
        border-radius: 9999px !important;
        text-transform: uppercase !important;
      }
      html.theme-light .arox-train-cat-badge,
      html:not(.dark) .arox-train-cat-badge {
        background: rgba(0, 102, 255, 0.06) !important;
        border: 1px solid rgba(0, 102, 255, 0.18) !important;
        color: #0066FF !important;
      }
      html.dark .arox-train-cat-badge,
      html.theme-dark .arox-train-cat-badge {
        background: rgba(0, 210, 255, 0.12) !important;
        border: 1px solid rgba(0, 210, 255, 0.25) !important;
        color: #00D2FF !important;
      }

      /* Card Title */
      .arox-train-title {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 16px !important;
        font-weight: 800 !important;
        line-height: 1.22 !important;
        margin: 0 0 6px 0 !important;
        letter-spacing: -0.01em !important;
      }
      html.theme-light .arox-train-title,
      html:not(.dark) .arox-train-title {
        color: #0B1426 !important;
      }
      html.dark .arox-train-title,
      html.theme-dark .arox-train-title {
        color: #FFFFFF !important;
      }

      /* Card Description */
      .arox-train-desc {
        font-family: var(--font-sans, 'Montserrat', sans-serif) !important;
        font-size: 11.5px !important;
        line-height: 1.42 !important;
        margin: 0 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
      }
      html.theme-light .arox-train-desc,
      html:not(.dark) .arox-train-desc {
        color: #475569 !important;
      }
      html.dark .arox-train-desc,
      html.theme-dark .arox-train-desc {
        color: #94A3B8 !important;
      }

      /* Centered 3D Course Graphic Area */
      .arox-train-graphic-box {
        position: relative !important;
        z-index: 2 !important;
        width: 100% !important;
        height: 105px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 4px 0 10px 0 !important;
        pointer-events: none !important;
      }
      .arox-train-graphic-img {
        max-width: 105px !important;
        max-height: 98px !important;
        object-fit: contain !important;
        display: block !important;
        transition: transform 0.3s ease !important;
      }
      html.theme-light .arox-train-graphic-img,
      html:not(.dark) .arox-train-graphic-img {
        filter: drop-shadow(0 10px 18px rgba(0, 80, 220, 0.2)) !important;
      }
      html.dark .arox-train-graphic-img,
      html.theme-dark .arox-train-graphic-img {
        filter: drop-shadow(0 12px 22px rgba(0, 180, 255, 0.28)) !important;
      }

      .arox-exact-train-card:hover .arox-train-graphic-img {
        transform: translateY(-2px) scale(1.05) !important;
      }

      /* Bottom 'Explore Course →' Pill Button */
      .arox-train-explore-btn {
        position: relative !important;
        z-index: 3 !important;
        align-self: flex-start !important;
        background: #0066FF !important;
        color: #FFFFFF !important;
        padding: 8px 18px !important;
        border-radius: 9999px !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        border: none !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.32) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
      }
      .arox-train-explore-btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 16px rgba(0, 102, 255, 0.42) !important;
      }

      /* ============================================================
         2. INCREASED INTERNSHIP CARDS (196px x 212px)
      ============================================================ */
      .arox-mob-pills-row {
        display: flex !important;
        gap: 9px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 3px 2px 14px 2px !important;
        margin: 0 -16px 4px -16px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
      }
      .arox-mob-pills-row::-webkit-scrollbar {
        display: none !important;
      }

      .arox-mob-pill {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 8px 18px !important;
        border-radius: 9999px !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        letter-spacing: 0.04em !important;
        white-space: nowrap !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
        flex-shrink: 0 !important;
      }

      /* Pills: DARK */
      html.dark .arox-mob-pill,
      html.theme-dark .arox-mob-pill,
      body.theme-dark .arox-mob-pill {
        background: #0E1626 !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #8E9BAE !important;
      }
      html.dark .arox-mob-pill.active,
      html.theme-dark .arox-mob-pill.active,
      body.theme-dark .arox-mob-pill.active {
        background: #081B2B !important;
        border: 1.5px solid #00D2FF !important;
        color: #00D2FF !important;
        box-shadow: 0 0 14px rgba(0, 210, 255, 0.42) !important;
      }

      /* Pills: LIGHT */
      html.theme-light .arox-mob-pill,
      html:not(.dark) .arox-mob-pill,
      body.theme-light .arox-mob-pill {
        background: #FFFFFF !important;
        border: 1px solid #D1D9E6 !important;
        color: #475569 !important;
        box-shadow: 0 2px 6px rgba(0, 102, 255, 0.06) !important;
      }
      html.theme-light .arox-mob-pill.active,
      html:not(.dark) .arox-mob-pill.active,
      body.theme-light .arox-mob-pill.active {
        background: #0066FF !important;
        border: 1.5px solid #0066FF !important;
        color: #FFFFFF !important;
        box-shadow: 0 4px 14px rgba(0, 102, 255, 0.35) !important;
      }

      /* Internship Cards: Increased to 196px x 212px */
      .arox-mob-card-intern {
        width: 196px !important;
        min-width: 196px !important;
        height: 212px !important;
        position: relative !important;
        border-radius: 22px !important;
        overflow: hidden !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 16px 14px 12px 14px !important;
        box-sizing: border-box !important;
        transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease !important;
      }
      .arox-mob-card-intern:active {
        transform: scale(0.97) !important;
      }

      /* Internship Card: DARK */
      html.dark .arox-mob-card-intern,
      html.theme-dark .arox-mob-card-intern,
      body.theme-dark .arox-mob-card-intern {
        background: linear-gradient(145deg, #0D1629 0%, #060B14 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.5) !important;
      }

      /* Internship Card: LIGHT */
      html.theme-light .arox-mob-card-intern,
      html:not(.dark) .arox-mob-card-intern,
      body.theme-light .arox-mob-card-intern {
        background: linear-gradient(145deg, #FFFFFF 0%, #F5F9FE 100%) !important;
        border: 1px solid rgba(210, 225, 245, 0.95) !important;
        box-shadow: 0 8px 24px rgba(0, 102, 255, 0.08) !important;
      }

      .arox-intern-top-text {
        display: flex !important;
        flex-direction: column !important;
        line-height: 1.05 !important;
        pointer-events: none !important;
        z-index: 2 !important;
      }

      .arox-intern-l1 {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 17.5px !important;
        font-weight: 800 !important;
        letter-spacing: -0.01em !important;
        margin: 0 !important;
      }
      .arox-intern-l2 {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 17.5px !important;
        font-weight: 800 !important;
        letter-spacing: -0.01em !important;
        margin: 0 !important;
      }

      /* Internship Text: DARK */
      html.dark .arox-intern-l1,
      html.theme-dark .arox-intern-l1 {
        color: #FFFFFF !important;
      }
      html.dark .arox-intern-l2,
      html.theme-dark .arox-intern-l2 {
        color: #00D2FF !important;
      }

      /* Internship Text: LIGHT */
      html.theme-light .arox-intern-l1,
      html:not(.dark) .arox-intern-l1 {
        color: #0A1629 !important;
      }
      html.theme-light .arox-intern-l2,
      html:not(.dark) .arox-intern-l2 {
        color: #0066FF !important;
      }

      .arox-intern-img-box {
        width: 100% !important;
        height: 114px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-top: 6px !important;
        position: relative !important;
        pointer-events: none !important;
      }
      .arox-intern-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        object-position: center bottom !important;
        display: block !important;
        transition: transform 0.3s ease !important;
      }
      html.dark .arox-intern-img,
      html.theme-dark .arox-intern-img {
        filter: drop-shadow(0 8px 18px rgba(0, 180, 255, 0.24)) !important;
      }
      html.theme-light .arox-intern-img,
      html:not(.dark) .arox-intern-img {
        filter: drop-shadow(0 8px 16px rgba(0, 70, 200, 0.16)) !important;
      }
    }
"""

with open(r'd:\Downloads\Arox new website\arox-website\scratch\build_exact_training_cards.py', 'r', encoding='utf-8') as f:
    orig = f.read()

# Replace updated_mobile_css block
pattern = r'updated_mobile_css\s*=\s*"""[\s\S]*?"""'
new_content = re.sub(pattern, f'updated_mobile_css = """{updated_mobile_css}"""', orig)

with open(r'd:\Downloads\Arox new website\arox-website\scratch\build_exact_training_cards.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("build_exact_training_cards.py updated with balanced card dimensions!")

