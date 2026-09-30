import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add objectPosition: "center 25%" right after objectFit: "cover"
pattern = r'"objectFit":"cover"'
replacement = '"objectFit":"cover","objectPosition":"center 25%"'

new_content = re.sub(pattern, replacement, content, count=1) # only the first one, which is the hero image

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
