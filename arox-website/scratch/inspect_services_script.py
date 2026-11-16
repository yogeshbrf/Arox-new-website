with open('services.html', encoding='utf-8') as f:
    s = f.read()

import re
# Find all <script> blocks
scripts = re.findall(r'<script[^>]*>(.*?)</script>', s, re.DOTALL)
print(f"Total script tags: {len(scripts)}")
for i, sc in enumerate(scripts):
    print(f"Script {i}: length {len(sc)}")
    if 'cat' in sc or 'domain' in sc or 'services' in sc or 'goToCard' in sc:
        # print snippet
        lines = sc.strip().split('\n')
        print(f"  First 20 lines of script {i}:")
        for line in lines[:25]:
            print("   ", line)

