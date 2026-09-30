import re

def fix_ext(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('.jpeg', '.jpg')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_ext('c:/Users/Balu/Desktop/Dknott/src/data/images.js')
fix_ext('c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx')
fix_ext('c:/Users/Balu/Desktop/Dknott/src/pages/Home.jsx')
fix_ext('c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx')
