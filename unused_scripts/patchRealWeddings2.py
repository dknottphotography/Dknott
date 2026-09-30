import re

path = 'c:/Users/Balu/Desktop/Dknott/src/pages/RealWeddings.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src={galleryData[activeTab][currentSlideIndex]}', 'src={cloudinaryUrl(galleryData[activeTab][currentSlideIndex])} onError={handleImageError}')
content = content.replace('src={src} alt={alt}', 'src={cloudinaryUrl(src)} onError={handleImageError} alt={alt}')
content = content.replace('src={img} alt', 'src={cloudinaryUrl(img)} onError={handleImageError} alt')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
