import os

card_dir = 'assets/internships/cards'
for fname in ['hr-finance.png', 'business-analytics.png', 'data-analytics-data-science.png', 'stock-market.png', 'investment-banking.png']:
    p = os.path.join(card_dir, fname)
    if os.path.exists(p):
        print(f"{fname}: {os.path.getsize(p)} bytes")
    else:
        print(f"{fname}: NOT FOUND")

