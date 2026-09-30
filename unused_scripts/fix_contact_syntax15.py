path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('\r\n.contact-hero', '\r\n.contact-hero')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
