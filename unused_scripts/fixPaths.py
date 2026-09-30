import re

# Patch images.js
path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('dknott/gallery/', 'img/gallery/')
content = content.replace('dknott/branding/', 'img/branding/')
content = content.replace('dknott/hero/', 'img/hero/')
content = content.replace('.jpg', '.jpeg') # they were .jpeg locally and probably on cloudinary too

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Patch Index.jsx
path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('dknott/gallery/', 'img/gallery/')
content = content.replace('.jpg', '.jpeg')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
