import urllib.request
import base64
import json

url = 'https://api.cloudinary.com/v1_1/ddcwf9ji/resources/image?max_results=500'
auth = b'518347776757877:MdEVHbLq0bCsnTIBIo_K4CfqCxs'
b64auth = base64.b64encode(auth).decode('utf-8')
headers = {'Authorization': 'Basic ' + b64auth}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

# Collect photos per core gallery name
galleries = {
    "Pooja & Sai Charan": [],
    "Anuhya & Abhinav": [],
    "Ellen & Yashwanth": [],
    "Kavya & Goutham": [],
    "Mahesh & Mounika": [],
    "Manasa & Gokul": [],
    "Poojitha & Pranay": [],
    "Reshma & Prakash": [],
    "Sindhuja & Akhil": []
}

for res in data.get('resources', []):
    folder = res.get('asset_folder', '')
    if not folder and '/' in res.get('public_id', ''):
        folder = res['public_id'].split('/')[0]
    
    pub_id = f"{res['public_id']}.{res['format']}"
    
    # Match folder to gallery
    f_norm = folder.upper().replace('&', '').replace(' ', '')
    for gal_name in galleries.keys():
        g_norm = gal_name.upper().replace('&', '').replace(' ', '')
        if g_norm in f_norm:
            galleries[gal_name].append(pub_id)
            break

# Generate JavaScript
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
    ("pooja-sai-charan", "Pooja & Sai Charan", "India", "traditional", "gallery_6.jpg"),
    ("anuhya-abhinav", "Anuhya & Abhinav", "India", "traditional", "gallery_2.jpg"),
    ("ellen-yashwanth", "Ellen & Yashwanth", "India", "intimate", "gallery_3.jpg"),
    ("kavya-goutham", "Kavya & Goutham", "India", "traditional", "gallery_4.jpg"),
    ("mahesh-mounika", "Mahesh & Mounika", "India", "traditional", "gallery_5.jpg"),
    ("manasa-gokul", "Manasa & Gokul", "India", "intimate", "gallery_1.jpg"),
    ("poojitha-pranay", "Poojitha & Pranay", "India", "traditional", "gallery_7.jpg"),
    ("reshma-prakash", "Reshma & Prakash", "India", "traditional", "gallery_8.jpg"),
    ("sindhuja-akhil", "Sindhuja & Akhil", "India", "destination", "gallery_2.jpg")
]

for i, (gid, title, loc, tag, cov) in enumerate(gal_meta):
    photos = galleries[title]
    photos_str = json.dumps(photos)
    js += f'''  {{
    id: "{gid}",
    title: "{title}",
    location: "{loc}",
    tags: "{tag}",
    description: "A beautiful wedding story captured by Dknott.",
    coverImage: "{cov}",
    photos: {{
      "Gallery": {photos_str}
    }}
  }}'''
    if i < len(gal_meta) - 1:
        js += ','
    js += '\n'

js += '];\n'

path = 'c:/Users/Balu/Desktop/Dknott/src/data/images.js'
with open(path, 'w', encoding='utf-8') as f:
    f.write(js)
