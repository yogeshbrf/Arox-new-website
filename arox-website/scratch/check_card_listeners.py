with open(r'd:\Downloads\Arox new website\arox-website\scratch\build_exact_training_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('card.addEventListener')
while idx != -1:
    print(text[max(0, idx-50):idx+250])
    print('='*50)
    idx = text.find('card.addEventListener', idx+1)

