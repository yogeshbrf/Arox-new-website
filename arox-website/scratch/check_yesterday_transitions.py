import os
import re

# Search scratch files for transition or cubic-bezier or opacity/visibility speed
for f in os.listdir('scratch'):
    if f.endswith('.py') and ('slit' in f or 'hover' in f or 'apply' in f or 'card' in f or 'audit' in f):
        try:
            with open(os.path.join('scratch', f), 'r', encoding='utf-8') as fp:
                txt = fp.read()
            transitions = re.findall(r'transition:\s*[^;]+;', txt)
            if transitions:
                print(f"=== {f} ===")
                for t in set(transitions):
                    print("  ", t)
        except Exception as e:
            pass

