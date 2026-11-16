for page in ['training.html', 'courses.html']:
    with open(page, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f"=== {page} ===")
    for pattern in ['data-analytics-data-science.png', 'data_analytics.png', 'Neon Data Analytics Dashboard.png']:
        print(f"  {pattern}: {text.count(pattern)} times")

