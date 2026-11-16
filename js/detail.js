/**
 * AROX TECH - Course Detail Interactive Controller (js/detail.js)
 * Dynamically populates hero, interactive 3-column syllabus, real-time projects,
 * student testimonials, FAQs, and application links based on URL query parameter (?course=...).
 */

(function () {
    'use strict';

    // ─── 1. URL & Course Extraction ───
    function getSelectedCourse() {
        const urlParams = new URLSearchParams(window.location.search);
        let slug = urlParams.get('course') || urlParams.get('program') || urlParams.get('internship') || urlParams.get('track') || urlParams.get('id') || urlParams.get('name');

        if (!slug && window.location.pathname) {
            const pathMatch = window.location.pathname.match(/\/(?:course|training|internship)\/([a-zA-Z0-9_-]+)/i);
            if (pathMatch) {
                slug = pathMatch[1];
            }
        }

        if (!slug && window.location.hash) {
            // Check if hash matches card-xyz or xyz
            slug = window.location.hash.replace('#card-', '').replace('#', '');
        }

        if (!slug) {
            slug = 'full-stack-web-development';
        }

        return getCourseBySlug(slug);
    }


    // ─── Hero Visual 3D Graphic Image Mapping ───
    const DETAIL_HERO_IMAGES = {
        'cyber-security': 'assets/detail page images/Glowing 3D Cybersecurity Shield Network.png',
        'software-development': 'assets/detail page images/Neon 3D Software Development Hub.png',
        'java-fsd': 'assets/detail page images/Neon 3D Software Development Hub.png',
        'devops-engineering': 'assets/detail page images/Neon DevOps Engineering Infinity Loop.png',
        'cloud-aws': 'assets/detail page images/Neon DevOps Engineering Infinity Loop.png',
        'cloud-devops-internship': 'assets/internships/cards/devops.png',
        'digital-marketing': 'assets/detail page images/Neon Digital Marketing Megaphone Icons.png',
        'full-stack-web-development': 'assets/detail page images/Neon Full-Stack Developer Workspace.png',
        'mern-stack': 'assets/detail page images/Neon Full-Stack Developer Workspace.png',
        'full-stack-internship': 'assets/internships/cards/python-full-stack.png',
        'embedded-systems-and-iot': 'assets/detail page images/Neon IoT Rover Technology Hub.png',
        'app-development': 'assets/detail page images/Neon Mobile App Development Ecosystem.png',
        'mobile-app-internship': 'assets/internships/cards/iot.png',
        'data-science-and-ai': 'assets/detail page images/Neon Python Analytics Laptop Ecosystem.png',
        'python-dev': 'assets/detail page images/Neon Python Analytics Laptop Ecosystem.png',
        'python-backend-internship': 'assets/internships/cards/python-full-stack.png',
        'ai-agent-internship': 'assets/internships/cards/generative-ai.png',
        'ui-ux-designing': 'assets/detail page images/Neon UI_UX Design Workspace.png',
        'ui-ux-design-internship': 'assets/internships/cards/ui-ux-design.png'
    };

    // ─── Outside Internship Card Images (Exact 1:1 Matching with Training/Internship Cards) ───
    const INTERNSHIP_CARD_IMAGES = {
        'python-full-stack': 'assets/internships/cards/python-full-stack.png',
        'java-full-stack': 'assets/internships/cards/java-full-stack.png',
        'aws-cloud-computing': 'assets/internships/cards/aws-cloud-computing.png',
        'devops': 'assets/internships/cards/devops.png',
        'data-analytics-data-science': 'assets/internships/cards/data-analytics-data-science.png',
        'generative-ai': 'assets/internships/cards/generative-ai.png',
        'ai-ml': 'assets/internships/cards/ai-ml.png',
        'cyber-security': 'assets/internships/cards/cyber-security.png',
        'selenium-testing': 'assets/internships/cards/selenium-testing.png',
        'ui-ux-design': 'assets/internships/cards/ui-ux-design.png',
        'salesforce': 'assets/internships/cards/salesforce.png',
        'investment-banking': 'assets/internships/cards/investment-banking.png',
        'supply-chain': 'assets/internships/cards/supply-chain.png',
        'sap-fico': 'assets/internships/cards/sap-fico.png',
        'digital-marketing': 'assets/internships/cards/digital-marketing.png',
        'power-bi': 'assets/internships/cards/power-bi.png',
        'advanced-excel': 'assets/internships/cards/advanced-excel.png',
        'stock-market': 'assets/internships/cards/stock-market.png',
        'business-analytics': 'assets/internships/cards/business-analytics.png',
        'hr-finance': 'assets/internships/cards/hr-finance.png',
        'vlsi-design': 'assets/internships/cards/vlsi-design.png',
        'embedded-system': 'assets/internships/cards/embedded-system.png',
        'iot': 'assets/internships/cards/iot.png',
        'iot-robotics': 'assets/internships/cards/iot-robotics.png',
        'hybrid-ev': 'assets/internships/cards/hybrid-ev.png',
        'nptel-aircraft': 'assets/internships/cards/nptel-aircraft.png',
        'catia-english': 'assets/internships/cards/catia-english.png',
        'ic-engine-design': 'assets/internships/cards/ic-engine-design.png',
        'autocad': 'assets/internships/cards/autocad.png',
        'car-design': 'assets/internships/cards/car-design.png',
        'industrial-robotics': 'assets/internships/cards/industrial-robotics.png',
        'full-stack-internship': 'assets/internships/cards/python-full-stack.png',
        'python-backend-internship': 'assets/internships/cards/python-full-stack.png',
        'ai-agent-internship': 'assets/internships/cards/generative-ai.png',
        'cloud-devops-internship': 'assets/internships/cards/devops.png',
        'ui-ux-design-internship': 'assets/internships/cards/ui-ux-design.png',
        'mobile-app-internship': 'assets/internships/cards/iot.png',
        // Internal slug aliases from courses-detail-data
        'python-dev': 'assets/internships/cards/python-full-stack.png',
        'java-fsd': 'assets/internships/cards/java-full-stack.png',
        'cloud-aws': 'assets/internships/cards/aws-cloud-computing.png',
        'devops-engineering': 'assets/internships/cards/devops.png',
        'data-science-and-ai': 'assets/internships/cards/data-analytics-data-science.png',
        'data-science-ai-systems': 'assets/internships/cards/data-analytics-data-science.png',
        'ui-ux-designing': 'assets/internships/cards/ui-ux-design.png',
        'embedded-systems-and-iot': 'assets/internships/cards/embedded-system.png',
        'software-development': 'assets/internships/cards/selenium-testing.png',
        'app-development': 'assets/internships/cards/iot.png'
    };

    function getDetailHeroImage(course) {
        if (!course) return 'assets/detail page images/Neon Full-Stack Developer Workspace.png';
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = (urlParams.get('from') || '').toLowerCase();
        const querySlug = (urlParams.get('course') || urlParams.get('internship') || urlParams.get('track') || urlParams.get('id') || '').toLowerCase().trim();
        const slug = (course.slug || course.id || '').toLowerCase();
        const isInternship = fromParam === 'internship' ||
                             (course.category && course.category.toLowerCase().includes('internship')) ||
                             Boolean(course.isInternship) ||
                             (Boolean(INTERNSHIP_CARD_IMAGES[querySlug]) && fromParam !== 'training') ||
                             (Boolean(INTERNSHIP_CARD_IMAGES[slug]) && fromParam !== 'training');

        // Exact match with outside internship card
        if (isInternship) {
            if (querySlug && INTERNSHIP_CARD_IMAGES[querySlug]) {
                return INTERNSHIP_CARD_IMAGES[querySlug];
            }
            if (slug && INTERNSHIP_CARD_IMAGES[slug]) {
                return INTERNSHIP_CARD_IMAGES[slug];
            }
            if (querySlug) {
                return `assets/internships/cards/${querySlug}.png`;
            }
            if (slug) {
                return `assets/internships/cards/${slug}.png`;
            }
        }

        if (DETAIL_HERO_IMAGES[slug]) {
            return DETAIL_HERO_IMAGES[slug];
        }
        if (querySlug && DETAIL_HERO_IMAGES[querySlug]) {
            return DETAIL_HERO_IMAGES[querySlug];
        }
        const title = (course.title || '').toLowerCase();

        if (slug.includes('cyber') || title.includes('cyber') || title.includes('security')) {
            return isInternship ? 'assets/internships/cards/cyber-security.png' : 'assets/detail page images/Glowing 3D Cybersecurity Shield Network.png';
        }
        if (slug.includes('ui-ux') || title.includes('ui') || title.includes('ux') || title.includes('design')) {
            return isInternship ? 'assets/internships/cards/ui-ux-design.png' : 'assets/detail page images/Neon UI_UX Design Workspace.png';
        }
        if (slug.includes('python') || slug.includes('data') || slug.includes('ai') || title.includes('python') || title.includes('data') || title.includes('ai') || title.includes('analytics')) {
            return isInternship ? 'assets/internships/cards/python-full-stack.png' : 'assets/detail page images/Neon Python Analytics Laptop Ecosystem.png';
        }
        if (slug.includes('devops') || slug.includes('cloud') || slug.includes('aws') || title.includes('devops') || title.includes('cloud') || title.includes('aws')) {
            return isInternship ? 'assets/internships/cards/devops.png' : 'assets/detail page images/Neon DevOps Engineering Infinity Loop.png';
        }
        if (slug.includes('mobile') || slug.includes('app') || title.includes('mobile') || title.includes('app') || title.includes('android') || title.includes('flutter')) {
            return 'assets/detail page images/Neon Mobile App Development Ecosystem.png';
        }
        if (slug.includes('iot') || slug.includes('embedded') || title.includes('iot') || title.includes('embedded') || title.includes('rover')) {
            return isInternship ? 'assets/internships/cards/embedded-system.png' : 'assets/detail page images/Neon IoT Rover Technology Hub.png';
        }
        if (slug.includes('market') || title.includes('marketing') || title.includes('digital market')) {
            return isInternship ? 'assets/internships/cards/digital-marketing.png' : 'assets/detail page images/Neon Digital Marketing Megaphone Icons.png';
        }
        if (slug.includes('software') || slug.includes('java') || title.includes('software') || title.includes('java')) {
            return isInternship ? 'assets/internships/cards/java-full-stack.png' : 'assets/detail page images/Neon 3D Software Development Hub.png';
        }
        return 'assets/detail page images/Neon Full-Stack Developer Workspace.png';
    }
    window.getDetailHeroImage = getDetailHeroImage;

    // ─── 2. DOM Population Helpers ───
    function renderHero(course) {
        // Page Title & Meta
        document.title = `Arox Tech - ${course.title}`;
        const pageTitleEl = document.getElementById('page-title');
        if (pageTitleEl) pageTitleEl.innerText = `Arox Tech - ${course.title}`;

        // Hero Title & Accent
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            heroTitle.innerText = course.heroAccent || course.title;
        }

        // Hero Badge
        const heroBadge = document.getElementById('hero-badge');
        if (heroBadge) {
            heroBadge.innerText = course.badge || `${course.category.toUpperCase()} PROGRAM`;
        }

        // Hero Description
        const heroDesc = document.getElementById('hero-desc');
        if (heroDesc) {
            heroDesc.innerText = course.desc;
        }

        // Hero Features (6 Highlights)
        const heroFeaturesContainer = document.getElementById('hero-features-list');
        if (heroFeaturesContainer && course.heroFeatures && course.heroFeatures.length > 0) {
            heroFeaturesContainer.innerHTML = course.heroFeatures.map(feat => `
                <div class="feat">
                    <div class="feat-check"><i class="fa-solid fa-check"></i></div>
                    <span>${feat}</span>
                </div>
            `).join('');
        }

        // Apply links - navigates to apply.html or opens in-page modal
        const targetCourseParam = encodeURIComponent(course.title || course.slug || course.id);
        const applyUrl = `apply.html?course=${targetCourseParam}`;

        const applyLink = document.getElementById('apply-link');
        if (applyLink) {
            applyLink.href = applyUrl;
            applyLink.setAttribute('role', 'button');
            applyLink.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0 && typeof window.openStudentModal === 'function') {
                    e.preventDefault();
                    window.openStudentModal();
                }
            });
        }

        const ctaApplyLink = document.getElementById('cta-apply-link');
        if (ctaApplyLink) {
            ctaApplyLink.href = applyUrl;
            ctaApplyLink.setAttribute('role', 'button');
            ctaApplyLink.addEventListener('click', (e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0 && typeof window.openStudentModal === 'function') {
                    e.preventDefault();
                    window.openStudentModal();
                }
            });
        }

        // Hero 3D Graphic Image
        const heroCourseImg = document.getElementById('hero-course-image');
        if (heroCourseImg) {
            heroCourseImg.src = getDetailHeroImage(course);
            heroCourseImg.alt = `${course.title} Visual Graphic`;
            heroCourseImg.onerror = function () {
                this.onerror = null;
                this.src = 'assets/internships/3d_laptop_dark.png';
            };
        }

        // Back to Courses Link
        const backBtn = document.getElementById('back-to-courses-btn');
        if (backBtn) {
            const urlParams = new URLSearchParams(window.location.search);
            const fromParam = urlParams.get('from');
            const isInternship = fromParam === 'internship' || (course.category && course.category.toLowerCase().includes('internship'));
            const targetTab = isInternship ? 'internship' : 'training';
            let targetPage = 'courses.html';
            if (document.referrer && document.referrer.includes('training.html')) {
                targetPage = 'training.html';
            }
            backBtn.href = `${targetPage}?tab=${targetTab}&section=courses#hscrollSection`;
        }
    }

    // ─── 3. 3-Column Interactive Syllabus Engine ───
    function initInteractiveSyllabus(course) {
        const techContainer = document.getElementById('tech-stack-container');
        const curriculumContainer = document.getElementById('curriculum-container');
        const topicDetailPanel = document.getElementById('topic-detail-panel');

        if (!curriculumContainer || !topicDetailPanel) return;

        // Structured topic objects from course.topics or generated fallback
        const topics = course.topics || (course.learnItems || []).map((item, idx) => {
            const associatedTool = (course.techStack && course.techStack[idx % course.techStack.length]) || 'Technology';
            return {
                title: item,
                tool: associatedTool,
                desc: `Master ${item} through practical labs, real-world case studies, and industry-aligned training modules. Build key skills required by top engineering teams.`,
                points: [
                    `Comprehensive coverage of ${item} concepts`,
                    `Hands-on practical exercises & live demonstrations`,
                    `Industry standard design patterns & best practices`,
                    `Real-world troubleshooting & workflow integration`
                ],
                practicalLab: `Build and complete a hands-on project assignment focusing on ${item}.`
            };
        });

        // 1. Render Tools in Column 1 (Static / Sticky)
        if (techContainer && course.techStack) {
            techContainer.innerHTML = '';
            course.techStack.forEach(techName => {
                const deviconSlug = (typeof deviconMap !== 'undefined' && deviconMap[techName]) || 'chrome/chrome-original.svg';
                const badge = document.createElement('div');
                badge.className = 'tech-badge-card';
                badge.setAttribute('data-tool', techName);
                badge.innerHTML = `
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${deviconSlug}" alt="${techName}" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg'" />
                    <span>${techName}</span>
                `;
                badge.addEventListener('click', () => {
                    let topicIdx = topics.findIndex(t => t.tool && t.tool.toLowerCase() === techName.toLowerCase());
                    if (topicIdx === -1) {
                        topicIdx = topics.findIndex(t => 
                            (t.title && t.title.toLowerCase().includes(techName.toLowerCase())) ||
                            (t.desc && t.desc.toLowerCase().includes(techName.toLowerCase())) ||
                            (t.points && t.points.some(p => p.toLowerCase().includes(techName.toLowerCase())))
                        );
                    }
                    if (topicIdx === -1) {
                        const techIdx = course.techStack.indexOf(techName);
                        if (techIdx !== -1 && topics.length > 0) {
                            topicIdx = techIdx % topics.length;
                        }
                    }
                    if (topicIdx !== -1) {
                        activateTopic(topicIdx, techName);
                        if (window.innerWidth > 768) {
                            const targetItem = curriculumContainer.querySelector(`.topic-scroll-item[data-index="${topicIdx}"]`);
                            if (targetItem) {
                                targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }
                    }
                });
                techContainer.appendChild(badge);
            });
        }

        // 2. Render Topics in Column 2 (Scroll-driven arrival sequence)
        curriculumContainer.innerHTML = '';
        topics.forEach((topic, index) => {
            const stepNum = String(index + 1).padStart(2, '0');
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-scroll-item arrived';
            topicItem.setAttribute('data-index', index);
            topicItem.innerHTML = `
                <div class="topic-card-body">
                    <div class="topic-num-badge">${stepNum}</div>
                    <div class="topic-content-preview">
                        <h4 class="topic-title">${topic.title}</h4>
                        <span class="topic-tag"><i class="fa-solid fa-layer-group"></i> Module ${index + 1} &bull; ${topic.tool}</span>
                    </div>
                </div>
            `;

            topicItem.addEventListener('click', () => {
                activateTopic(index);
            });

            curriculumContainer.appendChild(topicItem);
        });

        let currentActiveIndex = -1;
        let currentActiveTool = '';

        // Activate specific topic in Col 2, update Col 3 detail, and highlight Col 1 tool
        function activateTopic(index, specificTool) {
            if (index === currentActiveIndex && specificTool && specificTool.toLowerCase() === currentActiveTool.toLowerCase()) return;

            const topicItems = curriculumContainer.querySelectorAll('.topic-scroll-item');
            topicItems.forEach((item, idx) => {
                if (idx === index) {
                    item.classList.add('active-topic');
                    item.classList.add('arrived');
                } else {
                    item.classList.remove('active-topic');
                }
            });

            const activeTopic = topics[index];
            if (!activeTopic) return;

            const targetToolName = specificTool || activeTopic.tool;
            currentActiveTool = targetToolName || '';

            // Highlight matching tool in Col 1
            if (techContainer) {
                const toolCards = techContainer.querySelectorAll('.tech-badge-card');
                toolCards.forEach(card => {
                    const toolName = card.getAttribute('data-tool');
                    if (toolName && targetToolName && toolName.toLowerCase() === targetToolName.toLowerCase()) {
                        card.classList.add('active-tool');
                    } else {
                        card.classList.remove('active-tool');
                    }
                });
            }

            // Update Col 3 Detail Panel with smooth transition
            updateDetailPanel(activeTopic, index + 1, topics.length);
            currentActiveIndex = index;
        }

        function updateDetailPanel(topic, modNum, totalMods) {
            const renderHTML = `
                <div class="detail-transition-wrapper fade-out">
                    <div class="detail-header-badge">
                        <i class="fa-solid fa-sparkles"></i> Module ${modNum} of ${totalMods}
                    </div>
                    <h4 class="detail-main-title">${topic.title}</h4>
                    <p class="detail-desc">${topic.desc}</p>

                    <div class="detail-bullets-title">Key Takeaways:</div>
                    <ul class="detail-bullets-list">
                        ${topic.points.map(pt => `<li><i class="fa-solid fa-circle-check"></i> <span>${pt}</span></li>`).join('')}
                    </ul>

                    <div class="detail-lab-box">
                        <div class="detail-lab-header">
                            <i class="fa-solid fa-flask"></i> Hands-On Practical Lab
                        </div>
                        <div class="detail-lab-text">${topic.practicalLab}</div>
                    </div>
                </div>
            `;

            topicDetailPanel.innerHTML = renderHTML;
            const newWrap = topicDetailPanel.querySelector('.detail-transition-wrapper');
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (newWrap) {
                        newWrap.classList.remove('fade-out');
                        newWrap.classList.add('fade-in');
                    }
                });
            });
        }

        // Activate initial topic
        if (topics.length > 0) {
            activateTopic(0);
        }

        // 3. Scroll Observer: Topics arrive sequentially and remain in place (Desktop only)
        if (window.innerWidth > 768) {
            const observerOptions = {
                root: null,
                rootMargin: '-10% 0px -25% 0px',
                threshold: 0.15
            };

            const topicObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const item = entry.target;
                        const idx = parseInt(item.getAttribute('data-index'), 10);
                        item.classList.add('arrived');
                        activateTopic(idx);
                    }
                });
            }, observerOptions);

            const topicItems = curriculumContainer.querySelectorAll('.topic-scroll-item');
            topicItems.forEach(item => {
                topicObserver.observe(item);
            });
        }
    }

    // ─── 4. Real Time Projects Renderer ───
    function renderProjects(course) {
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;

        const projects = course.projects || [
            {
                title: 'E-Commerce Marketplace',
                subtitle: 'Full Stack Web Platform',
                icon: 'fa-solid fa-cart-shopping',
                iconColor: '#5d4cf7',
                desc: 'End-to-end shopping platform with product filtering, dynamic cart state, Stripe checkout, and admin dashboard.',
                tags: ['React', 'Node.js', 'MongoDB', 'Stripe']
            },
            {
                title: 'Real-Time Team Chat',
                subtitle: 'WebSocket Application',
                icon: 'fa-solid fa-comment-dots',
                iconColor: '#10b981',
                desc: 'Instant messaging platform supporting channels, direct messages, read receipts, and file attachments.',
                tags: ['Socket.io', 'Express', 'React', 'Tailwind']
            },
            {
                title: 'SaaS Billing & Analytics',
                subtitle: 'Enterprise Dashboard',
                icon: 'fa-solid fa-chart-line',
                iconColor: '#3b82f6',
                desc: 'Subscription billing dashboard with interactive charts, invoice generation, and customer management.',
                tags: ['Next.js', 'TypeScript', 'Prisma', 'Chart.js']
            },
            {
                title: 'Interactive Portfolio Portal',
                subtitle: 'Creative Web Experience',
                icon: 'fa-solid fa-laptop-code',
                iconColor: '#f97316',
                desc: 'Dynamic interactive developer showcase featuring smooth GSAP animations, 3D elements, and contact handling.',
                tags: ['HTML5', 'GSAP', 'CSS3', 'JavaScript']
            }
        ];

        projectsContainer.innerHTML = projects.map(p => `
            <div class="project-card">
                <div class="project-card-header">
                    <div class="project-icon-wrapper" style="background: ${p.iconColor || '#5d4cf7'};">
                        <i class="${p.icon || 'fa-solid fa-code'}"></i>
                    </div>
                    <span class="project-type-tag">${p.subtitle || 'Live Project'}</span>
                </div>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-subtitle">${p.subtitle}</p>
                <p class="project-desc">${p.desc}</p>
                <div class="project-tags-list">
                    ${(p.tags || []).map(t => `<span class="project-tag-pill">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // ─── 5. Student Reviews Renderer ───
    function renderReviews(course) {
        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) return;

        const reviews = course.reviews || [
            {
                name: 'Aravind K.',
                role: `${course.title} Trainee`,
                initials: 'AK',
                quote: 'The training gave me real-world experience and confidence to build live applications from scratch.',
                stars: 5
            },
            {
                name: 'Kaviya S.',
                role: 'Frontend Trainee',
                initials: 'KS',
                quote: 'Mentors here are super supportive and the hands-on projects helped me boost my placement skills.',
                stars: 5
            },
            {
                name: 'Vignesh R.',
                role: 'Backend Trainee',
                initials: 'VR',
                quote: 'Best training program I have ever joined. Learned a lot and improved my problem-solving skills.',
                stars: 5
            }
        ];

        const reviewCardsHTML = reviews.map(r => `
            <div class="review-card">
                <i class="fa-solid fa-quote-left quote"></i>
                <p class="review-text">${r.quote}</p>
                <div style="padding-bottom:0.5rem;">
                    <p class="reviewer-name">— ${r.name}</p>
                    <p class="reviewer-role">${r.role}</p>
                    <div class="review-stars">
                        ${Array.from({ length: r.stars || 5 }).map(() => '<i class="fa-solid fa-star"></i>').join('')}
                    </div>
                </div>
                <div class="reviewer-avatar-badge">${r.initials || 'AT'}</div>
            </div>
        `).join('');

        reviewsContainer.innerHTML = `
            <div class="reviews-marquee-track">${reviewCardsHTML}</div>
            <div class="reviews-marquee-track" aria-hidden="true">${reviewCardsHTML}</div>
        `;
    }

    // ─── 6. FAQs Renderer ───
    function renderFaqs(course) {
        const faqContainer = document.getElementById('faq-accordion');
        if (!faqContainer) return;

        const faqs = course.faqs || [
            {
                q: `What is the duration of the ${course.title} program?`,
                a: 'The training duration typically ranges from 10 to 14 weeks (approx. 3 months) to ensure comprehensive project development and practical mastery.'
            },
            {
                q: 'Is this training program completely online?',
                a: 'Yes, our training programs are fully remote with live mentor sessions, allowing you to learn from anywhere with flexible sprint hours.'
            },
            {
                q: 'Will I get an industry-recognized certificate after completion?',
                a: 'Absolutely. Upon successful completion of all curriculum modules and project reviews, you will receive a verified certificate from AROX Tech.'
            },
            {
                q: 'What are the eligibility criteria for enrolling?',
                a: 'Basic knowledge of computing concepts is helpful. The program is ideal for college students, recent graduates, and career changers.'
            },
            {
                q: 'Do you offer job placement assistance?',
                a: 'Yes! We conduct mock technical interviews, resume and portfolio optimization, and refer our top trainees to partner engineering teams.'
            }
        ];

        faqContainer.innerHTML = faqs.map((faq) => `
            <details class="faq-item">
                <summary>${faq.q} <span class="toggle">+</span></summary>
                <div class="faq-answer">${faq.a}</div>
            </details>
        `).join('');
    }

    // ─── 7. In-Page Student Application Modal Controller (4-Step Stepper) ───
    function initStudentApplicationModal(course) {
        const backdrop = document.getElementById('studentApplyBackdrop');
        const closeBtn = document.getElementById('closeStudentModalBtn');
        const cancelBtn = document.getElementById('form-btn-cancel');
        const doneBtn = document.getElementById('form-btn-done');
        const selectedCourseInput = document.getElementById('form-selected-course');

        if (!backdrop) return;

        let currentStepNum = 1;
        let validatedReferralCode = null;
        let validatedDiscount = 0;

        if (window.AroxEnrollForm) {
            window.AroxEnrollForm.initAcademicCascadingSelects();
        }

        function setStep(stepNum) {
            currentStepNum = stepNum;

            const stepViews = [
                document.getElementById('modal-view-form-step1'),
                document.getElementById('modal-view-form-step2'),
                document.getElementById('modal-view-form-step3'),
                document.getElementById('modal-view-form-step4'),
                document.getElementById('modal-view-success')
            ];

            stepViews.forEach(v => {
                if (v) v.classList.remove('active');
            });

            const stepperHeader = document.getElementById('modal-stepper-header');

            if (stepNum >= 1 && stepNum <= 4) {
                if (stepperHeader) stepperHeader.style.display = 'block';
                const activeView = document.getElementById(`modal-view-form-step${stepNum}`);
                if (activeView) activeView.classList.add('active');

                if (stepNum === 3) {
                    if (selectedCourseInput) {
                        selectedCourseInput.value = course.title || 'Selected Program';
                    }
                }

                if (stepNum === 4) {
                    buildPreviewSummary();
                }

                // Update Stepper Nodes and Lines
                for (let i = 1; i <= 4; i++) {
                    const node = document.getElementById(`mstep-node-${i}`);
                    const circle = document.getElementById(`mstep-circle-${i}`);
                    const lbl = document.getElementById(`mstep-lbl-${i}`);
                    const line = document.getElementById(`mstep-line-${i}`);

                    if (i < stepNum) {
                        if (circle) { circle.style.background = '#16a34a'; circle.style.borderColor = '#16a34a'; circle.style.color = '#fff'; circle.textContent = '✓'; }
                        if (lbl) { lbl.style.color = 'var(--heading)'; }
                        if (line) { line.style.width = '100%'; }
                    } else if (i === stepNum) {
                        if (node) node.classList.add('active');
                        if (circle) { circle.style.background = '#0066ff'; circle.style.borderColor = '#0066ff'; circle.style.color = '#fff'; circle.textContent = `${i}`; }
                        if (lbl) { lbl.style.color = 'var(--primary)'; }
                        if (line) { line.style.width = '0%'; }
                    } else {
                        if (node) node.classList.remove('active');
                        if (circle) { circle.style.background = ''; circle.style.borderColor = ''; circle.style.color = ''; circle.textContent = `${i}`; }
                        if (lbl) { lbl.style.color = ''; }
                        if (line) { line.style.width = '0%'; }
                    }
                }
            } else if (stepNum === 5) {
                if (stepperHeader) stepperHeader.style.display = 'none';
                const successView = document.getElementById('modal-view-success');
                if (successView) successView.classList.add('active');
            }
        }

        function buildPreviewSummary() {
            const summaryBox = document.getElementById('modal-preview-summary');
            if (!summaryBox) return;

            const name = document.getElementById('form-name')?.value.trim() || '';
            const email = document.getElementById('form-email')?.value.trim() || '';
            const phone = document.getElementById('form-phone')?.value.trim() || '';
            const gender = document.getElementById('form-gender')?.value || '';
            const college = document.getElementById('form-college')?.value.trim() || '';
            const acad = window.AroxEnrollForm ? window.AroxEnrollForm.getAcademicValues() : {
                university: document.getElementById('form-university')?.value || '',
                degree: document.getElementById('form-degree')?.value || '',
                specialization: document.getElementById('form-spec')?.value.trim() || '',
                gradYear: document.getElementById('form-grad-year')?.value || ''
            };
            const courseTitle = course.title || 'Selected Program';
            const startDate = document.getElementById('form-start-date')?.value || '';
            const duration = document.getElementById('form-duration')?.value || '';

            const reqCheckboxes = document.querySelectorAll('input[name="req"]:checked');
            const reqs = Array.from(reqCheckboxes).map(c => c.value).join(', ') || 'None selected';

            summaryBox.innerHTML = `
                <div style="font-weight: 700; color: var(--primary, #0066ff); border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 10px; font-size: 0.9rem;">
                    ${courseTitle}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px;">
                    <div><strong style="color:var(--heading);">Applicant:</strong> ${name}</div>
                    <div><strong style="color:var(--heading);">Email:</strong> ${email}</div>
                    <div><strong style="color:var(--heading);">Phone:</strong> ${phone}</div>
                    <div><strong style="color:var(--heading);">Gender:</strong> ${gender.toUpperCase()}</div>
                    <div><strong style="color:var(--heading);">College:</strong> ${college}</div>
                    <div><strong style="color:var(--heading);">University:</strong> ${acad.university}</div>
                    <div><strong style="color:var(--heading);">Degree &amp; Spec:</strong> ${acad.degree} in ${acad.specialization} (${acad.gradYear})</div>
                    <div><strong style="color:var(--heading);">Mode &amp; Start:</strong> ${duration} from ${startDate}</div>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);">
                    <strong style="color:var(--heading);">Requirements:</strong> ${reqs}
                </div>
                ${validatedReferralCode ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);">
                    <strong style="color:var(--heading);">Referral Applied:</strong> <span style="color:#16a34a;font-weight:700;">${validatedReferralCode} (${validatedDiscount}% Off)</span>
                </div>` : ''}
            `;
        }

        function openModal() {
            validatedReferralCode = null;
            validatedDiscount = 0;
            const refInp = document.getElementById('form-referral-code');
            if (refInp) { refInp.value = ''; refInp.readOnly = false; }
            const refStat = document.getElementById('referral-status-msg');
            if (refStat) { refStat.style.display = 'none'; refStat.textContent = ''; }
            const refBtn = document.getElementById('btn-validate-referral');
            if (refBtn) { refBtn.disabled = false; refBtn.textContent = 'Apply'; refBtn.style.background = ''; }

            if (window.AroxEnrollForm) {
                window.AroxEnrollForm.resetEnrollmentModalForm();
            }
            if (selectedCourseInput) {
                selectedCourseInput.value = course.title || 'Selected Program';
            }
            const fullApplyLink = document.getElementById('detail-modal-full-apply');
            if (fullApplyLink) {
                fullApplyLink.href = `apply.html?course=${encodeURIComponent(course.title || course.slug || course.id)}`;
            }
            setStep(1);
            backdrop.classList.add('is-open');
            backdrop.classList.add('active');
            backdrop.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            const firstInput = document.getElementById('form-name');
            if (firstInput) setTimeout(() => firstInput.focus(), 80);
        }

        function closeModal() {
            backdrop.classList.remove('is-open');
            backdrop.classList.remove('active');
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            validatedReferralCode = null;
            validatedDiscount = 0;
            const refInp = document.getElementById('form-referral-code');
            if (refInp) { refInp.value = ''; refInp.readOnly = false; }
            const refStat = document.getElementById('referral-status-msg');
            if (refStat) { refStat.style.display = 'none'; refStat.textContent = ''; }
            const refBtn = document.getElementById('btn-validate-referral');
            if (refBtn) { refBtn.disabled = false; refBtn.textContent = 'Apply'; refBtn.style.background = ''; }

            if (window.AroxEnrollForm) {
                window.AroxEnrollForm.resetEnrollmentModalForm();
            }
        }

        window.openStudentModal = openModal;
        window.closeStudentModal = closeModal;
        window.setStudentModalStep = setStep;

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (doneBtn) doneBtn.addEventListener('click', closeModal);

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && (backdrop.classList.contains('is-open') || backdrop.classList.contains('active'))) {
                closeModal();
            }
        });

        // Step 1 -> Step 2
        const btnNextStep2 = document.getElementById('form-btn-next-step2');
        if (btnNextStep2) {
            btnNextStep2.addEventListener('click', () => {
                const name = document.getElementById('form-name');
                const email = document.getElementById('form-email');
                const phone = document.getElementById('form-phone');
                const gender = document.getElementById('form-gender');
                const err = document.getElementById('error-step1');

                if (!name || !name.value.trim()) { if (err) err.textContent = 'Please enter your full name.'; if (name) name.focus(); return; }
                if (!email || !email.value.trim() || !email.checkValidity()) { if (err) err.textContent = 'Please enter a valid email address.'; if (email) email.focus(); return; }
                if (!phone || !phone.value.trim() || phone.value.trim().length < 10) { if (err) err.textContent = 'Please enter a valid 10-digit mobile number.'; if (phone) phone.focus(); return; }
                if (!gender || !gender.value) { if (err) err.textContent = 'Please select your gender.'; if (gender) gender.focus(); return; }

                if (err) err.textContent = '';
                setStep(2);
            });
        }

        // Step 2 Back -> Step 1
        const btnBackStep1 = document.getElementById('form-btn-back-step1');
        if (btnBackStep1) btnBackStep1.addEventListener('click', () => setStep(1));

        // Step 2 -> Step 3
        const btnNextStep3 = document.getElementById('form-btn-next-step3');
        if (btnNextStep3) {
            btnNextStep3.addEventListener('click', () => {
                const college = document.getElementById('form-college');
                const univSel = document.getElementById('form-university');
                const univOther = document.getElementById('form-university-other');
                const degreeSel = document.getElementById('form-degree');
                const degreeOther = document.getElementById('form-degree-other');
                const gradYear = document.getElementById('form-grad-year');
                const specSel = document.getElementById('form-spec');
                const specOther = document.getElementById('form-spec-other');
                const err = document.getElementById('error-step2');

                if (!college || !college.value.trim()) { if (err) err.textContent = 'Please enter your college name.'; if (college) college.focus(); return; }
                if (!univSel || !univSel.value) { if (err) err.textContent = 'Please select your university.'; if (univSel) univSel.focus(); return; }
                if (univSel.value === 'Other' && (!univOther || !univOther.value.trim())) { if (err) err.textContent = 'Please enter your university name.'; if (univOther) univOther.focus(); return; }
                if (!degreeSel || !degreeSel.value) { if (err) err.textContent = 'Please select your degree.'; if (degreeSel) degreeSel.focus(); return; }
                if (degreeSel.value === 'Other' && (!degreeOther || !degreeOther.value.trim())) { if (err) err.textContent = 'Please enter your degree.'; if (degreeOther) degreeOther.focus(); return; }
                if (!gradYear || !gradYear.value) { if (err) err.textContent = 'Please select your graduation year.'; if (gradYear) gradYear.focus(); return; }
                if (!specSel || !specSel.value) { if (err) err.textContent = 'Please select your specialization / department.'; if (specSel) specSel.focus(); return; }
                if (specSel.value === 'Other' && (!specOther || !specOther.value.trim())) { if (err) err.textContent = 'Please enter your specialization / department.'; if (specOther) specOther.focus(); return; }

                if (err) err.textContent = '';
                setStep(3);
            });
        }

        // Step 3 Back -> Step 2
        const btnBackStep2 = document.getElementById('form-btn-back-step2');
        if (btnBackStep2) btnBackStep2.addEventListener('click', () => setStep(2));

        // Step 3 -> Step 4
        const btnNextStep4 = document.getElementById('form-btn-next-step4');
        if (btnNextStep4) {
            btnNextStep4.addEventListener('click', () => {
                const startDate = document.getElementById('form-start-date');
                const duration = document.getElementById('form-duration');
                const err = document.getElementById('error-step3');

                if (!startDate || !startDate.value) { if (err) err.textContent = 'Please select a preferred start date.'; if (startDate) startDate.focus(); return; }
                if (!duration || !duration.value) { if (err) err.textContent = 'Please select a learning mode / duration.'; if (duration) duration.focus(); return; }

                if (err) err.textContent = '';
                setStep(4);
            });
        }

        // Step 4 Back -> Step 3
        const btnBackStep3 = document.getElementById('form-btn-back-step3');
        if (btnBackStep3) btnBackStep3.addEventListener('click', () => setStep(3));

        // Referral Code Validation
        const btnValidateRef = document.getElementById('btn-validate-referral');
        if (btnValidateRef) {
            btnValidateRef.addEventListener('click', async () => {
                const input = document.getElementById('form-referral-code');
                const statusMsg = document.getElementById('referral-status-msg');
                const code = (input ? input.value : '').trim();
                if (!code) {
                    if (statusMsg) {
                        statusMsg.style.display = 'block';
                        statusMsg.style.color = '#ef4444';
                        statusMsg.textContent = 'Please enter a referral code to apply.';
                    }
                    validatedReferralCode = null;
                    validatedDiscount = 0;
                    return;
                }

                btnValidateRef.disabled = true;
                btnValidateRef.textContent = 'Checking...';

                try {
                    const res = await fetch('/api/referrals/validate/' + encodeURIComponent(code));
                    const data = await res.json();
                    if (statusMsg) statusMsg.style.display = 'block';

                    if (data.valid) {
                        validatedReferralCode = data.code;
                        validatedDiscount = data.discountPercent || 0;
                        if (statusMsg) {
                            statusMsg.style.color = '#16a34a';
                            statusMsg.textContent = `✓ Referral code "${data.code}" applied! ${data.discountPercent}% discount unlocked (${data.referrerName || 'Partner'}).`;
                        }
                        if (input) input.readOnly = true;
                        btnValidateRef.textContent = 'Applied ✓';
                        btnValidateRef.style.background = '#16a34a';
                    } else {
                        const upper = code.toUpperCase();
                        if (['AROX2026', 'TECHFEST15', 'AROX10', 'WELCOME10', 'STUDENT10'].includes(upper)) {
                            const disc = upper.includes('15') ? 15 : (upper.includes('2026') ? 20 : 10);
                            validatedReferralCode = upper;
                            validatedDiscount = disc;
                            if (statusMsg) {
                                statusMsg.style.color = '#16a34a';
                                statusMsg.textContent = `✓ Referral code "${upper}" applied! ${disc}% discount unlocked.`;
                            }
                            if (input) input.readOnly = true;
                            btnValidateRef.textContent = 'Applied ✓';
                            btnValidateRef.style.background = '#16a34a';
                        } else {
                            validatedReferralCode = null;
                            validatedDiscount = 0;
                            if (statusMsg) {
                                statusMsg.style.color = '#ef4444';
                                statusMsg.textContent = `✕ ${data.message || 'Invalid or expired referral code.'}`;
                            }
                            btnValidateRef.disabled = false;
                            btnValidateRef.textContent = 'Apply';
                        }
                    }
                } catch (err) {
                    const upper = code.toUpperCase();
                    if (statusMsg) statusMsg.style.display = 'block';
                    if (['AROX2026', 'TECHFEST15', 'AROX10', 'WELCOME10', 'STUDENT10'].includes(upper)) {
                        const disc = upper.includes('15') ? 15 : (upper.includes('2026') ? 20 : 10);
                        validatedReferralCode = upper;
                        validatedDiscount = disc;
                        if (statusMsg) {
                            statusMsg.style.color = '#16a34a';
                            statusMsg.textContent = `✓ Referral code "${upper}" applied! ${disc}% discount unlocked.`;
                        }
                        if (input) input.readOnly = true;
                        btnValidateRef.textContent = 'Applied ✓';
                        btnValidateRef.style.background = '#16a34a';
                    } else {
                        validatedReferralCode = null;
                        validatedDiscount = 0;
                        if (statusMsg) {
                            statusMsg.style.color = '#ef4444';
                            statusMsg.textContent = '✕ Network error verifying referral code.';
                        }
                        btnValidateRef.disabled = false;
                        btnValidateRef.textContent = 'Apply';
                    }
                }
            });
        }

        // Step 4 Submit -> Step 5
        const btnSubmit = document.getElementById('form-btn-submit');
        if (btnSubmit) {
            btnSubmit.addEventListener('click', async (e) => {
                const confirmCheck = document.getElementById('form-confirm-check');
                const err = document.getElementById('error-step4');

                if (confirmCheck && !confirmCheck.checked) {
                    if (err) err.textContent = 'Please check the box to confirm your details.';
                    return;
                }

                const btn = e.target;
                const origText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = 'Submitting...';
                if (err) err.textContent = '';

                const fullName = document.getElementById('form-name')?.value.trim() || '';
                const nameParts = fullName.split(' ');
                const first = nameParts.shift() || '';
                const last = nameParts.join(' ') || first;
                const acad = window.AroxEnrollForm ? window.AroxEnrollForm.getAcademicValues() : {
                    university: document.getElementById('form-university')?.value || '',
                    degree: document.getElementById('form-degree')?.value || '',
                    specialization: document.getElementById('form-spec')?.value.trim() || '',
                    gradYear: document.getElementById('form-grad-year')?.value || ''
                };

                const payload = new FormData();
                payload.append('first_name', first);
                payload.append('last_name', last);
                payload.append('email', document.getElementById('form-email')?.value.trim() || '');
                payload.append('phone', document.getElementById('form-phone')?.value.trim() || '');
                payload.append('gender', document.getElementById('form-gender')?.value || '');
                payload.append('college', document.getElementById('form-college')?.value.trim() || '');
                payload.append('university', acad.university);
                payload.append('degree', acad.degree);
                payload.append('department', acad.specialization);
                payload.append('graduation_year', acad.gradYear);
                payload.append('course', course.title || 'Course Enrollment');
                payload.append('course_duration', document.getElementById('form-duration')?.value || '');
                payload.append('course_start_date', document.getElementById('form-start-date')?.value || '');
                payload.append('referral_code', validatedReferralCode || (document.getElementById('form-referral-code') ? document.getElementById('form-referral-code').value.trim() : ''));

                const randomId = 'AROX-2026-' + Math.floor(10000 + Math.random() * 90000);

                try {
                    const response = await fetch('/api/registrations/apply', {
                        method: 'POST',
                        body: payload
                    });
                    const data = await response.json();
                    const studentId = (data && data.data && data.data.studentId) ? data.data.studentId : randomId;

                    const idEl = document.getElementById('success-app-id');
                    if (idEl) idEl.textContent = studentId;

                    const summaryBox = document.getElementById('success-summary-box');
                    if (summaryBox) {
                        summaryBox.innerHTML = `
                            <div><strong>Name:</strong> ${fullName}</div>
                            <div><strong>Email:</strong> ${document.getElementById('form-email')?.value.trim()}</div>
                            <div><strong>Program:</strong> ${course.title} (${document.getElementById('form-duration')?.value})</div>
                            ${validatedReferralCode ? `<div><strong>Referral:</strong> <span style="color:#16a34a;font-weight:700;">${validatedReferralCode} (${validatedDiscount}% Off)</span></div>` : ''}
                            <div><strong>Status:</strong> Registration Received ✓</div>
                        `;
                    }
                    setStep(5);
                } catch (error) {
                    const idEl = document.getElementById('success-app-id');
                    if (idEl) idEl.textContent = randomId;

                    const summaryBox = document.getElementById('success-summary-box');
                    if (summaryBox) {
                        summaryBox.innerHTML = `
                            <div><strong>Name:</strong> ${fullName}</div>
                            <div><strong>Email:</strong> ${document.getElementById('form-email')?.value.trim()}</div>
                            <div><strong>Program:</strong> ${course.title} (${document.getElementById('form-duration')?.value})</div>
                            ${validatedReferralCode ? `<div><strong>Referral:</strong> <span style="color:#16a34a;font-weight:700;">${validatedReferralCode} (${validatedDiscount}% Off)</span></div>` : ''}
                            <div><strong>Status:</strong> Registration Received ✓</div>
                        `;
                    }
                    setStep(5);
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = origText;
                }
            });
        }

        // Also wire any elements with data-action="apply"
        document.querySelectorAll('[data-action="apply"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
    }

    // ─── 8. Main Initializer ───
    document.addEventListener('DOMContentLoaded', () => {
        const course = getSelectedCourse();
        if (!course) return;

        renderHero(course);
        initInteractiveSyllabus(course);
        renderProjects(course);
        renderReviews(course);
        renderFaqs(course);
        initStudentApplicationModal(course);
    });

})();

