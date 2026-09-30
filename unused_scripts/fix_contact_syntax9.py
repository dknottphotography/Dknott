path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad = "}\n      \n.contact-hero"
good = "}\n.contact-hero"
content = content.replace(bad, good)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
