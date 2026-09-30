path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

bad_str = "        }\r\n      \r\n.contact-hero {\r\n"
good_str = "        }\r\n.contact-hero {\r\n"
c = c.replace(bad_str, good_str)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
