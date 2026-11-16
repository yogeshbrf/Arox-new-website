import sys
sys.path.append(r'd:\Downloads\Arox new website\arox-website\scratch')
from build_exact_training_cards import updated_mobile_css, updated_mobile_js

def apply_exact_cards(filepath):
    print(f"Applying exact training cards to {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update style block
    style_start = '<style id="arox-strict-mobile-css">'
    style_end = '</style>'
    idx_s_start = content.find(style_start)
    if idx_s_start != -1:
        idx_s_end = content.find(style_end, idx_s_start)
        if idx_s_end != -1:
            content = content[:idx_s_start + len(style_start)] + "\n" + updated_mobile_css + "\n" + content[idx_s_end:]
            print("  Updated style block arox-strict-mobile-css")

    # 2. Update script block
    script_start = '<script id="arox-strict-mobile-js">'
    script_end = '</script>'
    idx_sc_start = content.find(script_start)
    if idx_sc_start != -1:
        idx_sc_end = content.find(script_end, idx_sc_start)
        if idx_sc_end != -1:
            content = content[:idx_sc_start + len(script_start)] + "\n" + updated_mobile_js + "\n" + content[idx_sc_end:]
            print("  Updated script block arox-strict-mobile-js")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath} successfully!")

apply_exact_cards('training.html')
apply_exact_cards('courses.html')

