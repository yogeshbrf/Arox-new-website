with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
matches = [m.start() for m in re.finditer(r'</style>', html)]
print("Total </style> tags:", len(matches))
for idx in matches:
    print("--- Context around </style> at index", idx)
    print(html[idx-100:idx+20])

