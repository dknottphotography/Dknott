import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove inline aspect ratio
content = content.replace('"aspectRatio":"3/1", "height":"auto",', '')

# 2. Add media queries to style block
css_to_add = """
        .contact-hero {
          min-height: 45vh;
        }
        @media (min-width: 768px) {
          .contact-hero {
            min-height: auto;
            aspect-ratio: 3/1;
          }
        }
      """
content = content.replace("</style>", css_to_add + "</style>")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
