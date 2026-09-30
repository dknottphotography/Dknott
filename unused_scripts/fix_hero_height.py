import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace minHeight: "38vh" with "65vh"
content = content.replace('"minHeight":"38vh"', '"minHeight":"65vh"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
