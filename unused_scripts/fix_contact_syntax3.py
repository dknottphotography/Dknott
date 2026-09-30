import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\s*\s*\.contact-hero \{.*?</style>'
replacement = """
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

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
