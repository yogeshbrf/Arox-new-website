import shutil, os
from PIL import Image

src_hr = r"C:\Users\HP VICTUS\.gemini\antigravity\brain\b147def7-8180-4222-afd7-765a60d13056\.user_uploaded\media_1794592152160_32afc57b.png"
src_ba = "scratch/business_analytics_cutout.png"

# Target paths
targets_hr = [
    r"assets\internships\cards\hr-finance.png",
    r"arox-website\assets\internships\cards\hr-finance.png",
    r"d:\internship cards images\Glossy 3D Finance Analytics Workspace.png"
]

targets_ba = [
    r"assets\internships\cards\business-analytics.png",
    r"arox-website\assets\internships\cards\business-analytics.png",
    r"d:\internship cards images\business-analytics.png"
]

for t in targets_hr:
    try:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        shutil.copy2(src_hr, t)
        print(f"Copied HR & Finance to {t}")
    except Exception as e:
        print(f"Error copying to {t}: {e}")

for t in targets_ba:
    try:
        os.makedirs(os.path.dirname(t), exist_ok=True)
        shutil.copy2(src_ba, t)
        print(f"Copied Business Analytics to {t}")
    except Exception as e:
        print(f"Error copying to {t}: {e}")

