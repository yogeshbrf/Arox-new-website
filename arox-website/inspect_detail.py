with open('detail.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("File length:", len(text))
matches = re.findall(r'<section[^>]*id="([^"]+)"[^>]*>', text)
print("Sections found:", matches)

# Find "Back to Courses" or similar
back_matches = re.findall(r'<a[^>]*back[^>]*>.*?</a>', text, re.IGNORECASE)
print("Back button matches:", back_matches)

# Find "What Our Students Say" or testimonials
say_idx = text.find('What Our Students Say')
if say_idx != -1:
    print("\n--- Found What Our Students Say ---")
    print(text[say_idx-200:say_idx+800])

