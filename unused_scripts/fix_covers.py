import re

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace coverImage: "gallery_X.jpg", with coverImage: "first_photo_in_gallery.jpg",
# We can do this block by block.
# Let's find each gallery block.
def replacer(match):
    prefix = match.group(1) # up to coverImage: "
    old_cover = match.group(2) # e.g. gallery_X.jpg
    middle = match.group(3) # ", \n photos: { "Gallery": [
    photos = match.group(4) # "first_photo.jpg", "second.jpg" ...
    suffix = match.group(5) # ]
    
    first_photo = ''
    if photos:
        # Extract the first string in the array
        first_match = re.search(r'"([^"]+)"', photos)
        if first_match:
            first_photo = first_match.group(1)
            
    # If we found a photo in the gallery, use it. Otherwise keep the old cover.
    new_cover = first_photo if first_photo else old_cover
    
    return prefix + new_cover + middle + photos + suffix

# Match: coverImage: "(.*?)",(.*?)photos: {\s*"Gallery": \[(.*?)\]
pattern = re.compile(r'(coverImage:\s*")([^"]+)(".*?"Gallery":\s*\[)(.*?)(\])', re.DOTALL)
new_content = pattern.sub(replacer, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
