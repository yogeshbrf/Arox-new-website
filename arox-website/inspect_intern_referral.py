content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('<!-- Referral / Discount Code -->')
print(content[idx-600:idx+1500])

