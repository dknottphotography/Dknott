import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/ClientGuide.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("cloudinaryUrl(commonImages.instagram[3])", "cloudinaryUrl('image2.png')")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
