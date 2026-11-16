for fname in ['training.html', 'courses.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_marker = "/* Card Rail Container: Centered on screen, width sized to cards, spaces distributed in between */"
    end_marker = "/* Responsive: Tablet and Mobile (<1024px) */"
    
    s = content.find(start_marker)
    e = content.find(end_marker)
    print(f"{fname}: start_marker found at {s}, end_marker found at {e}")
    if s != -1 and e != -1:
        print(f"  Length of block: {e - s} characters")

