import shutil
import os

src = r'C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794599726314_107b40ef.png'

targets = [
    r'assets\internships\cards\data-analytics-data-science.png',
    r'assets\internships\cards\Neon Data Analytics Dashboard.png',
    r'assets\internships\data_analytics.png',
    r'assets\data_analytics.png',
    r'assets\apply\data_analytics.png'
]

for t in targets:
    if os.path.exists(t):
        backup = t + '.bak'
        if not os.path.exists(backup):
            shutil.copyfile(t, backup)
    shutil.copyfile(src, t)
    print(f"Replaced {t} (size: {os.path.getsize(t)})")

