import sys
sys.path.append(r'd:\Downloads\Arox new website\arox-website\scratch')
from build_updated_mobile_components import updated_mobile_css, updated_mobile_js

def apply_updates(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace style block
    style_tag_start = '<style id="arox-strict-mobile-css">'
    style_tag_end = '</style>'
    idx_s_start = content.find(style_tag_start)
    if idx_s_start != -1:
        idx_s_end = content.find(style_tag_end, idx_s_start)
        if idx_s_end != -1:
            content = content[:idx_s_start + len(style_tag_start)] + "\n" + updated_mobile_css + "\n" + content[idx_s_end:]
            print("  Replaced arox-strict-mobile-css style block")
        else:
            print("  ERROR: style closing tag not found")
    else:
        # If tag wasn't found, insert before </head>
        idx_head = content.find('</head>')
        if idx_head != -1:
            new_style = f'<style id="arox-strict-mobile-css">\n{updated_mobile_css}\n</style>\n'
            content = content[:idx_head] + new_style + content[idx_head:]
            print("  Inserted new arox-strict-mobile-css before </head>")

    # 2. Replace script block
    script_tag_start = '<script id="arox-strict-mobile-js">'
    script_tag_end = '</script>'
    idx_sc_start = content.find(script_tag_start)
    if idx_sc_start != -1:
        idx_sc_end = content.find(script_tag_end, idx_sc_start)
        if idx_sc_end != -1:
            content = content[:idx_sc_start + len(script_tag_start)] + "\n" + updated_mobile_js + "\n" + content[idx_sc_end:]
            print("  Replaced arox-strict-mobile-js script block")
        else:
            print("  ERROR: script closing tag not found")
    else:
        # If tag wasn't found, insert before </body>
        idx_body = content.rfind('</body>')
        if idx_body != -1:
            new_script = f'<script id="arox-strict-mobile-js">\n{updated_mobile_js}\n</script>\n'
            content = content[:idx_body] + new_script + content[idx_body:]
            print("  Inserted new arox-strict-mobile-js before </body>")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully saved {filepath}!")

apply_updates('training.html')
apply_updates('courses.html')

