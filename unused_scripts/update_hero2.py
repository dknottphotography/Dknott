import re

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('realWeddings: "new-image.jpg"', 'realWeddings: "newimage.png"')
content = content.replace('realWeddings: "new-image.png"', 'realWeddings: "newimage.png"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
