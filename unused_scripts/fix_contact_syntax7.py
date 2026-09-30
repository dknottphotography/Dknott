path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

idx1 = content.find('.map-container:hover iframe {')
if idx1 != -1:
    idx2 = content.find('</style>', idx1)
    if idx2 != -1:
        bad_part = content[idx1:idx2+8]
        # Remove any stray backticks in this chunk
        cleaned = bad_part.replace('', '')
        # Now put one backtick right before }</style>
        cleaned = cleaned.replace('}</style>', '}</style>')
        content = content[:idx1] + cleaned + content[idx2+8:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
