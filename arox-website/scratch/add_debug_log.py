with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

target = """        // Desktop: wait for internTrigger start/end to be ready
        if (window.internTrigger && typeof window.internTrigger.start === 'number' && typeof window.switchInternshipDomain === 'function') {
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        } else if (attempts < 12) {
          setTimeout(() => trySwitch(attempts + 1), 80);
        } else if (typeof window.switchInternshipDomain === 'function') {
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        }"""

replacement = """        // Desktop: wait for internTrigger start/end to be ready
        console.log('[handleUrlDomainLanding] attempt:', attempts, 'internTrigger:', Boolean(window.internTrigger), 'start:', window.internTrigger && window.internTrigger.start);
        if (window.internTrigger && typeof window.internTrigger.start === 'number' && typeof window.switchInternshipDomain === 'function') {
          console.log('[handleUrlDomainLanding] Calling switchInternshipDomain with:', targetDomain);
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        } else if (attempts < 12) {
          setTimeout(() => trySwitch(attempts + 1), 80);
        } else if (typeof window.switchInternshipDomain === 'function') {
          console.log('[handleUrlDomainLanding] Fallback calling switchInternshipDomain with:', targetDomain);
          window.switchInternshipDomain(targetDomain, false);
          document.querySelectorAll('.intern-cat-pill').forEach(pill => {
            pill.classList.toggle('active', pill.getAttribute('data-domain') === targetDomain);
          });
        }"""

assert target in t, "target not found"
t = t.replace(target, replacement)

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("Added console logs to training.html and mirrored")

