import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cloudinaryUrl('img/branding/newimage.png')", "cloudinaryUrl('img/branding/new-image.png')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
