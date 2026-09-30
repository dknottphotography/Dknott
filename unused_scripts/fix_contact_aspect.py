import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"minHeight":"65vh"', '"aspectRatio":"3/1", "height":"auto"')
# also remove objectPosition if it's there
content = content.replace('"objectPosition":"center 30%",', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
