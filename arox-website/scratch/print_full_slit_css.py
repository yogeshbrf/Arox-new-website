with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('.internship-cards-rail')
end = html.find('/* Responsive adjustments for slit cards */', start)
if end == -1:
    end = html.find('@media (max-width: 1024px)', start)

print(html[start:end])

