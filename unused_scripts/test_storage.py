import requests
import os

# Read anon key from .env
with open('.env', 'r') as f:
    env = f.read()

key = ''
for line in env.split('\n'):
    if line.startswith('VITE_SUPABASE_ANON_KEY='):
        key = line.split('=')[1].strip()

url = "https://hpdzehxsxvvfvbskgnrd.supabase.co/storage/v1/object/list/wedding-images"
headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# List root
res = requests.post(url, headers=headers, json={"prefix": "", "limit": 100, "offset": 0})
print("Root folders:")
for item in res.json():
    print(item['name'])

