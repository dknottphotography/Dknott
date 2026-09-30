import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, revert the section tag to just className="hero-band" (no tailwind min-h classes)
content = content.replace('<section className="hero-band min-h-[45vh] md:min-h-[65vh]">', '<section className="hero-band">')

# Second, find the .hero-band CSS block and replace its min-height logic with media queries
pattern = r'\.hero-band\{\s*min-height:\s*46vh;\s*display:flex;\s*align-items:flex-end;\s*position:\s*relative;\s*\}'
replacement = '.hero-band{ min-height: 40vh; display:flex; align-items:flex-end; position: relative; }\n  @media (min-width: 768px) {\n    .hero-band { min-height: 65vh; }\n  }'

if pattern not in content:
    content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
