path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

bad_str = "        }\n      \n.contact-hero {\n"
good_str = "        }\n.contact-hero {\n"
c = c.replace(bad_str, good_str)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
