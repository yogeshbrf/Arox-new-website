import re

def update_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update formatHeroTitle
    old_fmt = """function formatHeroTitle(title) {
      if (!title) return '';
      const trimmed = title.trim();
      const words = trimmed.split(/\s+/);
      if (words.length <= 1) return `<span class="hero-title-accent">${words[0]}</span>`;
      if (words.length === 2) return `${words[0]}<br><span class="hero-title-accent">${words[1]}</span>`;
      if (words.length === 3) return `${words[0]}<br><span class="hero-title-accent">${words[1]}</span><br>${words[2]}`;
      if (words.length === 4) return `${words[0]} ${words[1]}<br><span class="hero-title-accent">${words[2]}</span><br>${words[3]}`;
      const mid = Math.ceil(words.length / 2);
      return `${words.slice(0, mid).join(' ')}<br><span class="hero-title-accent">${words.slice(mid).join(' ')}</span>`;
    }"""

    new_fmt = """function formatHeroTitle(title) {
      if (!title) return '';
      const trimmed = title.trim();
      const words = trimmed.split(/\s+/);
      if (words.length <= 1) return `<span class="hero-title-accent">${words[0]}</span>`;
      if (words.length === 2) return `${words[0]}<br><span class="hero-title-accent">${words[1]}</span>`;
      if (words.length === 3) return `${words[0]}<br><span class="hero-title-accent">${words[1]}</span> ${words[2]}`;
      if (words.length === 4) {
        // Exact match for Image 3: "PYTHON FULL <span class="hero-title-accent">STACK</span><br>DEVELOPMENT"
        if (words[2].toUpperCase() === 'STACK') {
          return `${words[0]} ${words[1]} <span class="hero-title-accent">${words[2]}</span><br>${words[3]}`;
        }
        return `${words[0]} ${words[1]}<br><span class="hero-title-accent">${words[2]}</span> ${words[3]}`;
      }
      const mid = Math.ceil(words.length / 2);
      return `${words.slice(0, mid).join(' ')}<br><span class="hero-title-accent">${words.slice(mid).join(' ')}</span>`;
    }"""

    if old_fmt in content:
        content = content.replace(old_fmt, new_fmt)
        print(f"Updated formatHeroTitle in {filename}")
    else:
        # Regex replacement if whitespace differs slightly
        content = re.sub(
            r'function formatHeroTitle\(title\)\s*\{.*?return `\$\{words\.slice\(0, mid\)\.join\(\' \'\)\}<br><span class="hero-title-accent">\$\{words\.slice\(mid\)\.join\(\' \'\)\}</span>`;\s*\}',
            new_fmt,
            content,
            flags=re.DOTALL
        )
        print(f"Regex-updated formatHeroTitle in {filename}")

    # 2. Update Inactive slit flex and width
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?flex:\s*)0 0 \d+px;',
        r'\g<1>0 0 46px;',
        content
    )
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?min-width:\s*)\d+px;',
        r'\g<1>42px;',
        content
    )
    content = re.sub(
        r'(\.internship-card-slit\s*\{[^}]*?max-width:\s*)\d+px;',
        r'\g<1>50px;',
        content
    )

    # 3. Update Active Slit Card
    old_active_pattern = r'\.internship-card-slit\.active\s*\{[^}]*?max-width:\s*\d+px;[^}]*?min-width:\s*\d+px;[^}]*?\}'
    new_active_css = """.internship-card-slit.active {
      flex: 1 1 auto;
      max-width: 780px;
      min-width: 620px;
      cursor: default;
      border-radius: 28px;
      background: linear-gradient(135deg, #FFFFFF 0%, #F5F9FE 55%, #EAF2FD 100%);
      border: 1px solid rgba(215, 230, 250, 0.95);
      box-shadow: 0 14px 40px rgba(0, 102, 255, 0.1);
    }"""
    content = re.sub(old_active_pattern, new_active_css, content)

    # Dark active slit card
    old_dark_active = r'\.theme-dark \.internship-card-slit\.active\s*\{[^}]*?\}'
    new_dark_active = """.theme-dark .internship-card-slit.active {
      background: linear-gradient(135deg, rgba(4, 15, 32, 0.98) 0%, rgba(2, 8, 18, 0.98) 100%);
      border: 1.5px solid rgba(0, 180, 255, 0.7);
      box-shadow: 0 0 35px rgba(0, 140, 255, 0.35), inset 0 0 25px rgba(0, 120, 255, 0.12);
    }"""
    content = re.sub(old_dark_active, new_dark_active, content)

    # 4. Update .card-hero-view padding
    content = re.sub(
        r'(\.card-hero-view\s*\{[^}]*?padding:\s*)[^;]+;',
        r'\g<1>38px 44px 30px 44px;',
        content
    )

    # 5. Update .card-hero-content max-width
    content = re.sub(
        r'(\.card-hero-content\s*\{[^}]*?max-width:\s*)[^;]+;',
        r'\g<1>55%;',
        content
    )

    # 6. Update .card-hero-eyebrow-text (ensure flex-shrink: 0 and no truncation)
    old_eyebrow = r'(\.card-hero-eyebrow-text\s*\{[^}]*?overflow:\s*hidden;\s*text-overflow:\s*ellipsis;[^}]*?\})'
    new_eyebrow = """.card-hero-eyebrow-text {
      font-family: var(--font-display, 'Montserrat', sans-serif);
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #0F172A;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
    }"""
    content = re.sub(old_eyebrow, new_eyebrow, content)

    # 7. Update .card-hero-title font size
    content = re.sub(
        r'(\.card-hero-title\s*\{[^}]*?font-size:\s*)[^;]+;',
        r'\g<1>clamp(30px, 2.9vw, 40px);',
        content
    )
    content = re.sub(
        r'(\.card-hero-title\s*\{[^}]*?line-height:\s*)[^;]+;',
        r'\g<1>1.1;',
        content
    )

    # 8. Update .card-hero-title-underline
    content = re.sub(
        r'(\.card-hero-title-underline\s*\{[^}]*?width:\s*)[^;]+;',
        r'\g<1>56px;',
        content
    )

    # 9. Update .card-hero-desc
    content = re.sub(
        r'(\.card-hero-desc\s*\{[^}]*?font-size:\s*)[^;]+;',
        r'\g<1>15px;',
        content
    )
    content = re.sub(
        r'(\.card-hero-desc\s*\{[^}]*?line-height:\s*)[^;]+;',
        r'\g<1>1.58;',
        content
    )

    # 10. Update .card-hero-graphic sizing (prominent and floor-grounded like Image 3)
    old_graphic = r'\.card-hero-graphic\s*\{[^}]*?\}'
    new_graphic = """.card-hero-graphic {
      position: absolute;
      right: 18px;
      bottom: 12px;
      width: 360px;
      height: 270px;
      max-width: 48%;
      max-height: 64%;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      z-index: 6;
      pointer-events: none;
    }"""
    content = re.sub(old_graphic, new_graphic, content)

    # 11. Update .domain-cards-track max-width to 1260px
    content = re.sub(
        r'(\.domain-cards-track[^{]*\{[^}]*?max-width:\s*)1200px;',
        r'\g<1>1260px;',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Applied updates to {filename} successfully!")

update_file('training.html')
update_file('courses.html')

