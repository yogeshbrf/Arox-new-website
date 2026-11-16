with open('training.html', 'r', encoding='utf-8') as f:
    t = f.read()

target = """    window.switchInternshipDomain = function(domainKey, fromScroll = false) {
      const track = document.getElementById('domainCardsTrack');
      const needsRender = !track || track.children.length === 0;"""

replacement = """    window.switchInternshipDomain = function(domainKey, fromScroll = false) {
      console.log('[switchInternshipDomain] called with:', domainKey, 'fromScroll:', fromScroll, new Error().stack);
      const track = document.getElementById('domainCardsTrack');
      const needsRender = !track || track.children.length === 0;"""

assert target in t, "target not found"
t = t.replace(target, replacement)

with open('training.html', 'w', encoding='utf-8') as f:
    f.write(t)

with open('courses.html', 'w', encoding='utf-8') as f:
    f.write(t)

print("Added stack trace to switchInternshipDomain")

