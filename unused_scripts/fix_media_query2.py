import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I need to find .hero-band{ block and replace it.
old_block = """.hero-band{
    min-height: 46vh;
    display:flex; align-items:flex-end;
    position: relative;
  }"""
new_block = """.hero-band{
    min-height: 40vh; /* Mobile height */
    display:flex; align-items:flex-end;
    position: relative;
  }
  @media (min-width: 768px) {
    .hero-band { min-height: 65vh; } /* Desktop height */
  }"""
content = content.replace(old_block, new_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
