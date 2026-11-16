with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

print("OCCURRENCE 2 FULL BLOCK:")
print(css[101880:102600])
print("\n" + "="*40 + "\n")
print("OCCURRENCE 3 FULL BLOCK:")
print(css[149800:150200])

