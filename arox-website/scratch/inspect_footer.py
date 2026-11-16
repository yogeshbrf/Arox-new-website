import re

content = open('index.html', encoding='utf-8').read()
for col in re.findall(r'<details class="footer-col.*?</details>', content, re.DOTALL):
    title = re.search(r'<h3 class="footer-col-title">(.*?)</h3>', col)
    if title:
        print('=== ' + title.group(1) + ' ===')
        for link in re.findall(r'<a class="footer-link" href="(.*?)">(.*?)</a>', col):
            text = re.sub(r'<.*?>', '', link[1]).strip()
            print(f'  {text} -> {link[0]}')

