import urllib.request
import base64
import json

url = 'https://api.cloudinary.com/v1_1/ddcwf9ji/resources/image?max_results=50'
auth = b'518347776757877:MdEVHbLq0bCsnTIBIo_K4CfqCxs'
b64auth = base64.b64encode(auth).decode('utf-8')
headers = {'Authorization': 'Basic ' + b64auth}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())

for res in data.get('resources', []):
    pid = res.get('public_id', '')
    if 'newimage' in pid.lower():
        print(f"Asset: {pid}.{res.get('format')}, Folder: {res.get('asset_folder', '')}")
        
