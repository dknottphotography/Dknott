import re

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('realWeddings: "gallery_6.jpg"', 'realWeddings: "new-image.jpg"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
