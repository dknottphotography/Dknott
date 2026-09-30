import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cloudinaryUrl('newimage.png')", "cloudinaryUrl('gallery_6.jpg')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
