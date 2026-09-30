import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/ClientGuide.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Only replace the one that has alt="Client Guide Hero"
# We can just change all back to commonImages.instagram[3] first:
content = content.replace("cloudinaryUrl('image2.png')", "cloudinaryUrl(commonImages.instagram[3])")

# Then specifically target the hero image
hero_pattern = r'<img src=\{cloudinaryUrl\(commonImages\.instagram\[3\]\)\} onError=\{handleImageError\} alt="Client Guide Hero"'
replacement = '<img src={cloudinaryUrl(\'image2.png\')} onError={handleImageError} alt="Client Guide Hero"'

content = re.sub(hero_pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
