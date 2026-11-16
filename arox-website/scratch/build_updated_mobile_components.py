import re

updated_mobile_css = """
    /* ============================================================
       MOBILE VIEW (LIGHT & DARK THEMES + SQUARE CARDS)
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
        padding: 32px 16px 44px 16px !important;
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
        font-size: clamp(25px, 6.5vw, 30px) !important;
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

      /* DOMAIN FILTER PILLS */
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
        padding: 7px 18px !important;
        border-radius: 9999px !important;
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 12px !important;
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

      /* HORIZONTAL SCROLL TRACK */
      .arox-mob-scroll-track {
        display: flex !important;
        gap: 13px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 6px 2px 16px 2px !important;
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
         SQUARE CARDS (164px x 172px) FOR BOTH TRAINING & INTERNSHIP
      ============================================================ */
      .arox-mob-card {
        width: 164px !important;
        min-width: 164px !important;
        height: 172px !important;
        position: relative !important;
        border-radius: 20px !important;
        overflow: hidden !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, background 0.3s ease !important;
        box-sizing: border-box !important;
      }

      .arox-mob-card:active {
        transform: scale(0.97) !important;
      }

      /* Card: DARK THEME */
      html.dark .arox-mob-card,
      html.theme-dark .arox-mob-card,
      body.theme-dark .arox-mob-card {
        background: linear-gradient(145deg, #0D1629 0%, #060B14 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5) !important;
      }
      html.dark .arox-mob-card:hover,
      html.theme-dark .arox-mob-card:hover {
        border-color: rgba(0, 210, 255, 0.35) !important;
        box-shadow: 0 12px 28px rgba(0, 210, 255, 0.14) !important;
      }

      /* Card: LIGHT THEME */
      html.theme-light .arox-mob-card,
      html:not(.dark) .arox-mob-card,
      body.theme-light .arox-mob-card {
        background: linear-gradient(145deg, #FFFFFF 0%, #F5F9FE 100%) !important;
        border: 1px solid rgba(210, 225, 245, 0.95) !important;
        box-shadow: 0 8px 22px rgba(0, 102, 255, 0.08) !important;
      }
      html.theme-light .arox-mob-card:hover,
      html:not(.dark) .arox-mob-card:hover {
        border-color: rgba(0, 102, 255, 0.35) !important;
        box-shadow: 0 12px 26px rgba(0, 102, 255, 0.15) !important;
      }

      /* ============================================================
         TRAINING CARDS: CENTERED SQUARE IMAGE + PROPER SPACING
      ============================================================ */
      .arox-mob-card-training {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 12px 10px 14px 10px !important;
        text-align: center !important;
      }

      /* Centered Image Container with Proper Spacing */
      .arox-train-img-box {
        width: 84px !important;
        height: 84px !important;
        min-height: 84px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 4px auto 6px auto !important;
        position: relative !important;
        pointer-events: none !important;
      }

      .arox-train-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        display: block !important;
        transition: transform 0.3s ease !important;
      }

      /* Dark drop shadow for training icon */
      html.dark .arox-train-img,
      html.theme-dark .arox-train-img {
        filter: drop-shadow(0 8px 18px rgba(0, 180, 255, 0.25)) !important;
      }

      /* Light drop shadow for training icon */
      html.theme-light .arox-train-img,
      html:not(.dark) .arox-train-img {
        filter: drop-shadow(0 8px 16px rgba(0, 80, 200, 0.16)) !important;
      }

      .arox-mob-card-training:hover .arox-train-img {
        transform: translateY(-2px) scale(1.05) !important;
      }

      /* Training Text Block (Centered Below Icon) */
      .arox-train-text-box {
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 2px !important;
        pointer-events: none !important;
      }

      .arox-train-title {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 13px !important;
        font-weight: 800 !important;
        line-height: 1.18 !important;
        margin: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        width: 100% !important;
        letter-spacing: -0.01em !important;
      }

      .arox-train-sub {
        font-family: var(--font-sans, 'Montserrat', sans-serif) !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        margin: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        width: 100% !important;
      }

      /* Training Text: DARK */
      html.dark .arox-train-title,
      html.theme-dark .arox-train-title {
        color: #FFFFFF !important;
      }
      html.dark .arox-train-sub,
      html.theme-dark .arox-train-sub {
        color: #00D2FF !important;
        opacity: 0.9 !important;
      }

      /* Training Text: LIGHT */
      html.theme-light .arox-train-title,
      html:not(.dark) .arox-train-title {
        color: #0B1426 !important;
      }
      html.theme-light .arox-train-sub,
      html:not(.dark) .arox-train-sub {
        color: #0066FF !important;
        opacity: 0.95 !important;
      }

      /* ============================================================
         INTERNSHIP CARDS: SQUARE CARDS + TWO-TONE TITLE & CENTERED GRAPHIC
      ============================================================ */
      .arox-mob-card-intern {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 14px 12px 10px 12px !important;
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
        font-size: 16px !important;
        font-weight: 800 !important;
        letter-spacing: -0.01em !important;
        margin: 0 !important;
      }

      .arox-intern-l2 {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 16px !important;
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

      /* Internship Centered Image Box */
      .arox-intern-img-box {
        width: 100% !important;
        height: 88px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-top: 4px !important;
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

      /* Dark drop shadow for internship illustration */
      html.dark .arox-intern-img,
      html.theme-dark .arox-intern-img {
        filter: drop-shadow(0 6px 16px rgba(0, 180, 255, 0.22)) !important;
      }

      /* Light drop shadow for internship illustration */
      html.theme-light .arox-intern-img,
      html:not(.dark) .arox-intern-img {
        filter: drop-shadow(0 6px 14px rgba(0, 70, 200, 0.15)) !important;
      }

      .arox-mob-card-intern:hover .arox-intern-img {
        transform: translateY(-2px) scale(1.04) !important;
      }
    }
"""

