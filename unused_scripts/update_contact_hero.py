import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cloudinaryUrl('new-image.jpg')", "cloudinaryUrl('newimage.png')")
content = content.replace("cloudinaryUrl('new-image.png')", "cloudinaryUrl('newimage.png')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
