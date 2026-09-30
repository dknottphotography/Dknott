import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any occurrence of the duplicated color
pattern = r'style=\{\{\s*"color":\s*"#F8F3E9",\s*"background":\s*"var\(--ink\)",\s*"color":\s*"var\(--parchment\)"\s*\}\}'
replacement = 'style={{ "background": "var(--ink)", "color": "var(--parchment)" }}'

content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
