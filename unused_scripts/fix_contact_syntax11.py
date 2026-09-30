path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.contact-hero' in line:
        if i > 0 and '' in lines[i-1]:
            lines[i-1] = lines[i-1].replace('', '')
        break

content = "".join(lines)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
