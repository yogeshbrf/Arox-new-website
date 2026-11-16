with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('const DOMAIN_COURSES = {')
end_idx = html.find('};', idx)

domain_block = html[idx:end_idx+2]
import re
items = re.findall(r'id:\s*[\'\"]([^\'\"]+)[\'\"].*?title:\s*[\'\"]([^\'\"]+)[\'\"].*?bgImage:\s*[\'\"]([^\'\"]+)[\'\"]', domain_block, re.DOTALL)
print(f"Found {len(items)} courses in DOMAIN_COURSES:")
for i in items:
    print(f"  id: {i[0]:<25} title: {i[1]:<35} bgImage: {i[2]}")

