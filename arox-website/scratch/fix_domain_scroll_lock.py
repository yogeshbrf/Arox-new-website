with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

# 1. Update onUpdate in internTrigger to ignore during isRefreshing or isDomainNavigating
old_on_update = """        onUpdate: (self) => {
          if (window.isDomainNavigating || window._isSectionTransitionLocked) return;
          const p = self.progress;"""

new_on_update = """        onUpdate: (self) => {
          if (window.isDomainNavigating || window._isSectionTransitionLocked || (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.isRefreshing)) return;
          const p = self.progress;"""

assert old_on_update in t, "old_on_update not found"
t = t.replace(old_on_update, new_on_update)

# 2. Update timeout in switchInternshipDomain from 50ms to 800ms
old_timeout = """          if (window._domainNavTimeout) clearTimeout(window._domainNavTimeout);
          window._domainNavTimeout = setTimeout(() => {
            window.isDomainNavigating = false;
          }, 50);"""

new_timeout = """          if (window._domainNavTimeout) clearTimeout(window._domainNavTimeout);
          window._domainNavTimeout = setTimeout(() => {
            window.isDomainNavigating = false;
          }, 800);"""

assert old_timeout in t, "old_timeout not found"
t = t.replace(old_timeout, new_timeout)

# 3. Clean up debug logs
t = t.replace("console.log('[handleUrlDomainLanding]", "// console.log('[handleUrlDomainLanding]")
t = t.replace("console.log('[switchInternshipDomain]", "// console.log('[switchInternshipDomain]")

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("✅ Updated internTrigger onUpdate & domainNavTimeout, mirrored to courses.html")

