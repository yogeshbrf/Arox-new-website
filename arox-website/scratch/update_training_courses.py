import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Domain Pills CSS
    old_pills_css = """.arox-mob-pills-row {
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
      }"""

    new_pills_css = """.arox-mob-pills-row {
        display: flex !important;
        gap: 6px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 4px 16px 12px 16px !important;
        margin: 0 -16px 4px -16px !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
        justify-content: flex-start !important;
      }
      .arox-mob-pills-row::-webkit-scrollbar {
        display: none !important;
      }

      .arox-mob-pill {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 5px 12px !important;
        height: 30px !important;
        border-radius: 9999px !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: 0.03em !important;
        white-space: nowrap !important;
        cursor: pointer !important;
        transition: all 0.25s ease !important;
        flex-shrink: 0 !important;
      }"""

    if old_pills_css in content:
        content = content.replace(old_pills_css, new_pills_css)
        print(f'[{filepath}] Replaced pills CSS successfully!')
    else:
        print(f'[{filepath}] Warning: old_pills_css not found directly, checking regex...')
        # Use regex to replace .arox-mob-pills-row and .arox-mob-pill
        pattern = r'\.arox-mob-pills-row\s*\{[^}]+\}\s*\.arox-mob-pills-row::-webkit-scrollbar\s*\{[^}]+\}\s*\.arox-mob-pill\s*\{[^}]+\}'
        content = re.sub(pattern, new_pills_css, content, count=1)

    # 2. Add Mobile Flip Card CSS before /* Header Row: Blue Number Box */
    target_marker = "/* Header Row: Blue Number Box (left) + Category Badge (right) */"
    
    mobile_flip_css = """
      /* ─────────────────────────────────────────────────────────────
         3D FLIP CARDS ON MOBILE VIEW
         Flips to show back details on card click, matching desktop!
      ───────────────────────────────────────────────────────────── */
      .arox-mobile-flip-card {
        width: 228px !important;
        min-width: 228px !important;
        height: 358px !important;
        perspective: 1000px !important;
        position: relative !important;
        border-radius: 24px !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      .arox-mobile-flip-inner {
        width: 100% !important;
        height: 100% !important;
        position: relative !important;
        transform-style: preserve-3d !important;
        transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1) !important;
        border-radius: 24px !important;
      }

      .arox-mobile-flip-card.flipped .arox-mobile-flip-inner {
        transform: rotateY(180deg) !important;
      }

      .arox-mobile-card-face {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        border-radius: 24px !important;
        overflow: hidden !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
        box-sizing: border-box !important;
      }

      /* Front Face */
      .arox-mobile-card-front {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 18px 16px 16px 16px !important;
        z-index: 2 !important;
        transform: rotateY(0deg) !important;
      }

      /* Back Face */
      .arox-mobile-card-back {
        transform: rotateY(180deg) !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 16px 14px 14px 14px !important;
        z-index: 1 !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }

      /* Front & Back Backgrounds: LIGHT */
      html.theme-light .arox-mobile-card-front,
      html:not(.dark) .arox-mobile-card-front,
      body.theme-light .arox-mobile-card-front,
      html.theme-light .arox-mobile-card-back,
      html:not(.dark) .arox-mobile-card-back,
      body.theme-light .arox-mobile-card-back {
        background: #FFFFFF !important;
        border: 1px solid rgba(226, 232, 240, 0.95) !important;
        box-shadow: 0 10px 28px rgba(0, 102, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
      }

      /* Front & Back Backgrounds: DARK */
      html.dark .arox-mobile-card-front,
      html.theme-dark .arox-mobile-card-front,
      body.theme-dark .arox-mobile-card-front,
      html.dark .arox-mobile-card-back,
      html.theme-dark .arox-mobile-card-back,
      body.theme-dark .arox-mobile-card-back {
        background: #0E1726 !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
      }

      /* Back Content Details */
      .arox-mob-back-header {
        text-align: center !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.12em !important;
        text-transform: uppercase !important;
        color: var(--heading, #0F172A) !important;
        padding-bottom: 8px !important;
        border-bottom: 1px solid rgba(0, 102, 255, 0.12) !important;
        margin-bottom: 10px !important;
      }
      html.dark .arox-mob-back-header,
      html.theme-dark .arox-mob-back-header,
      body.theme-dark .arox-mob-back-header {
        color: #F8FAFC !important;
        border-bottom-color: rgba(255, 255, 255, 0.1) !important;
      }

      .arox-mob-learn-list {
        list-style: disc !important;
        padding-left: 18px !important;
        margin: 0 0 10px 0 !important;
      }
      .arox-mob-learn-list li {
        font-size: 0.74rem !important;
        line-height: 1.35 !important;
        color: var(--body, #475569) !important;
        margin-bottom: 5px !important;
      }
      html.dark .arox-mob-learn-list li,
      html.theme-dark .arox-mob-learn-list li,
      body.theme-dark .arox-mob-learn-list li {
        color: #CBD5E1 !important;
      }

      .arox-mob-tech-divider {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        margin: 6px 0 8px 0 !important;
      }
      .arox-mob-tech-divider div {
        flex: 1 !important;
        height: 1px !important;
        background: rgba(0, 102, 255, 0.15) !important;
      }
      html.dark .arox-mob-tech-divider div {
        background: rgba(255, 255, 255, 0.12) !important;
      }
      .arox-mob-tech-divider span {
        font-size: 0.62rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.1em !important;
        text-transform: uppercase !important;
        color: #0078FF !important;
      }

      .arox-mob-tech-icons {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        justify-content: center !important;
        align-items: center !important;
        margin-bottom: 10px !important;
      }
      .arox-mob-tech-icon-item {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 3px !important;
      }
      .arox-mob-tech-icon-item img,
      .arox-mob-tech-icon-item svg {
        width: 22px !important;
        height: 22px !important;
        display: block !important;
      }
      .arox-mob-tech-icon-item span {
        font-size: 0.58rem !important;
        font-weight: 700 !important;
        color: var(--muted, #64748B) !important;
        text-transform: uppercase !important;
      }

      """
    if "/* 3D FLIP CARDS ON MOBILE VIEW */" not in content:
        content = content.replace(target_marker, mobile_flip_css + target_marker)
        print(f'[{filepath}] Injected mobile flip CSS successfully!')

    # 3. Replace the trainingList.forEach rendering loop inside initAroxMobileCourses
    old_loop_marker = """    trainTrack.innerHTML = '';
    trainingList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'arox-exact-train-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.title} training course`);

      const fullCourse = findCourseItemById(item.id) || {
        id: item.id,
        number: item.num,
        badge: item.badge,
        title: item.title,
        desc: item.desc,
        tagline: 'Premier Training Track',
        syllabusUrl: `syllabi/${item.id}.pdf`
      };

      card.innerHTML = `
        <div class="arox-train-deco-bg" aria-hidden="true">
          <img src="assets/training/card bg.png" alt="" />
        </div>
        <div class="arox-train-content-top">
          <div class="arox-train-header-row">
            <div class="arox-train-num-box">${item.num}</div>
            <span class="arox-train-cat-badge">${item.badge}</span>
          </div>
          <h3 class="arox-train-title">${item.title}</h3>
          <p class="arox-train-desc">${item.desc}</p>
        </div>
        <div class="arox-train-graphic-box">
          <img src="${item.img}" alt="${item.title}" class="arox-train-graphic-img" loading="lazy" />
        </div>
        <button type="button" class="arox-train-explore-btn">
          <span>Explore Course</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      `;

      card.addEventListener('click', () => {
        window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=training`;
      });
      const exploreBtn = card.querySelector('.arox-train-explore-btn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=training`;
        });
      }

      trainTrack.appendChild(card);
    });"""

    new_loop_code = """    trainTrack.innerHTML = '';
    trainingList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'arox-mobile-flip-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.title} training course`);

      const fullCourse = (typeof flipCourses !== 'undefined' && flipCourses.find(c => c.id === item.id)) ||
                         (typeof findCourseItemById === 'function' && findCourseItemById(item.id)) || {};

      const learnItems = fullCourse.learnItems || [
        "Core architectural fundamentals & principles",
        "Hands-on production projects & code labs",
        "Industry standard design patterns & tools",
        "Git version control & deployment practices",
        "Technical interview & portfolio preparation"
      ];

      const techStack = fullCourse.techStack || [
        { name: "Git", color: "#F05032" },
        { name: "Web", color: "#0078FF" }
      ];

      const learnItemsHTML = learnItems.slice(0, 5).map(li => `<li>${li}</li>`).join('');
      const techIconsHTML = techStack.slice(0, 5).map(t => {
        const iconSVG = typeof techSVG === 'function' ? techSVG(t.name, t.color) : `<svg viewBox="0 0 24 24" fill="${t.color || '#0078FF'}"><circle cx="12" cy="12" r="10"/></svg>`;
        return `
          <div class="arox-mob-tech-icon-item" title="${t.name}">
            ${iconSVG}
            <span>${t.name}</span>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="arox-mobile-flip-inner">
          <!-- FRONT FACE -->
          <div class="arox-mobile-card-face arox-mobile-card-front">
            <div class="arox-train-deco-bg" aria-hidden="true">
              <img src="assets/training/card bg.png" alt="" />
            </div>
            <div class="arox-train-content-top">
              <div class="arox-train-header-row">
                <div class="arox-train-num-box">${item.num}</div>
                <span class="arox-train-cat-badge">${item.badge}</span>
              </div>
              <h3 class="arox-train-title">${item.title}</h3>
              <p class="arox-train-desc">${item.desc}</p>
            </div>
            <div class="arox-train-graphic-box">
              <img src="${item.img}" alt="${item.title}" class="arox-train-graphic-img" loading="lazy" />
            </div>
            <button type="button" class="arox-train-explore-btn">
              <span>Explore Course</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <!-- BACK FACE (FLIPPED ON CLICK) -->
          <div class="arox-mobile-card-face arox-mobile-card-back">
            <div>
              <div class="arox-mob-back-header">
                <span>:::</span> What You'll Learn <span>:::</span>
              </div>
              <ul class="arox-mob-learn-list">
                ${learnItemsHTML}
              </ul>
              <div class="arox-mob-tech-divider">
                <div></div><span>Tech Stack</span><div></div>
              </div>
              <div class="arox-mob-tech-icons">
                ${techIconsHTML}
              </div>
            </div>
            <button type="button" class="arox-train-explore-btn arox-mob-back-explore">
              <span>Explore Course</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      `;

      // 3D Flip on card click (desktop parity)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.arox-train-explore-btn')) return;
        document.querySelectorAll('.arox-mobile-flip-card.flipped').forEach(other => {
          if (other !== card) other.classList.remove('flipped');
        });
        card.classList.toggle('flipped');
      });

      // Navigation when clicking explore button (front or back)
      const exploreBtns = card.querySelectorAll('.arox-train-explore-btn');
      exploreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `detail.html?course=${encodeURIComponent(item.id)}&from=training`;
        });
      });

      trainTrack.appendChild(card);
    });"""

    if old_loop_marker in content:
        content = content.replace(old_loop_marker, new_loop_code)
        print(f'[{filepath}] Replaced training cards loop successfully!')
    else:
        print(f'[{filepath}] Error: old_loop_marker not found exactly!')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[{filepath}] Saved successfully!')

update_file('training.html')
update_file('courses.html')

