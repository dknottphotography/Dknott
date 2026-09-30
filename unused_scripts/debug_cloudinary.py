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

galleries = {
    "Poojitha & Pranay": {}
}

for res in data.get('resources', []):
    f = res.get('asset_folder', '')
    if not f and '/' in res.get('public_id', ''):
        f = res['public_id'].rsplit('/', 1)[0]
    
    if 'POOJITHA' in f.upper():
        print(f"Asset: {res['public_id']}, Folder: {f}")
        
