content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('id="modalOverlay"')
print("modalOverlay HTML:")
print(content[idx-100:idx+1500])

idx_js = content.find('window.openModal = function')
print("\nJS around window.openModal:")
print(content[idx_js:idx_js+2000])

