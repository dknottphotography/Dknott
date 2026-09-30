import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\.map-container:hover iframe \{.*?</style>'
replacement = """\.map-container:hover iframe {
          filter: grayscale(0) contrast(1) sepia(0);
        }
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: 55vh;
          }
        }
      }</style>"""

# Need to make sure the regex matches newlines.
content = re.sub(r'\.map-container:hover iframe \{.*?</style>', replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
