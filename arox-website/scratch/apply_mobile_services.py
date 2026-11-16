import re

# Read current services.html
with open('services.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Mobile Services CSS in the <style> section
# We'll place it right after the media query or inside it
mobile_css = """
        /* ============================================================ */
        /* AROX NATIVE MOBILE SERVICES SECTION (Training Page Style)     */
        /* Square Cards + Horizontal Scroll + Zero Explanation          */
        /* ============================================================ */
        .arox-mobile-services-view {
            display: none !important;
        }

        @media (max-width: 768px) {
            /* Hide the desktop 400vh pinned sticky stack on mobile */
            #services-stack-wrapper {
                display: none !important;
                height: 0 !important;
                overflow: hidden !important;
            }
            #services-floating-nav {
                display: none !important;
            }

            /* Show the mobile native services view */
            .arox-mobile-services-view {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 24px 16px 40px 16px !important;
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
                font-size: clamp(23px, 6vw, 27px) !important;
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
"""

print("Preparing to apply changes...")

