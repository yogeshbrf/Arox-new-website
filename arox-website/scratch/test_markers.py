with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's verify markers exist
print("Has CATEGORIES:", "const CATEGORIES = [" in html)
print("Has function ServiceCard:", "function ServiceCard({ service })" in html)
print("Has id=\"services-stack-wrapper\":", 'id="services-stack-wrapper"' in html)
print("Has checkNavAndHeader:", "const checkNavAndHeader = () => {" in html)
print("Has gsap.registerPlugin(ScrollTrigger):", "gsap.registerPlugin(ScrollTrigger);" in html)

