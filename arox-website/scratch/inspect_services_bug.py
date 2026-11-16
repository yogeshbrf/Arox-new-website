with open('services.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. CSS
s_css = html.find('#services-floating-nav {')
e_css = html.find('/* Category Filter Pills Nav Bar', s_css)
print("1. CSS of #services-floating-nav:")
print(html[s_css:e_css])

# 2. JSX
s_jsx = html.find('id="services-floating-nav"')
e_jsx = html.find('{/* Mobile View: Native App Feed', s_jsx)
print("2. JSX of #services-floating-nav:")
print(html[s_jsx-80:e_jsx])

# 3. goToCard
s_func = html.find('const goToCard =')
e_func = html.find('return (', s_func)
print("3. goToCard function:")
print(html[s_func:e_func])

