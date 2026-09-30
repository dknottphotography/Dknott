import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I want to remove ANY backtick that appears between sepia(0); and .contact-hero {
pattern = r'(sepia\(0\);\s*\n\s*\}[\s\n]*)()?([\s\n]*\.contact-hero \{)'
replacement = r'\g<1>\g<3>'

content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
