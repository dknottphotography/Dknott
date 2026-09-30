import re

def strip_folders(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace img/gallery/, img/branding/, img/hero/, dknott/hero/ etc.
    content = re.sub(r'img/gallery/([a-zA-Z0-9_]+)\.(jpg|jpeg)', r'\1.jpg', content)
    content = re.sub(r'img/branding/([a-zA-Z0-9_]+)\.(png|jpg|jpeg)', r'\1.png', content)
    content = re.sub(r'img/hero/([a-zA-Z0-9_%]+)\.(jpg|jpeg|png)', r'\1.\2', content)
    content = re.sub(r'dknott/hero/([a-zA-Z0-9_%]+)\.(jpg|jpeg|png)', r'\1.\2', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

strip_folders('c:/Users/Balu/Desktop/Dknott/src/data/images.js')
strip_folders('c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx')
strip_folders('c:/Users/Balu/Desktop/Dknott/src/pages/Home.jsx')
strip_folders('c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx')
