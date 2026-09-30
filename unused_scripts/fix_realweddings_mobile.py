import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the section's minHeight inline style with responsive Tailwind classes
content = content.replace('<section className="hero-band" style={{"minHeight":"65vh"}}>', '<section className="hero-band min-h-[45vh] md:min-h-[65vh]">')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
