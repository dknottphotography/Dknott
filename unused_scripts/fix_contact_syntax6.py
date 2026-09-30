path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Just find the exact string that is there
idx1 = content.find('.map-container:hover iframe {')
if idx1 != -1:
    idx2 = content.find('</style>', idx1)
    if idx2 != -1:
        bad_part = content[idx1:idx2+8]
        good_part = bad_part.replace('\n        .contact-hero', '.contact-hero').replace('}</style>', '}</style>')
        content = content[:idx1] + good_part + content[idx2+8:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
