import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace duplicate color key
content = content.replace('style={{ "color": "#F8F3E9", "background": "var(--ink)", "color": "var(--parchment)" }}', 'style={{ "background": "var(--ink)", "color": "var(--parchment)" }}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
