new_slit_styles = """/* Card Rail Container: Centered on screen, width sized to cards, spaces distributed in between */
    .internship-cards-rail,
    .domain-cards-track {
      width: 100%;
      max-width: 1240px;
      height: min(530px, calc(100vh - 170px)) !important;
      min-height: 490px !important;
      margin: 0 auto !important;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
      background: linear-gradient(145deg, #F4F8FD 0%, #EAF2FC 100%);
      border: 1px solid rgba(215, 230, 250, 0.9);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 10px 40px -10px rgba(0, 102, 255, 0.08);
      padding: 12px 14px !important;
      gap: 10px !important;
      position: relative;
      box-sizing: border-box;
      transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, max-width 0.4s ease;
    }

    /* Domain-specific max-widths to reduce extra empty spacing at ending */
    .domain-cards-track[data-count="4"] {
      max-width: 800px !important;
    }
    .domain-cards-track[data-count="5"] {
      max-width: 900px !important;
    }
    .domain-cards-track[data-count="6"] {
      max-width: 1000px !important;
    }

    .theme-dark .internship-cards-rail,
    .theme-dark .domain-cards-track {
      background: linear-gradient(145deg, #050a14 0%, #03060d 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.7) !important;
    }

    /* Individual Slit Card (Initially & normally collapsed, Image 1 & User Reference) */
    .internship-card-slit {
      position: relative;
      flex: 0 0 48px;
      min-width: 44px;
      max-width: 52px;
      height: 100%;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      border: 1px solid rgba(220, 232, 248, 0.85);
      box-shadow: 0 2px 10px rgba(0, 60, 180, 0.04);
      transition: flex 0.75s cubic-bezier(0.25, 1, 0.35, 1),
                  max-width 0.75s cubic-bezier(0.25, 1, 0.35, 1),
                  background 0.35s ease,
                  border-color 0.35s ease,
                  box-shadow 0.4s ease;
      will-change: flex, max-width;
      transform: translateZ(0);
      backface-visibility: hidden;
      user-select: none;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .theme-dark .internship-card-slit {
      background: linear-gradient(180deg, #0e1828 0%, #081220 100%) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4) !important;
    }

    .internship-card-slit:not(.active):hover {
      background: #FFFFFF;
      border-color: rgba(0, 102, 255, 0.4);
      box-shadow: 0 8px 24px rgba(0, 102, 255, 0.12);
    }

    .theme-dark .internship-card-slit:not(.active):hover {
      background: linear-gradient(180deg, #132238 0%, #0c1a2d 100%) !important;
      border-color: rgba(0, 190, 255, 0.65) !important;
      box-shadow: 0 0 22px rgba(0, 140, 255, 0.35) !important;
    }

    /* Active / Mouse-Hovered Expanded Card (Smooth reveal matching User Reference) */
    .internship-card-slit.active {
      flex: 1 1 auto;
      max-width: 690px;
      min-width: 580px;
      cursor: default;
      border-radius: 26px;
      background: linear-gradient(135deg, #FFFFFF 0%, #F5F9FE 55%, #EAF2FD 100%);
      border: 1.5px solid rgba(180, 215, 250, 0.95);
      box-shadow: 0 14px 44px rgba(0, 102, 255, 0.12);
    }

    .theme-dark .internship-card-slit.active {
      background: linear-gradient(145deg, #071526 0%, #0a1e36 50%, #06111e 100%) !important;
      border: 2px solid #00B4FF !important;
      box-shadow: 0 0 32px rgba(0, 160, 255, 0.4), inset 0 0 20px rgba(0, 140, 255, 0.12) !important;
    }

    /* Collapsed Slit View: Top Number, Vertical Title reading upwards, Right Arrow, Bottom Bar (Image 1 & User Ref) */
    .card-slit-view {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 22px 6px 16px;
      box-sizing: border-box;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
      z-index: 2;
      overflow: hidden;
    }

    .internship-card-slit.active .card-slit-view {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s;
    }

    .card-slit-num {
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 14.5px;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: -0.01em;
      line-height: 1;
      user-select: none;
      transition: color 0.3s ease;
    }

    .internship-card-slit:hover .card-slit-num {
      color: #0066FF;
    }
    .theme-dark .internship-card-slit:hover .card-slit-num {
      color: #00D2FF;
    }

    .card-slit-title {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      text-transform: uppercase;
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0F172A;
      white-space: nowrap;
      margin: auto 0;
      transition: color 0.3s ease;
      user-select: none;
    }

    .theme-dark .card-slit-title {
      color: #CBD5E1;
    }

    .internship-card-slit:hover .card-slit-title {
      color: #0066FF;
    }
    .theme-dark .internship-card-slit:hover .card-slit-title {
      color: #FFFFFF;
    }

    .card-slit-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
      width: 100%;
      margin-top: auto;
    }

    .card-slit-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748B;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
    }

    .theme-dark .card-slit-arrow {
      color: #64748B;
    }

    .internship-card-slit:hover .card-slit-arrow {
      color: #0066FF;
      transform: translateX(3px);
    }
    .theme-dark .internship-card-slit:hover .card-slit-arrow {
      color: #00D2FF;
      transform: translateX(3px);
    }

    .card-slit-bar {
      width: 32px;
      height: 3.5px;
      border-radius: 9999px;
      background: rgba(0, 0, 0, 0.12);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    .theme-dark .card-slit-bar {
      background: rgba(255, 255, 255, 0.14);
    }

    .internship-card-slit:hover .card-slit-bar {
      background: #0066FF;
      box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
    }
    .theme-dark .internship-card-slit:hover .card-slit-bar {
      background: #FFFFFF;
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.7);
    }

    /* Expanded Card Hero View: Static text layout matching User Reference Image */
    .card-hero-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      padding: 34px 38px 28px 38px;
      box-sizing: border-box;
      z-index: 5;
      overflow: hidden;
      transform: none !important;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .internship-card-slit.active .card-hero-view {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: none !important;
    }

    .card-hero-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      max-width: 52%;
      flex-shrink: 0;
      z-index: 10;
      position: relative;
      transform: none !important;
      text-align: left !important;
    }

    .card-hero-content > * {
      transform: none !important;
      opacity: 1 !important;
      transition: none !important;
    }

    /* Reference Eyebrow: Blue pill bar + text + fading line */
    .card-hero-eyebrow-row {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 10px;
      margin-bottom: 14px;
    }

    .card-hero-pill-bar {
      display: inline-block;
      width: 5px;
      height: 18px;
      border-radius: 3px;
      background: #0066FF;
      flex-shrink: 0;
    }

    .theme-dark .card-hero-pill-bar {
      background: #00D2FF;
      box-shadow: 0 0 10px #00D2FF;
    }

    .card-hero-eyebrow-text {
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0F172A;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .theme-dark .card-hero-eyebrow-text {
      color: #FFFFFF;
    }

    .card-hero-fade-line {
      flex: 1;
      max-width: 120px;
      height: 2px;
      background: linear-gradient(90deg, #0084FF 0%, rgba(0, 132, 255, 0) 100%);
      opacity: 0.75;
    }

    .theme-dark .card-hero-fade-line {
      background: linear-gradient(90deg, #00D2FF 0%, rgba(0, 210, 255, 0) 100%);
    }

    /* Reference Title: Bold multi-line display */
    .card-hero-title {
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: clamp(30px, 2.7vw, 38px);
      font-weight: 900;
      line-height: 1.08;
      color: #0b132a;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      margin: 0;
    }

    .theme-dark .card-hero-title {
      color: #FFFFFF;
    }

    .hero-title-accent {
      color: #0066FF;
    }

    .theme-dark .hero-title-accent {
      color: #00D2FF;
      text-shadow: 0 0 20px rgba(0, 210, 255, 0.5);
    }

    /* Reference Underline: Solid blue rounded bar */
    .card-hero-title-underline {
      width: 58px;
      height: 5px;
      border-radius: 3px;
      background: #0066FF;
      margin-top: 12px;
      margin-bottom: 18px;
    }

    .theme-dark .card-hero-title-underline {
      background: #00D2FF;
      box-shadow: 0 0 14px rgba(0, 210, 255, 0.9);
    }

    .card-hero-desc {
      font-family: var(--font-sans, 'Montserrat', sans-serif);
      font-size: 14.5px;
      line-height: 1.52;
      color: #334155;
      width: 100%;
      max-width: 360px;
      margin-bottom: 22px;
      word-break: normal;
      text-align: left;
    }

    .theme-dark .card-hero-desc {
      color: #CBD5E1;
    }

    /* Reference Explore Track Button */
    .card-hero-cta {
      white-space: nowrap !important;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 12px 28px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #0084FF 0%, #0056D6 100%);
      color: #FFFFFF;
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 102, 255, 0.35);
      transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
      z-index: 12;
    }

    .card-hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(0, 102, 255, 0.45);
      filter: brightness(1.06);
    }

    .theme-dark .card-hero-cta {
      background: linear-gradient(135deg, #00A6FF 0%, #0056D6 100%);
      box-shadow: 0 0 25px rgba(0, 140, 255, 0.65), 0 8px 20px rgba(0, 102, 255, 0.45);
    }

    .theme-dark .card-hero-cta:hover {
      box-shadow: 0 0 34px rgba(0, 180, 255, 0.85), 0 10px 24px rgba(0, 102, 255, 0.55);
    }

    /* 3D Course Graphic Aligned at Bottom Right (Exact as Reference Image) */
    .card-hero-graphic {
      position: absolute;
      right: 14px;
      bottom: 8px;
      width: 390px;
      height: 300px;
      max-width: 52%;
      max-height: 72%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      z-index: 6;
      pointer-events: none;
    }

    .hero-card-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: right bottom;
      filter: drop-shadow(0 14px 28px rgba(0, 60, 180, 0.16));
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .theme-dark .hero-card-img {
      filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 35px rgba(0, 180, 255, 0.25));
    }

    .internship-card-slit.active:hover .hero-card-img {
      transform: translateY(-4px) scale(1.02);
    }

    /* Reference Card Background Waves */
    .card-hero-waves {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background-image: 
        radial-gradient(circle at 10% 105%, rgba(0, 140, 255, 0.15) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 65%, rgba(0, 140, 255, 0.12) 0%, transparent 60%);
      opacity: 1;
      transition: opacity 0.4s ease;
    }

    .theme-dark .card-hero-waves {
      background-image: 
        /* Bottom-left glowing cyan arc */
        radial-gradient(circle at 10% 105%, rgba(0, 210, 255, 0.38) 0%, rgba(0, 160, 255, 0.15) 35%, transparent 60%),
        /* Middle-right soft cyan wave */
        radial-gradient(ellipse at 88% 65%, rgba(0, 180, 255, 0.28) 0%, rgba(0, 102, 255, 0.1) 45%, transparent 65%),
        /* Top-right ambient aura */
        radial-gradient(circle at 95% 10%, rgba(0, 140, 255, 0.25) 0%, transparent 50%);
    }
"""

def apply_update(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_marker = "/* Card Rail Container: Centered on screen, width sized to cards, spaces distributed in between */"
    end_marker = "/* Responsive: Tablet and Mobile (<1024px) */"
    
    s = content.find(start_marker)
    e = content.find(end_marker)
    if s == -1 or e == -1:
        print(f"Error: Markers not found in {filename}")
        return False
        
    new_content = content[:s] + new_slit_styles + "\n    " + content[e:]
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated slit card sizes, bg colors & animation speed in {filename}")
    return True

apply_update('training.html')
apply_update('courses.html')

