import urllib.request
import base64
import json
import re

url = 'https://api.cloudinary.com/v1_1/ddcwf9ji/resources/image?max_results=500'
auth = b'518347776757877:MdEVHbLq0bCsnTIBIo_K4CfqCxs'
b64auth = base64.b64encode(auth).decode('utf-8')
headers = {'Authorization': 'Basic ' + b64auth}

print('Fetching assets...')
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

# Group by folder
folders = {}
for res in data.get('resources', []):
    # If the user uploaded to a folder, the public_id usually looks like 'FOLDER_NAME/filename'
    # BUT wait, the previous JSON showed "asset_folder": "SINDHUJA AKHIL", "public_id": "RAM00427"
    # Let's check both
    folder = res.get('asset_folder', '')
    if not folder and '/' in res.get('public_id', ''):
        folder = res['public_id'].split('/')[0]
    
    if folder:
        # We need the full public_id to load it via cloudinaryUrl
        # Wait, if they are flat, it's just public_id. format
        pub_id = f"{res['public_id']}.{res['format']}"
        folders.setdefault(folder.upper(), []).append(pub_id)

# Now read images.js and update it
path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# For each gallery in weddingGalleries, find the empty photos array and replace it
def replacer(match):
    gallery_id = match.group(1) # e.g. "pooja-sai-charan"
    title = match.group(2) # e.g. "Pooja & Sai Charan"
    
    # Try to match the title to a folder name
    folder_key = None
    title_norm = title.upper().replace('&', '').replace(' ', '')
    for f_name in folders.keys():
        f_norm = f_name.upper().replace('&', '').replace(' ', '')
        if f_norm == title_norm or f_norm in title_norm or title_norm in f_norm:
            folder_key = f_name
            break
            
    images = folders.get(folder_key, []) if folder_key else []
    # format as JSON array of strings
    images_str = json.dumps(images)
    
    # We replace the photos object entirely
    return f'id: "{gallery_id}",\n    title: "{title}",' + match.group(3) + f'photos: {{\n      "Gallery": {images_str}\n    }}'

# We use regex to find each gallery block
# Matches id: "...", \n title: "...", \n ... photos: { ... }
pattern = re.compile(r'id:\s*"([^"]+)",\s*title:\s*"([^"]+)",(.*?)\s*photos:\s*\{\s*"Gallery":\s*\[.*?\]\s*\}', re.DOTALL)
new_content = pattern.sub(replacer, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Updated images.js. Found folders: {list(folders.keys())}")
