path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('.contact-hero', '\n.contact-hero')
content = content.replace('}</style>', '}</style>')
content = content.replace('`}</style>', '}</style>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
