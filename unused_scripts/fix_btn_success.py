import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'style=\{\{\s*"color":\s*"#F8F3E9",\s*"background":\s*submitStatus === \'success\' \? \'var\(--olive\)\' : \'\','
replacement = 'style={{ "color": "#F8F3E9", "background": submitStatus === "success" ? "#5C6B47" : (isSubmitting ? "#574E43" : "#262019"), "border": "none",'

new_content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
