import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update rail height and max-width
    content = re.sub(
        r'(\.internship-cards-rail,\s*\.domain-cards-track\s*\{[^}]*?height:\s*)[^;]+;',
        r'\g<1>min(600px, calc(100vh - 150px)) !important;\n      min-height: 550px !important;',
        content
    )
    content = re.sub(
        r'(\.internship-cards-rail,\s*\.domain-cards-track\s*\{[^}]*?max-width:\s*)[^;]+;',
        r'\g<1>1300px;',
        content
    )
    content = re.sub(
        r'(\.internship-cards-rail,\s*\.domain-cards-track\s*\{[^}]*?gap:\s*)[^;]+;',
        r'\g<1>10px !important;',
        content
    )
    content = re.sub(
        r'(\.internship-cards-rail,\s*\.domain-cards-track\s*\{[^}]*?padding:\s*)[^;]+;',
        r'\g<1>12px 14px !important;',
        content
    )

    # 2. Update Inactive slit flex and width to 42px
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?flex:\s*)0 0 \d+px;',
        r'\g<1>0 0 42px;',
        content
    )
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?min-width:\s*)\d+px;',
        r'\g<1>38px;',
        content
    )
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?max-width:\s*)\d+px;',
        r'\g<1>44px;',
        content
    )

    # 3. Update Active Slit Card to exact match
    new_active_css = """.internship-card-slit.active {
      flex: 1 1 auto;
      max-width: 860px;
      min-width: 650px;
      cursor: default;
      border-radius: 30px;
      background: linear-gradient(135deg, #FFFFFF 0%, #F5F9FE 55%, #EAF2FD 100%);
      border: 1.5px solid rgba(180, 215, 250, 0.95);
      box-shadow: 0 14px 44px rgba(0, 102, 255, 0.12);
    }

    .theme-dark .internship-card-slit.active {
      background: linear-gradient(145deg, #021024 0%, #031530 45%, #010814 100%) !important;
      border: 2px solid #00B4FF !important;
      box-shadow: 0 0 35px rgba(0, 160, 255, 0.45), inset 0 0 22px rgba(0, 140, 255, 0.15) !important;
    }"""
    content = re.sub(
        r'\.internship-card-slit\.active\s*\{[^}]*?\}.*?\.theme-dark \.internship-card-slit\.active\s*\{[^}]*?\}',
        new_active_css,
        content,
        flags=re.DOTALL
    )

    # 4. Update .card-hero-view padding
    content = re.sub(
        r'(\.card-hero-view\s*\{[^}]*?padding:\s*)[^;]+;',
        r'\g<1>42px 46px 34px 46px;',
        content
    )

    # 5. Update .card-hero-content max-width
    content = re.sub(
        r'(\.card-hero-content\s*\{[^}]*?max-width:\s*)[^;]+;',
        r'\g<1>52%;',
        content
    )

    # 6. Update .card-hero-eyebrow-row
    old_eyebrow_css = """.card-hero-eyebrow-row {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      margin-bottom: 18px;
    }

    .card-hero-pill-bar {
      display: inline-block;
      width: 5px;
      height: 20px;
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
      font-size: 13px;
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
      max-width: 140px;
      height: 2px;
      background: linear-gradient(90deg, #0084FF 0%, rgba(0, 132, 255, 0) 100%);
      opacity: 0.75;
    }

    .theme-dark .card-hero-fade-line {
      background: linear-gradient(90deg, #00D2FF 0%, rgba(0, 210, 255, 0) 100%);
    }"""

    content = re.sub(
        r'\.card-hero-eyebrow-row\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-fade-line\s*\{[^}]*?\}',
        old_eyebrow_css,
        content,
        flags=re.DOTALL
    )

    # 7. Update .card-hero-title font size to 46px-52px matching the reference image
    new_title_css = """.card-hero-title {
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: clamp(36px, 3.6vw, 50px);
      font-weight: 900;
      line-height: 1.04;
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

    .card-hero-title-underline {
      width: 64px;
      height: 6px;
      border-radius: 3px;
      background: #0066FF;
      margin-top: 14px;
      margin-bottom: 24px;
    }

    .theme-dark .card-hero-title-underline {
      background: #00D2FF;
      box-shadow: 0 0 14px rgba(0, 210, 255, 0.9);
    }"""

    content = re.sub(
        r'\.card-hero-title\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-title-underline\s*\{[^}]*?\}',
        new_title_css,
        content,
        flags=re.DOTALL
    )

    # 8. Update .card-hero-desc
    new_desc_css = """.card-hero-desc {
      font-family: var(--font-sans, 'Montserrat', sans-serif);
      font-size: 16px;
      line-height: 1.55;
      color: #334155;
      width: 100%;
      max-width: 440px;
      margin-bottom: 28px;
      word-break: normal;
      text-align: left;
    }

    .theme-dark .card-hero-desc {
      color: #E2E8F0;
    }"""
    content = re.sub(
        r'\.card-hero-desc\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-desc\s*\{[^}]*?\}',
        new_desc_css,
        content,
        flags=re.DOTALL
    )

    # 9. Update .card-hero-cta
    new_cta_css = """.card-hero-cta {
      white-space: nowrap !important;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 34px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #0084FF 0%, #0056D6 100%);
      color: #FFFFFF;
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 15px;
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
    }"""
    content = re.sub(
        r'\.card-hero-cta\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-cta:hover\s*\{[^}]*?\}',
        new_cta_css,
        content,
        flags=re.DOTALL
    )

    # 10. Update .card-hero-graphic sizing (Massive, prominent and floor-grounded like reference image)
    new_graphic_css = """.card-hero-graphic {
      position: absolute;
      right: 14px;
      bottom: 8px;
      width: 480px;
      height: 360px;
      max-width: 55%;
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
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .theme-dark .hero-card-img {
      filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 35px rgba(0, 180, 255, 0.25));
    }

    .internship-card-slit.active:hover .hero-card-img {
      transform: translateY(-4px) scale(1.02);
    }"""
    content = re.sub(
        r'\.card-hero-graphic\s*\{[^}]*?\}.*?\.internship-card-slit\.active:hover \.hero-card-img\s*\{[^}]*?\}',
        new_graphic_css,
        content,
        flags=re.DOTALL
    )

    # 11. Update background waves for the glowing bottom-left neon arc
    new_waves_css = """.card-hero-waves {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background-image: 
        radial-gradient(circle at 10% 105%, rgba(0, 140, 255, 0.22) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 65%, rgba(0, 140, 255, 0.18) 0%, transparent 60%);
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
    }"""
    content = re.sub(
        r'\.card-hero-waves\s*\{[^}]*?\}.*?\.theme-dark \.card-hero-waves\s*\{[^}]*?\}',
        new_waves_css,
        content,
        flags=re.DOTALL
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Applied exact image match styling to {filename} successfully!")

update_file('training.html')
update_file('courses.html')

