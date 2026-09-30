import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/Index.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_1\.jpeg'": r"${cloudinaryUrl('dknott/gallery/gallery_1.jpg')}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_2\.jpeg'": r"${cloudinaryUrl(commonImages.instagram[0])}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_3\.jpeg'": r"${cloudinaryUrl(commonImages.instagram[3])}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_4\.jpeg'": r"${cloudinaryUrl(commonImages.instagram[1])}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_5\.jpeg'": r"${cloudinaryUrl(commonImages.instagram[4])}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_6\.jpeg'": r"${cloudinaryUrl(commonImages.instagram[2])}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_7\.jpeg'": r"${cloudinaryUrl('dknott/gallery/gallery_7.jpg')}",
    r"'https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_8\.jpeg'": r"${cloudinaryUrl('dknott/gallery/gallery_8.jpg')}"
}

for k, v in replacements.items():
    content = re.sub(k, v, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
