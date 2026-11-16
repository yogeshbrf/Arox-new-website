content = open('login.html', encoding='utf-8').read()
checks = [
    ('mob-panel-top', 'TOP panel class'),
    ('mob-panel-bottom', 'BOTTOM panel class'),
    ('mob-sweep-shape', 'Sweep shape'),
    ('mob-back-pill', 'Back pill in panel'),
    ('mob-back-pill-dark', 'Dark back pill'),
    ('mob-portal-bar', 'Mobile portal bar'),
    ('mob-btn-outline', 'Panel outline btn'),
    ('mob-active', 'mob-active class'),
    ('--sweep: 1.2s', 'Speed 1.2s'),
    ('--swap-delay: 0.7s', 'Swap delay 0.7s'),
    ('--fade: 0.4s', 'Fade 0.4s'),
    ('--stagger: 0.04s', 'Stagger var'),
    ('mobPanelTop', 'Panel top id'),
    ('mobPanelBottom', 'Panel bottom id'),
    ('mob-portal-btn', 'Mobile portal btn class'),
    ('setPortalRole', 'setPortalRole fn'),
    ('border-radius: 0 0 50% 50%', 'Top panel curve'),
    ('border-radius: 50% 50% 0 0', 'Bottom panel curve'),
]
for key, name in checks:
    found = key in content
    status = 'OK' if found else 'MISSING'
    print(status + ': ' + name + ' (' + key + ')')

