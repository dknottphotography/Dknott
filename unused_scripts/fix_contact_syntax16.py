path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

bad = "\n.contact-hero"
bad2 = "\r\n.contact-hero"

if bad in c:
    print('Found LF')
    c = c.replace(bad, '\n.contact-hero')
elif bad2 in c:
    print('Found CRLF')
    c = c.replace(bad2, '\r\n.contact-hero')
else:
    print('NOT FOUND')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
