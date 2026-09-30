import re

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/Home.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add images.length to the DOM
old_span = """<span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'}</span>"""
new_span = """<span className="meta" style={{textTransform: 'uppercase'}}>{wedding.tags || 'WEDDING'} ({images.length} imgs)</span>"""
content = content.replace(old_span, new_span)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
