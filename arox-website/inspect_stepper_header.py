content = open('training.html', 'r', encoding='utf-8').read()
idx = content.find('id="modal-stepper-header"')
print(content[idx-100:idx+1500])

