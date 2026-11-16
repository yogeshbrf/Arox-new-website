import re

with open('training.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'id=["\']domainCardsTrack["\']', text)
if m:
    start = max(0, m.start() - 800)
    end = min(len(text), m.end() + 800)
    print(text[start:end])

