import os

filepath = 'c:/Users/Balu/Desktop/dknott/src/pages/WeddingFilms.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all teaser and invitation tags with wedding tags
content = content.replace('data-tags="teaser"', 'data-tags="wedding"')
content = content.replace('data-tags="invitation"', 'data-tags="wedding"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("All existing videos set to 'wedding' tag.")
