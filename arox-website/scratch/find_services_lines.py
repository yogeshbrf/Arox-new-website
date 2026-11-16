with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ['Development', 'Creative & Experience', 'Business Solutions', 'Infrastructure', 'servicesData', 'SERVICES_DATA', 'categories', 'service-card', 'arox-service-card']):
        print(f"Line {i+1}: {line.strip()[:100]}")

