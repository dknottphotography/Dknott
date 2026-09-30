import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

bad_block = """      
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: auto;
            aspect-ratio: 3/1;
          }
        }
      }</style>"""

good_block = """
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: auto;
            aspect-ratio: 3/1;
          }
        }
      }</style>"""

content = content.replace(bad_block, good_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
