import os

new_css = """#services-floating-nav {
            position: fixed;
            top: 20px;
            left: 0;
            right: 0;
            z-index: 998;
            display: flex;
            justify-content: center;
            pointer-events: none !important;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-1rem);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }

        #services-floating-nav.is-nav-visible {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: translateY(0) !important;
        }

        #services-floating-nav.nav-hidden,
        #services-floating-nav:not(.is-nav-visible) {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transform: translateY(-1rem) !important;
        }

        #services-floating-nav.nav-hidden *,
        #services-floating-nav:not(.is-nav-visible) * {
            pointer-events: none !important;
            cursor: default !important;
        }"""

new_jsx = """{/* Floating Service Cards Navigation Bar */}
                    {/* Positioned at top of cards with guaranteed clearance (never touches cards) */}
                    <div 
                        id="services-floating-nav"
                        className={`fixed top-5 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${navVisible ? 'is-nav-visible opacity-100 translate-y-0 pointer-events-auto visible' : 'nav-hidden opacity-0 -translate-y-4 pointer-events-none invisible'}`}
                        style={{
                            visibility: navVisible ? 'visible' : 'hidden',
                            pointerEvents: navVisible ? 'auto' : 'none'
                        }}
                    >
                        <div 
                            className={`services-category-pills-bar ${navVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            style={{
                                pointerEvents: navVisible ? 'auto' : 'none',
                                visibility: navVisible ? 'visible' : 'hidden'
                            }}
                        >
                            {CATEGORIES.map((cat, idx) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    disabled={!navVisible}
                                    tabIndex={navVisible ? 0 : -1}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (navVisible) goToCard(idx);
                                    }}
                                    className={`services-category-pill-btn ${activeIdx === idx ? 'active' : ''}`}
                                    style={{
                                        pointerEvents: navVisible ? 'auto' : 'none'
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>"""

def update_services_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update CSS
    old_css_needle = """        #services-floating-nav {
            position: fixed;
            top: 20px;
            left: 0;
            right: 0;
            z-index: 998;
            display: flex;
            justify-content: center;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }"""
    if old_css_needle in content:
        content = content.replace(old_css_needle, new_css)
        print(f"Replaced CSS in {path}")
    else:
        print(f"Warning: old CSS needle not found in {path}")

    # 2. Update JSX
    old_jsx_needle = """{/* Floating Service Cards Navigation Bar */}
                    {/* Positioned at top of cards with guaranteed clearance (never touches cards) */}
                    <div 
                        id="services-floating-nav"
                        className={`fixed top-5 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ${navVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                    >
                        <div className="services-category-pills-bar pointer-events-auto">
                            {CATEGORIES.map((cat, idx) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => goToCard(idx)}
                                    className={`services-category-pill-btn ${activeIdx === idx ? 'active' : ''}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>"""
    if old_jsx_needle in content:
        content = content.replace(old_jsx_needle, new_jsx)
        print(f"Replaced JSX in {path}")
    else:
        print(f"Warning: old JSX needle not found in {path}")

    # 3. Update goToCard guard
    old_gotocard = """            const goToCard = (index) => {
                const st = ScrollTrigger.getById("services-folder-stack-trigger");"""
    new_gotocard = """            const goToCard = (index) => {
                if (!navVisible) return;
                const st = ScrollTrigger.getById("services-folder-stack-trigger");"""
    if old_gotocard in content:
        content = content.replace(old_gotocard, new_gotocard)
        print(f"Replaced goToCard in {path}")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {path}")

update_services_file('services.html')
if os.path.exists('arox-website/services.html'):
    update_services_file('arox-website/services.html')

