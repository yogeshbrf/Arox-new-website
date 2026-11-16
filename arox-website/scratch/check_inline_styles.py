import glob
import re

print("=== CHECKING INLINE STYLES IN ALL HTML FILES ===")
for hf in sorted(glob.glob('*.html')):
    with open(hf, 'r', encoding='utf-8') as f:
        content = f.read()
    styles = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    for s in styles:
        # check if it has background or background-color
        for line in s.split('\n'):
            line_s = line.strip()
            if 'background' in line_s and any(c in line_s for c in ['#', 'rgb', 'var']):
                if any(k in line_s.lower() for k in ['060', '080', '0b', '0e', '161', '1e', 'surface', '111', '050']):
                    print(f"{hf}: {line_s}")

