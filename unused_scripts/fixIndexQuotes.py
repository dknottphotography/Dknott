import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace "url()" with url()
content = re.sub(r'"url\(\$\{([^}]+)\}\)\"', r'url()', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
