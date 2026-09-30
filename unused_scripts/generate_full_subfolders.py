import urllib.request
import base64
import json

url_base = 'https://api.cloudinary.com/v1_1/ddcwf9ji/resources/image?max_results=500'
auth = b'518347776757877:MdEVHbLq0bCsnTIBIo_K4CfqCxs'
b64auth = base64.b64encode(auth).decode('utf-8')
headers = {'Authorization': 'Basic ' + b64auth}

resources = []
next_cursor = ''
while True:
    url = url_base
    if next_cursor:
        url += f'&next_cursor={next_cursor}'
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        resources.extend(data.get('resources', []))
        next_cursor = data.get('next_cursor')
        if not next_cursor:
            break

print(f"Total resources fetched: {len(resources)}")

galleries = {
    "Pooja & Sai Charan": {},
    "Anuhya & Abhinav": {},
    "Ellen & Yashwanth": {},
    "Kavya & Goutham": {},
    "Mahesh & Mounika": {},
    "Manasa & Gokul": {},
    "Poojitha & Pranay": {},
    "Reshma & Prakash": {},
    "Sindhuja & Akhil": {}
}

for res in resources:
    folder = res.get('asset_folder', '')
    if not folder and '/' in res.get('public_id', ''):
        folder = res['public_id'].rsplit('/', 1)[0]
    
    pub_id = f"{res['public_id']}.{res['format']}"
    
    f_norm = folder.upper().replace('&', '').replace(' ', '')
    matched_gal = None
    for gal_name in galleries.keys():
        g_norm = gal_name.upper().replace('&', '').replace(' ', '')
        if g_norm in f_norm:
            matched_gal = gal_name
            break
            
    if matched_gal:
        subfolder = "Gallery"
        if '/' in folder:
            sub = folder.split('/')[-1].strip()
            # Special case for ALL CAPS
            subfolder = sub.capitalize()
            
        if subfolder not in galleries[matched_gal]:
            galleries[matched_gal][subfolder] = []
        galleries[matched_gal][subfolder].append(pub_id)

js = '''export const commonImages = {
  logos: {
    nav: "logo1.png",
    large: "logo.png"
  },
  heroes: {
    realWeddings: "gallery_6.jpg",
    weddingFilms: "new_fixed.jpg"
  },
  instagram: [
    "gallery_2.jpg",
    "gallery_4.jpg",
    "gallery_6.jpg",
    "gallery_3.jpg",
    "gallery_5.jpg"
  ],
  testimonials: [
    "gallery_6.jpg",
    "gallery_5.jpg",
    "gallery_4.jpg",
    "gallery_3.jpg"
  ]
};

export const weddingGalleries = [
'''

gal_meta = [
    ("pooja-sai-charan", "Pooja & Sai Charan", "India", "traditional"),
    ("anuhya-abhinav", "Anuhya & Abhinav", "India", "traditional"),
    ("ellen-yashwanth", "Ellen & Yashwanth", "India", "intimate"),
    ("kavya-goutham", "Kavya & Goutham", "India", "traditional"),
    ("mahesh-mounika", "Mahesh & Mounika", "India", "traditional"),
    ("manasa-gokul", "Manasa & Gokul", "India", "intimate"),
    ("poojitha-pranay", "Poojitha & Pranay", "India", "traditional"),
    ("reshma-prakash", "Reshma & Prakash", "India", "traditional"),
    ("sindhuja-akhil", "Sindhuja & Akhil", "India", "destination")
]

for i, (gid, title, loc, tag) in enumerate(gal_meta):
    photos_dict = galleries[title]
    if not photos_dict:
        photos_dict = {"Gallery": []}
        
    first_cat = list(photos_dict.keys())[0]
    cov = photos_dict[first_cat][0] if photos_dict[first_cat] else f"gallery_{(i%8) + 1}.jpg"
    
    photos_str = "{\n"
    for cat_name, file_list in photos_dict.items():
        photos_str += f'      "{cat_name}": {json.dumps(file_list)},\n'
    photos_str = photos_str.rstrip(',\n') + "\n    }"

    js += f'''  {{
    id: "{gid}",
    title: "{title}",
    location: "{loc}",
    tags: "{tag}",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "{cov}",
    photos: {photos_str}
  }}'''
    if i < len(gal_meta) - 1:
        js += ','
    js += '\n'

js += '];\n'

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'w', encoding='utf-8') as f:
    f.write(js)
