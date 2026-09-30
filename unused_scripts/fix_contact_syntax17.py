import sys

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8', newline='') as f:
    c = f.read()

# using raw bytes or exact string replacement without newline assumptions
# Just replace any backtick followed by whitespace and .contact-hero
import re
c = re.sub(r'(\s*\.contact-hero \{)', r'\1', c)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(c)
    
print("Done")
