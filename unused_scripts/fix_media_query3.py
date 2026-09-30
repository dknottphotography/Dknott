import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\.hero-band\{\s*min-height:\s*46vh;\s*display:flex;\s*align-items:flex-end;\s*position:\s*relative;\s*overflow:\s*hidden;\s*\}'
replacement = '.hero-band{ min-height: 40vh; display:flex; align-items:flex-end; position: relative; overflow: hidden; }\n  @media (min-width: 768px) {\n    .hero-band { min-height: 65vh; }\n  }'

new_content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
