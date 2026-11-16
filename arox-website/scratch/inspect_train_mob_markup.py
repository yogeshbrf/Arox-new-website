with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = re.findall(r'<div[^>]*id="aroxMobileCoursesView"[^>]*>.*?</div>\s*</div>\s*</div>', html, re.DOTALL)
if matches:
    print("Found aroxMobileCoursesView HTML:\n", matches[0][:800])
else:
    # search around aroxMobileCoursesView
    idx = html.find('aroxMobileCoursesView')
    print("Found at idx:", idx)
    print(html[idx-100:idx+800])

