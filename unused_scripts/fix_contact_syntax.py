import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the syntax error
bad_code = """      }
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: auto;
            aspect-ratio: 3/1;
          }
        }
      </style>"""

good_code = """
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

content = content.replace(bad_code, good_code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
