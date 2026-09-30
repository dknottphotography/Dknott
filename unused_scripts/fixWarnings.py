import os

file_path = 'src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix onmouseover / onmouseout
content = content.replace(
    'onmouseover="this.style.borderColor=\\'var(--ink)\\'"',
    'onMouseOver={(e)=>e.currentTarget.style.borderColor=\\'var(--ink)\\'}'
)
content = content.replace(
    'onmouseout="this.style.borderColor=\\'transparent\\'"',
    'onMouseOut={(e)=>e.currentTarget.style.borderColor=\\'transparent\\'}'
)

# Fix iframe properties
content = content.replace('allowfullscreen=""', 'allowFullScreen={true}')
content = content.replace('referrerpolicy="no-referrer-when-downgrade"', 'referrerPolicy="no-referrer-when-downgrade"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
