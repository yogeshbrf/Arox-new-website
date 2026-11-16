import re

def update_services():
    with open('services.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Define Mobile Styles
    mobile_style_tag = """
  <!-- AROX MOBILE SERVICES: Native Mobile App Style (Training Page Alignment) -->
  <style id="arox-mobile-services-native-styles">
    /* Hide on Desktop */
    .arox-mobile-services-view {
      display: none !important;
    }

    @media (max-width: 768px) {
      /* Completely disable and hide desktop 400vh sticky scroll on mobile */
      #services-stack-wrapper {
        display: none !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      #services-floating-nav {
        display: none !important;
      }

      /* Native App Mobile Services Feed */
      .arox-mobile-services-view {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 24px 16px 44px 16px !important;
        box-sizing: border-box !important;
        position: relative !important;
        z-index: 10 !important;
      }

      .arox-mob-service-section {
        width: 100% !important;
        margin-bottom: 34px !important;
      }
      .arox-mob-service-section:last-child {
        margin-bottom: 0 !important;
      }

      .arox-mob-service-header {
        width: 100% !important;
        margin-bottom: 12px !important;
        padding-left: 2px !important;
      }

      .arox-mob-service-heading {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: clamp(22px, 5.8vw, 26px) !important;
        font-weight: 800 !important;
        letter-spacing: -0.015em !important;
        margin: 0 0 4px 0 !important;
        line-height: 1.18 !important;
        transition: color 0.3s ease !important;
      }

      .arox-mob-service-sub {
        font-family: var(--font-sans, 'Montserrat', sans-serif) !important;
        font-size: 13px !important;
        font-weight: 400 !important;
        margin: 0 !important;
        line-height: 1.4 !important;
        transition: color 0.3s ease !important;
      }

      /* Dark mode text colors */
      html.dark .arox-mob-service-heading,
      html.theme-dark .arox-mob-service-heading,
      body.theme-dark .arox-mob-service-heading {
        color: #FFFFFF !important;
      }
      html.dark .arox-mob-service-sub,
      html.theme-dark .arox-mob-service-sub,
      body.theme-dark .arox-mob-service-sub {
        color: #94A3B8 !important;
      }

      /* Light mode text colors */
      html.theme-light .arox-mob-service-heading,
      html:not(.dark) .arox-mob-service-heading,
      body.theme-light .arox-mob-service-heading {
        color: #0A1629 !important;
      }
      html.theme-light .arox-mob-service-sub,
      html:not(.dark) .arox-mob-service-sub,
      body.theme-light .arox-mob-service-sub {
        color: #475569 !important;
      }

      /* Horizontal scrolling carousel track (Native App feel) */
      .arox-mob-services-scroll-track {
        display: flex !important;
        gap: 14px !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        padding: 6px 2px 18px 2px !important;
        margin: 0 -16px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
      }
      .arox-mob-services-scroll-track::-webkit-scrollbar {
        display: none !important;
      }

      /* Square Card (matching Reference Image media_1794580201838_fe975541.jpg) */
      .arox-mob-service-card {
        width: 214px !important;
        min-width: 214px !important;
        height: 214px !important;
        min-height: 214px !important;
        aspect-ratio: 1 / 1 !important;
        position: relative !important;
        border-radius: 22px !important;
        overflow: hidden !important;
        scroll-snap-align: start !important;
        flex-shrink: 0 !important;
        cursor: pointer !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 13px 14px 13px 14px !important;
        box-sizing: border-box !important;
        transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .arox-mob-service-card:active {
        transform: scale(0.97) !important;
      }

      /* Square Card: DARK THEME */
      html.dark .arox-mob-service-card,
      html.theme-dark .arox-mob-service-card,
      body.theme-dark .arox-mob-service-card {
        background: linear-gradient(150deg, #101626 0%, #080d19 100%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.55) !important;
      }

      /* Square Card: LIGHT THEME */
      html.theme-light .arox-mob-service-card,
      html:not(.dark) .arox-mob-service-card,
      body.theme-light .arox-mob-service-card {
        background: linear-gradient(150deg, #FFFFFF 0%, #F3F7FD 100%) !important;
        border: 1px solid rgba(218, 228, 244, 0.95) !important;
        box-shadow: 0 8px 24px rgba(0, 60, 180, 0.08) !important;
      }

      /* Card Header: Title on Left, Circular Button on Right */
      .arox-mob-card-head {
        display: flex !important;
        align-items: flex-start !important;
        justify-content: space-between !important;
        gap: 8px !important;
        margin-bottom: 8px !important;
        width: 100% !important;
        flex-shrink: 0 !important;
      }

      .arox-mob-card-title {
        font-family: var(--font-display, 'Montserrat', sans-serif) !important;
        font-size: 14.5px !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        letter-spacing: -0.01em !important;
        margin: 0 !important;
        flex: 1 1 auto !important;
        text-align: left !important;
      }

      html.dark .arox-mob-card-title,
      html.theme-dark .arox-mob-card-title,
      body.theme-dark .arox-mob-card-title {
        color: #FFFFFF !important;
      }
      html.theme-light .arox-mob-card-title,
      html:not(.dark) .arox-mob-card-title,
      body.theme-light .arox-mob-card-title {
        color: #0F172A !important;
      }

      /* Circular Arrow Button */
      .arox-mob-card-arrow {
        width: 28px !important;
        height: 28px !important;
        min-width: 28px !important;
        min-height: 28px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        background: rgba(255, 255, 255, 0.08) !important;
        color: #CBD5E1 !important;
        cursor: pointer !important;
        padding: 0 !important;
        transition: transform 0.2s ease, background 0.2s ease !important;
      }
      .arox-mob-service-card:hover .arox-mob-card-arrow,
      .arox-mob-service-card:active .arox-mob-card-arrow {
        transform: translate(1px, -1px) !important;
      }
      html.theme-light .arox-mob-card-arrow,
      html:not(.dark) .arox-mob-card-arrow,
      body.theme-light .arox-mob-card-arrow {
        background: rgba(0, 102, 255, 0.08) !important;
        border-color: rgba(0, 102, 255, 0.18) !important;
        color: #0066FF !important;
      }

      /* Video Box (Square Proportions, Crisp Placement) */
      .arox-mob-card-video-wrap {
        flex: 1 1 auto !important;
        width: 100% !important;
        min-height: 0 !important;
        border-radius: 14px !important;
        overflow: hidden !important;
        position: relative !important;
        background: #000000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .arox-mob-card-video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        border-radius: 14px !important;
        pointer-events: none !important;
      }
    }
  </style>
"""

    # Insert mobile style tag before </head>
    if '<style id="arox-mobile-services-native-styles">' not in html:
        html = html.replace('</head>', mobile_style_tag + '\n</head>')

    # 2. Add MobileServiceCard and MobileServicesView components
    react_components = """
        // ------------------------------------------------------------
        // MOBILE NATIVE SERVICES COMPONENTS (Training Page Alignment)
        // ------------------------------------------------------------
        function MobileServiceCard({ service }) {
            const videoRef = useRef(null);

            const handleNavigate = () => {
                window.location.href = `contact.html?service=${encodeURIComponent(service.name)}`;
            };

            useEffect(() => {
                const video = videoRef.current;
                if (!video) return;

                video.muted = true;
                video.defaultMuted = true;

                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                video.play().catch(() => {});
                            } else {
                                video.pause();
                            }
                        });
                    }, { threshold: 0.25 });
                    observer.observe(video);
                    return () => observer.disconnect();
                } else {
                    video.play().catch(() => {});
                }
            }, []);

            return (
                <div 
                    onClick={handleNavigate}
                    className="arox-mob-service-card"
                    role="button"
                    tabIndex={0}
                    aria-label={`${service.name} service`}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleNavigate(); }}
                >
                    {/* Top Header: Title on Left, Circular Arrow Button on Right */}
                    <div className="arox-mob-card-head">
                        <h3 className="arox-mob-card-title">{service.name}</h3>
                        <button
                            type="button"
                            aria-label={`Explore ${service.name}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate();
                            }}
                            className="arox-mob-card-arrow"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </button>
                    </div>

                    {/* Video Container (No explanation text as requested) */}
                    <div className="arox-mob-card-video-wrap">
                        <video 
                            ref={videoRef}
                            src={service.video} 
                            loop 
                            muted 
                            playsInline
                            autoPlay
                            preload="auto"
                            className="arox-mob-card-video"
                        />
                    </div>
                </div>
            );
        }

        function MobileServicesView({ categories }) {
            return (
                <div className="arox-mobile-services-view" id="aroxMobileServicesView">
                    {categories.map((domain) => (
                        <div key={domain.id} className="arox-mob-service-section">
                            <div className="arox-mob-service-header">
                                <h2 className="arox-mob-service-heading">{domain.name}</h2>
                                {domain.tagline && (
                                    <p className="arox-mob-service-sub">{domain.tagline}</p>
                                )}
                            </div>
                            <div className="arox-mob-services-scroll-track">
                                {domain.services.map((svc, idx) => (
                                    <MobileServiceCard key={idx} service={svc} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

"""

    # Insert right before function ServiceCard({ service })
    if 'function MobileServiceCard' not in html:
        target = 'function ServiceCard({ service }) {'
        html = html.replace(target, react_components + '\n        ' + target)

    # 3. Update checkNavAndHeader to ignore mobile
    old_check_nav = """                const checkNavAndHeader = () => {
                    const isMobile = window.innerWidth <= 768;
                    let isServicesActive = false;"""

    new_check_nav = """                const checkNavAndHeader = () => {
                    const isMobile = window.innerWidth <= 768;
                    if (isMobile) {
                        setNavVisible(false);
                        if (header) header.classList.remove('services-nav-hidden');
                        return;
                    }
                    let isServicesActive = false;"""

    if old_check_nav in html:
        html = html.replace(old_check_nav, new_check_nav)

    # 4. Update ScrollTrigger effect to not pin on mobile
    old_st = """            useEffect(() => {
                if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
                
                gsap.registerPlugin(ScrollTrigger);"""

    new_st = """            useEffect(() => {
                if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
                if (window.innerWidth <= 768) return; // Do NOT initialize desktop pinning on mobile!
                
                gsap.registerPlugin(ScrollTrigger);"""

    if old_st in html:
        html = html.replace(old_st, new_st)

    # 5. Insert <MobileServicesView categories={CATEGORIES} /> in App return
    old_return_top = """                    {/* Sticky Domain Stacking System for the 4 Service Domain Containers */}
                    <div id="services-stack-wrapper" className="relative w-full" style={{ height: '400vh' }}>"""

    new_return_top = """                    {/* Mobile View: Native App Feed with Horizontal Scroll Tracks */}
                    <MobileServicesView categories={CATEGORIES} />

                    {/* Sticky Domain Stacking System for the 4 Service Domain Containers */}
                    <div id="services-stack-wrapper" className="relative w-full" style={{ height: '400vh' }}>"""

    if old_return_top in html and '<MobileServicesView' not in html:
        html = html.replace(old_return_top, new_return_top)

    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("services.html updated successfully!")

if __name__ == "__main__":
    update_services()
