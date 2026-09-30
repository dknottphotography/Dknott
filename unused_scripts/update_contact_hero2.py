import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cloudinaryUrl('gallery_6.jpg')", "cloudinaryUrl('another_image.png')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
