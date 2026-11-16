with open('services.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines count:", len(lines))
for i, line in enumerate(lines):
    if 'function ServiceCard' in line:
        print(f"ServiceCard at line {i+1}")
    if 'function DomainSection' in line:
        print(f"DomainSection at line {i+1}")
    if 'function App()' in line:
        print(f"App at line {i+1}")
    if 'id="services-stack-wrapper"' in line:
        print(f"services-stack-wrapper at line {i+1}")

