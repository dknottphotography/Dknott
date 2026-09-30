import os
import re

files = [
    'src/pages/Home.jsx',
    'src/pages/Index.jsx',
    'src/pages/OurStory.jsx',
    'src/pages/RealWeddings.jsx',
    'src/pages/WeddingFilms.jsx',
    'src/pages/Contact.jsx',
    'src/pages/ClientGuide.jsx'
]

imports_str = "\nimport { cloudinaryUrl, handleImageError } from '../lib/cloudinary';\nimport { commonImages, weddingGalleries } from '../data/images';\n"

for fpath in files:
    full_path = os.path.join('c:/Users/Balu/Desktop/Dknott', fpath)
    if not os.path.exists(full_path):
        continue
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'import { cloudinaryUrl' not in content:
        content = re.sub(r'^(import React.*?;?)\n', r'\1' + imports_str, content, count=1, flags=re.MULTILINE)

    # Handle JSX src="..."
    replacements_jsx = {
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/logo1\.png"': r'src={cloudinaryUrl(commonImages.logos.nav)} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/logo\.png"': r'src={cloudinaryUrl(commonImages.logos.large)} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/new_fixed\.jpeg"': r'src={cloudinaryUrl(commonImages.heroes.weddingFilms)} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_6\.jpeg"': r'src={cloudinaryUrl(commonImages.heroes.realWeddings)} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_2\.jpeg"': r'src={cloudinaryUrl(commonImages.instagram[0])} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_4\.jpeg"': r'src={cloudinaryUrl(commonImages.instagram[1])} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_3\.jpeg"': r'src={cloudinaryUrl(commonImages.instagram[3])} onError={handleImageError}',
        r'src="https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_5\.jpeg"': r'src={cloudinaryUrl(commonImages.instagram[4])} onError={handleImageError}'
    }

    for k, v in replacements_jsx.items():
        content = re.sub(k, v, content)

    # Handle object literals like image: "..."
    replacements_obj = {
        r'"https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_6\.jpeg"': r'cloudinaryUrl(commonImages.testimonials[0])',
        r'"https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_5\.jpeg"': r'cloudinaryUrl(commonImages.testimonials[1])',
        r'"https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_4\.jpeg"': r'cloudinaryUrl(commonImages.testimonials[2])',
        r'"https://hpdzehxsxvvfvbskgnrd\.supabase\.co/storage/v1/object/public/website-images/gallery_3\.jpeg"': r'cloudinaryUrl(commonImages.testimonials[3])',
    }

    for k, v in replacements_obj.items():
        content = re.sub(k, v, content)

    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
