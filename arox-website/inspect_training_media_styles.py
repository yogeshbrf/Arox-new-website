content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('/* ---- split-screen modal ---- */')
print(content[idx:idx+1000])

idx_media = content.find('@media (max-width: 768px) {', 120000)
print("\nMedia query at", idx_media)
print(content[idx_media:idx_media+1500])

