content = open('training.html', 'r', encoding='utf-8').read()
import re
for term in ['modal-stepper-header', 'google-form-container', 'google-form-title', 'arox-field-group', 'arox-input']:
    for m in re.finditer(term, content):
        pos = m.start()
        print(term, 'at', pos, ':', content[pos-20:pos+80])

