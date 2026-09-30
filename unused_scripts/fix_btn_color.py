import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace style={{ "background": ... }} with style={{ "color": "var(--paper)", "background": ... }}
pattern = r'style=\{\{\s*"background":'
new_content = re.sub(pattern, 'style={{ "color": "#F8F3E9", "background":', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
