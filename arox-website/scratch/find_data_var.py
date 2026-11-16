with open('training.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('id: "power-bi"')
# Find where the enclosing object starts
start = html.rfind('const ', 0, idx)
if start == -1:
    start = html.rfind('var ', 0, idx)
if start == -1:
    start = html.rfind('let ', 0, idx)

print("Declaration before power-bi:", html[start:start+150])
print("\nAround power-bi:")
print(html[idx-100:idx+400])

