with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

s = html.find('/* Card Rail Container: Centered on screen, width sized to cards, spaces distributed in between */')
e = html.find('/* Responsive: Tablet and Mobile (<1024px) */', s)
print(f"Slit block in training.html: length {e - s}")
print(html[s:s+1200])