updated_mobile_js = """
  /* ============================================================
     MOBILE VIEW JS (LIGHT & DARK THEMES + SQUARE CARDS)
  ============================================================ */
  function splitInternTitleForMobile(title, id) {
    if (id === 'ui-ux-design') return { line1: 'UI/UX', line2: 'Design' };
    if (id === 'data-analytics-data-science') return { line1: 'Data', line2: 'Analytics' };
    if (id === 'cyber-security') return { line1: 'Cyber', line2: 'Security' };
    if (id === 'python-full-stack') return { line1: 'Python', line2: 'Full Stack' };
    if (id === 'java-full-stack') return { line1: 'Java', line2: 'Full Stack' };
    if (id === 'aws-cloud-computing') return { line1: 'AWS', line2: 'Cloud' };
    if (id === 'devops') return { line1: 'DevOps', line2: 'Engineering' };
    if (id === 'generative-ai') return { line1: 'Generative', line2: 'AI' };
    if (id === 'ai-ml') return { line1: 'AI &', line2: 'Machine Learning' };
    if (id === 'selenium-testing') return { line1: 'Selenium', line2: 'Testing' };
    if (id === 'power-bi') return { line1: 'Power', line2: 'BI' };
    if (id === 'salesforce') return { line1: 'Salesforce', line2: 'CRM' };
    if (id === 'catia-english') return { line1: 'CATIA', line2: 'English' };
    if (id === 'vlsi-design') return { line1: 'VLSI', line2: 'Design' };
    if (id === 'embedded-system') return { line1: 'Embedded', line2: 'System' };
    if (id === 'iot-robotics') return { line1: 'IoT &', line2: 'Robotics' };
    if (id === 'iot') return { line1: 'Internet of', line2: 'Things' };
    if (id === 'hybrid-ev') return { line1: 'Hybrid', line2: 'EV' };
    if (id === 'nptel-aircraft') return { line1: 'Aircraft', line2: 'Engineering' };
    if (id === 'ic-engine-design') return { line1: 'IC Engine', line2: 'Design' };
    if (id === 'autocad') return { line1: 'AutoCAD', line2: 'Drafting' };
    if (id === 'car-design') return { line1: 'Car', line2: 'Design' };
    if (id === 'industrial-robotics') return { line1: 'Industrial', line2: 'Robotics' };
    if (id === 'investment-banking') return { line1: 'Investment', line2: 'Banking' };
    if (id === 'supply-chain') return { line1: 'Supply Chain', line2: 'Management' };
    if (id === 'sap-fico') return { line1: 'SAP', line2: 'FICO' };
    if (id === 'digital-marketing') return { line1: 'Digital', line2: 'Marketing' };
    if (id === 'advanced-excel') return { line1: 'Advanced', line2: 'Excel' };
    if (id === 'stock-market') return { line1: 'Stock Market', line2: 'Trading' };
    if (id === 'business-analytics') return { line1: 'Business', line2: 'Analytics' };
    if (id === 'hr-finance') return { line1: 'HR &', line2: 'Finance' };

    const words = (title || '').trim().split(/\\s+/);
    if (words.length <= 1) return { line1: words[0] || '', line2: '' };
    if (words.length === 2) return { line1: words[0], line2: words[1] };
    const mid = Math.ceil(words.length / 2);
    return { line1: words.slice(0, mid).join(' '), line2: words.slice(mid).join(' ') };
  }

  function findCourseItemById(id) {
    if (window.DOMAIN_COURSES) {
      for (const dom in window.DOMAIN_COURSES) {
        const found = window.DOMAIN_COURSES[dom].find(c => c.id === id);
        if (found) return found;
      }
    }
    if (typeof flipCourses !== 'undefined') {
      const found = flipCourses.find(c => c.id === id);
      if (found) return found;
    }
    return null;
  }

  function initAroxMobileCourses() {
    const trainTrack = document.getElementById('aroxMobileTrainingTrack');
    const internTrack = document.getElementById('aroxMobileInternTrack');
    const pillsRow = document.getElementById('aroxMobilePillsRow');
    if (!trainTrack || !internTrack) return;

    // 1. POPULATE TRAINING TRACK
    // Strictly uses images from 'assets/trainig cards image/' placed on center with square card design
    const trainingList = [
      {
        id: 'full-stack-web-development',
        title: 'Full Stack Web Development',
        dTitle: 'Full Stack Web',
        dSub: 'Web Development',
        img: 'assets/trainig cards image/full stack wd.png'
      },
      {
        id: 'ui-ux-designing',
        title: 'UI & UX Designing',
        dTitle: 'UI & UX Design',
        dSub: 'Design & Prototyping',
        img: 'assets/trainig cards image/uiux.png'
      },
      {
        id: 'data-science-and-ai',
        title: 'Data Science & AI',
        dTitle: 'Data Science & AI',
        dSub: 'Analytics & Models',
        img: 'assets/trainig cards image/data science and ai.png'
      },
      {
        id: 'cyber-security',
        title: 'Cyber Security',
        dTitle: 'Cyber Security',
        dSub: 'Network & Auditing',
        img: 'assets/trainig cards image/cyber security.png'
      },
      {
        id: 'devops-engineering',
        title: 'DevOps Engineering',
        dTitle: 'DevOps',
        dSub: 'Cloud & CI/CD',
        img: 'assets/trainig cards image/devops.png'
      },
      {
        id: 'digital-marketing',
        title: 'Digital Marketing',
        dTitle: 'Digital Marketing',
        dSub: 'SEO & Growth Strategy',
        img: 'assets/trainig cards image/dig marketing.png'
      },
      {
        id: 'app-development',
        title: 'App Development',
        dTitle: 'App Development',
        dSub: 'iOS & Android Native',
        img: 'assets/trainig cards image/app development.png'
      },
      {
        id: 'embedded-systems-and-iot',
        title: 'Embedded Systems & IoT',
        dTitle: 'IoT & Embedded',
        dSub: 'Sensors & Hardware',
        img: 'assets/trainig cards image/iot.png'
      },
      {
        id: 'software-development',
        title: 'Software Development',
        dTitle: 'Software Dev',
        dSub: 'System Architecture',
        img: 'assets/trainig cards image/sw dev.png'
      }
    ];

    trainTrack.innerHTML = '';
    trainingList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'arox-mob-card arox-mob-card-training';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.title} training`);

      card.innerHTML = `
        <div class="arox-train-img-box">
          <img src="${item.img}" alt="${item.title}" class="arox-train-img" loading="lazy" />
        </div>
        <div class="arox-train-text-box">
          <h3 class="arox-train-title">${item.dTitle}</h3>
          <p class="arox-train-sub">${item.dSub}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        const fullCourse = findCourseItemById(item.id) || {
          id: item.id,
          title: item.title,
          desc: item.dSub,
          tagline: 'Premier Training Track',
          syllabusUrl: `syllabi/${item.id}.pdf`
        };
        openModal(fullCourse);
      });

      trainTrack.appendChild(card);
    });

    // 2. POPULATE INTERNSHIP TRACK (Square cards with top two-tone title + centered image)
    function renderMobileInternship(domainKey) {
      internTrack.innerHTML = '';
      const rawCourses = (window.DOMAIN_COURSES && window.DOMAIN_COURSES[domainKey]) || [];
      
      let courses = [...rawCourses];
      if (domainKey === 'cse_it') {
        const topIds = ['ui-ux-design', 'data-analytics-data-science', 'cyber-security'];
        courses.sort((a, b) => {
          const ia = topIds.indexOf(a.id);
          const ib = topIds.indexOf(b.id);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return 0;
        });
      }

      courses.forEach(item => {
        const card = document.createElement('div');
        card.className = 'arox-mob-card arox-mob-card-intern';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${item.title} internship`);

        const parts = splitInternTitleForMobile(item.title, item.id);
        const imgSrc = `assets/internships/cards/${item.id}.png`;

        card.innerHTML = `
          <div class="arox-intern-top-text">
            <span class="arox-intern-l1">${parts.line1}</span>
            <span class="arox-intern-l2">${parts.line2}</span>
          </div>
          <div class="arox-intern-img-box">
            <img src="${imgSrc}" alt="${item.title}" class="arox-intern-img" loading="lazy" onerror="this.src='assets/internships/3d_laptop_dark.png'" />
          </div>
        `;

        card.addEventListener('click', () => {
          openModal(item);
        });

        internTrack.appendChild(card);
      });

      internTrack.scrollLeft = 0;
    }

    if (pillsRow) {
      const pillBtns = pillsRow.querySelectorAll('.arox-mob-pill');
      pillBtns.forEach(btn => {
        btn.onclick = () => {
          pillBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const dom = btn.getAttribute('data-domain');
          renderMobileInternship(dom);
        };
      });
    }

    renderMobileInternship('cse_it');
  }

  // Ensure init on DOMReady / resize
  if (typeof window !== 'undefined') {
    window.initAroxMobileCourses = initAroxMobileCourses;
    if (window.innerWidth <= 768) {
      setTimeout(initAroxMobileCourses, 200);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        initAroxMobileCourses();
      }
    });
  }
"""

print("Updated mobile components created!")

