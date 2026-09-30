import re

# Home.jsx
path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Home.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"url(\'https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/DKN%202copy.jpg?v=2\')"', "url()")
content = content.replace('src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/gallery_8.jpeg"', "src={cloudinaryUrl('img/gallery/gallery_8.jpeg')} onError={handleImageError}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Contact.jsx
path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Contact.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src="https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/public/website-images/newimage.png"', "src={cloudinaryUrl('img/hero/newimage.png')} onError={handleImageError}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
