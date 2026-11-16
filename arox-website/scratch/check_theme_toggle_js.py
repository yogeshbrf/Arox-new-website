with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find("themeToggle")
if idx == -1:
    idx = text.find("theme-toggle")
print(text[idx:idx+800])

