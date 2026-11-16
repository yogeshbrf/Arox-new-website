with open('apply.html', encoding='utf-8') as f:
    content = f.read()
print("apply.html length:", len(content))
print("has 'copyright'?", 'copyright' in content.lower())
print("has 'AROX Tech'?", 'AROX Tech' in content)

